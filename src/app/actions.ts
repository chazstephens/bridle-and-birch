"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, setSessionCookie, deleteSessionCookie, getSessionUser } from "@/lib/auth";

// --- AUTH ACTIONS ---

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Please fill in all fields." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password." };
    }

    await setSessionCookie(user.id, user.role);
    
    // Redirect admin to dashboard, customer to account page
    if (user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/account");
    }
  } catch (error: any) {
    // If it's a redirect, we must rethrow it
    if (error.message === "NEXT_REDIRECT") throw error;
    return { success: false, error: error.message || "An error occurred during login." };
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { success: false, error: "Please fill in all fields." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Email already registered." };
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "customer"
      }
    });

    await setSessionCookie(user.id, user.role);
    redirect("/account");
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    return { success: false, error: error.message || "An error occurred during registration." };
  }
}

export async function logoutAction() {
  await deleteSessionCookie();
  redirect("/account");
}

// --- REVIEW ACTIONS ---

export async function submitReviewAction(productId: string, author: string, rating: number, text: string) {
  if (!productId || !author || !rating || !text) {
    return { success: false, error: "All review fields are required." };
  }

  try {
    await prisma.review.create({
      data: {
        productId,
        author,
        rating,
        text,
        verified: true,
      }
    });
    revalidatePath(`/products/${productId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit review." };
  }
}

// --- ORDER / CHECKOUT ACTIONS ---

export async function placeOrderAction(items: { productId: string; productName: string; price: number; quantity: number; customizationText?: string }[], total: number) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "You must be logged in to place an order." };
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: "pending",
        items: {
          create: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            customizationText: item.customizationText || null,
          }))
        }
      }
    });

    revalidatePath("/account");
    revalidatePath("/admin");
    return { success: true, orderId: order.id };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to place order." };
  }
}

// --- CUSTOM REQUEST ACTIONS ---

export async function submitCustomRequestAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and message are required." };
  }

  try {
    await prisma.customRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        status: "pending"
      }
    });
    return { success: true, message: "Your custom request has been submitted successfully! We will contact you soon." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit request." };
  }
}

// --- NEWSLETTER ACTIONS ---

export async function subscribeNewsletterAction(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await prisma.newsletter.create({
      data: { email }
    });
    return { success: true, message: "Thank you for subscribing!" };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: true, message: "You are already subscribed!" };
    }
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}

// --- ADMIN PRODUCT WIZARD ACTIONS ---

export async function createProductAction(prevState: any, data: {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  customFields: {
    label: string;
    type: string;
    placeholder?: string;
    required: boolean;
    renderX: number;
    renderY: number;
    renderWidth: number;
    renderHeight: number;
    fontStyle: string;
    renderColor: string;
  }[];
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized access." };
  }

  const { name, description, price, imageUrl, categoryId, customFields } = data;

  if (!name || !description || !price || !categoryId || !imageUrl) {
    return { success: false, error: "All product fields are required." };
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId,
        customFields: {
          create: customFields.map(cf => ({
            label: cf.label,
            type: cf.type,
            placeholder: cf.placeholder || null,
            required: cf.required,
            renderX: cf.renderX,
            renderY: cf.renderY,
            renderWidth: cf.renderWidth,
            renderHeight: cf.renderHeight,
            fontStyle: cf.fontStyle,
            renderColor: cf.renderColor,
          }))
        }
      }
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, productId: product.id };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create product." };
  }
}

// --- ADMIN GENERAL ACTIONS ---

export async function updateOrderStatusAction(orderId: string, status: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized." };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath("/admin");
    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update order." };
  }
}

export async function deleteProductAction(productId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized." };
  }

  try {
    await prisma.product.delete({
      where: { id: productId }
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete product." };
  }
}

export async function updateCustomRequestStatusAction(requestId: string, status: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized." };
  }

  try {
    await prisma.customRequest.update({
      where: { id: requestId },
      data: { status }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update request status." };
  }
}
