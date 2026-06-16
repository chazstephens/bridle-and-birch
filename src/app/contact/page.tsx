import ContactForm from "./contact-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container-width" style={{ padding: "64px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-accent)", fontWeight: 600 }}>
          Custom Orders & Inquiries
        </span>
        <h1 className="section-title" style={{ fontSize: "3rem", marginTop: "8px" }}>Get In Touch</h1>
      </div>

      <div className="engraving-container" style={{ gap: "48px" }}>
        {/* Contact Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--color-primary)", marginBottom: "16px" }}>
              Southern Charm at Your Service
            </h2>
            <p style={{ color: "var(--color-text-light)", fontSize: "0.95rem" }}>
              Whether you need to coordinate corporate closing gifts for a real estate agency, order matching monograms for a bridal shower, or ask about specific engraving files, we are happy to assist. Fill out the form or reach out through our details below.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ backgroundColor: "var(--color-surface-soft)", padding: "12px", borderRadius: "50%", color: "var(--color-accent)" }}>
                <Mail size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-light)" }}>Email Us</h4>
                <p style={{ fontWeight: 600 }}>jana@bridleandbirch.com</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ backgroundColor: "var(--color-surface-soft)", padding: "12px", borderRadius: "50%", color: "var(--color-accent)" }}>
                <Phone size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-light)" }}>Call Us</h4>
                <p style={{ fontWeight: 600 }}>(555) 123-4567</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ backgroundColor: "var(--color-surface-soft)", padding: "12px", borderRadius: "50%", color: "var(--color-accent)" }}>
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-light)" }}>Workshop Location</h4>
                <p style={{ fontWeight: 600 }}>Savannah, Georgia</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ backgroundColor: "var(--color-surface-soft)", padding: "12px", borderRadius: "50%", color: "var(--color-accent)" }}>
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-light)" }}>Business Hours</h4>
                <p style={{ fontWeight: 600 }}>Mon - Fri: 9:00 AM - 5:00 PM EST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}
