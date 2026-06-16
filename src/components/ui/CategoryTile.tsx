"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductImage } from "./ProductImage";

interface CategoryTileProps {
  title?: string;
  blurb?: string;
  href?: string;
  tone?: "walnut" | "maple" | "cherry" | "linen" | "marble" | "dark" | "cream";
  src?: string;
  ratio?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CategoryTile({
  title = "Wedding & Bridal",
  blurb = "Personalized keepsakes for couples and celebrations.",
  href = "#",
  tone = "linen",
  src,
  ratio = "4 / 5",
  className = "",
  style = {},
}: CategoryTileProps) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={href}
      className={`bb-category-tile ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        textDecoration: "none",
        ...style,
      }}
    >
      {/* Image */}
      <div
        style={{
          overflow: "hidden",
          borderRadius: "var(--radius-lg)",
          boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
          transition: "box-shadow var(--dur-base)",
        }}
      >
        <div
          style={{
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "transform var(--dur-slow) var(--ease-soft)",
          }}
        >
          <ProductImage
            src={src}
            tone={tone}
            ratio={ratio}
            radius="0"
            seal="circle"
          />
        </div>
      </div>

      {/* Caption */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-body)",
            fontSize: 14.5,
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          {blurb}
        </p>

        <span
          style={{
            marginTop: 4,
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent)",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          Shop now
          <span
            aria-hidden
            style={{
              transition: "transform var(--dur-fast)",
              transform: hover ? "translateX(4px)" : "none",
            }}
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
