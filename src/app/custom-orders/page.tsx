"use client";

import React, { useState } from "react";
import { submitCustomRequestAction } from "@/app/actions";
import { Send, Upload, CheckCircle2, AlertCircle, Sparkles, ShieldAlert } from "lucide-react";

export default function CustomOrdersPage() {
  const [state, setState] = useState<{ success: boolean; error?: string; message?: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Validate uploaded files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setFileName(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    // Allowed file types: vector formats or standard high-res images
    const allowedExtensions = ["svg", "ai", "eps", "pdf", "png", "jpg", "jpeg"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !allowedExtensions.includes(ext)) {
      setFileError("Invalid file type. Please upload a vector (.ai, .svg, .eps, .pdf) or image (.png, .jpg).");
      e.target.value = ""; // Clear file input
      return;
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File is too large. Max file size is 10MB.");
      e.target.value = "";
      return;
    }

    setFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileError) return;

    setPending(true);
    setState(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitCustomRequestAction(null, formData);
    
    setState(res);
    setPending(false);

    if (res.success) {
      setFileName(null);
      e.currentTarget.reset();
    }
  };

  return (
    <div className="container-width" style={{ padding: "64px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-accent)", fontWeight: 600 }}>
          Bespoke Commission Work
        </span>
        <h1 className="section-title" style={{ fontSize: "3rem", marginTop: "8px" }}>Custom Engraving Requests</h1>
        <p style={{ maxWidth: "600px", margin: "16px auto 0", color: "var(--color-text-light)" }}>
          Let us bring your unique designs to life. Whether you need a batch of realtor closing sets, personalized baby room blocks, or branded corporate coasters, we handcraft custom engraving templates to your exact specifications.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }} className="custom-orders-layout">
        {/* Value Proposition / Information */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--color-primary)", marginBottom: "16px" }}>
              Our Custom Process
            </h2>
            <p style={{ color: "var(--color-text-light)", lineHeight: "1.7", marginBottom: "16px" }}>
              At Bridle & Birch, we believe custom gifts should be truly premium. When you submit a custom request, Jana Stephens personally reviews your designs and vectors to verify the layout fit.
            </p>
            <p style={{ color: "var(--color-text-light)", lineHeight: "1.7" }}>
              Once approved, we engrave on our high-density wood, glass, or leather surfaces, wrap it in our signature cream bow, and ship it nationwide.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", gap: "16px", backgroundColor: "var(--color-surface)", padding: "20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <Sparkles size={24} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-primary)", marginBottom: "4px" }}>Occasion Tailored</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>We adapt our layouts specifically for weddings, corporate closing events, client handoffs, and family milestones.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", backgroundColor: "var(--color-surface)", padding: "20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <Upload size={24} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-primary)", marginBottom: "4px" }}>Vector File Support</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>Upload your own logo or monogram vectors (.ai, .svg, .pdf) for a precise, crisp laser burn.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="control-panel" style={{ width: "100%", backgroundColor: "var(--color-surface)" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: "8px" }}>
            Custom Request Form
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", marginBottom: "24px" }}>
            Please detail your request below. We will follow up with a live vector proof within 24 hours.
          </p>

          {state && state.success && (
            <div className="alert alert-success" style={{ marginBottom: "24px" }}>
              <CheckCircle2 size={18} />
              <span>{state.message}</span>
            </div>
          )}

          {state && !state.success && (
            <div className="alert alert-error" style={{ marginBottom: "24px" }}>
              <AlertCircle size={18} />
              <span>{state.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Your Name *</label>
                <input className="form-input" type="text" id="name" name="name" required placeholder="Jana Stephens" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address *</label>
                <input className="form-input" type="email" id="email" name="email" required placeholder="jana@example.com" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone (Optional)</label>
                <input className="form-input" type="tel" id="phone" name="phone" placeholder="(555) 123-4567" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="occasion">Occasion / Theme</label>
                <select className="form-select" id="occasion" name="occasion">
                  <option value="">Select occasion...</option>
                  <option value="wedding">Wedding / Anniversary</option>
                  <option value="corporate">Corporate / Realtor Closing</option>
                  <option value="holiday">Holiday / Seasonal</option>
                  <option value="baby">Newborn / Nursery</option>
                  <option value="other">Other Celebration</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Approximate Quantity Needed</label>
              <input className="form-input" type="number" id="quantity" name="quantity" defaultValue={1} min={1} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Custom Engraving Details *</label>
              <textarea 
                className="form-textarea" 
                id="message" 
                name="message" 
                required 
                rows={5}
                placeholder="Describe the items (e.g. 50 coasters with a corporate logo, baby room signs with cursive lettering) and placement details."
              />
            </div>

            {/* Design Upload Field */}
            <div className="form-group">
              <label className="form-label">Upload Design Logo or Font File (Optional)</label>
              <div 
                style={{
                  border: "2px dashed var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  position: "relative",
                  backgroundColor: "var(--color-background)"
                }}
              >
                <input 
                  type="file" 
                  name="file" 
                  id="custom-file-upload" 
                  onChange={handleFileChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer"
                  }}
                />
                <Upload size={24} style={{ color: "var(--color-text-light)", marginBottom: "8px" }} />
                <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--color-primary)" }}>
                  {fileName ? `Selected: ${fileName}` : "Click to select or drag your design file"}
                </p>
                <p style={{ fontSize: "0.7rem", color: "var(--color-text-light)", marginTop: "4px" }}>
                  Supports Vector (.ai, .svg, .eps, .pdf) or Image (.png, .jpg) up to 10MB
                </p>
              </div>

              {fileError && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-error)", fontSize: "0.75rem", marginTop: "8px" }}>
                  <ShieldAlert size={14} /> {fileError}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={pending}
              style={{ width: "100%", padding: "14px", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {pending ? "Submitting Request..." : (
                <>
                  <Send size={16} /> Send Custom Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
