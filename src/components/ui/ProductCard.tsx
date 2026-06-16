"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { Badge } from "./Badge";
import { Rating } from "./Rating";
import { Button } from "./Button";

interface ProductCardProps {
  id?: string;
  slug?: string;
  category?: string;
  name?: string;
  price?: string | number;
  badge?: string;
  badgeVariant?: "solid" | "brass" | "walnut" | "soft" | "outline" | "clay";
  rating?: number;
  reviews?: number;
  tone?: "walnut" | "maple" | "cherry" | "linen" | "marble" | "dark" | "cream";
  caption?: string;
  src?: string;
  cta?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ProductCard({
  id,
  slug,
  category = "Cutting Boards",
  name = "Personalized Family Cutting Board",
  price = "Starting at $48",
  badge,
  badgeVariant = "solid",
  rating,
  reviews,
  tone = "walnut",
  caption,
  src,
  cta = "Personalize",
  className = "",
  style = {},
}: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const href = `/products/${slug ?? id ?? ""}`;

  const priceDisplay =
    typeof price === "number" ? `Starting at $${price}` : price;

  return (
    <article
      className={`bb-product-card ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--surface-card)",
        border: "1px solid var(--line-soft)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-3px)" : "none",
        transition:
          "box-shadow var(--dur-base) var(--ease-soft), transform var(--dur-base) var(--ease-soft)",
        ...style,
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", padding: 12 }}>
        <ProductImage
          src={src}
          tone={tone}
          caption={caption}
          radius="var(--radius-md)"
          badge={
            badge ? (
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            ) : null
          }
        />

        {/* Quick View overlay */}
        <Link
          href={href}
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            height: 40,
            border: "none",
            cursor: "pointer",
            background: "rgba(56,47,38,0.86)",
            color: "var(--bb-ivory)",
            borderRadius: "var(--radius-sm)",
            backdropFilter: "blur(2px)",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: hover ? 1 : 0,
            transform: hover ? "translateY(0)" : "translateY(8px)",
            transition: "opacity var(--dur-base), transform var(--dur-base)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Quick View
        </Link>
      </div>

      {/* Info */}
      <div
        style={{
          padding: "6px 18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 7,
          flex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-subtle)",
          }}
        >
          {category}
        </span>

        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.25,
            color: "var(--text-heading)",
          }}
        >
          {name}
        </h3>

        {rating != null && <Rating value={rating} count={reviews} />}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 10,
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 16.5,
              color: "var(--text-heading)",
              whiteSpace: "nowrap",
            }}
          >
            {priceDisplay}
          </span>

          <Button as={Link} href={href} size="sm" variant="primary" style={{ flexShrink: 0 }}>
            {cta}
          </Button>
        </div>
      </div>
    </article>
  );
}
