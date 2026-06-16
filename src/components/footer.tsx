"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { subscribeNewsletterAction } from "@/app/actions";
import { Heart, Mail, Check, AlertCircle } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus(null);
    startTransition(async () => {
      const res = await subscribeNewsletterAction(email);
      if (res.success) {
        setStatus({ type: "success", message: res.message || "Thank you for subscribing!" });
        setEmail("");
      } else {
        setStatus({ type: "error", message: res.error || "Failed to subscribe." });
      }
    });
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand Col */}
        <div className="footer-col">
          <div className="footer-logo">BRIDLE & BIRCH</div>
          <div className="footer-logo-sub">Southern Charm & Engraving</div>
          <p>
            Custom laser engraved gifts crafted with Southern charm in North Carolina.
            From heirloom acacia cutting boards to frosted glassware and leatherette keepsakes.
          </p>
          <p style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--color-accent-light)" }}>
            Made with <Heart size={14} fill="currentColor" /> by Jana Stephens
          </p>
        </div>

        {/* Navigation Col */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link href="/">Shop Home</Link></li>
            <li><Link href="/about">Our Story</Link></li>
            <li><Link href="/contact">Custom Design Request</Link></li>
            <li><Link href="/account">My Account</Link></li>
          </ul>
        </div>

        {/* Contact Info Col */}
        <div className="footer-col">
          <h3>The Workshop</h3>
          <p>We'd love to chat, Sugah! Reach out for custom designs, wedding favors, or realtor closing package rates.</p>
          <p style={{ fontSize: "0.9rem", color: "var(--color-background)", fontWeight: 500 }}>
            Email: <a href="mailto:jana@bridleandbirch.com" style={{ textDecoration: "underline" }}>jana@bridleandbirch.com</a>
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--color-background)", fontWeight: 500 }}>
            Hours: Mon–Fri, 9am–5pm EST
          </p>
        </div>

        {/* Newsletter Col */}
        <div className="footer-col">
          <h3>Newsletter</h3>
          <p>Subscribe to receive product updates, seasonal design layouts, and southern entertaining ideas.</p>
          
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="newsletter-input-group">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="newsletter-input"
                required
                disabled={isPending}
              />
              <button type="submit" className="newsletter-btn" disabled={isPending}>
                {isPending ? "..." : <Mail size={18} />}
              </button>
            </div>
            {status && (
              <div style={{ 
                fontSize: "0.75rem", 
                display: "flex", 
                alignItems: "center", 
                gap: "6px",
                color: status.type === "success" ? "var(--color-accent-light)" : "#f87171"
              }}>
                {status.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
                <span>{status.message}</span>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} Bridle & Birch. All rights reserved.</div>
        <div style={{ display: "flex", gap: "24px" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
