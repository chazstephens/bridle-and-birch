import Image from "next/image";
import Link from "next/link";
import { Heart, Gift, Compass } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container-width" style={{ padding: "64px 24px" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-accent)", fontWeight: 600 }}>
          Southern Charm & Hospitality
        </span>
        <h1 className="section-title" style={{ fontSize: "3rem", marginTop: "8px" }}>Our Story</h1>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", margin: "16px 0" }}>
          <div style={{ width: "40px", height: "1px", backgroundColor: "var(--color-accent)" }} />
          <Heart size={16} color="var(--color-accent)" />
          <div style={{ width: "40px", height: "1px", backgroundColor: "var(--color-accent)" }} />
        </div>
      </div>

      {/* Main Story Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px", alignItems: "center" }}>
        {/* Story Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--color-primary)", lineHeight: 1.3 }}>
            “Hospitality isn’t about making things perfect; it’s about making people feel welcome and valued.”
          </h2>
          
          <p style={{ color: "var(--color-text)", fontSize: "1.05rem", lineHeight: 1.8 }}>
            Growing up in the heart of the South, founder Jana Stephens learned early on that the best conversations happen around a shared table, and the most memorable gifts are the ones that hold a personal connection. With a passion for design and a love of laser engraving, she created **Bridle & Birch** to bring that warmth and Southern charm to homes everywhere.
          </p>

          <p style={{ color: "var(--color-text-light)", lineHeight: 1.7 }}>
            The name <em>Bridle & Birch</em> represents two sides of the brand: the refined heritage and elegance of equestrian life (the bridle), and the rustic, organic beauty of the natural world (the birch). Together, they form a perfect harmony of polished details and organic textures.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", margin: "24px 0" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Gift size={24} color="var(--color-accent)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--color-primary)", marginBottom: "8px" }}>Hand-Wrapped Gift Presentation</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                  Each engraved charcuterie board or custom block set is hand-wrapped in a signature cream bow. We believe the unboxing should be just as magical as the gift itself.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Compass size={24} color="var(--color-accent)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--color-primary)", marginBottom: "8px" }}>Deep Laser Engraving</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                  We utilize state-of-the-art laser machinery to burn monograms and text deep into the grain of acacia, marble, leatherette, and stone, creating a lasting finish.
                </p>
              </div>
            </div>
          </div>

          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--color-primary)", marginTop: "16px" }}>Our Promise to You</h3>
          <p style={{ color: "var(--color-text-light)", lineHeight: 1.7 }}>
            We work with the finest sustainable acacia wood, rich slate stone, and premium glassware to ensure that every engraving is clean, crisp, and high-contrast. If you have a custom design request or a corporate inquiry for closing gifts, we would be honored to bring your vision to life.
          </p>

          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <Link href="/" className="btn btn-primary">Shop The Store</Link>
            <Link href="/contact" className="btn btn-outline">Request Custom Work</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
