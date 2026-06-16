import React from "react";

interface DividerProps {
  ornament?: "diamond" | "dot" | "amp" | "none";
  width?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Divider({
  ornament = "diamond",
  width = "100%",
  color = "var(--line-fine)",
  className = "",
  style = {},
}: DividerProps) {
  const lineStyle: React.CSSProperties = {
    flex: 1,
    height: 1,
    background: color,
    opacity: 0.7,
  };

  function Ornament() {
    if (ornament === "none") return null;
    if (ornament === "dot")
      return (
        <span
          style={{ width: 5, height: 5, borderRadius: "50%", background: color }}
        />
      );
    if (ornament === "amp")
      return (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            color: "var(--text-muted)",
            lineHeight: 1,
          }}
        >
          &amp;
        </span>
      );
    // diamond (default)
    return (
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden>
        <path d="M5 0L10 5L5 10L0 5Z" fill={color} />
      </svg>
    );
  }

  return (
    <div
      className={`bb-divider ${className}`}
      role="separator"
      style={{ display: "flex", alignItems: "center", gap: 14, width, ...style }}
    >
      <span style={lineStyle} />
      <Ornament />
      <span style={lineStyle} />
    </div>
  );
}
