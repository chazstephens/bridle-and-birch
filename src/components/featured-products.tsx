"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FeaturedProductsProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function FeaturedProducts({
  initialProducts,
  categories,
}: FeaturedProductsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts = activeCategory === "all"
    ? initialProducts
    : initialProducts.filter(p => p.categoryId === activeCategory);

  return (
    <section className="container-width" id="shop">
      <h2 className="section-title">Our Curated Collection</h2>
      <p className="section-subtitle">
        Bespoke gifts crafted with Southern charm, hand-engraved to celebrate life's most meaningful moments.
      </p>

      {/* Category Tabs */}
      <div 
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveCategory("all")}
          className={`btn ${activeCategory === "all" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "8px 20px", fontSize: "0.85rem" }}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`btn ${activeCategory === category.id ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "8px 20px", fontSize: "0.85rem" }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid-3" style={{ minHeight: "400px" }}>
        {filteredProducts.map((product) => (
          <article key={product.id} className="card">
            <Link href={`/products/${product.id}`} className="card-img-container">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="card-img"
                priority
              />
            </Link>
            <div className="card-content">
              <span className="card-category">{product.category.name}</span>
              <h3 className="card-title" style={{ fontSize: "1.2rem", margin: "4px 0 8px" }}>
                <Link href={`/products/${product.id}`} style={{ color: "inherit" }}>
                  {product.name}
                </Link>
              </h3>
              <p 
                style={{ 
                  fontSize: "0.85rem", 
                  color: "var(--color-text-light)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: "16px",
                  height: "2.7rem"
                }}
              >
                {product.description}
              </p>
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginTop: "auto"
                }}
              >
                <span className="card-price">${product.price.toFixed(2)}</span>
                <Link 
                  href={`/products/${product.id}`} 
                  className="btn btn-outline"
                  style={{ padding: "6px 14px", fontSize: "0.75rem", borderWidth: "1px" }}
                >
                  Personalize
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
