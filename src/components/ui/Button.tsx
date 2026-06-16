"use client";

import React, { useState } from "react";

type ButtonVariant = "primary" | "dark" | "secondary" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "pill" | "rounded";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  block?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: "button" | "submit" | "reset";
}

const SIZES: Record<ButtonSize, { h: number; px: number; fs: number }> = {
  sm: { h: 38, px: 18, fs: 13.5 },
  md: { h: 48, px: 26, fs: 15 },
  lg: { h: 56, px: 34, fs: 16.5 },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  shape = "pill",
  block = false,
  disabled = false,
  iconLeft,
  iconRight,
  as,
  href,
  className = "",
  style = {},
  onClick,
  type = "button",
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const s = SIZES[size];
  const isLink = variant === "link";

  const paletteMap = {
    primary: {
      bg: hover ? "var(--btn-primary-bg-hover)" : "var(--btn-primary-bg)",
      fg: "var(--btn-primary-fg)",
      border: "transparent",
    },
    dark: {
      bg: hover ? "var(--btn-dark-bg-hover)" : "var(--btn-dark-bg)",
      fg: "var(--text-on-dark)",
      border: "transparent",
    },
    secondary: {
      bg: hover ? "var(--btn-secondary-bg-hover)" : "transparent",
      fg: "var(--btn-secondary-fg)",
      border: "var(--btn-secondary-border)",
    },
    ghost: {
      bg: hover ? "var(--bb-ivory-200)" : "transparent",
      fg: "var(--accent)",
      border: "transparent",
    },
    link: {
      bg: "transparent",
      fg: hover ? "var(--accent-strong)" : "var(--accent)",
      border: "transparent",
    },
  };

  const palette = paletteMap[variant] ?? paletteMap.primary;

  const base: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6em",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition:
      "background var(--dur-fast) var(--ease-soft), transform var(--dur-fast) var(--ease-soft), color var(--dur-fast)",
    width: block ? "100%" : "auto",
    opacity: disabled ? 0.45 : 1,
    textDecoration: "none",
    userSelect: "none",
    whiteSpace: "nowrap",
  };

  if (isLink) {
    Object.assign(base, {
      fontSize: "var(--fs-label)",
      color: palette.fg,
      background: "none",
      padding: 0,
      height: "auto",
      borderBottom: `1px solid ${hover ? "var(--accent-strong)" : "var(--line-fine)"}`,
      paddingBottom: "3px",
      borderRadius: 0,
    });
  } else {
    Object.assign(base, {
      height: s.h,
      padding: `0 ${s.px}px`,
      fontSize: s.fs,
      borderRadius:
        shape === "pill" ? "var(--radius-pill)" : "var(--radius-sm)",
      background: palette.bg,
      color: palette.fg,
      outline:
        palette.border === "transparent"
          ? "none"
          : `1.5px solid ${palette.border}`,
      outlineOffset: "-1.5px",
      transform:
        !disabled && press ? "translateY(1px)" : "translateY(0)",
      boxShadow:
        (variant === "primary" || variant === "dark") && hover && !disabled
          ? "var(--shadow-md)"
          : "var(--shadow-xs)",
    });
  }

  const Tag = as ?? (href ? "a" : "button");

  const handlers = disabled
    ? {}
    : {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => {
          setHover(false);
          setPress(false);
        },
        onMouseDown: () => setPress(true),
        onMouseUp: () => setPress(false),
        onClick,
      };

  return (
    <Tag
      className={`bb-btn bb-btn--${variant} ${className}`}
      href={href}
      style={{ ...base, ...style }}
      disabled={Tag === "button" ? disabled : undefined}
      type={Tag === "button" ? type : undefined}
      {...handlers}
      {...rest}
    >
      {iconLeft && (
        <span style={{ display: "inline-flex", fontSize: "1.1em" }}>
          {iconLeft}
        </span>
      )}
      {children}
      {iconRight && (
        <span style={{ display: "inline-flex", fontSize: "1.1em" }}>
          {iconRight}
        </span>
      )}
      {isLink && !iconRight && (
        <span
          aria-hidden
          style={{
            transition: "transform var(--dur-fast)",
            transform: hover ? "translateX(3px)" : "none",
          }}
        >
          →
        </span>
      )}
    </Tag>
  );
}
