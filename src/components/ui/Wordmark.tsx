import React from "react";

interface WordmarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  descriptor?: boolean;
  tagline?: boolean;
  color?: string;
  align?: "center" | "left";
  className?: string;
  style?: React.CSSProperties;
}

export function Wordmark({
  size = "md",
  descriptor = true,
  tagline = false,
  color,
  align = "center",
  className = "",
  style = {},
}: WordmarkProps) {
  const scaleMap = { sm: 0.7, md: 1, lg: 1.5, xl: 2.1 };
  const scale = scaleMap[size] ?? 1;

  const root: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: align === "center" ? "center" : "flex-start",
    gap: `${6 * scale}px`,
    color: color ?? "var(--bb-espresso)",
    lineHeight: 1,
    ...style,
  };

  const nameStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 500,
    fontSize: `${30 * scale}px`,
    letterSpacing: "var(--ls-wordmark)",
    textTransform: "uppercase",
    color: "inherit",
    whiteSpace: "nowrap",
  };

  const descStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: `${9 * scale}px`,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "inherit",
    opacity: 0.78,
    display: "flex",
    alignItems: "center",
    gap: `${8 * scale}px`,
  };

  const ruleStyle: React.CSSProperties = {
    display: "inline-block",
    width: `${22 * scale}px`,
    height: "1px",
    background: "var(--line-fine)",
    opacity: 0.8,
  };

  const tagStyle: React.CSSProperties = {
    fontFamily: "var(--font-script)",
    fontSize: `${18 * scale}px`,
    color: "var(--accent-warm)",
    marginTop: `${2 * scale}px`,
  };

  return (
    <span className={`bb-wordmark ${className}`} style={root}>
      <span style={nameStyle}>Bridle&nbsp;&amp;&nbsp;Birch</span>

      {descriptor && (
        <span style={descStyle}>
          {align === "center" && <span style={ruleStyle} />}
          Southern&nbsp;Keepsake&nbsp;Goods
          {align === "center" && <span style={ruleStyle} />}
        </span>
      )}

      {tagline && (
        <span style={tagStyle}>Made to order. Meant to be kept.</span>
      )}
    </span>
  );
}
