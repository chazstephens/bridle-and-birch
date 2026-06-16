"use client";

import { useState } from "react";
import { loginAction, signupAction } from "@/app/actions";
import { KeyRound, Mail, User, AlertCircle } from "lucide-react";

export default function AuthForms() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (formData: FormData) => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginAction(null, formData);
      if (res && !res.success) {
        setError(res.error || "Login failed.");
      }
    } catch (e: any) {
      // If it's a redirect, the framework handles it, but in case of errors:
      if (e.message !== "NEXT_REDIRECT") {
        setError(e.message || "An error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (formData: FormData) => {
    setError(null);
    setLoading(true);
    try {
      const res = await signupAction(null, formData);
      if (res && !res.success) {
        setError(res.error || "Signup failed.");
      }
    } catch (e: any) {
      if (e.message !== "NEXT_REDIRECT") {
        setError(e.message || "An error occurred during signup.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="control-panel" style={{ width: "100%", maxWidth: "450px", margin: "0 auto" }}>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", marginBottom: "24px" }}>
        <button
          onClick={() => { setActiveTab("login"); setError(null); }}
          style={{
            flex: 1,
            padding: "12px",
            background: "none",
            border: "none",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: activeTab === "login" ? "var(--color-primary)" : "var(--color-text-light)",
            borderBottom: activeTab === "login" ? "2px solid var(--color-accent)" : "none",
            cursor: "pointer"
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => { setActiveTab("signup"); setError(null); }}
          style={{
            flex: 1,
            padding: "12px",
            background: "none",
            border: "none",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: activeTab === "signup" ? "var(--color-primary)" : "var(--color-text-light)",
            borderBottom: activeTab === "signup" ? "2px solid var(--color-accent)" : "none",
            cursor: "pointer"
          }}
        >
          Create Account
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "20px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {activeTab === "login" ? (
        <form action={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
              <input
                className="form-input"
                type="email"
                id="login-email"
                name="email"
                required
                placeholder="jana@bridleandbirch.com"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: "relative" }}>
              <KeyRound size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
              <input
                className="form-input"
                type="password"
                id="login-password"
                name="password"
                required
                placeholder="••••••••"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "14px", marginTop: "8px" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-light)", textAlign: "center", marginTop: "12px" }}>
            <strong>Demo Credentials:</strong><br />
            Admin: <code>jana@bridleandbirch.com</code> / <code>admin123</code><br />
            Buyer: <code>buyer@example.com</code> / <code>customer123</code>
          </div>
        </form>
      ) : (
        <form action={handleSignupSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Full Name</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
              <input
                className="form-input"
                type="text"
                id="signup-name"
                name="name"
                required
                placeholder="Jana Stephens"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
              <input
                className="form-input"
                type="email"
                id="signup-email"
                name="email"
                required
                placeholder="buyer@example.com"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div style={{ position: "relative" }}>
              <KeyRound size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
              <input
                className="form-input"
                type="password"
                id="signup-password"
                name="password"
                required
                placeholder="••••••••"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "14px", marginTop: "8px" }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      )}
    </div>
  );
}
