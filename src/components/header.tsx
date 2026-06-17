"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-context";
import { Wordmark } from "./ui/Wordmark";
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Heart,
  Search,
} from "lucide-react";
import { logoutAction } from "@/app/actions";

interface HeaderProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  } | null;
}

const ANNOUNCEMENTS = [
  "Free shipping on orders over $100",
  "Made to order — allow 5–7 business days",
  "Gift wrapping included on every order",
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/about" },
  { label: "Custom Request", href: "/custom-orders" },
  { label: "Contact", href: "/contact" },
];

const SHOP_MENU = [
  { label: "Cutting Boards", href: "/products?category=cutting-boards" },
  { label: "Whiskey & Bar Sets", href: "/products?category=bar-sets" },
  { label: "Coasters & Trivets", href: "/products?category=coasters" },
  { label: "Baby & Kids", href: "/products?category=baby" },
  { label: "Signs & Plaques", href: "/products?category=signs" },
  { label: "View All Products", href: "/products" },
];

const SHOP_TILES = [
  {
    label: "Cutting Boards",
    desc: "Handcrafted boards engraved with your family name, recipe, or…",
    href: "/products?category=cutting-boards",
    tone: "linear-gradient(140deg, #8A6647 0%, #5E422D 100%)",
  },
  {
    label: "Baby & Kids",
    desc: "Personalized keepsakes to celebrate life's newest arrivals —…",
    href: "/products?category=baby",
    tone: "linear-gradient(140deg, #C4A882 0%, #A07B55 100%)",
  },
  {
    label: "Wedding & Bridal",
    desc: "Timeless engraved gifts for the couple — perfect for ceremonies…",
    href: "/products?occasion=wedding",
    tone: "linear-gradient(140deg, #9EA88A 0%, #6B7557 100%)",
  },
  {
    label: "Kitchen",
    desc: "Elevate everyday cooking with personalized kitchen essentials…",
    href: "/products?category=coasters",
    tone: "linear-gradient(140deg, #7A5E46 0%, #4E3829 100%)",
  },
];

const OCCASIONS_MENU = [
  { label: "Weddings & Bridal", href: "/products?occasion=wedding" },
  { label: "Housewarming", href: "/products?occasion=housewarming" },
  { label: "Realtor Closing Gifts", href: "/products?occasion=realtor" },
  { label: "Corporate Gifting", href: "/products?occasion=corporate" },
  { label: "Baby Showers", href: "/products?occasion=baby-shower" },
  { label: "Holidays", href: "/products?occasion=holiday" },
];

function IconBtn({
  onClick,
  label,
  children,
  count,
}: {
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "var(--radius-pill)",
        border: "none",
        background: "none",
        color: "var(--text-heading)",
        cursor: "pointer",
        transition: "background var(--dur-fast)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bb-ivory-200)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {children}
      {count != null && count > 0 && (
        <span
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--bb-walnut)",
            color: "var(--bb-ivory)",
            fontSize: 10,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-body)",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function MegaMenu({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  // Timer ref — lets the mouse cross the gap between the trigger button and the
  // dropdown panel without closing the menu. The wrapper div's hit box is only
  // as tall as the button; entering the 12px gap fires onMouseLeave on the
  // wrapper. The timer gives the mouse 150ms to re-enter a child element before
  // we actually close.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelClose() {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13.5,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--text-heading)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px 4px",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {label}
        <span
          style={{
            fontSize: 10,
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--dur-fast)",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: 220,
            background: "var(--surface-card)",
            border: "var(--border-1)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            padding: "10px 0",
            zIndex: 200,
          }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "10px 20px",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--text-body)",
                fontWeight: 500,
                transition: "background var(--dur-fast), color var(--dur-fast)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--surface-warm)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--accent-strong)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "";
                (e.currentTarget as HTMLElement).style.color = "";
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } =
    useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const [announcementIndex] = useState(0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        customizationText: item.customizationText,
      }));
      const { placeOrderAction } = await import("@/app/actions");
      const result = await placeOrderAction(items, cartTotal);
      if (result.success) {
        setCheckoutSuccess(result.orderId || "Success");
        clearCart();
      } else {
        alert(result.error || "Order placement failed. Are you logged in?");
      }
    } catch (e) {
      console.error(e);
      alert("Order placement failed. Make sure you are logged in!");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--surface-page)",
        }}
      >
        {/* ── Announcement bar ──────────────────────────────────── */}
        <div
          style={{
            background: "var(--bb-espresso)",
            color: "var(--bb-ivory)",
            textAlign: "center",
            padding: "9px 16px",
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            fontWeight: 500,
            letterSpacing: "0.08em",
          }}
        >
          {ANNOUNCEMENTS[announcementIndex]}
        </div>

        {/* ── Main bar ──────────────────────────────────────────── */}
        <div
          style={{
            height: "var(--header-h)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--content-pad)",
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            gap: 16,
          }}
        >
          {/* Left: search (desktop) + mobile hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
            {/* Mobile menu toggle */}
            <button
              aria-label="Toggle navigation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--text-heading)",
              }}
              className="bb-mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <IconBtn label="Search">
              <Search size={18} strokeWidth={1.8} />
            </IconBtn>
          </div>

          {/* Center: wordmark */}
          <Link href="/" style={{ flexShrink: 0 }}>
            <Wordmark size="md" />
          </Link>

          {/* Right: account + cart */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {user?.role === "admin" && (
              <IconBtn label="Admin Dashboard">
                <Link href="/admin" style={{ display: "flex", color: "var(--bb-brass)" }}>
                  <ShieldCheck size={18} strokeWidth={1.8} />
                </Link>
              </IconBtn>
            )}

            {user ? (
              <>
                <IconBtn label="My Account">
                  <Link href="/account" style={{ display: "flex", color: "inherit" }}>
                    <User size={18} strokeWidth={1.8} />
                  </Link>
                </IconBtn>
                <form action={logoutAction} style={{ display: "inline" }}>
                  <IconBtn label="Log Out">
                    <button
                      type="submit"
                      style={{
                        display: "flex",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "inherit",
                        padding: 0,
                      }}
                    >
                      <LogOut size={18} strokeWidth={1.8} />
                    </button>
                  </IconBtn>
                </form>
              </>
            ) : (
              <IconBtn label="Log In">
                <Link href="/account" style={{ display: "flex", color: "inherit" }}>
                  <User size={18} strokeWidth={1.8} />
                </Link>
              </IconBtn>
            )}

            <IconBtn
              label="Shopping bag"
              onClick={() => setIsCartOpen(true)}
              count={cartCount}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
            </IconBtn>
          </div>
        </div>

        {/* ── Nav row (desktop) ─────────────────────────────────── */}
        <nav
          style={{
            borderTop: "var(--border-1)",
            borderBottom: "var(--border-1)",
          }}
          className="bb-nav-row"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 36,
              height: 48,
              maxWidth: "var(--content-max)",
              margin: "0 auto",
              padding: "0 var(--content-pad)",
            }}
          >
            <MegaMenu label="Shop" items={SHOP_MENU} />
            <MegaMenu label="Occasions" items={OCCASIONS_MENU} />

            {NAV_LINKS.filter((l) => l.label !== "Home").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 13.5,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: isActive(link.href)
                    ? "var(--accent-strong)"
                    : "var(--text-heading)",
                  borderBottom: isActive(link.href)
                    ? "2px solid var(--bb-brass)"
                    : "2px solid transparent",
                  paddingBottom: 2,
                  transition: "color var(--dur-fast), border-color var(--dur-fast)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent-strong)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive(link.href)
                    ? "var(--accent-strong)"
                    : "var(--text-heading)")
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* ── Mobile nav ────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div
            style={{
              background: "var(--surface-card)",
              borderBottom: "var(--border-1)",
              padding: "20px var(--content-pad)",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {[{ label: "Home", href: "/" }, ...NAV_LINKS.slice(1)].map(
              (link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "13px 0",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "var(--text-heading)",
                    borderBottom: "var(--border-1)",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        )}
      </header>

      {/* ── Cart Drawer ───────────────────────────────────────────── */}
      {isCartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(56,47,38,0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 460,
              height: "100%",
              background: "var(--surface-card)",
              boxShadow: "var(--shadow-lg)",
              display: "flex",
              flexDirection: "column",
              padding: "28px 24px",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <ShoppingBag size={20} />
                Your Bag
                {cartCount > 0 && (
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-subtle)",
                    }}
                  >
                    ({cartCount})
                  </span>
                )}
              </h2>
              <button
                aria-label="Close bag"
                onClick={() => setIsCartOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background: "var(--bb-ivory-200)",
                  cursor: "pointer",
                  color: "var(--text-heading)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Cart content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {checkoutSuccess ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <Heart size={40} color="var(--bb-clay)" />
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      color: "var(--text-heading)",
                    }}
                  >
                    Thank you!
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    We&apos;ve received your order. Reference:{" "}
                    <strong>{checkoutSuccess}</strong>. We&apos;ll get to
                    crafting right away.
                  </p>
                  <button
                    onClick={() => {
                      setCheckoutSuccess(null);
                      setIsCartOpen(false);
                    }}
                    style={{
                      marginTop: 8,
                      height: 44,
                      padding: "0 28px",
                      background: "var(--btn-primary-bg)",
                      color: "var(--btn-primary-fg)",
                      border: "none",
                      borderRadius: "var(--radius-pill)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13.5,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "56px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <ShoppingBag size={40} color="var(--bb-linen)" />
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      color: "var(--text-heading)",
                    }}
                  >
                    Your bag is empty
                  </p>
                  <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    Browse our collection and find something beautiful.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      marginTop: 12,
                      height: 44,
                      padding: "0 24px",
                      background: "var(--btn-primary-bg)",
                      color: "var(--btn-primary-fg)",
                      border: "none",
                      borderRadius: "var(--radius-pill)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 14,
                      paddingBottom: 18,
                      borderBottom: "var(--border-1)",
                    }}
                  >
                    {/* Item image */}
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                        background:
                          "linear-gradient(150deg, #8A6647, #5E422D)",
                        flexShrink: 0,
                        border: "var(--border-1)",
                      }}
                    >
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>

                    {/* Item info */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                        minWidth: 0,
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 16,
                          fontWeight: 600,
                          color: "var(--text-heading)",
                          margin: 0,
                        }}
                      >
                        {item.name}
                      </h4>

                      {item.customizationDisplay && (
                        <div
                          style={{
                            fontSize: 12,
                            background: "var(--surface-warm)",
                            padding: "5px 10px",
                            borderRadius: "var(--radius-xs)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {Object.entries(item.customizationDisplay).map(
                            ([label, val]) => (
                              <div key={label}>
                                <span style={{ fontWeight: 600 }}>{label}:</span>{" "}
                                <span style={{ fontFamily: "monospace" }}>
                                  &quot;{val}&quot;
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "auto",
                          paddingTop: 6,
                        }}
                      >
                        {/* Qty */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            border: "var(--border-1)",
                            borderRadius: "var(--radius-pill)",
                            padding: "3px 10px",
                          }}
                        >
                          <button
                            aria-label="Decrease quantity"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            style={{
                              display: "flex",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--text-muted)",
                              padding: 0,
                            }}
                          >
                            <Minus size={13} />
                          </button>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              width: 16,
                              textAlign: "center",
                              color: "var(--text-heading)",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            style={{
                              display: "flex",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--text-muted)",
                              padding: 0,
                            }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <span
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: 15,
                            fontWeight: 600,
                            color: "var(--text-heading)",
                          }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      aria-label="Remove item"
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        alignSelf: "flex-start",
                        display: "flex",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "var(--text-subtle)",
                        padding: 4,
                        transition: "color var(--dur-fast)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--status-error)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-subtle)")
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart footer */}
            {cart.length > 0 && !checkoutSuccess && (
              <div
                style={{
                  borderTop: "var(--border-1)",
                  paddingTop: 24,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13.5,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--text-muted)",
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 22,
                      fontWeight: 600,
                      color: "var(--text-heading)",
                    }}
                  >
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 12.5,
                    color: "var(--text-subtle)",
                    marginBottom: 20,
                    lineHeight: 1.5,
                  }}
                >
                  Shipping and taxes at checkout. Gift wrapping always included.
                </p>

                {user ? (
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    style={{
                      width: "100%",
                      height: 52,
                      background: isCheckingOut
                        ? "var(--bb-espresso-900)"
                        : "var(--btn-dark-bg)",
                      color: "var(--text-on-dark)",
                      border: "none",
                      borderRadius: "var(--radius-pill)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: 14,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: isCheckingOut ? "not-allowed" : "pointer",
                      opacity: isCheckingOut ? 0.75 : 1,
                      transition: "background var(--dur-fast)",
                    }}
                  >
                    {isCheckingOut ? "Processing…" : "Submit Order"}
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Link
                      href="/account?redirect=checkout"
                      onClick={() => setIsCartOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 52,
                        background: "var(--btn-dark-bg)",
                        color: "var(--text-on-dark)",
                        borderRadius: "var(--radius-pill)",
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                        fontSize: 14,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                      }}
                    >
                      Log In to Checkout
                    </Link>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--status-error)",
                        textAlign: "center",
                      }}
                    >
                      An account is required to place orders.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile nav CSS ────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .bb-mobile-menu-btn { display: flex !important; }
          .bb-nav-row { display: none !important; }
        }
      `}</style>
    </>
  );
}
