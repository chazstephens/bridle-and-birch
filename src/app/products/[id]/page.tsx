import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EngravingPreview from "@/components/engraving-preview";
import { Star, Truck, Calendar, ShieldCheck, ArrowLeft, Send } from "lucide-react";
import { submitReviewAction } from "@/app/actions";
import { revalidatePath } from "next/cache";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Retrieve product by ID or unique slug
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id },
        { slug: id }
      ]
    },
    include: {
      category: true,
      customFields: true,
      reviews: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!product || !product.active) {
    notFound();
  }

  // Calculate average rating
  const avgRating = product.reviews.length > 0
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  // Server Action handler for posting reviews directly
  async function handlePostReview(formData: FormData) {
    "use server";
    const author = formData.get("author") as string;
    const rating = parseInt(formData.get("rating") as string, 10);
    const text = formData.get("text") as string;
    const prodId = formData.get("productId") as string;

    if (!author || !rating || !text || !prodId) return;

    await submitReviewAction(prodId, author, rating, text);
  }

  return (
    <div className="container-width" style={{ padding: "40px 24px" }}>
      {/* Back navigation link */}
      <div style={{ marginBottom: "32px" }}>
        <Link 
          href="/" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            fontSize: "0.9rem", 
            color: "var(--color-text-light)", 
            fontWeight: 500 
          }}
        >
          <ArrowLeft size={16} /> Back to Collection
        </Link>
      </div>

      {/* Product customizer interface layout */}
      <div className="product-customizer-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px", marginBottom: "64px" }}>
        {/* Live preview component loaded on client */}
        <EngravingPreview product={product} />

        {/* Product specs, description, and trust seals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-accent)", fontWeight: 600 }}>
              {product.category.name}
            </span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", color: "var(--color-primary)", marginTop: "4px", marginBottom: "12px" }}>
              {product.name}
            </h1>
            
            {/* Review summary stars */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", color: "var(--color-accent)" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    fill={star <= (avgRating ? Math.round(Number(avgRating)) : 5) ? "currentColor" : "none"} 
                  />
                ))}
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                {avgRating ? `${avgRating} / 5.0 (${product.reviews.length} reviews)` : "No reviews yet"}
              </span>
            </div>
          </div>

          <div style={{ fontSize: "1.8rem", fontWeight: 500, color: "var(--color-text)" }}>
            ${product.price.toFixed(2)}
          </div>

          <p style={{ color: "var(--color-text-light)", lineHeight: "1.7" }}>
            {product.description}
          </p>

          <hr style={{ border: "none", borderTop: "1px solid var(--color-border)" }} />

          {/* Turnaround & Shipping Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <Calendar size={20} style={{ color: "var(--color-primary)", marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-primary)" }}>Handcraft Turnaround</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                  Engraving is custom completed in {product.turnaround}.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <Truck size={20} style={{ color: "var(--color-primary)", marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-primary)" }}>Nationwide U.S. Shipping</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                  Standard shipping takes 3-5 business days. Ships directly from our workshop.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <ShieldCheck size={20} style={{ color: "var(--color-primary)", marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-primary)" }}>Heirloom Guarantee</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                  We inspect each laser-burn and glass frosting template under close verification to guarantee a flawless finish.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section style={{ backgroundColor: "var(--color-surface)", padding: "48px 32px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--color-primary)", marginBottom: "32px" }}>
          Heirloom Reviews
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }} className="reviews-grid">
          {/* Reviews list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {product.reviews.length === 0 ? (
              <p style={{ color: "var(--color-text-light)", fontStyle: "italic" }}>
                Be the first to review this custom engraving!
              </p>
            ) : (
              product.reviews.map((review) => (
                <div 
                  key={review.id} 
                  style={{ 
                    borderBottom: "1px solid var(--color-border)", 
                    paddingBottom: "20px" 
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-text)" }}>
                      {review.author}
                    </h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                      {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div style={{ display: "flex", color: "var(--color-accent)", gap: "2px", marginBottom: "8px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={12} 
                        fill={star <= review.rating ? "currentColor" : "none"} 
                      />
                    ))}
                    {review.verified && (
                      <span style={{ fontSize: "0.7rem", color: "var(--color-success)", fontWeight: 600, marginLeft: "8px", textTransform: "uppercase" }}>
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", lineHeight: "1.6" }}>
                    {review.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Write a review form */}
          <div 
            style={{ 
              backgroundColor: "var(--color-surface-soft)", 
              padding: "24px", 
              borderRadius: "var(--radius-sm)", 
              height: "fit-content" 
            }}
          >
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "16px" }}>
              Share Your Thoughts
            </h3>
            <form action={handlePostReview} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input type="hidden" name="productId" value={product.id} />
              
              <div>
                <label className="form-label" htmlFor="review-author" style={{ marginBottom: "6px", display: "block", fontSize: "0.85rem" }}>
                  Your Name
                </label>
                <input 
                  type="text" 
                  id="review-author" 
                  name="author" 
                  className="form-input" 
                  placeholder="e.g. Sarah S." 
                  required 
                />
              </div>

              <div>
                <label className="form-label" htmlFor="review-rating" style={{ marginBottom: "6px", display: "block", fontSize: "0.85rem" }}>
                  Rating
                </label>
                <select 
                  id="review-rating" 
                  name="rating" 
                  className="form-select" 
                  required
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Great)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Unsatisfactory)</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="review-text" style={{ marginBottom: "6px", display: "block", fontSize: "0.85rem" }}>
                  Your Review
                </label>
                <textarea 
                  id="review-text" 
                  name="text" 
                  className="form-input" 
                  rows={4} 
                  placeholder="Tell us about the wood quality, engraving sharpness, and wrapping..." 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Send size={14} /> Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
