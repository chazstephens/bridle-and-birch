import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  updateOrderStatusAction, 
  updateCustomRequestStatusAction, 
  deleteProductAction 
} from "@/app/actions";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  Mail, 
  FileText, 
  ArrowRight, 
  Trash2, 
  Eye, 
  CheckCircle,
  ExternalLink,
  Plus
} from "lucide-react";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // 1. Authorize Admin
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/account");
  }

  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || "orders";

  // 2. Fetch Data
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      items: true
    },
    orderBy: { createdAt: "desc" }
  });

  const customRequests = await prisma.customRequest.findMany({
    orderBy: { createdAt: "desc" }
  });

  const subscribers = await prisma.newsletter.findMany({
    orderBy: { subscribedAt: "desc" }
  });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  // 3. Calculate Metrics
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalRequests = customRequests.length;
  const totalSubscribers = subscribers.length;

  // 4. Sales Trend (Last 7 Days)
  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    },
    orderBy: { createdAt: "asc" }
  });

  const salesData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    
    const dayOrders = recentOrders.filter(order => {
      const oDate = new Date(order.createdAt);
      return oDate.getFullYear() === date.getFullYear() &&
             oDate.getMonth() === date.getMonth() &&
             oDate.getDate() === date.getDate();
    });

    const total = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return { label: dateStr, amount: total };
  });

  const maxAmount = Math.max(...salesData.map(d => d.amount), 100);
  const chartHeight = 140;
  const chartWidth = 500;
  
  const points = salesData.map((d, index) => {
    const x = (index / (salesData.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - (d.amount / maxAmount) * (chartHeight - 40) - 15;
    return { x, y, label: d.label, amount: d.amount };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - 10} L ${points[0].x} ${chartHeight - 10} Z`
    : "";

  // 5. Server actions handlers inside Server Component
  async function handleUpdateOrderStatus(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    const status = formData.get("status") as string;
    await updateOrderStatusAction(orderId, status);
    revalidatePath("/admin");
  }

  async function handleUpdateCustomRequest(formData: FormData) {
    "use server";
    const requestId = formData.get("requestId") as string;
    const status = formData.get("status") as string;
    await updateCustomRequestStatusAction(requestId, status);
    revalidatePath("/admin");
  }

  async function handleDeleteProduct(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;
    await deleteProductAction(productId);
    revalidatePath("/admin");
    revalidatePath("/");
  }

  return (
    <div className="container-width" style={{ padding: "40px 24px" }}>
      {/* Admin Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid var(--color-border)",
        paddingBottom: "24px",
        marginBottom: "32px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-accent)", fontWeight: 600 }}>
            Bridle & Birch Portal
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", color: "var(--color-primary)", marginTop: "4px" }}>
            Owner's Dashboard
          </h1>
          <p style={{ color: "var(--color-text-light)", fontSize: "0.9rem" }}>
            Welcome back, {user.name}. Manage inventory, orders, and inquiries.
          </p>
        </div>
        <div>
          <Link href="/admin/wizard" className="btn btn-accent" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={16} /> Upload Product
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div className="control-panel" style={{ width: "100%", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ padding: "12px", borderRadius: "50%", backgroundColor: "rgba(197, 168, 128, 0.15)", color: "var(--color-accent)" }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Revenue</span>
            <h4 style={{ fontSize: "1.6rem", color: "var(--color-primary)", fontWeight: 700 }}>${totalSales.toFixed(2)}</h4>
          </div>
        </div>

        <div className="control-panel" style={{ width: "100%", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ padding: "12px", borderRadius: "50%", backgroundColor: "rgba(114, 84, 61, 0.15)", color: "var(--color-primary)" }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Orders</span>
            <h4 style={{ fontSize: "1.6rem", color: "var(--color-primary)", fontWeight: 700 }}>{totalOrders}</h4>
          </div>
        </div>

        <div className="control-panel" style={{ width: "100%", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ padding: "12px", borderRadius: "50%", backgroundColor: "rgba(140, 125, 112, 0.15)", color: "var(--color-text-light)" }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Custom Request Logs</span>
            <h4 style={{ fontSize: "1.6rem", color: "var(--color-primary)", fontWeight: 700 }}>{totalRequests}</h4>
          </div>
        </div>

        <div className="control-panel" style={{ width: "100%", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ padding: "12px", borderRadius: "50%", backgroundColor: "rgba(27, 59, 43, 0.1)", color: "var(--color-success)" }}>
            <Mail size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Newsletter Fans</span>
            <h4 style={{ fontSize: "1.6rem", color: "var(--color-primary)", fontWeight: 700 }}>{totalSubscribers}</h4>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px", marginBottom: "48px" }} className="engraving-container">
        {/* Sales Chart Area */}
        <div className="control-panel" style={{ width: "100%" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "20px" }}>
            7-Day Sales Trend
          </h3>
          
          <div style={{ width: "100%", overflowX: "auto" }}>
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              style={{ width: "100%", minWidth: "450px", height: "auto", overflow: "visible" }}
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--bb-brass)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--bb-brass)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="30" y1="20" x2={chartWidth - 30} y2="20" stroke="rgba(229, 223, 213, 0.5)" strokeDasharray="4" />
              <line x1="30" y1="60" x2={chartWidth - 30} y2="60" stroke="rgba(229, 223, 213, 0.5)" strokeDasharray="4" />
              <line x1="30" y1="100" x2={chartWidth - 30} y2="100" stroke="rgba(229, 223, 213, 0.5)" strokeDasharray="4" />
              <line x1="30" y1={chartHeight - 10} x2={chartWidth - 30} y2={chartHeight - 10} stroke="var(--color-border)" />

              {/* Area Under Line */}
              {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}

              {/* Line */}
              {linePath && (
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="var(--color-accent)" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}

              {/* Point Circles & Tooltips */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="5" 
                    fill="var(--color-surface)" 
                    stroke="var(--color-primary)" 
                    strokeWidth="2" 
                  />
                  {/* Amount Text */}
                  <text 
                    x={p.x} 
                    y={p.y - 10} 
                    textAnchor="middle" 
                    fontSize="9" 
                    fontFamily="var(--font-sans)" 
                    fontWeight="600" 
                    fill="var(--color-text)"
                  >
                    ${p.amount.toFixed(0)}
                  </text>
                  {/* Axis Label */}
                  <text 
                    x={p.x} 
                    y={chartHeight + 12} 
                    textAnchor="middle" 
                    fontSize="9" 
                    fontFamily="var(--font-sans)" 
                    fill="var(--color-text-light)"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", marginBottom: "24px", gap: "8px", overflowX: "auto" }}>
        <Link 
          href="?tab=orders" 
          className={`btn ${activeTab === "orders" ? "btn-primary" : "btn-outline"}`}
          style={{ padding: "10px 20px", fontSize: "0.8rem", whiteSpace: "nowrap" }}
        >
          Orders ({orders.length})
        </Link>
        <Link 
          href="?tab=requests" 
          className={`btn ${activeTab === "requests" ? "btn-primary" : "btn-outline"}`}
          style={{ padding: "10px 20px", fontSize: "0.8rem", whiteSpace: "nowrap" }}
        >
          Custom Inquiries ({customRequests.length})
        </Link>
        <Link 
          href="?tab=products" 
          className={`btn ${activeTab === "products" ? "btn-primary" : "btn-outline"}`}
          style={{ padding: "10px 20px", fontSize: "0.8rem", whiteSpace: "nowrap" }}
        >
          Products ({products.length})
        </Link>
        <Link 
          href="?tab=newsletter" 
          className={`btn ${activeTab === "newsletter" ? "btn-primary" : "btn-outline"}`}
          style={{ padding: "10px 20px", fontSize: "0.8rem", whiteSpace: "nowrap" }}
        >
          Newsletter Subscribers ({subscribers.length})
        </Link>
      </div>

      {/* Tab Panels */}
      <div>
        {/* TAB 1: ORDERS */}
        {activeTab === "orders" && (
          <div className="control-panel" style={{ width: "100%", padding: "24px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "20px" }}>
              Customer Orders
            </h3>
            {orders.length === 0 ? (
              <p style={{ textAlign: "center", padding: "40px", color: "var(--color-text-light)" }}>No orders placed yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {orders.map(order => (
                  <div key={order.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "var(--color-surface)" }}>
                    {/* Header */}
                    <div style={{ backgroundColor: "var(--color-surface-soft)", padding: "16px 20px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", fontSize: "0.85rem" }}>
                      <div>
                        Order Ref: <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{order.id}</span>
                      </div>
                      <div>
                        Date: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                      </div>
                      <div>
                        Total: <strong style={{ color: "var(--color-primary)", fontSize: "0.95rem" }}>${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                    
                    {/* Customer & Items Details */}
                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "20px" }}>
                        <div>
                          <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-light)", marginBottom: "8px" }}>Customer Details</h4>
                          <p style={{ fontWeight: 600 }}>{order.user.name}</p>
                          <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>{order.user.email}</p>
                        </div>
                        
                        <div>
                          <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-light)", marginBottom: "8px" }}>Change Order Status</h4>
                          <form action={handleUpdateOrderStatus} style={{ display: "flex", gap: "8px" }}>
                            <input type="hidden" name="orderId" value={order.id} />
                            <select 
                              name="status" 
                              defaultValue={order.status}
                              style={{ padding: "6px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-surface-soft)", fontSize: "0.85rem", cursor: "pointer" }}
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button type="submit" className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                              Update
                            </button>
                          </form>
                        </div>
                      </div>

                      <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-light)", borderBottom: "1px solid var(--color-border)", paddingBottom: "6px", marginBottom: "12px" }}>Order Items</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {order.items.map(item => {
                          let custom = null;
                          if (item.customizationText) {
                            try {
                              custom = JSON.parse(item.customizationText);
                            } catch (e) {}
                          }
                          return (
                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", borderBottom: "1px solid rgba(229, 223, 213, 0.3)", paddingBottom: "8px" }}>
                              <div>
                                <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                                  {item.productName} <span style={{ fontWeight: 400, color: "var(--color-text-light)", fontSize: "0.8rem" }}>x{item.quantity}</span>
                                </p>
                                {custom && (
                                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginTop: "4px", backgroundColor: "var(--color-surface-soft)", padding: "6px 10px", borderRadius: "var(--radius-sm)", fontFamily: "monospace" }}>
                                    {Object.entries(custom).map(([k, v]) => (
                                      <div key={k}>{k}: "{v as string}"</div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOM REQUESTS */}
        {activeTab === "requests" && (
          <div className="control-panel" style={{ width: "100%", padding: "24px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "20px" }}>
              Custom Request Logs
            </h3>
            {customRequests.length === 0 ? (
              <p style={{ textAlign: "center", padding: "40px", color: "var(--color-text-light)" }}>No inquiries submitted.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {customRequests.map(request => (
                  <div key={request.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "20px", backgroundColor: "var(--color-surface)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                      <div>
                        <h4 style={{ fontSize: "1.1rem", color: "var(--color-primary)" }}>{request.name}</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                          {request.email} {request.phone && `| ${request.phone}`}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.8rem", display: "block", color: "var(--color-text-light)" }}>
                          Submitted: {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`badge badge-${request.status}`} style={{ marginTop: "4px", display: "inline-block" }}>
                          {request.status}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px", fontSize: "0.9rem" }}>
                      <div>
                        <strong>Occasion:</strong> {request.occasion || "General Gift"}
                      </div>
                      <div>
                        <strong>Desired Quantity:</strong> {request.quantity}
                      </div>
                      <div>
                        <strong>Design File:</strong>{" "}
                        {request.uploadedFileUrl ? (
                          <a href={request.uploadedFileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "underline" }}>
                            View Uploaded File <ExternalLink size={14} />
                          </a>
                        ) : (
                          <span style={{ color: "var(--color-text-light)" }}>No file provided</span>
                        )}
                      </div>
                    </div>

                    <div style={{ backgroundColor: "var(--color-surface-soft)", padding: "12px 16px", borderRadius: "var(--radius-sm)", marginBottom: "16px", border: "1px solid var(--color-border)" }}>
                      <strong style={{ fontSize: "0.8rem", display: "block", color: "var(--color-text-light)", marginBottom: "6px" }}>Request Message:</strong>
                      <p style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>{request.message}</p>
                    </div>

                    <form action={handleUpdateCustomRequest} style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <select 
                        name="status" 
                        defaultValue={request.status}
                        style={{ padding: "6px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-surface-soft)", fontSize: "0.8rem" }}
                      >
                        <option value="pending">Pending Review</option>
                        <option value="reviewed">Reviewed & Answered</option>
                      </select>
                      <button type="submit" className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                        Update Status
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS */}
        {activeTab === "products" && (
          <div className="control-panel" style={{ width: "100%", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-primary)" }}>
                Active Storefront Products
              </h3>
              <Link href="/admin/wizard" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.75rem" }}>
                Add New Product
              </Link>
            </div>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                    <th style={{ padding: "12px" }}>Product</th>
                    <th style={{ padding: "12px" }}>Category</th>
                    <th style={{ padding: "12px" }}>Base Price</th>
                    <th style={{ padding: "12px" }}>Engrave Canvas</th>
                    <th style={{ padding: "12px" }}>Turnaround</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", overflow: "hidden", position: "relative" }}>
                          <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div>
                          <strong style={{ display: "block" }}>{product.name}</strong>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>Type: {product.productType}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px" }}>{product.category.name}</td>
                      <td style={{ padding: "12px", fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                      <td style={{ padding: "12px" }}>
                        <span className={`badge badge-${product.previewType !== "no_preview" ? "completed" : "pending"}`} style={{ fontSize: "0.7rem" }}>
                          {product.previewType}
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontSize: "0.8rem", color: "var(--color-text-light)" }}>{product.turnaround}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <Link href={`/products/${product.slug}`} target="_blank" className="btn btn-outline" style={{ padding: "6px", display: "flex", color: "var(--color-text)" }} title="View Storefront">
                            <Eye size={14} />
                          </Link>
                          <form action={handleDeleteProduct}>
                            <input type="hidden" name="productId" value={product.id} />
                            <button type="submit" className="btn btn-outline" style={{ padding: "6px", display: "flex", color: "var(--color-error)", borderColor: "rgba(154, 52, 18, 0.3)" }} title="Delete Product">
                              <Trash2 size={14} />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: NEWSLETTER */}
        {activeTab === "newsletter" && (
          <div className="control-panel" style={{ width: "100%", padding: "24px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "20px" }}>
              Newsletter Subscribers
            </h3>
            {subscribers.length === 0 ? (
              <p style={{ textAlign: "center", padding: "40px", color: "var(--color-text-light)" }}>No subscribers yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                      <th style={{ padding: "12px" }}>Email Address</th>
                      <th style={{ padding: "12px" }}>Subscribed On</th>
                      <th style={{ padding: "12px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map(sub => (
                      <tr key={sub.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <td style={{ padding: "12px", fontWeight: 500 }}>{sub.email}</td>
                        <td style={{ padding: "12px", color: "var(--color-text-light)" }}>
                          {new Date(sub.subscribedAt).toLocaleString()}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span className="badge badge-completed" style={{ fontSize: "0.7rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <CheckCircle size={10} /> Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
