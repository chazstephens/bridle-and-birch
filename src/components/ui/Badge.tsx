import React from "react";

type BadgeVariant = "solid" | "brass" | "walnut" | "soft" | "outline" | "clay";
type BadgeShape = "pill" | "tag";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  size?: BadgeSize;
  className?: string;
  style?: React.CSSProperties;
}

const palettes: Record<BadgeVariant, { bg: string; fg: string; border: string }> = {
  solid:   { bg: "var(--bb-espresso)", fg: "var(--bb-ivory)",  border: "transparent" },
  brass:   { bg: "var(--bb-brass)",    fg: "var(--bb-espresso)", border: "transparent" },
  walnut:  { bg: "var(--bb-walnut)",   fg: "var(--bb-ivory)",  border: "transparent" },
  soft:    { bg: "var(--bb-linen-100)", fg: "var(--bb-walnut)", border: "transparent" },
  outline: { bg: "transparent",        fg: "var(--bb-walnut)", border: "var(--line-fine)" },
  clay:    { bg: "var(--surface-warm)", fg: "var(--accent-warm)", border: "transparent" },
};

const dims: Record<BadgeSize, { fs: number; py: number; px: number }> = {
  sm: { fs: 10, py: 4, px: 9 },
  md: { fs: 11, py: 6, px: 12 },
};

export function Badge({
  children,
  variant = "solid",
  shape = "pill",
  size = "md",
  className = "",
  style = {},
}: BadgeProps) {
  const p = palettes[variant];
  const d = dims[size];

  return (
    <span
      className={`bb-badge ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: d.fs,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: p.fg,
        background: p.bg,
        border:
          p.border === "transparent"
            ? "1px solid transparent"
            : `1px solid ${p.border}`,
        padding: `${d.py}px ${d.px}px`,
        borderRadius: shape === "tag" ? "4px" : "var(--radius-pill)",
        clipPath:
          shape === "tag"
            ? "polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)"
            : "none",
        paddingLeft: shape === "tag" ? d.px + 8 : d.px,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
