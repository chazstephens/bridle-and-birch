import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import FeaturedProducts from "@/components/featured-products";
import { Gift, Heart, ShieldCheck, Award } from "lucide-react";

export default async function Home() {
  // Fetch categories and products from the database
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-tagline">Southern Charm & Fine Engravings</span>
          <h1 className="hero-title">Custom Giftware Crafted to Last</h1>
          <p className="hero-desc">
            Bespoke laser engraved wood cutting boards, monogrammed glassware, leatherette journals, and home details wrapped in our signature cream bow.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#shop" className="btn btn-accent">Shop The Collection</a>
            <Link href="/contact" className="btn btn-outline" style={{ borderColor: "var(--color-background)", color: "var(--color-background)" }}>
              Custom Request
            </Link>
          </div>
        </div>
      </section>

      {/* Unique Selling Points (USPs) */}
      <section className="usp-section">
        <div className="usp-grid">
          <div className="usp-item">
            <Gift className="usp-icon" size={28} />
            <div>
              <h3 className="usp-title">Signature Gift Wrap</h3>
              <p className="usp-desc">Each piece arrives wrapped in a delicate cream ribbon, ready to delight your loved ones.</p>
            </div>
          </div>
          <div className="usp-item">
            <Heart className="usp-icon" size={28} />
            <div>
              <h3 className="usp-title">Southern Craftsmanship</h3>
              <p className="usp-desc">Designed and laser engraved in the South with deep attention to detail and quality wood selection.</p>
            </div>
          </div>
          <div className="usp-item">
            <ShieldCheck className="usp-icon" size={28} />
            <div>
              <h3 className="usp-title">Personalized Live Preview</h3>
              <p className="usp-desc">Customize text and initial monogram fonts directly on the screen with real-time canvas overlays.</p>
            </div>
          </div>
          <div className="usp-item">
            <Award className="usp-icon" size={28} />
            <div>
              <h3 className="usp-title">Premium Gift Selection</h3>
              <p className="usp-desc">Acacia boards, marble coasters, realtor closing sets, and whiskey glasses built for memory making.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Component */}
      <FeaturedProducts initialProducts={products} categories={categories} />

      {/* Ribbon Divider */}
      <div className="ribbon-divider">
        <div className="ribbon-line" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <div className="ribbon-line" />
      </div>

      {/* Brand Story Section */}
      <section style={{ backgroundColor: "var(--color-surface)", padding: "80px 24px" }}>
        <div className="container-width" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px", alignItems: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ position: "relative", height: "300px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <Image 
                src="/images/mockups/charcuterie_board.jpg" 
                alt="Bow wrapped cutting board" 
                fill 
                style={{ objectFit: "cover" }} 
              />
            </div>
            <div style={{ position: "relative", height: "300px", borderRadius: "var(--radius-md)", overflow: "hidden", marginTop: "24px" }}>
              <Image 
                src="/images/mockups/whiskey_set.jpg" 
                alt="Engraved whiskey decanter" 
                fill 
                style={{ objectFit: "cover" }} 
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--color-accent)", fontWeight: 600 }}>
              The Story Behind the Brand
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", color: "var(--color-primary)" }}>
              Bridle & Birch
            </h2>
            <p style={{ color: "var(--color-text-light)" }}>
              Founded by Jana Stephens, Bridle & Birch was born from a love of hospitality, Southern charm, and the art of gift-giving. Inspired by the natural warmth of acacia and birch, combined with the timeless elegance of personalized engraving, each item in our collection is curated to tell a story.
            </p>
            <p style={{ color: "var(--color-text-light)" }}>
              Whether you are welcoming a new homeowner with a closing gift, celebrating a wedding anniversary, or hosting family gatherings around a charcuterie board, our pieces serve as beautiful centerpieces for life's celebrations.
            </p>
            <div style={{ marginTop: "12px" }}>
              <Link href="/about" className="btn btn-primary">Read Our Story</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
