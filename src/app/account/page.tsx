import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AuthForms from "./auth-forms";
import { logoutAction } from "@/app/actions";
import { LogOut, Package, CreditCard, MapPin, Calendar, Compass, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AccountPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="container-width" style={{ padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-accent)", fontWeight: 600 }}>
            Welcome to Bridle & Birch
          </span>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginTop: "8px" }}>Account Portal</h1>
          <p style={{ color: "var(--color-text-light)", fontSize: "0.95rem", maxWidth: "600px", margin: "8px auto 0" }}>
            Sign in to track orders, save billing preferences, and personalize your laser engraved gift orders.
          </p>
        </div>
        <AuthForms />
      </div>
    );
  }

  // Fetch user orders
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container-width" style={{ padding: "64px 24px" }}>
      {/* Welcome & Logout */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          borderBottom: "1px solid var(--color-border)", 
          paddingBottom: "24px",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", color: "var(--color-primary)" }}>
            Hello, {user.name || "Sugah"}!
          </h1>
          <p style={{ color: "var(--color-text-light)", fontSize: "0.9rem" }}>
            Email: {user.email} | Role: <span style={{ textTransform: "uppercase", fontWeight: 600, color: user.role === "admin" ? "var(--color-accent)" : "var(--color-primary)" }}>{user.role}</span>
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "12px" }}>
          {user.role === "admin" && (
            <Link href="/admin" className="btn btn-accent" style={{ padding: "10px 20px", fontSize: "0.8rem" }}>
              Admin Panel
            </Link>
          )}
          <form action={logoutAction}>
            <button type="submit" className="btn btn-outline" style={{ padding: "10px 20px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <LogOut size={16} /> Log Out
            </button>
          </form>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }} className="engraving-container">
        {/* Order History */}
        <div className="control-panel" style={{ width: "100%" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Package size={22} color="var(--color-accent)" /> Order History
          </h3>

          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--color-text-light)" }}>
              <p>You haven't placed any orders yet.</p>
              <p style={{ fontSize: "0.8rem", marginTop: "8px" }}>Our handcrafted personalized cutting boards and stemware are waiting to be customized!</p>
              <Link href="/" className="btn btn-primary" style={{ marginTop: "20px" }}>Start Shopping</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  style={{ 
                    border: "1px solid var(--color-border)", 
                    borderRadius: "var(--radius-md)", 
                    overflow: "hidden",
                    backgroundColor: "var(--color-surface-soft)"
                  }}
                >
                  {/* Order Header */}
                  <div 
                    style={{ 
                      padding: "16px 20px", 
                      backgroundColor: "var(--color-surface)", 
                      borderBottom: "1px solid var(--color-border)",
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                      fontSize: "0.85rem"
                    }}
                  >
                    <div>
                      <span style={{ color: "var(--color-text-light)" }}>Order ID: </span>
                      <strong style={{ fontFamily: "monospace" }}>{order.id.slice(0, 8)}...</strong>
                    </div>
                    <div>
                      <Calendar size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                      <span style={{ color: "var(--color-text-light)" }}>Date: </span>
                      <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-text-light)" }}>Status: </span>
                      <span className={`badge badge-${order.status}`}>{order.status}</span>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-text-light)" }}>Total: </span>
                      <strong style={{ color: "var(--color-primary)", fontSize: "0.95rem" }}>${order.total.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    {order.items.map((item) => {
                      let customization = null;
                      if (item.customizationText) {
                        try {
                          customization = JSON.parse(item.customizationText);
                        } catch (e) {}
                      }

                      return (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                          <div>
                            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-primary)" }}>
                              {item.productName} <span style={{ color: "var(--color-text-light)", fontWeight: 400 }}>x {item.quantity}</span>
                            </h4>
                            
                            {customization ? (
                              <div style={{ fontSize: "0.75rem", backgroundColor: "var(--color-surface)", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--color-border)", marginTop: "6px" }}>
                                <span style={{ fontWeight: 600, color: "var(--color-accent)", display: "block", marginBottom: "4px" }}>
                                  <Compass size={12} style={{ display: "inline", marginRight: "4px" }} /> Laser Engraving Settings:
                                </span>
                                {Object.entries(customization).map(([k, v]) => (
                                  <div key={k}>{k}: <span style={{ fontFamily: "monospace" }}>"{v as string}"</span></div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile / Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          {/* Mock Saved Payment */}
          <div className="control-panel" style={{ width: "100%" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <CreditCard size={20} color="var(--color-accent)" /> Saved Payment Method
            </h3>
            <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--color-surface-soft)" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Visa ending in 4242</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>Expires 12/2028</p>
              </div>
              <span className="badge badge-completed" style={{ fontSize: "0.65rem" }}>Default</span>
            </div>
            <button className="btn btn-outline" style={{ width: "100%", padding: "10px", marginTop: "16px", fontSize: "0.8rem" }} disabled>
              Update Payment Method
            </button>
          </div>

          {/* Mock Saved Shipping */}
          <div className="control-panel" style={{ width: "100%" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <MapPin size={20} color="var(--color-accent)" /> Shipping Address
            </h3>
            <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "16px", backgroundColor: "var(--color-surface-soft)", fontSize: "0.9rem" }}>
              <p style={{ fontWeight: 600 }}>{user.name || "Sugah"}</p>
              <p style={{ color: "var(--color-text-light)" }}>123 River Street</p>
              <p style={{ color: "var(--color-text-light)" }}>Savannah, GA 31401</p>
              <p style={{ color: "var(--color-text-light)" }}>United States</p>
            </div>
            <button className="btn btn-outline" style={{ width: "100%", padding: "10px", marginTop: "16px", fontSize: "0.8rem" }} disabled>
              Edit Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
