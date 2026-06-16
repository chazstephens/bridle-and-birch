"use client";

import React, { useRef, useState, useEffect } from "react";
import { useCart } from "./cart-context";
import { Compass, ShoppingBag, Check } from "lucide-react";

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
  imageUrl: string;
  customFields: CustomField[];
  productType: string;
  previewType: string;
}

interface EngravingPreviewProps {
  product: Product;
}

export default function EngravingPreview({ product }: EngravingPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { addToCart } = useCart();
  const [successMsg, setSuccessMsg] = useState(false);

  // Initialize custom inputs state
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.customFields.forEach((cf) => {
      initial[cf.id] = cf.defaultValue || "";
    });
    return initial;
  });

  // Track user-selected font style override per custom field
  const [fonts, setFonts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.customFields.forEach((cf) => {
      initial[cf.id] = cf.fontStyle;
    });
    return initial;
  });

  // Keep a reference to the loaded background image
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  // Load the background image on mount/image change
  useEffect(() => {
    const img = new Image();
    img.src = product.imageUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setBgImage(img);
    };
  }, [product.imageUrl]);

  // Helper to map mockup imageUrl to heightmap path
  const getHeightmapUrl = (url: string) => {
    const filename = url.split("/").pop() || "";
    const baseName = filename.substring(0, filename.lastIndexOf("."));
    return `/images/heightmaps/${baseName}_heightmap.png`;
  };

  // Redraw the canvas background image when loaded
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 600, 600);

    // Draw background image
    ctx.drawImage(bgImage, 0, 0, 600, 600);
  }, [bgImage]);

  const handleInputChange = (fieldId: string, val: string, maxLen: number | null) => {
    let clean = val;
    if (maxLen && val.length > maxLen) {
      clean = val.slice(0, maxLen);
    }
    setInputs((prev) => ({ ...prev, [fieldId]: clean }));
  };

  const handleFontChange = (fieldId: string, font: string) => {
    setFonts((prev) => ({ ...prev, [fieldId]: font }));
  };

  const handleAddToBag = () => {
    // Generate human-readable customization display object and json text
    const customDisplay: Record<string, string> = {};
    const customTextObj: Record<string, string> = {};

    let hasMissingRequired = false;
    product.customFields.forEach((cf) => {
      const val = inputs[cf.id] || "";
      if (cf.required && !val) {
        hasMissingRequired = true;
      }
      customDisplay[cf.label] = val || `[${cf.label}]`;
      customTextObj[cf.label] = val;
    });

    if (hasMissingRequired) {
      alert("Please fill in all required customization fields.");
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
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="engraving-container">
      {/* Visual Live Canvas Box */}
      <div className="preview-box">
        <span 
          style={{ 
            position: "absolute", 
            top: "16px", 
            left: "16px", 
            zIndex: 10,
            backgroundColor: "rgba(27, 59, 43, 0.85)", 
            color: "var(--color-background)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            padding: "4px 10px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 600
          }}
        >
          <Compass size={12} className="animate-spin" /> Live Engraving Preview
        </span>
        
        <div className="canvas-wrapper">
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={600} 
            className="canvas-element" 
          />
          {/* Overlay SVG for dynamic engraving with displacement filters */}
          <svg 
            className="engraving-svg-overlay animate-fade-in" 
            viewBox="0 0 600 600" 
            style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "100%", 
              pointerEvents: "none" 
            }}
          >
            <defs>
              <filter id="engrave-displacement-filter" x="0%" y="0%" width="100%" height="100%">
                {/* 1. Load the grayscale heightmap image */}
                <feImage 
                  href={getHeightmapUrl(product.imageUrl)} 
                  result="heightmap" 
                  x="0" 
                  y="0" 
                  width="100%" 
                  height="100%" 
                  preserveAspectRatio="none"
                />
                
                {/* 2. Displace the text along the wood grain/texture heightmap pixels */}
                <feDisplacementMap 
                  in="SourceGraphic" 
                  in2="heightmap" 
                  scale={product.productType === "glass" ? 2.0 : product.productType === "leather" ? 4.0 : 6.0} 
                  xChannelSelector="R" 
                  yChannelSelector="G" 
                  result="displaced" 
                />

                {/* 3. Add soft depth emboss shadow or glow */}
                {product.productType === "glass" ? (
                  <>
                    <feGaussianBlur stdDeviation="0.4" in="SourceGraphic" result="blur" />
                    <feColorMatrix type="matrix" values="1 0 0 0 1   0 1 0 0 1   0 0 1 0 1   0 0 0 0.85 0" in="blur" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="displaced" />
                    </feMerge>
                  </>
                ) : (
                  <>
                    <feColorMatrix 
                      type="matrix" 
                      values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.45 0" 
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

            {/* Render custom text overlays with displacement filter and mix-blend CSS */}
            {product.customFields.map((cf) => {
              const text = inputs[cf.id] || cf.placeholder || "";
              if (!text) return null;

              const x = (cf.renderX / 100) * 600;
              const y = (cf.renderY / 100) * 600;
              const fontSize = (cf.renderHeight / 100) * 600;
              const font = fonts[cf.id] || cf.fontStyle;
              const align = cf.renderAlign || "center";

              const textAnchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
              const isGlass = product.productType === "glass";
              
              // Dynamic color and blend styles
              const fill = isGlass ? "rgba(255, 255, 255, 0.85)" : cf.renderColor;
              const blendMode = isGlass ? "overlay" as const : "multiply" as const;

              // Select weight based on font style
              let weight = "normal";
              if (font === "Cinzel" || font === "Playfair Display") {
                weight = "600";
              } else if (font === "Montserrat") {
                weight = "500";
              }

              return (
                <text
                  key={cf.id}
                  x={x}
                  y={y}
                  fontSize={fontSize}
                  fontFamily={`'${font}', serif`}
                  fontWeight={weight}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  fill={fill}
                  style={{
                    filter: "url(#engrave-displacement-filter)",
                    mixBlendMode: blendMode,
                    opacity: isGlass ? 0.9 : 0.95
                  }}
                >
                  {text}
                </text>
              );
            })}
          </svg>
        </div>
        
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginTop: "12px", textAlign: "center" }}>
          * Engraving depth and color dynamically adapt to the physical product texture (wood burn / frosted glass).
        </p>
      </div>

      {/* Control Customization Panel */}
      <div className="control-panel">
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", color: "var(--color-primary)", marginBottom: "4px" }}>
          Personalize Your Piece
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", marginBottom: "24px" }}>
          Fill in the fields below. Watch your engraving dynamically update in the preview window on the left.
        </p>

        {/* Inputs list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          {product.customFields.map((cf) => {
            const val = inputs[cf.id] || "";
            const currentFont = fonts[cf.id] || cf.fontStyle;
            const maxLen = cf.maxLength;

            return (
              <div 
                key={cf.id} 
                style={{ 
                  border: "1px solid var(--color-border)", 
                  padding: "16px", 
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--color-surface-soft)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label className="form-label" htmlFor={cf.id}>
                    {cf.label} {cf.required && <span style={{ color: "var(--color-error)" }}>*</span>}
                  </label>
                  {maxLen && (
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                      {val.length} / {maxLen} chars
                    </span>
                  )}
                </div>

                <input
                  type={cf.type === "number" ? "number" : "text"}
                  id={cf.id}
                  value={val}
                  placeholder={cf.placeholder || `Enter ${cf.label}...`}
                  required={cf.required}
                  onChange={(e) => handleInputChange(cf.id, e.target.value, maxLen)}
                  className="form-input"
                  style={{ marginBottom: "12px" }}
                />

                {/* Font selector */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-light)", textTransform: "uppercase" }}>
                    Font Style:
                  </span>
                  <select
                    value={currentFont}
                    onChange={(e) => handleFontChange(cf.id, e.target.value)}
                    className="form-select"
                    style={{ padding: "6px 12px", fontSize: "0.8rem", width: "auto", flex: 1 }}
                  >
                    <option value="Cinzel">Cinzel (Classic Serif)</option>
                    <option value="Great Vibes">Great Vibes (Southern Script)</option>
                    <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                    <option value="Montserrat">Montserrat (Modern Sans)</option>
                    <option value="Marcellus">Marcellus (Sculpted Serif)</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add to Cart Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {successMsg && (
            <div className="alert alert-success" style={{ padding: "12px 16px" }}>
              <Check size={16} /> Added to Shopping Bag!
            </div>
          )}

          <button 
            onClick={handleAddToBag}
            className="btn btn-primary"
            style={{ width: "100%", padding: "16px", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
          >
            <ShoppingBag size={18} /> Add Personalized Piece to Bag
          </button>
          
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", textAlign: "center" }}>
            * Handcrafted acacia & glass pieces take 2-4 business days for custom design engraving before shipment.
          </p>
        </div>
      </div>
    </div>
  );
}
