import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "bridle-and-birch-super-secret-key-2026-southern-charm";
const SESSION_COOKIE_NAME = "bb_session";

// Hash password using PBKDF2 via Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const key = await crypto.subtle.importKey(
    "raw",
    data,
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );
  
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(new Uint8Array(derivedKey)).map(b => b.toString(16).padStart(2, "0")).join("");
  
  return `${saltHex}:${hashHex}`;
}

// Verify password against stored hash
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const parts = storedHash.split(":");
    if (parts.length !== 2) return false;
    const [saltHex, originalHashHex] = parts;
    
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    const key = await crypto.subtle.importKey(
      "raw",
      data,
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    
    const derivedKey = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      key,
      256
    );
    
    const hashHex = Array.from(new Uint8Array(derivedKey)).map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex === originalHashHex;
  } catch (e) {
    return false;
  }
}

// Sign payload to create session token
async function signSession(payload: any): Promise<string> {
  const encoder = new TextEncoder();
  const secretKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const payloadStr = JSON.stringify(payload);
  const payloadBytes = encoder.encode(payloadStr);
  const signature = await crypto.subtle.sign("HMAC", secretKey, payloadBytes);
  
  // Base64 encode the payload safely
  const payloadB64 = Buffer.from(payloadStr).toString("base64");
  const signatureHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, "0")).join("");
  
  return `${payloadB64}.${signatureHex}`;
}

// Verify session token and return payload
async function verifySession(token: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, signatureHex] = parts;
    
    const payloadStr = Buffer.from(payloadB64, "base64").toString("utf-8");
    const payload = JSON.parse(payloadStr);
    
    if (payload.exp < Date.now()) return null;
    
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    
    const signatureBytes = new Uint8Array(signatureHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const payloadBytes = encoder.encode(payloadStr);
    
    const isValid = await crypto.subtle.verify("HMAC", secretKey, signatureBytes, payloadBytes);
    return isValid ? payload : null;
  } catch (e) {
    return null;
  }
}

// Get the current logged-in user details from the session cookie
export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie) return null;
  
  const payload = await verifySession(sessionCookie.value);
  if (!payload || !payload.userId) return null;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });
    return user;
  } catch (e) {
    return null;
  }
}

// Check if the current user is an admin
export async function verifyAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === "admin";
}

// Log in a user and set the session cookie
export async function setSessionCookie(userId: string, role: string) {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const token = await signSession({ userId, role, exp });
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(exp),
    path: "/",
  });
}

// Log out a user by deleting the session cookie
export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
