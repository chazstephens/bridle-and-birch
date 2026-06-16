"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProductAction } from "@/app/actions";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Plus, 
  Trash2, 
  FileText, 
  Layout, 
  Settings, 
  CheckCircle,
  Sparkles,
  Info
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CustomField {
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  renderX: number;
  renderY: number;
  renderWidth: number;
  renderHeight: number;
  renderAlign: string;
  renderColor: string;
  fontStyle: string;
}

interface WizardFormProps {
  categories: Category[];
}

const MOCKUP_IMAGES = [
  { path: "/images/mockups/charcuterie_board.jpg", label: "Acacia Charcuterie Board" },
  { path: "/images/mockups/whiskey_set.jpg", label: "Whiskey Decanter Set" },
  { path: "/images/mockups/coasters.jpg", label: "Acacia & Marble Coasters" },
  { path: "/images/mockups/notebook.jpg", label: "Leatherette Journal" },
  { path: "/images/mockups/realtor_set.jpg", label: "Realtor Closing Gift Set" },
];

export default function WizardForm({ categories }: WizardFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Base Details
  const [name, setName] = useState("");
  const [price, setPrice] = useState("58.00");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [imageUrl, setImageUrl] = useState(MOCKUP_IMAGES[0].path);
  const [productType, setProductType] = useState("wood");
  const [previewType, setPreviewType] = useState("cutting_board");
  const [turnaround, setTurnaround] = useState("2-4 business days");
  const [shippingClass, setShippingClass] = useState("standard");
  const [badges, setBadges] = useState("");

  // Step 2: Customization Fields
  const [customFields, setCustomFields] = useState<CustomField[]>([
    {
      label: "Family Last Name",
      type: "text",
      placeholder: "e.g., STEPHENS",
      required: true,
      renderX: 50,
      renderY: 42,
      renderWidth: 70,
      renderHeight: 12,
      renderAlign: "center",
      renderColor: "#281b10",
      fontStyle: "Cinzel",
    },
    {
      label: "Established Year",
      type: "text",
      placeholder: "e.g., EST. 2026",
      required: false,
      renderX: 50,
      renderY: 58,
      renderWidth: 40,
      renderHeight: 6,
      renderAlign: "center",
      renderColor: "#281b10",
      fontStyle: "Montserrat",
    }
  ]);

  // Apply template presets
  const applyPreset = (presetName: string) => {
    if (presetName === "cutting_board") {
      setProductType("wood");
      setPreviewType("cutting_board");
      setImageUrl("/images/mockups/charcuterie_board.jpg");
      setCustomFields([
        {
          label: "Family Last Name",
          type: "text",
          placeholder: "e.g., STEPHENS",
          required: true,
          renderX: 50,
          renderY: 42,
          renderWidth: 70,
          renderHeight: 12,
          renderAlign: "center",
          renderColor: "#281b10",
          fontStyle: "Cinzel",
        },
        {
          label: "Established Year",
          type: "text",
          placeholder: "e.g., EST. 2026",
          required: false,
          renderX: 50,
          renderY: 58,
          renderWidth: 40,
          renderHeight: 6,
          renderAlign: "center",
          renderColor: "#281b10",
          fontStyle: "Montserrat",
        }
      ]);
    } else if (presetName === "drinkware") {
      setProductType("glass");
      setPreviewType("drinkware");
      setImageUrl("/images/mockups/whiskey_set.jpg");
      setCustomFields([
        {
          label: "Monogram Initial",
          type: "text",
          placeholder: "e.g., S",
          required: true,
          renderX: 50,
          renderY: 52,
          renderWidth: 35,
          renderHeight: 25,
          renderAlign: "center",
          renderColor: "rgba(255, 255, 255, 0.85)",
          fontStyle: "Cinzel",
        }
      ]);
    } else if (presetName === "coaster") {
      setProductType("wood");
      setPreviewType("coaster");
      setImageUrl("/images/mockups/coasters.jpg");
      setCustomFields([
        {
          label: "Monogram Initial",
          type: "text",
          placeholder: "e.g., H",
          required: true,
          renderX: 50,
          renderY: 50,
          renderWidth: 40,
          renderHeight: 40,
          renderAlign: "center",
          renderColor: "#301d0d",
          fontStyle: "Marcellus",
        }
      ]);
    } else if (presetName === "no_preview") {
      setPreviewType("no_preview");
      setCustomFields([]);
    }
  };

  const handleAddField = () => {
    setCustomFields([
      ...customFields,
      {
        label: "New Text Field",
        type: "text",
        placeholder: "Enter details...",
        required: true,
        renderX: 50,
        renderY: 50,
        renderWidth: 50,
        renderHeight: 10,
        renderAlign: "center",
        renderColor: "#281b10",
        fontStyle: "Cinzel",
      }
    ]);
  };

  const handleRemoveField = (index: number) => {
    setCustomFields(customFields.filter((_, idx) => idx !== index));
  };

  const handleUpdateField = (index: number, key: keyof CustomField, value: any) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [key]: value };
    setCustomFields(updated);
  };

  const handlePublish = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        throw new Error("Please enter a valid product price.");
      }

      const payload = {
        name,
        description,
        price: parsedPrice,
        imageUrl,
        categoryId,
        productType,
        previewType,
        turnaround,
        shippingClass,
        badges: badges || undefined,
        customFields,
      };

      const result = await createProductAction({}, payload);

      if (result.success) {
        router.push("/admin?tab=products");
        router.refresh();
      } else {
        setError(result.error || "Failed to create product.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Back button & Title */}
      <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href="/admin" className="btn btn-outline" style={{ padding: "8px 12px", display: "flex", gap: "8px", fontSize: "0.8rem" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Steps indicator */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        borderBottom: "1px solid var(--color-border)",
        paddingBottom: "16px",
        marginBottom: "32px",
      }}>
        <div style={{ display: "flex", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => setStep(1)}>
            <span style={{ 
              width: "28px", 
              height: "28px", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              backgroundColor: step >= 1 ? "var(--color-primary)" : "var(--color-surface-soft)",
              color: step >= 1 ? "var(--color-background)" : "var(--color-text-light)",
              fontWeight: 600,
              fontSize: "0.85rem"
            }}>
              1
            </span>
            <span style={{ fontWeight: step === 1 ? 600 : 500, fontSize: "0.9rem", color: step === 1 ? "var(--color-primary)" : "var(--color-text-light)" }}>
              Product Details
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => setStep(2)}>
            <span style={{ 
              width: "28px", 
              height: "28px", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              backgroundColor: step >= 2 ? "var(--color-primary)" : "var(--color-surface-soft)",
              color: step >= 2 ? "var(--color-background)" : "var(--color-text-light)",
              fontWeight: 600,
              fontSize: "0.85rem"
            }}>
              2
            </span>
            <span style={{ fontWeight: step === 2 ? 600 : 500, fontSize: "0.9rem", color: step === 2 ? "var(--color-primary)" : "var(--color-text-light)" }}>
              Engrave Canvas Editor
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => setStep(3)}>
            <span style={{ 
              width: "28px", 
              height: "28px", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              backgroundColor: step === 3 ? "var(--color-accent)" : "var(--color-surface-soft)",
              color: step === 3 ? "var(--color-background)" : "var(--color-text-light)",
              fontWeight: 600,
              fontSize: "0.85rem"
            }}>
              3
            </span>
            <span style={{ fontWeight: step === 3 ? 600 : 500, fontSize: "0.9rem", color: step === 3 ? "var(--color-accent)" : "var(--color-text-light)" }}>
              Publish Review
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "24px" }}>
          {error}
        </div>
      )}

      {/* STEP 1: PRODUCT DETAILS */}
      {step === 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="engraving-container">
          <div className="control-panel" style={{ width: "100%" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
              <Settings size={22} color="var(--color-accent)" /> 1. General Product Details
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }} className="engraving-container">
              <div>
                <label className="input-label" htmlFor="product-name">Product Name *</label>
                <input 
                  type="text" 
                  id="product-name" 
                  className="input-field" 
                  placeholder="e.g. Artisan Walnut Cheese Board" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>

              <div>
                <label className="input-label" htmlFor="product-price">Base Price ($ USD) *</label>
                <input 
                  type="text" 
                  id="product-price" 
                  className="input-field" 
                  placeholder="58.00" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }} className="engraving-container">
              <div>
                <label className="input-label" htmlFor="product-category">Category *</label>
                <select 
                  id="product-category" 
                  className="input-field" 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ backgroundColor: "var(--color-surface)", height: "46px" }}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="product-type">Material Type</label>
                <select 
                  id="product-type" 
                  className="input-field" 
                  value={productType} 
                  onChange={(e) => setProductType(e.target.value)}
                  style={{ backgroundColor: "var(--color-surface)", height: "46px" }}
                >
                  <option value="wood">Acacia/Walnut Wood</option>
                  <option value="glass">Monogrammed Glassware</option>
                  <option value="leather">Leatherette Goods</option>
                  <option value="acrylic">Acrylic Lettering</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label className="input-label" htmlFor="product-desc">Description & Sizing Details *</label>
              <textarea 
                id="product-desc" 
                className="input-field" 
                rows={4} 
                placeholder="Describe the wood species, dimensions, cleaning care instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }} className="engraving-container">
              <div>
                <label className="input-label" htmlFor="product-image">Select Product Base Image</label>
                <select 
                  id="product-image" 
                  className="input-field" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ backgroundColor: "var(--color-surface)", height: "46px" }}
                >
                  {MOCKUP_IMAGES.map((img) => (
                    <option key={img.path} value={img.path}>{img.label} ({img.path})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="product-badges">Badges (Comma separated)</label>
                <input 
                  type="text" 
                  id="product-badges" 
                  className="input-field" 
                  placeholder="e.g. Best Seller, Holiday Special" 
                  value={badges} 
                  onChange={(e) => setBadges(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }} className="engraving-container">
              <div>
                <label className="input-label" htmlFor="product-turnaround">Turnaround Time</label>
                <input 
                  type="text" 
                  id="product-turnaround" 
                  className="input-field" 
                  placeholder="e.g. 2-4 business days" 
                  value={turnaround} 
                  onChange={(e) => setTurnaround(e.target.value)} 
                />
              </div>

              <div>
                <label className="input-label" htmlFor="product-shipping">Shipping Class</label>
                <select 
                  id="product-shipping" 
                  className="input-field" 
                  value={shippingClass} 
                  onChange={(e) => setShippingClass(e.target.value)}
                  style={{ backgroundColor: "var(--color-surface)", height: "46px" }}
                >
                  <option value="standard">Standard Lightweight</option>
                  <option value="heavy">Heavy Wood/Glassware</option>
                  <option value="fragile">Fragile Drinkware</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  if (!name || !description || !price) {
                    setError("Please fill in Name, Price, and Description.");
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                Next Step: Live Preview Canvas <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: ENGRAVING POSITIONING */}
      {step === 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
          {/* Preset Buttons */}
          <div className="control-panel" style={{ width: "100%", padding: "20px" }}>
            <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-accent)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={16} /> Apply Live Customizer Presets
            </h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-outline" onClick={() => applyPreset("cutting_board")} style={{ fontSize: "0.8rem", padding: "8px 16px" }}>
                Acacia Board Template
              </button>
              <button type="button" className="btn btn-outline" onClick={() => applyPreset("drinkware")} style={{ fontSize: "0.8rem", padding: "8px 16px" }}>
                Whiskey Glasses Template
              </button>
              <button type="button" className="btn btn-outline" onClick={() => applyPreset("coaster")} style={{ fontSize: "0.8rem", padding: "8px 16px" }}>
                Marble Coasters Template
              </button>
              <button type="button" className="btn btn-outline" onClick={() => applyPreset("no_preview")} style={{ fontSize: "0.8rem", padding: "8px 16px" }}>
                No Canvas Preview
              </button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Info size={14} /> Templates automatically configure text box sizes, fonts, and burn colors.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "32px" }} className="engraving-container">
            {/* Visual Canvas Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-primary)", width: "100%", textAlign: "left" }}>
                Live Canvas Visualizer
              </h3>
              
              <div 
                style={{ 
                  width: "100%", 
                  aspectRatio: "1/1", 
                  maxWidth: "400px", 
                  backgroundColor: "var(--color-surface-soft)",
                  borderRadius: "var(--radius-md)",
                  border: "2px solid var(--color-border)",
                  position: "relative",
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-md)"
                }}
              >
                {/* Overlay Fields */}
                {customFields.map((field, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: `${field.renderX}%`,
                      top: `${field.renderY}%`,
                      width: `${field.renderWidth}%`,
                      height: `${field.renderHeight}%`,
                      transform: "translate(-50%, -50%)",
                      border: "1px dashed var(--color-accent)",
                      backgroundColor: "rgba(197, 168, 128, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "4px",
                      pointerEvents: "none"
                    }}
                  >
                    <span style={{ 
                      fontSize: "0.7rem", 
                      fontWeight: 600, 
                      color: "var(--color-primary)", 
                      backgroundColor: "var(--color-surface)", 
                      padding: "2px 6px", 
                      borderRadius: "2px", 
                      position: "absolute", 
                      top: "-10px", 
                      border: "1px solid var(--color-border)" 
                    }}>
                      Field #{idx + 1}: {field.label}
                    </span>
                    <span style={{ 
                      color: field.renderColor, 
                      fontFamily: `var(--font-${field.fontStyle.toLowerCase() === "cinzel" ? "display" : field.fontStyle.toLowerCase() === "great vibes" ? "script" : field.fontStyle.toLowerCase() === "playfair display" ? "serif" : "sans"})`,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textAlign: field.renderAlign as any
                    }}>
                      {field.placeholder || "Sample Engraving"}
                    </span>
                  </div>
                ))}

                {previewType === "no_preview" && (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(56, 47, 38, 0.6)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyItems: "center", color: "var(--bb-ivory)", padding: "24px", textAlign: "center" }}>
                    <p style={{ margin: "auto", fontSize: "0.9rem" }}>No Canvas Preview active. Customers will customize products via normal inputs without a live overlay render.</p>
                  </div>
                )}
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                * Red boxes represent customer text bounding sizes. Adjust sliders to fine-tune placement.
              </p>
            </div>

            {/* Customizer Slider Control List */}
            <div className="control-panel" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--color-border)", paddingBottom: "10px" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-primary)" }}>
                  Engraved Text Fields ({customFields.length})
                </h3>
                <button type="button" className="btn btn-outline" onClick={handleAddField} style={{ padding: "6px 12px", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Plus size={14} /> Add Text Box
                </button>
              </div>

              {customFields.length === 0 ? (
                <p style={{ color: "var(--color-text-light)", textAlign: "center", padding: "40px" }}>No customizable fields. This product cannot be custom engraved.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxHeight: "450px", overflowY: "auto", paddingRight: "8px" }}>
                  {customFields.map((field, idx) => (
                    <div key={idx} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "16px", backgroundColor: "var(--color-surface-soft)", position: "relative" }}>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveField(idx)}
                        style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", color: "var(--color-error)", cursor: "pointer" }}
                        title="Delete Field"
                      >
                        <Trash2 size={16} />
                      </button>

                      <h4 style={{ fontSize: "0.9rem", color: "var(--color-primary)", fontWeight: 700, marginBottom: "12px" }}>
                        Text Box #{idx + 1}
                      </h4>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>Field Label (User Facing)</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            style={{ padding: "6px", fontSize: "0.8rem" }} 
                            value={field.label}
                            onChange={(e) => handleUpdateField(idx, "label", e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>Placeholder Text</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            style={{ padding: "6px", fontSize: "0.8rem" }} 
                            value={field.placeholder}
                            onChange={(e) => handleUpdateField(idx, "placeholder", e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>Font Family</label>
                          <select 
                            style={{ width: "100%", padding: "6px", fontSize: "0.8rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-surface)" }}
                            value={field.fontStyle}
                            onChange={(e) => handleUpdateField(idx, "fontStyle", e.target.value)}
                          >
                            <option value="Cinzel">Cinzel (Serif Caps)</option>
                            <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                            <option value="Montserrat">Montserrat (Modern Sans)</option>
                            <option value="Great Vibes">Great Vibes (Formal Script)</option>
                            <option value="Marcellus">Marcellus (Spaced Serif)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>Text Alignment</label>
                          <select 
                            style={{ width: "100%", padding: "6px", fontSize: "0.8rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-surface)" }}
                            value={field.renderAlign}
                            onChange={(e) => handleUpdateField(idx, "renderAlign", e.target.value)}
                          >
                            <option value="center">Center</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>Burn/Engrave Color</label>
                          <select 
                            style={{ width: "100%", padding: "6px", fontSize: "0.8rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-surface)" }}
                            value={field.renderColor}
                            onChange={(e) => handleUpdateField(idx, "renderColor", e.target.value)}
                          >
                            <option value="#281b10">Acacia Wood Burn (#281b10)</option>
                            <option value="#150d06">Deep Deboss Brown (#150d06)</option>
                            <option value="rgba(255, 255, 255, 0.85)">Glass Frosted White</option>
                            <option value="#382F26">Espresso Gray (#382F26)</option>
                          </select>
                        </div>
                      </div>

                      {/* Position Sliders */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                            <span>Horizontal Center (X)</span>
                            <strong>{field.renderX}%</strong>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            style={{ width: "100%", accentColor: "var(--color-primary)" }}
                            value={field.renderX}
                            onChange={(e) => handleUpdateField(idx, "renderX", parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                            <span>Vertical Center (Y)</span>
                            <strong>{field.renderY}%</strong>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            style={{ width: "100%", accentColor: "var(--color-primary)" }}
                            value={field.renderY}
                            onChange={(e) => handleUpdateField(idx, "renderY", parseFloat(e.target.value))}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                            <span>Max Width Box</span>
                            <strong>{field.renderWidth}%</strong>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            style={{ width: "100%", accentColor: "var(--color-primary)" }}
                            value={field.renderWidth}
                            onChange={(e) => handleUpdateField(idx, "renderWidth", parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                            <span>Max Height Box</span>
                            <strong>{field.renderHeight}%</strong>
                          </div>
                          <input 
                            type="range" 
                            min="4" 
                            max="50" 
                            style={{ width: "100%", accentColor: "var(--color-primary)" }}
                            value={field.renderHeight}
                            onChange={(e) => handleUpdateField(idx, "renderHeight", parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <div style={{ marginTop: "12px" }}>
                        <label style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input 
                            type="checkbox" 
                            checked={field.required} 
                            onChange={(e) => handleUpdateField(idx, "required", e.target.checked)}
                          />
                          <span>Required Customization Field</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", borderTop: "1px solid var(--color-border)", paddingTop: "20px" }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                  Back to Details
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  Proceed to Review <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & PUBLISH */}
      {step === 3 && (
        <div className="control-panel" style={{ width: "100%", maxWidth: "700px", margin: "0 auto", padding: "32px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
            <FileText size={24} color="var(--color-accent)" /> 3. Review & Launch Product
          </h2>

          <div style={{ display: "flex", gap: "24px", marginBottom: "32px", borderBottom: "1px solid var(--color-border)", paddingBottom: "24px" }}>
            <div style={{ width: "120px", height: "120px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", overflow: "hidden", position: "relative" }}>
              <img src={imageUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <span className="badge badge-completed" style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ready to Publish</span>
              <h3 style={{ fontSize: "1.4rem", margin: "4px 0 8px" }}>{name}</h3>
              <p style={{ fontWeight: 600, color: "var(--color-primary)", fontSize: "1.1rem" }}>${parseFloat(price).toFixed(2)}</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px", fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                <div><strong>Category:</strong> {categories.find(c => c.id === categoryId)?.name || "General"}</div>
                <div><strong>Material:</strong> {productType}</div>
                <div><strong>Preview Type:</strong> {previewType}</div>
                <div><strong>Turnaround:</strong> {turnaround}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-light)", marginBottom: "8px" }}>Description</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text)", whiteSpace: "pre-wrap" }}>{description}</p>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-light)", marginBottom: "12px" }}>Customizable Engravings</h4>
            {customFields.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>This is a static product (no custom engraving).</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {customFields.map((field, idx) => (
                  <div key={idx} style={{ padding: "8px 12px", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                    <span>Field {idx + 1}: <strong>{field.label}</strong> (Font: {field.fontStyle})</span>
                    <span style={{ color: "var(--color-accent)" }}>Coords: ({field.renderX}%, {field.renderY}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-border)", paddingTop: "20px" }}>
            <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
              Adjust Coordinates
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={handlePublish}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px" }}
            >
              {isSubmitting ? "Publishing..." : <>
                <Save size={18} /> Launch Product
              </>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
