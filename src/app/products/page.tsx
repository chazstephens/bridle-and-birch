export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

const CATEGORY_FILTERS = [
  { label: "All Products", value: "" },
  { label: "Cutting Boards", value: "cutting-boards" },
  { label: "Bar & Whiskey Sets", value: "bar-sets" },
  { label: "Coasters & Trivets", value: "coasters" },
  { label: "Baby & Kids", value: "baby" },
  { label: "Signs & Plaques", value: "signs" },
];

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; occasion?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, occasion } = await searchParams;

  // Fetch from DB; silently fall back to placeholder catalog if unavailable.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dbProducts: any[] = await prisma.product
    .findMany({
      where: {
        active: true,
        ...(category ? { category: { slug: category } } : {}),
      },
      include: { category: true, reviews: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  // Fall back to placeholder catalog when DB has no records
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: any[] = dbProducts.length > 0
    ? dbProducts
    : PLACEHOLDER_PRODUCTS.filter(
        (p) => !category || p.category.slug === category
      );

  const pageTitle =
    category
      ? CATEGORY_FILTERS.find((f) => f.value === category)?.label ?? "Products"
      : occasion
      ? "Shop by Occasion"
      : "Our Collection";

  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface-warm)",
          borderBottom: "var(--border-1)",
          padding: "56px 0 44px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
          }}
        >
          <SectionLabel rules>Bridle & Birch</SectionLabel>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-h1)",
              fontWeight: 600,
              color: "var(--text-heading)",
              marginTop: 12,
              marginBottom: 14,
            }}
          >
            {pageTitle}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "var(--text-muted)",
              lineHeight: "var(--lh-normal)",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Every piece is laser-engraved to order and arrives wrapped in our
            signature cream bow. Built to be kept for generations.
          </p>
        </div>
      </section>

      {/* ── Category filters ────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "var(--border-1)",
          background: "var(--surface-page)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            overflowX: "auto",
            height: 56,
          }}
        >
          {CATEGORY_FILTERS.map((f) => {
            const isActive = f.value === (category ?? "");
            return (
              <Link
                key={f.value}
                href={f.value ? `/products?category=${f.value}` : "/products"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 34,
                  padding: "0 16px",
                  borderRadius: "var(--radius-pill)",
                  border: isActive ? "1.5px solid var(--bb-walnut)" : "var(--border-1)",
                  background: isActive ? "var(--bb-walnut)" : "transparent",
                  color: isActive ? "var(--bb-ivory)" : "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 12.5,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "background var(--dur-fast), color var(--dur-fast)",
                }}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Product grid ────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "56px var(--content-pad) 80px",
        }}
      >
        {products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                color: "var(--text-muted)",
                fontStyle: "italic",
              }}
            >
              No products in this category yet.
            </p>
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                marginTop: 20,
                height: 44,
                padding: "0 24px",
                background: "var(--btn-primary-bg)",
                color: "var(--btn-primary-fg)",
                borderRadius: "var(--radius-pill)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                alignItems: "center",
              }}
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--grid-gap)",
            }}
            className="bb-products-grid"
          >
            {products.map((p, i) => {
              const avgRating =
                p.reviews?.length > 0
                  ? p.reviews.reduce(
                      (a: number, r: { rating: number }) => a + r.rating,
                      0
                    ) / p.reviews.length
                  : undefined;
              return (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  category={p.category?.name ?? ""}
                  price={`Starting at $${Math.floor(p.price)}`}
                  rating={avgRating}
                  reviews={p.reviews?.length || undefined}
                  tone={(["walnut", "maple", "linen", "cherry"] as const)[i % 4]}
                  badge={p.badges ?? undefined}
                  badgeVariant={p.badges ? "brass" : undefined}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* ── Custom orders CTA ───────────────────────────────────── */}
      <section
        style={{
          background: "var(--bb-espresso)",
          padding: "56px 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-h2)",
              fontWeight: 600,
              color: "var(--bb-ivory)",
              marginBottom: 12,
            }}
          >
            Don&apos;t see what you&apos;re looking for?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "var(--bb-taupe)",
              lineHeight: "var(--lh-normal)",
              marginBottom: 28,
              maxWidth: 460,
              margin: "0 auto 28px",
            }}
          >
            We take custom orders for any shape, size, wood species, or text.
            Tell us your vision and we&apos;ll bring it to life.
          </p>
          <Link
            href="/custom-orders"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 50,
              padding: "0 30px",
              background: "var(--bb-brass)",
              color: "var(--bb-espresso)",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 13.5,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Start a Custom Request
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .bb-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .bb-products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
