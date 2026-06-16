"use client";

import React, { useState } from "react";
import { submitCustomRequestAction } from "@/app/actions";
import {
  Send,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  MessageSquare,
  Clock,
  Gift,
} from "lucide-react";
import { Seal } from "@/components/ui/Seal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function CustomOrdersPage() {
  const [state, setState] = useState<{
    success: boolean;
    error?: string;
    message?: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setFileName(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedExtensions = ["svg", "ai", "eps", "pdf", "png", "jpg", "jpeg"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      setFileError(
        "Invalid file type. Please upload a vector (.ai, .svg, .eps, .pdf) or image (.png, .jpg)."
      );
      e.target.value = "";
      return;
    }
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

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 7,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 44,
    padding: "0 14px",
    background: "var(--surface-page)",
    border: "var(--border-1)",
    borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-body)",
    fontSize: 14.5,
    color: "var(--text-body)",
    outline: "none",
  };

  return (
    <>
      {/* ── Hero band ─────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--bb-espresso)",
          color: "var(--bb-ivory)",
          position: "relative",
          overflow: "hidden",
          padding: "88px 0 80px",
        }}
      >
        {/* Decorative seal watermark */}
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        >
          <Seal variant="scalloped" size={320} color="var(--bb-ivory)" />
        </div>

        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <SectionLabel color="var(--bb-brass)">Bespoke Commission Work</SectionLabel>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              color: "var(--bb-ivory)",
              lineHeight: 1.18,
              maxWidth: 620,
              margin: "16px 0 20px",
            }}
          >
            Custom Engraving,{" "}
            <em style={{ color: "var(--bb-brass)", fontStyle: "italic" }}>
              Your Vision
            </em>
          </h1>
          <p
            style={{
              maxWidth: 560,
              fontSize: 16.5,
              lineHeight: 1.7,
              color: "rgba(247,243,236,0.75)",
            }}
          >
            Whether you need 50 realtor closing gifts, personalized baby blocks,
            or branded corporate coasters — we handcraft bespoke engraving
            templates to your exact specifications.
          </p>

          {/* Quick stats */}
          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 44,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "24 hrs", label: "Vector proof turnaround" },
              { value: "10+", label: "Product types available" },
              { value: "1–500+", label: "Quantity range" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--bb-brass)",
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(247,243,236,0.6)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 96px" }}>
        <div
          style={{
            maxWidth: "var(--content-max)",
            margin: "0 auto",
            padding: "0 var(--content-pad)",
            display: "grid",
            gridTemplateColumns: "1fr 480px",
            gap: 72,
            alignItems: "start",
          }}
          className="bb-custom-grid"
        >
          {/* ── Left: process + value props ────────────────────────── */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "var(--fs-h2)",
                color: "var(--text-heading)",
                marginBottom: 16,
              }}
            >
              How It Works
            </h2>
            <p
              style={{
                fontSize: 15.5,
                color: "var(--text-muted)",
                lineHeight: 1.75,
                marginBottom: 40,
              }}
            >
              When you submit a custom request, Jana Stephens personally reviews
              your designs and vectors to verify the layout fit. Once approved,
              we engrave on our high-density wood, glass, or leather surfaces,
              wrap it in our signature cream bow, and ship it nationwide.
            </p>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                {
                  step: "01",
                  Icon: MessageSquare,
                  heading: "Submit Your Request",
                  body: "Fill out the form with your occasion, quantity, and design details. Upload a logo or font file if you have one.",
                },
                {
                  step: "02",
                  Icon: Clock,
                  heading: "Receive a Vector Proof",
                  body: "Within 24 hours, Jana sends you a live vector mockup for approval before any engraving begins.",
                },
                {
                  step: "03",
                  Icon: Gift,
                  heading: "We Engrave & Ship",
                  body: "Approved pieces are laser-engraved, wrapped in our signature packaging, and shipped nationwide within 5–7 days.",
                },
              ].map(({ step, Icon, heading, body }, i, arr) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    gap: 22,
                    paddingBottom: 32,
                    paddingTop: i > 0 ? 32 : 0,
                    borderBottom:
                      i < arr.length - 1 ? "var(--border-1)" : "none",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "var(--surface-warm)",
                      border: "var(--border-1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--bb-walnut)",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--bb-brass)",
                        marginBottom: 5,
                      }}
                    >
                      Step {step}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.15rem",
                        fontWeight: 600,
                        color: "var(--text-heading)",
                        marginBottom: 6,
                      }}
                    >
                      {heading}
                    </h3>
                    <p
                      style={{
                        fontSize: 14.5,
                        color: "var(--text-muted)",
                        lineHeight: 1.65,
                      }}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Value props */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 44,
              }}
              className="bb-value-grid"
            >
              {[
                {
                  Icon: Sparkles,
                  heading: "Occasion Tailored",
                  body: "Weddings, corporate closings, baby showers — we adapt layouts for each event.",
                },
                {
                  Icon: Upload,
                  heading: "Vector File Support",
                  body: "Upload your logo or monogram in .ai, .svg, or .pdf for a precise laser burn.",
                },
              ].map(({ Icon, heading, body }) => (
                <div
                  key={heading}
                  style={{
                    background: "var(--surface-card)",
                    border: "var(--border-1)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <Icon
                    size={20}
                    style={{ color: "var(--bb-walnut)", flexShrink: 0, marginTop: 2 }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "var(--text-heading)",
                        marginBottom: 5,
                      }}
                    >
                      {heading}
                    </div>
                    <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.55 }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: request form ─────────────────────────────────── */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "var(--border-1)",
              borderRadius: "var(--radius-xl)",
              padding: "36px 32px",
              boxShadow: "var(--shadow-lg)",
              position: "sticky",
              top: "calc(var(--header-h) + 28px)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--text-heading)",
                marginBottom: 6,
              }}
            >
              Custom Request Form
            </h3>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--text-muted)",
                lineHeight: 1.55,
                marginBottom: 28,
              }}
            >
              We&rsquo;ll follow up with a live vector proof within 24 hours.
            </p>

            {/* Status banners */}
            {state?.success && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 18px",
                  background: "rgba(110,123,87,0.12)",
                  border: "1px solid var(--status-success)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--status-success)",
                  marginBottom: 24,
                }}
              >
                <CheckCircle2 size={16} />
                {state.message}
              </div>
            )}
            {state && !state.success && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 18px",
                  background: "rgba(180,70,70,0.09)",
                  border: "1px solid var(--status-error)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--status-error)",
                  marginBottom: 24,
                }}
              >
                <AlertCircle size={16} />
                {state.error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              {/* Name + Email row */}
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
                className="bb-form-2col"
              >
                <div>
                  <label htmlFor="name" style={labelStyle}>
                    Your Name *
                  </label>
                  <input
                    style={inputStyle}
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Jana Stephens"
                  />
                </div>
                <div>
                  <label htmlFor="email" style={labelStyle}>
                    Email Address *
                  </label>
                  <input
                    style={inputStyle}
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="jana@example.com"
                  />
                </div>
              </div>

              {/* Phone + Occasion row */}
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
                className="bb-form-2col"
              >
                <div>
                  <label htmlFor="phone" style={labelStyle}>
                    Phone (Optional)
                  </label>
                  <input
                    style={inputStyle}
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="occasion" style={labelStyle}>
                    Occasion / Theme
                  </label>
                  <select
                    id="occasion"
                    name="occasion"
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select occasion…</option>
                    <option value="wedding">Wedding / Anniversary</option>
                    <option value="corporate">Corporate / Realtor Closing</option>
                    <option value="holiday">Holiday / Seasonal</option>
                    <option value="baby">Newborn / Nursery</option>
                    <option value="other">Other Celebration</option>
                  </select>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" style={labelStyle}>
                  Approximate Quantity Needed
                </label>
                <input
                  style={inputStyle}
                  type="number"
                  id="quantity"
                  name="quantity"
                  defaultValue={1}
                  min={1}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" style={labelStyle}>
                  Custom Engraving Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Describe the items (e.g. 50 coasters with a corporate logo, baby room signs with cursive lettering) and placement details."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "var(--surface-page)",
                    border: "var(--border-1)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontSize: 14.5,
                    color: "var(--text-body)",
                    lineHeight: 1.55,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* File upload */}
              <div>
                <label style={labelStyle}>
                  Upload Design / Logo File (Optional)
                </label>
                <div
                  style={{
                    border: "2px dashed var(--line-soft)",
                    borderRadius: "var(--radius-md)",
                    padding: "22px 20px",
                    textAlign: "center",
                    position: "relative",
                    background: "var(--surface-warm)",
                    cursor: "pointer",
                    transition: "border-color var(--dur-fast)",
                  }}
                >
                  <input
                    type="file"
                    name="file"
                    id="custom-file-upload"
                    onChange={handleFileChange}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                  <Upload
                    size={22}
                    style={{
                      color: "var(--bb-walnut)",
                      marginBottom: 8,
                      display: "block",
                      margin: "0 auto 8px",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13.5,
                      color: "var(--text-heading)",
                    }}
                  >
                    {fileName
                      ? `Selected: ${fileName}`
                      : "Click or drag your design file here"}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-subtle)",
                      marginTop: 4,
                    }}
                  >
                    Vector (.ai, .svg, .eps, .pdf) or Image (.png, .jpg) — up to 10MB
                  </p>
                </div>
                {fileError && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      fontSize: 12.5,
                      color: "var(--status-error)",
                      marginTop: 8,
                    }}
                  >
                    <ShieldAlert size={13} />
                    {fileError}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={pending}
                style={{
                  width: "100%",
                  height: 54,
                  background: pending ? "var(--line-soft)" : "var(--bb-espresso)",
                  color: "var(--bb-ivory)",
                  border: "none",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: pending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 4,
                  transition: "background var(--dur-fast)",
                }}
              >
                {pending ? (
                  "Submitting…"
                ) : (
                  <>
                    <Send size={15} />
                    Send Custom Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .bb-custom-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .bb-form-2col {
            grid-template-columns: 1fr !important;
          }
          .bb-value-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
