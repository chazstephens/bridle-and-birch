"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitCustomRequestAction } from "@/app/actions";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      className="btn btn-primary" 
      disabled={pending}
      style={{ width: "100%", padding: "14px", marginTop: "8px" }}
    >
      {pending ? "Sending Custom Inquiry..." : (
        <>
          <Send size={16} /> Send Inquiry
        </>
      )}
    </button>
  );
}

export default function ContactForm() {
  const [state, setState] = useState<{ success: boolean; error?: string; message?: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setState(null);
    const res = await submitCustomRequestAction(null, formData);
    setState(res);
    
    if (res.success) {
      // Clear form inputs
      const form = document.getElementById("inquiry-form") as HTMLFormElement;
      if (form) form.reset();
    }
  };

  return (
    <div className="control-panel" style={{ width: "100%" }}>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: "8px" }}>
        Inquire for Custom Work
      </h3>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", marginBottom: "24px" }}>
        Looking for corporate closing gifts, wedding sets, or a product not in our standard inventory? Let us know what you have in mind!
      </p>

      {state && state.success && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{state.message}</span>
        </div>
      )}

      {state && !state.success && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{state.error}</span>
        </div>
      )}

      <form id="inquiry-form" action={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Your Name *</label>
          <input className="form-input" type="text" id="name" name="name" required placeholder="Jana Stephens" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address *</label>
          <input className="form-input" type="email" id="email" name="email" required placeholder="jana@example.com" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone Number (Optional)</label>
          <input className="form-input" type="tel" id="phone" name="phone" placeholder="(555) 000-0000" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">Your Custom Design Details *</label>
          <textarea 
            className="form-textarea" 
            id="message" 
            name="message" 
            required 
            placeholder="Please detail the product (e.g., acacia board with custom logo), quantity needed, and text styles desired."
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
