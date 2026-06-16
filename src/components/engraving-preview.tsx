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

  // Redraw the canvas whenever inputs, fonts, or bgImage updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 600, 600);

    // Draw background image
    ctx.drawImage(bgImage, 0, 0, 600, 600);

    // Draw each custom field text
    product.customFields.forEach((cf) => {
      const text = inputs[cf.id] || cf.placeholder || "";
      if (!text) return;

      const x = (cf.renderX / 100) * 600;
      const y = (cf.renderY / 100) * 600;
      const fontSize = (cf.renderHeight / 100) * 600;
      const font = fonts[cf.id] || cf.fontStyle;

      // Font formatting
      ctx.textAlign = (cf.renderAlign as CanvasTextAlign) || "center";
      ctx.textBaseline = "middle";
      
      // Select weight based on font style
      let weight = "normal";
      if (font === "Cinzel" || font === "Playfair Display") {
        weight = "600";
      } else if (font === "Montserrat") {
        weight = "500";
      }

      ctx.font = `${weight} ${fontSize}px '${font}', serif`;

      // Apply realistic blend/effects
      ctx.save();
      
      if (cf.renderColor.includes("rgba(255,255,255") || cf.renderColor.includes("rgba(255, 255, 255") || cf.renderColor === "#ffffff" || cf.renderColor === "white") {
        // Frosted Glass Effect (White)
        ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
        ctx.shadowBlur = 2;
      } else {
        // Wood Burn Effect (Dark)
        ctx.fillStyle = cf.renderColor;
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 1;
        ctx.shadowOffsetY = 1;
        // Blend mode to simulate wood burn
        ctx.globalCompositeOperation = "multiply";
      }

      ctx.fillText(text, x, y);
      ctx.restore();
    });
  }, [bgImage, inputs, fonts, product.customFields]);

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
