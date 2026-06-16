"use client";

import React, { useRef, useState, useEffect } from "react";
import { useCart } from "./cart-context";
import { ShoppingBag, Check, Eye } from "lucide-react";

interface CustomField {
  id: string;
  label: string;
  type: string;
  placeholder: string | null;
  defaultValue: string | null;
  maxLength: number | null;
  required: boolean;
  renderX: number;
  renderY: number;
  renderWidth: number;
  renderHeight: number;
  renderAlign: string;
  renderColor: string;
  fontStyle: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  basePrice?: number;
  imageUrl: string;
  customFields: CustomField[];
  productType: string;
  previewType: string;
}

interface EngravingPreviewProps {
  product: Product;
}

const FONT_OPTIONS = [
  { value: "Playfair Display", label: "Playfair Display — Elegant Serif" },
  { value: "Great Vibes", label: "Great Vibes — Southern Script" },
  { value: "Lora", label: "Lora — Classic Serif" },
  { value: "Nunito Sans", label: "Nunito Sans — Modern Sans" },
];

export default function EngravingPreview({ product }: EngravingPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { addToCart } = useCart();
  const [successMsg, setSuccessMsg] = useState(false);

  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.customFields.forEach((cf) => {
      initial[cf.id] = cf.defaultValue ?? "";
    });
    return initial;
  });

  const [fonts, setFonts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.customFields.forEach((cf) => {
      initial[cf.id] = cf.fontStyle;
    });
    return initial;
  });

  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = product.imageUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => setBgImage(img);
  }, [product.imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 600, 600);
    ctx.drawImage(bgImage, 0, 0, 600, 600);
  }, [bgImage]);

  const getHeightmapUrl = (url: string) => {
    const filename = url.split("/").pop() ?? "";
    const baseName = filename.substring(0, filename.lastIndexOf("."));
    return `/images/heightmaps/${baseName}_heightmap.png`;
  };

  const handleInputChange = (fieldId: string, val: string, maxLen: number | null) => {
    const clean = maxLen && val.length > maxLen ? val.slice(0, maxLen) : val;
    setInputs((prev) => ({ ...prev, [fieldId]: clean }));
  };

  const handleFontChange = (fieldId: string, font: string) => {
    setFonts((prev) => ({ ...prev, [fieldId]: font }));
  };

  const handleAddToBag = () => {
    const customDisplay: Record<string, string> = {};
    const customTextObj: Record<string, string> = {};
    let hasMissingRequired = false;

    product.customFields.forEach((cf) => {
      const val = inputs[cf.id] ?? "";
      if (cf.required && !val) hasMissingRequired = true;
      customDisplay[cf.label] = val || `[${cf.label}]`;
      customTextObj[cf.label] = val;
    });

    if (hasMissingRequired) {
      alert("Please fill in all required fields.");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      customizationText: JSON.stringify(customTextObj),
      customizationDisplay: customDisplay,
    });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3500);
  };

  const isGlass = product.productType === "glass";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40,
        alignItems: "start",
      }}
      className="bb-engraving-grid"
    >
      {/* ── Preview panel ─────────────────────────────────────────── */}
      <div style={{ position: "sticky", top: "calc(var(--header-h) + 32px)" }}>
        {/* Live badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 14,
            background: "var(--bb-espresso)",
            color: "var(--bb-ivory)",
            padding: "6px 14px",
            borderRadius: "var(--radius-pill)",
            fontFamily: "var(--font-body)",
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <Eye size={12} />
          Live Engraving Preview
        </div>

        {/* Canvas wrapper */}
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            border: "var(--border-1)",
            boxShadow: "var(--shadow-lg)",
            background: "linear-gradient(150deg, #8A6647, #5E422D)",
          }}
        >
          <canvas ref={canvasRef} width={600} height={600} style={{ display: "block", width: "100%" }} />

          {/* SVG engraving overlay */}
          <svg
            viewBox="0 0 600 600"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <defs>
              <filter
                id="engrave-filter"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
              >
                <feImage
                  href={getHeightmapUrl(product.imageUrl)}
                  result="heightmap"
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="none"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="heightmap"
                  scale={isGlass ? 2.0 : product.productType === "leather" ? 4.0 : 6.0}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="displaced"
                />
                {isGlass ? (
                  <>
                    <feGaussianBlur stdDeviation="0.4" in="SourceGraphic" result="blur" />
                    <feColorMatrix
                      type="matrix"
                      values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  0 0 0 0.85 0"
                      in="blur"
                      result="glow"
                    />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="displaced" />
                    </feMerge>
                  </>
                ) : (
                  <>
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0"
                      in="SourceGraphic"
                      result="shadowMask"
                    />
                    <feOffset dx="0.5" dy="1.0" in="shadowMask" result="shadowOffset" />
                    <feMerge>
                      <feMergeNode in="shadowOffset" />
                      <feMergeNode in="displaced" />
                    </feMerge>
                  </>
                )}
              </filter>
            </defs>

            {product.customFields.map((cf) => {
              const text = inputs[cf.id] || cf.placeholder || "";
              if (!text) return null;
              const x = (cf.renderX / 100) * 600;
              const y = (cf.renderY / 100) * 600;
              const fontSize = (cf.renderHeight / 100) * 600;
              const font = fonts[cf.id] || cf.fontStyle;
              const align = cf.renderAlign || "center";
              const textAnchor =
                align === "left" ? "start" : align === "right" ? "end" : "middle";
              const fill = isGlass ? "rgba(255,255,255,0.85)" : cf.renderColor;

              return (
                <text
                  key={cf.id}
                  x={x}
                  y={y}
                  fontSize={fontSize}
                  fontFamily={`'${font}', serif`}
                  fontWeight="600"
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  fill={fill}
                  style={{
                    filter: "url(#engrave-filter)",
                    mixBlendMode: isGlass ? "overlay" : "multiply",
                    opacity: isGlass ? 0.9 : 0.95,
                  }}
                >
                  {text}
                </text>
              );
            })}
          </svg>
        </div>

        <p
          style={{
            marginTop: 12,
            fontSize: 12,
            color: "var(--text-subtle)",
            textAlign: "center",
          }}
        >
          Engraving depth and color adapt to your chosen wood or glass finish.
        </p>
      </div>

      {/* ── Personalization panel ─────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-h2)",
              fontWeight: 600,
              color: "var(--text-heading)",
              marginBottom: 8,
            }}
          >
            Personalize Your Piece
          </h3>
          <p style={{ fontSize: 14.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Fill in the fields below. Your engraving updates live in the preview.
          </p>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {product.customFields.map((cf) => {
            const val = inputs[cf.id] ?? "";
            const currentFont = fonts[cf.id] || cf.fontStyle;
            const maxLen = cf.maxLength;

            return (
              <div
                key={cf.id}
                style={{
                  background: "var(--surface-card)",
                  border: "var(--border-1)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label
                    htmlFor={cf.id}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    {cf.label}
                    {cf.required && (
                      <span style={{ color: "var(--status-error)", marginLeft: 4 }}>
                        *
                      </span>
                    )}
                  </label>
                  {maxLen && (
                    <span
                      style={{ fontSize: 12, color: "var(--text-subtle)" }}
                    >
                      {val.length} / {maxLen}
                    </span>
                  )}
                </div>

                <input
                  id={cf.id}
                  type={cf.type === "number" ? "number" : "text"}
                  value={val}
                  placeholder={cf.placeholder ?? `Enter ${cf.label}…`}
                  required={cf.required}
                  onChange={(e) =>
                    handleInputChange(cf.id, e.target.value, maxLen)
                  }
                  style={{
                    width: "100%",
                    height: 46,
                    padding: "0 14px",
                    background: "var(--surface-page)",
                    border: "var(--border-1)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    color: "var(--text-body)",
                    outline: "none",
                    transition: "border-color var(--dur-fast)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--bb-brass)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--line-soft)")
                  }
                />

                {/* Font picker */}
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-subtle)",
                      marginBottom: 8,
                    }}
                  >
                    Font Style
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {FONT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleFontChange(cf.id, opt.value)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "var(--radius-pill)",
                          border:
                            currentFont === opt.value
                              ? "1.5px solid var(--bb-brass)"
                              : "1px solid var(--line-soft)",
                          background:
                            currentFont === opt.value
                              ? "var(--surface-warm)"
                              : "transparent",
                          fontFamily: opt.value + ", serif",
                          fontSize: 13,
                          color:
                            currentFont === opt.value
                              ? "var(--accent-strong)"
                              : "var(--text-muted)",
                          cursor: "pointer",
                          transition:
                            "background var(--dur-fast), border-color var(--dur-fast)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {opt.label.split(" — ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add to bag */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {successMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 18px",
                background: "rgba(110, 123, 87, 0.12)",
                border: "1px solid var(--status-success)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--status-success)",
              }}
            >
              <Check size={16} />
              Added to your bag!
            </div>
          )}

          <button
            onClick={handleAddToBag}
            style={{
              width: "100%",
              height: 56,
              background: "var(--btn-dark-bg)",
              color: "var(--text-on-dark)",
              border: "none",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "var(--shadow-sm)",
              transition: "background var(--dur-fast)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--btn-dark-bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--btn-dark-bg)")
            }
          >
            <ShoppingBag size={18} />
            Add to Bag
          </button>

          <p style={{ fontSize: 12.5, color: "var(--text-subtle)", textAlign: "center" }}>
            Each piece is hand-engraved. Allow 5–7 business days before
            shipment.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .bb-engraving-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
