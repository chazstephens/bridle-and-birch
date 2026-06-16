"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-context";
import { ShoppingBag, User, LogOut, Menu, X, Trash2, Plus, Minus, ShieldCheck, Heart } from "lucide-react";
import { logoutAction } from "@/app/actions";

interface HeaderProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  
  // Checkout simulation
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Create order via Server Action
      const items = cart.map(item => ({
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

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="header">
      <div className="announcement-bar">
        Southern Elegance & Fine Engraving — Free shipping on orders over $100
      </div>
      
      <div className="nav-container">
        {/* Mobile menu toggle */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="logo-link">
          BRIDLE & BIRCH
          <span className="logo-sub">Southern Engraving</span>
        </Link>

        {/* Desktop navigation */}
        <ul className="nav-menu" style={{ display: "flex" }}>
          <li className={`nav-item ${isActive("/") ? "active" : ""}`}>
            <Link href="/">Home</Link>
          </li>
          <li className={`nav-item ${isActive("/about") ? "active" : ""}`}>
            <Link href="/about">Our Story</Link>
          </li>
          <li className={`nav-item ${isActive("/contact") ? "active" : ""}`}>
            <Link href="/contact">Custom Request</Link>
          </li>
        </ul>

        {/* Header actions */}
        <div className="nav-actions">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {user.role === "admin" ? (
                <Link 
                  href="/admin" 
                  className="nav-action-btn" 
                  title="Admin Dashboard"
                  style={{ display: "flex", color: "#b3925c" }}
                >
                  <ShieldCheck size={20} />
                </Link>
              ) : null}
              <Link href="/account" className="nav-action-btn" title="My Account">
                <User size={20} />
              </Link>
              <form action={logoutAction} style={{ display: "inline" }}>
                <button type="submit" className="nav-action-btn" title="Log Out">
                  <LogOut size={20} />
                </button>
              </form>
            </div>
          ) : (
            <Link href="/account" className="nav-action-btn" title="Log In">
              <User size={20} />
            </Link>
          )}

          <button 
            className="nav-action-btn" 
            onClick={() => setIsCartOpen(true)}
            aria-label="Open shopping bag"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 99
        }}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Home</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Our Story</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Custom Request</Link>
        </div>
      )}

      {/* Cart Sidebar Slider Drawer */}
      {isCartOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "flex-end"
        }} onClick={() => setIsCartOpen(false)}>
          <div style={{
            width: "100%",
            maxWidth: "450px",
            height: "100%",
            backgroundColor: "var(--color-surface)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            animation: "slideIn 0.3s ease",
            padding: "24px"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingBag size={20} /> Shopping Bag ({cartCount})
              </h2>
              <button className="nav-action-btn" onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "24px" }}>
              {checkoutSuccess ? (
                <div className="alert alert-success" style={{ flexDirection: "column", gap: "12px", textAlign: "center", padding: "24px 16px" }}>
                  <Heart size={36} color="var(--color-accent)" />
                  <h3>Thank you, Sugah!</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                    We've received your order! Reference number: <strong>{checkoutSuccess}</strong>. 
                    We will get to crafting and wrap it in our signature cream bow.
                  </p>
                  <button className="btn btn-primary" onClick={() => setCheckoutSuccess(null)} style={{ marginTop: "12px" }}>
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--color-text-light)", padding: "48px 16px" }}>
                  <p>Your shopping bag is currently empty.</p>
                  <p style={{ fontSize: "0.8rem", marginTop: "12px" }}>Browse our shop and add personalized cutting boards, decanters, or baby blocks!</p>
                  <button className="btn btn-primary" onClick={() => setIsCartOpen(false)} style={{ marginTop: "24px" }}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "16px", borderBottom: "1px solid var(--color-border)", paddingBottom: "16px" }}>
                    <div style={{ width: "80px", height: "80px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", overflow: "hidden", position: "relative" }}>
                      <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 600 }}>{item.name}</h4>
                      
                      {item.customizationDisplay ? (
                        <div style={{ fontSize: "0.75rem", backgroundColor: "var(--color-surface-soft)", padding: "6px 10px", borderRadius: "var(--radius-sm)", margin: "4px 0" }}>
                          <span style={{ fontWeight: 600, color: "var(--color-accent)" }}>Custom Engraving:</span>
                          {Object.entries(item.customizationDisplay).map(([label, val]) => (
                            <div key={label}>{label}: <span style={{ fontFamily: "monospace" }}>"{val}"</span></div>
                          ))}
                        </div>
                      ) : null}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--color-border)", borderRadius: "20px", padding: "2px 8px" }}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, width: "16px", textAlign: "center" }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: "none", border: "none", color: "var(--color-text-light)", cursor: "pointer", alignSelf: "flex-start", padding: "4px" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && !checkoutSuccess && (
              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 600, marginBottom: "16px" }}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginBottom: "20px" }}>
                  Shipping and taxes calculated at checkout. Southern charm bows wrapping always included.
                </p>

                {user ? (
                  <button 
                    className="btn btn-primary" 
                    onClick={handleCheckout} 
                    disabled={isCheckingOut}
                    style={{ width: "100%", padding: "16px" }}
                  >
                    {isCheckingOut ? "Processing order..." : "Submit Order"}
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Link 
                      href="/account?redirect=checkout" 
                      onClick={() => setIsCartOpen(false)}
                      className="btn btn-primary"
                      style={{ width: "100%", padding: "16px", textAlign: "center" }}
                    >
                      Log In to Checkout
                    </Link>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-error)", textAlign: "center" }}>
                      * An account is required to place simulated orders.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
