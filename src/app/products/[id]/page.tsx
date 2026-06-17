export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPlaceholderBySlug } from "@/lib/placeholder-products";
import EngravingPreview from "@/components/engraving-preview";
import { Star, Truck, Calendar, ShieldCheck, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { submitReviewAction } from "@/app/actions";
import { Rating } from "@/components/ui";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// ── Accordion ─────────────────────────────────────────────────────────────
// Server-rendered accordion using native <details>/<summary>
function Accordion({
  title,
  children,
  open = false,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details
      open={open}
      style={{
        borderBottom: "var(--border-1)",
        paddingBottom: 0,
      }}
    >
      <summary
        style={{
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0",
          cursor: "pointer",
          userSelect: "none",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--text-heading)",
        }}
      >
        {title}
        <span
          style={{
            fontSize: 20,
            fontWeight: 300,
            color: "var(--text-subtle)",
            lineHeight: 1,
          }}
          aria-hidden
        >
          +
        </span>
      </summary>
      <div style={{ paddingBottom: 20 }}>{children}</div>
    </details>
  );
}

// ── Trust item ─────────────────────────────────────────────────────────────
function TrustItem({
  icon,
  heading,
  body,
}: {
  icon: React.ReactNode;
  heading: string;
  body: string;
}) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "var(--surface-warm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "var(--bb-walnut)",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--text-heading)",
            marginBottom: 3,
          }}
        >
          {heading}
        </div>
        <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.55 }}>
          {body}
        </p>
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Try the database first; fall back to placeholder data when no production
  // database is connected. Using catch() so a missing DATABASE_URL doesn't
  // result in a 500 — it gracefully degrades to the placeholder catalog.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let product: any = await prisma.product
    .findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        category: true,
        customFields: { orderBy: { id: "asc" } },
        reviews: { orderBy: { createdAt: "desc" } },
      },
    })
    .catch(() => null);

  if (!product || !product.active) {
    product = getPlaceholderBySlug(id) ?? null;
  }

  if (!product || !product.active) {
    notFound();
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce(
          (acc: number, r: { rating: number }) => acc + r.rating,
          0
        ) / product.reviews.length
      : null;

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
    <>
      {/* ── Page shell ──────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "0 var(--content-pad)",
        }}
      >
        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <nav
          style={{
            paddingTop: 28,
            paddingBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--text-subtle)",
          }}
        >
          <Link
            href="/"
            style={{ color: "var(--text-subtle)", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <ArrowLeft size={13} />
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            style={{ color: "var(--text-subtle)" }}
          >
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category?.id ?? ""}`}
            style={{ color: "var(--text-subtle)" }}
          >
            {product.category?.name}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-body)" }}>{product.name}</span>
        </nav>

        {/* ── Product header meta ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "10px 24px",
            marginBottom: 32,
            paddingBottom: 24,
            borderBottom: "var(--border-1)",
          }}
        >
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            {product.category && (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "var(--ls-label)",
                  textTransform: "uppercase",
                  color: "var(--bb-brass)",
                  marginBottom: 8,
                }}
              >
                {product.category.name}
              </div>
            )}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                color: "var(--text-heading)",
                lineHeight: 1.2,
                margin: "0 0 12px",
              }}
            >
              {product.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {avgRating ? (
                <Rating
                  value={avgRating}
                  count={product.reviews.length}
                  showValue
                />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--text-subtle)",
                    fontStyle: "italic",
                  }}
                >
                  No reviews yet
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div
            style={{
              flexShrink: 0,
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            Starting at ${Math.floor(product.price)}
          </div>
        </div>

        {/* ── Engraving preview + personalization form ─────────────── */}
        <div style={{ marginBottom: 60 }}>
          <EngravingPreview product={product} />
        </div>

        {/* ── Product details accordion row ─────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 80px",
            marginBottom: 72,
          }}
          className="bb-detail-grid"
        >
          {/* Left col — Description + Care */}
          <div>
            <Accordion title="About This Piece" open>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-muted)",
                  lineHeight: 1.75,
                }}
              >
                {product.description}
              </p>
            </Accordion>
            <Accordion title="Care Instructions">
              <ul
                style={{
                  fontSize: 14.5,
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  paddingLeft: 20,
                }}
              >
                <li>Hand wash only — dishwasher heat warps the wood grain.</li>
                <li>Condition with food-safe mineral oil every few months.</li>
                <li>Store flat to prevent warping. Keep dry between uses.</li>
                <li>Do not soak or leave submerged in water.</li>
              </ul>
            </Accordion>
            <Accordion title="Materials">
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}
              >
                All wood pieces are crafted from responsibly sourced hardwood —
                acacia, walnut, or cherry depending on the item. Engravings are
                laser-cut to a consistent depth and sealed with food-safe finish.
              </p>
            </Accordion>
          </div>

          {/* Right col — Trust badges + Shipping */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              paddingTop: 18,
            }}
          >
            <TrustItem
              icon={<Calendar size={17} />}
              heading="Handcraft Turnaround"
              body={`Custom engraving is completed in ${product.turnaround ?? "5–7 business days"}. Rush orders available at checkout.`}
            />
            <TrustItem
              icon={<Truck size={17} />}
              heading="Nationwide U.S. Shipping"
              body="Ships directly from our workshop. Standard delivery takes 3–5 business days after fulfillment."
            />
            <TrustItem
              icon={<ShieldCheck size={17} />}
              heading="Heirloom Guarantee"
              body="Every laser-engraved piece is inspected before packing. If anything isn't right, we remake it. No questions."
            />

            {/* Trust pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 6 }}>
              {["Handmade in the USA", "Gift Wrapping Available", "Free Returns"].map(
                (label) => (
                  <div
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      background: "var(--surface-warm)",
                      border: "var(--border-1)",
                      borderRadius: "var(--radius-pill)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 12,
                      color: "var(--text-muted)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    <CheckCircle2 size={12} style={{ color: "var(--bb-walnut)" }} />
                    {label}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Reviews section ── warm inset band ─────────────────────── */}
      <section
        style={{
          background: "var(--surface-warm)",
          borderTop: "var(--border-1)",
          borderBottom: "var(--border-1)",
          padding: "72px 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 400px",
              gap: 60,
              alignItems: "start",
            }}
            className="bb-reviews-grid"
          >
            {/* ── Left: review list ──────────────────────────────────── */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--fs-h2)",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  marginBottom: 8,
                }}
              >
                Heirloom Reviews
              </h2>
              {avgRating && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 32,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "var(--text-heading)",
                    }}
                  >
                    {avgRating.toFixed(1)}
                  </span>
                  <div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          fill={
                            s <= Math.round(avgRating)
                              ? "var(--bb-brass)"
                              : "none"
                          }
                          color="var(--bb-brass)"
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-subtle)",
                        marginTop: 2,
                      }}
                    >
                      Based on {product.reviews.length}{" "}
                      {product.reviews.length === 1 ? "review" : "reviews"}
                    </div>
                  </div>
                </div>
              )}

              {product.reviews.length === 0 ? (
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.1rem",
                    fontStyle: "italic",
                    color: "var(--text-subtle)",
                    marginBottom: 32,
                  }}
                >
                  Be the first to leave a review for this piece.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {product.reviews.map((review: { id: string; rating: number; verified: boolean; text: string; author: string; createdAt: Date }, i: number) => (
                    <div
                      key={review.id}
                      style={{
                        paddingTop: i === 0 ? 0 : 28,
                        paddingBottom: 28,
                        borderBottom:
                          i < product.reviews.length - 1
                            ? "var(--border-1)"
                            : "none",
                      }}
                    >
                      {/* Stars + verified */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={13}
                              fill={
                                s <= review.rating ? "var(--bb-brass)" : "none"
                              }
                              color="var(--bb-brass)"
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "var(--status-success)",
                            }}
                          >
                            Verified Purchase
                          </span>
                        )}
                      </div>

                      {/* Review text */}
                      <blockquote
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "1rem",
                          fontStyle: "italic",
                          color: "var(--text-body)",
                          lineHeight: 1.7,
                          margin: "0 0 12px",
                        }}
                      >
                        &ldquo;{review.text}&rdquo;
                      </blockquote>

                      {/* Author + date */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 700,
                            fontSize: 13,
                            color: "var(--text-muted)",
                          }}
                        >
                          — {review.author}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--text-subtle)",
                          }}
                        >
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: write a review form ────────────────────────── */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "var(--border-1)",
                borderRadius: "var(--radius-xl)",
                padding: "32px 28px",
                boxShadow: "var(--shadow-sm)",
                position: "sticky",
                top: "calc(var(--header-h) + 28px)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  marginBottom: 6,
                }}
              >
                Share Your Thoughts
              </h3>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--text-muted)",
                  lineHeight: 1.55,
                  marginBottom: 24,
                }}
              >
                Received your order? Let others know what you thought.
              </p>

              <form
                action={handlePostReview}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <input type="hidden" name="productId" value={product.id} />

                {/* Name */}
                <div>
                  <label
                    htmlFor="review-author"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      marginBottom: 7,
                    }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="review-author"
                    name="author"
                    placeholder="e.g. Sarah M."
                    required
                    style={{
                      width: "100%",
                      height: 44,
                      padding: "0 14px",
                      background: "var(--surface-page)",
                      border: "var(--border-1)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-body)",
                      fontSize: 14.5,
                      color: "var(--text-body)",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label
                    htmlFor="review-rating"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      marginBottom: 7,
                    }}
                  >
                    Rating
                  </label>
                  <select
                    id="review-rating"
                    name="rating"
                    required
                    style={{
                      width: "100%",
                      height: 44,
                      padding: "0 14px",
                      background: "var(--surface-page)",
                      border: "var(--border-1)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-body)",
                      fontSize: 14.5,
                      color: "var(--text-body)",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="5">5 Stars — Excellent</option>
                    <option value="4">4 Stars — Great</option>
                    <option value="3">3 Stars — Average</option>
                    <option value="2">2 Stars — Poor</option>
                    <option value="1">1 Star — Unsatisfactory</option>
                  </select>
                </div>

                {/* Review text */}
                <div>
                  <label
                    htmlFor="review-text"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      marginBottom: 7,
                    }}
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review-text"
                    name="text"
                    rows={4}
                    placeholder="How was the quality, engraving depth, and packaging?"
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "var(--surface-page)",
                      border: "var(--border-1)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-body)",
                      fontSize: 14.5,
                      color: "var(--text-body)",
                      lineHeight: 1.55,
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: 50,
                    background: "var(--bb-espresso)",
                    color: "var(--bb-ivory)",
                    border: "none",
                    borderRadius: "var(--radius-pill)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: 13.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <Send size={14} />
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .bb-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .bb-reviews-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
