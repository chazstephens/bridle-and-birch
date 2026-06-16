"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { subscribeNewsletterAction } from "@/app/actions";
import { Check, AlertCircle, Instagram, Facebook, Pinterest } from "lucide-react";
import { Wordmark } from "./ui/Wordmark";
import { Seal } from "./ui/Seal";
import { Divider } from "./ui/Divider";

const SHOP_LINKS = [
  { label: "Cutting Boards", href: "/products?category=cutting-boards" },
  { label: "Bar & Whiskey Sets", href: "/products?category=bar-sets" },
  { label: "Coasters & Trivets", href: "/products?category=coasters" },
  { label: "Baby & Kids", href: "/products?category=baby" },
  { label: "Signs & Plaques", href: "/products?category=signs" },
  { label: "View All Products", href: "/products" },
];

const OCCASION_LINKS = [
  { label: "Wedding & Bridal", href: "/products?occasion=wedding" },
  { label: "Housewarming", href: "/products?occasion=housewarming" },
  { label: "Realtor Closing Gifts", href: "/products?occasion=realtor" },
  { label: "Corporate Gifting", href: "/products?occasion=corporate" },
  { label: "Baby Showers", href: "/products?occasion=baby-shower" },
  { label: "Custom Request", href: "/custom-orders" },
];

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  color: "var(--bb-taupe)",
  display: "block",
  padding: "4px 0",
  transition: "color var(--dur-fast)",
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bb-ivory)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--bb-taupe)")}
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus(null);
    startTransition(async () => {
      const res = await subscribeNewsletterAction(email);
      if (res.success) {
        setStatus({
          type: "success",
          message: res.message || "Thank you for subscribing!",
        });
        setEmail("");
      } else {
        setStatus({
          type: "error",
          message: res.error || "Failed to subscribe.",
        });
      }
    });
  };

  return (
    <footer
      style={{
        background: "var(--bb-espresso-900)",
        color: "var(--bb-ivory)",
        paddingTop: 72,
        paddingBottom: 0,
      }}
    >
      {/* ── Main grid ─────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "0 var(--content-pad)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1.2fr",
          gap: 40,
          paddingBottom: 64,
        }}
        className="bb-footer-grid"
      >
        {/* Col 1 — Brand */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <Seal variant="oval" size={72} color="var(--bb-taupe)" />
          <Wordmark
            size="sm"
            color="var(--bb-ivory)"
            align="left"
            descriptor
          />
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.65,
              color: "var(--bb-taupe)",
              maxWidth: 220,
            }}
          >
            Custom laser-engraved gifts crafted with Southern charm. Made to
            order, meant to be kept.
          </p>
          {/* Social */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {[
              { Icon: Instagram, label: "Instagram", href: "#" },
              { Icon: Facebook, label: "Facebook", href: "#" },
              { Icon: Pinterest, label: "Pinterest", href: "#" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid rgba(166,147,128,0.3)",
                  color: "var(--bb-taupe)",
                  transition: "color var(--dur-fast), border-color var(--dur-fast)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--bb-ivory)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--bb-ivory)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--bb-taupe)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(166,147,128,0.3)";
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Shop */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "var(--ls-label)",
              textTransform: "uppercase",
              color: "var(--bb-brass)",
              marginBottom: 16,
            }}
          >
            Shop
          </h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SHOP_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </ul>
        </div>

        {/* Col 3 — Occasions */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "var(--ls-label)",
              textTransform: "uppercase",
              color: "var(--bb-brass)",
              marginBottom: 16,
            }}
          >
            Occasions
          </h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {OCCASION_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </ul>
        </div>

        {/* Col 4 — Newsletter */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "var(--ls-label)",
              textTransform: "uppercase",
              color: "var(--bb-brass)",
              marginBottom: 12,
            }}
          >
            Stay in the Loop
          </h4>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--bb-taupe)",
              lineHeight: 1.6,
              marginBottom: 18,
            }}
          >
            Seasonal designs, new arrivals, and entertaining ideas — delivered
            to your inbox.
          </p>

          <form onSubmit={handleSubscribe}>
            <div
              style={{
                display: "flex",
                gap: 0,
                borderRadius: "var(--radius-pill)",
                overflow: "hidden",
                border: "1px solid rgba(166,147,128,0.35)",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isPending}
                style={{
                  flex: 1,
                  height: 46,
                  padding: "0 18px",
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  outline: "none",
                  color: "var(--bb-ivory)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                }}
              />
              <button
                type="submit"
                disabled={isPending}
                style={{
                  height: 46,
                  padding: "0 22px",
                  background: "var(--bb-walnut)",
                  color: "var(--bb-ivory)",
                  border: "none",
                  cursor: isPending ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: isPending ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {isPending ? "…" : "Join"}
              </button>
            </div>

            {status && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color:
                    status.type === "success"
                      ? "var(--status-success)"
                      : "var(--status-error)",
                }}
              >
                {status.type === "success" ? (
                  <Check size={13} />
                ) : (
                  <AlertCircle size={13} />
                )}
                {status.message}
              </div>
            )}
          </form>

          {/* Contact info */}
          <div style={{ marginTop: 28 }}>
            <p
              style={{
                fontSize: 13,
                color: "var(--bb-taupe)",
                marginBottom: 6,
              }}
            >
              <a
                href="mailto:jana@bridleandbirch.com"
                style={{
                  color: "var(--bb-taupe)",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(166,147,128,0.4)",
                }}
              >
                jana@bridleandbirch.com
              </a>
            </p>
            <p style={{ fontSize: 13, color: "var(--bb-taupe)" }}>
              Mon–Fri, 9am–5pm EST
            </p>
          </div>
        </div>
      </div>

      {/* ── Brass divider ─────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "0 var(--content-pad)",
        }}
      >
        <Divider color="rgba(176,138,74,0.25)" />
      </div>

      {/* ── Fine print ────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "20px var(--content-pad)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            color: "rgba(166,147,128,0.6)",
          }}
        >
          © {new Date().getFullYear()} Bridle &amp; Birch. All rights reserved.
        </span>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            color: "rgba(166,147,128,0.6)",
          }}
        >
          <span style={{ cursor: "pointer" }}>Privacy Policy</span>
          <span style={{ cursor: "pointer" }}>Terms of Service</span>
        </div>
      </div>

      {/* ── Mobile responsive ─────────────────────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          .bb-footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .bb-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
