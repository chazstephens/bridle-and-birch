import React from "react";

interface SectionLabelProps {
  children: React.ReactNode;
  rules?: boolean;
  align?: "center" | "left";
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SectionLabel({
  children,
  rules = false,
  align = "center",
  color = "var(--accent-detail)",
  className = "",
  style = {},
}: SectionLabelProps) {
  const rule = (
    <span
      style={{ width: 28, height: 1, background: "var(--line-fine)", opacity: 0.8 }}
    />
  );

  return (
    <span
      className={`bb-section-label ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        justifyContent: align === "center" ? "center" : "flex-start",
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: "var(--fs-label)",
        letterSpacing: "var(--ls-label)",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {rules && rule}
      {children}
      {rules && rule}
    </span>
  );
}
