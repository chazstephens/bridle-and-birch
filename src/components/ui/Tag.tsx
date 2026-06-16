"use client";

import React from "react";

interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Tag({
  children,
  active = false,
  className = "",
  style = {},
  ...rest
}: TagProps) {
  return (
    <button
      className={`bb-tag ${active ? "is-active" : ""} ${className}`}
      aria-pressed={active}
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: 13.5,
        letterSpacing: "0.04em",
        color: active ? "var(--bb-ivory)" : "var(--text-muted)",
        background: active ? "var(--accent)" : "var(--surface-card)",
        border: `1px solid ${active ? "var(--accent)" : "var(--line-soft)"}`,
        borderRadius: "var(--radius-pill)",
        padding: "9px 18px",
        cursor: "pointer",
        transition:
          "background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
