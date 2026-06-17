export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Gift, Heart, ShieldCheck, Award, Pencil, Clock, Star, Truck } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Seal } from "@/components/ui/Seal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryTile } from "@/components/ui/CategoryTile";

export default async function Home() {
  const categories = await prisma.category.findMany({ take: 5 });
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true, reviews: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface-page)",
          paddingBlock: "var(--section-y-desktop)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="bb-hero-grid"
        >
          {/* Left — text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: 560,
            }}
          >
            <SectionLabel rules align="left">
              Southern Keepsake Goods
            </SectionLabel>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-display-m)",
                fontWeight: 700,
                lineHeight: "var(--lh-tight)",
                color: "var(--text-heading)",
                letterSpacing: "var(--ls-tight)",
              }}
            >
              Gifts Made to Order.
              <br />
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--bb-walnut)",
                }}
              >
                Meant to be Kept.
              </span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 17,
                lineHeight: "var(--lh-normal)",
                color: "var(--text-muted)",
                maxWidth: 440,
              }}
            >
              Custom laser-engraved cutting boards, glassware, and keepsakes —
              each one crafted with Southern warmth and wrapped in a signature
              cream bow.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link
                href="/products"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 52,
                  padding: "0 32px",
                  background: "var(--btn-primary-bg)",
                  color: "var(--btn-primary-fg)",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                Shop the Collection
              </Link>

              <Link
                href="/custom-orders"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 52,
                  padding: "0 32px",
                  background: "transparent",
                  color: "var(--accent)",
                  borderRadius: "var(--radius-pill)",
                  border: "1.5px solid var(--line-fine)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Custom Request
              </Link>
            </div>

            {/* Social proof */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 20px",
                background: "var(--surface-card)",
                border: "var(--border-1)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-xs)",
                alignSelf: "flex-start",
              }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="var(--bb-brass)"
                    color="var(--bb-brass)"
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13.5,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                4.9 · 500+ happy customers
              </span>
            </div>
          </div>

          {/* Right — image placeholder */}
          <div
            style={{
              background: "linear-gradient(150deg, #8A6647, #5E422D)",
              borderRadius: "var(--radius-xl)",
              aspectRatio: "4 / 5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "var(--border-1)",
              boxShadow: "var(--shadow-lg)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Seal
              variant="oval"
              size={180}
              color="rgba(255,247,236,0.14)"
              ringText
            />
            <span
              style={{
                position: "absolute",
                bottom: 32,
                fontFamily: "var(--font-script)",
                fontSize: 38,
                color: "rgba(255,247,236,0.72)",
              }}
            >
              The Smith Family
            </span>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--bb-espresso)",
          padding: "32px 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}
          className="bb-trust-grid"
        >
          {[
            {
              icon: Gift,
              label: "Gift Wrapping Included",
              sub: "Every order arrives bow-ready",
            },
            {
              icon: Pencil,
              label: "Live Preview",
              sub: "See your engraving before you order",
            },
            {
              icon: Clock,
              label: "5–7 Business Days",
              sub: "Handcrafted, never rushed",
            },
            {
              icon: Truck,
              label: "Free Shipping $100+",
              sub: "On all orders in the contiguous US",
            },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <Icon size={28} color="var(--bb-brass)" strokeWidth={1.5} />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: 13.5,
                    color: "var(--bb-ivory)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12.5,
                    color: "var(--bb-taupe)",
                    marginTop: 2,
                  }}
                >
                  {sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OCCASIONS ─────────────────────────────────────────────── */}
      <section className="bb-section">
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
          }}
        >
          {/* Section heading */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            <SectionLabel rules>Shop by Occasion</SectionLabel>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-h1)",
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              Find the Perfect Gift
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--text-muted)",
                maxWidth: 480,
                lineHeight: "var(--lh-normal)",
              }}
            >
              From weddings to housewarmings, we have something meaningful for
              every occasion.
            </p>
          </div>

          {/* Tiles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "var(--grid-gap)",
            }}
            className="bb-occasions-grid"
          >
            {categories.length > 0
              ? categories.slice(0, 5).map((cat) => (
                  <CategoryTile
                    key={cat.id}
                    title={cat.name}
                    blurb={""}
                    href={`/products?category=${cat.slug}`}
                    tone={
                      (["linen", "maple", "walnut", "cherry", "cream"] as const)[
                        categories.indexOf(cat) % 5
                      ]
                    }
                  />
                ))
              : // Fallback tiles when DB is empty
                [
                  {
                    title: "Wedding & Bridal",
                    blurb: "Personalized keepsakes for couples.",
                    tone: "linen" as const,
                    href: "/products?occasion=wedding",
                  },
                  {
                    title: "Housewarming",
                    blurb: "Welcome them home in style.",
                    tone: "maple" as const,
                    href: "/products?occasion=housewarming",
                  },
                  {
                    title: "Realtor Gifts",
                    blurb: "Closing gifts they'll always remember.",
                    tone: "walnut" as const,
                    href: "/products?occasion=realtor",
                  },
                  {
                    title: "Corporate",
                    blurb: "Branded gifting done beautifully.",
                    tone: "cherry" as const,
                    href: "/products?occasion=corporate",
                  },
                  {
                    title: "Baby Showers",
                    blurb: "Sweet keepsakes for new arrivals.",
                    tone: "cream" as const,
                    href: "/products?occasion=baby-shower",
                  },
                ].map((t) => (
                  <CategoryTile key={t.title} {...t} />
                ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "0 var(--content-pad)",
        }}
      >
        <Divider />
      </div>

      {/* ── BEST SELLERS ──────────────────────────────────────────── */}
      <section className="bb-section">
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            <SectionLabel rules>Best Sellers</SectionLabel>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-h1)",
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              Our Most Loved Pieces
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--grid-gap)",
            }}
            className="bb-products-grid"
          >
            {products.length > 0
              ? products.map((p) => {
                  const avgRating =
                    p.reviews.length > 0
                      ? p.reviews.reduce((a, r) => a + r.rating, 0) /
                        p.reviews.length
                      : undefined;
                  return (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      slug={p.slug}
                      name={p.name}
                      category={p.category?.name ?? ""}
                      price={`Starting at $${p.price.toFixed(2)}`}
                      rating={avgRating}
                      reviews={p.reviews.length || undefined}
                      tone="walnut"
                    />
                  );
                })
              : // Fallback cards
                [
                  { name: "Family Heirloom Cutting Board", category: "Cutting Boards", price: "Starting at $58" },
                  { name: "Whiskey & Decanter Set", category: "Bar Sets", price: "Starting at $78" },
                  { name: "Marble Coaster Set", category: "Coasters", price: "Starting at $42" },
                  { name: "Baby Name Block", category: "Baby & Kids", price: "Starting at $36" },
                ].map((p, i) => (
                  <ProductCard
                    key={p.name}
                    name={p.name}
                    category={p.category}
                    price={p.price}
                    tone={(["walnut", "maple", "linen", "cherry"] as const)[i % 4]}
                    badge={i === 0 ? "Best Seller" : undefined}
                    badgeVariant="brass"
                  />
                ))}
          </div>

          {/* View all */}
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link
              href="/products"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "var(--ls-label)",
                textTransform: "uppercase",
                color: "var(--accent)",
                borderBottom: "1px solid var(--line-fine)",
                paddingBottom: 3,
              }}
            >
              View Full Collection →
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface-card)",
          paddingBlock: "var(--section-y-desktop)",
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBottom: 56,
              textAlign: "center",
            }}
          >
            <SectionLabel rules>The Process</SectionLabel>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-h1)",
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              How It Works
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 32,
            }}
            className="bb-howitworks-grid"
          >
            {[
              {
                icon: ShieldCheck,
                step: "01",
                label: "Choose Your Piece",
                desc: "Browse our collection of cutting boards, glassware, coasters, and more.",
              },
              {
                icon: Pencil,
                step: "02",
                label: "Personalize It",
                desc: "Enter names, dates, or special text. Preview your engraving live on screen.",
              },
              {
                icon: Heart,
                step: "03",
                label: "We Craft It",
                desc: "Every item is laser-engraved by hand in 5–7 business days.",
              },
              {
                icon: Gift,
                step: "04",
                label: "Arrives Gift-Ready",
                desc: "Wrapped in our signature cream bow and ready to delight.",
              },
            ].map(({ icon: Icon, step, label, desc }) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "var(--surface-warm)",
                    border: "var(--border-brass)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={26} color="var(--bb-walnut)" strokeWidth={1.5} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "var(--ls-label)",
                    textTransform: "uppercase",
                    color: "var(--bb-brass)",
                  }}
                >
                  Step {step}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--fs-h3)",
                    fontWeight: 600,
                    color: "var(--text-heading)",
                  }}
                >
                  {label}
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "var(--text-muted)",
                    lineHeight: "var(--lh-normal)",
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOM CTA ────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface-warm)",
          paddingBlock: "var(--section-y-desktop)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 48,
            alignItems: "center",
          }}
          className="bb-custom-cta-grid"
        >
          <Seal variant="scalloped" size={140} color="rgba(114,84,61,0.2)" />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel align="left">Something Unique</SectionLabel>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-h2)",
                fontWeight: 600,
                color: "var(--text-heading)",
                maxWidth: 480,
              }}
            >
              Don&apos;t see what you&apos;re looking for? We do custom orders.
            </h2>
            <p
              style={{
                fontSize: 15.5,
                color: "var(--text-muted)",
                lineHeight: "var(--lh-normal)",
                maxWidth: 520,
              }}
            >
              Tell us your vision — shape, size, wood species, text, and occasion. We&apos;ll
              bring it to life with care.
            </p>
            <Link
              href="/custom-orders"
              style={{
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                height: 50,
                padding: "0 30px",
                background: "var(--btn-dark-bg)",
                color: "var(--text-on-dark)",
                borderRadius: "var(--radius-pill)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 13.5,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "var(--shadow-sm)",
                marginTop: 8,
              }}
            >
              Start a Custom Request
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="bb-section">
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBottom: 56,
              textAlign: "center",
            }}
          >
            <SectionLabel rules>Reviews</SectionLabel>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-h1)",
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              What Our Customers Say
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--grid-gap)",
            }}
            className="bb-reviews-grid"
          >
            {[
              {
                quote:
                  "The cutting board was absolutely stunning. Jana's attention to detail is unmatched — this was worth every penny.",
                author: "Sarah M.",
                occasion: "Wedding Gift",
              },
              {
                quote:
                  "I ordered realtor closing gifts for my whole team. Every client was blown away. Will order again and again.",
                author: "Mark T.",
                occasion: "Realtor Gifting",
              },
              {
                quote:
                  "The whiskey set for my dad's birthday came perfectly wrapped and looked even better in person. He cried.",
                author: "Emily R.",
                occasion: "Birthday Gift",
              },
            ].map(({ quote, author, occasion }) => (
              <figure
                key={author}
                style={{
                  background: "var(--surface-card)",
                  border: "var(--border-1)",
                  borderRadius: "var(--radius-lg)",
                  padding: "32px",
                  boxShadow: "var(--shadow-xs)",
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={15}
                      fill="var(--bb-brass)"
                      color="var(--bb-brass)"
                    />
                  ))}
                </div>
                <blockquote
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-serif)",
                    fontSize: 16,
                    fontStyle: "italic",
                    lineHeight: "var(--lh-normal)",
                    color: "var(--text-body)",
                  }}
                >
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <figcaption
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {author}
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: 12,
                      color: "var(--text-subtle)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {occasion}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .bb-hero-grid { grid-template-columns: 1fr !important; }
          .bb-trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bb-occasions-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .bb-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bb-howitworks-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bb-reviews-grid { grid-template-columns: 1fr !important; }
          .bb-custom-cta-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .bb-trust-grid { grid-template-columns: 1fr !important; }
          .bb-occasions-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bb-products-grid { grid-template-columns: 1fr !important; }
          .bb-howitworks-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
