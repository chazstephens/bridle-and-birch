import React from "react";
import { Seal } from "./Seal";

type Tone = "walnut" | "maple" | "cherry" | "linen" | "marble" | "dark" | "cream";

interface ProductImageProps {
  src?: string;
  alt?: string;
  tone?: Tone;
  caption?: string;
  ratio?: string;
  radius?: string;
  watermark?: boolean;
  seal?: "oval" | "circle" | "scalloped" | "bb";
  badge?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TONES: Record<Tone, { from: string; to: string; ink: string }> = {
  walnut: { from: "#8A6647", to: "#5E422D", ink: "rgba(255,247,236,0.16)" },
  maple:  { from: "#D8B88A", to: "#B68F5E", ink: "rgba(56,47,38,0.14)" },
  cherry: { from: "#A66247", to: "#7C4330", ink: "rgba(255,247,236,0.16)" },
  linen:  { from: "#F1E7DA", to: "#DCC8BC", ink: "rgba(56,47,38,0.12)" },
  marble: { from: "#F4F0EA", to: "#E4DACE", ink: "rgba(56,47,38,0.10)" },
  dark:   { from: "#4A3B30", to: "#241D17", ink: "rgba(176,138,74,0.22)" },
  cream:  { from: "#FFF9F1", to: "#EFE2D4", ink: "rgba(56,47,38,0.10)" },
};

const LIGHT_TONES: Tone[] = ["maple", "linen", "marble", "cream"];

export function ProductImage({
  src,
  alt = "",
  tone = "walnut",
  caption,
  ratio = "1 / 1",
  radius = "var(--radius-md)",
  watermark = true,
  seal = "oval",
  badge = null,
  className = "",
  style = {},
}: ProductImageProps) {
  const t = TONES[tone];
  const isLight = LIGHT_TONES.includes(tone);

  return (
    <div
      className={`bb-product-image ${className}`}
      style={{
        position: "relative",
        aspectRatio: ratio,
        width: "100%",
        borderRadius: radius,
        overflow: "hidden",
        background: src
          ? "var(--surface-inset)"
          : `linear-gradient(150deg, ${t.from}, ${t.to})`,
        border: "1px solid var(--line-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <>
          {watermark && (
            <div style={{ color: t.ink, lineHeight: 0 }}>
              <Seal
                variant={seal}
                size={118}
                color={t.ink}
                ringText={seal !== "bb"}
              />
            </div>
          )}
          {caption && (
            <span
              style={{
                position: "absolute",
                bottom: 16,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: "var(--font-script)",
                fontSize: 26,
                color: isLight
                  ? "rgba(56,47,38,0.55)"
                  : "rgba(255,247,236,0.78)",
              }}
            >
              {caption}
            </span>
          )}
        </>
      )}
      {badge && (
        <div style={{ position: "absolute", top: 14, left: 14 }}>{badge}</div>
      )}
    </div>
  );
}
