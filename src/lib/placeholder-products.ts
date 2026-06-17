/**
 * Placeholder product data used when the production database has no records.
 * These are rendered by both the /products listing page and the /products/[slug]
 * detail page as fallback content.
 */

export interface PlaceholderProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  productType: string;
  previewType: string;
  turnaround: string;
  shippingClass: string;
  badges: string | null;
  active: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  customFields: Array<{
    id: string;
    productId: string;
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
  }>;
  reviews: Array<{
    id: string;
    productId: string;
    author: string;
    rating: number;
    text: string;
    verified: boolean;
    createdAt: Date;
  }>;
}

export const PLACEHOLDER_PRODUCTS: PlaceholderProduct[] = [
  {
    id: "placeholder-cutting-board",
    slug: "family-heirloom-cutting-board",
    name: "Family Heirloom Cutting Board",
    description:
      "Our signature walnut cutting board, laser-engraved with your family name and established year. Each board is hand-selected for grain character and finished with food-safe oil. A piece that earns its place on the counter and gets handed down.",
    price: 58,
    imageUrl: "",
    productType: "wood",
    previewType: "cutting_board",
    turnaround: "3–5 business days",
    shippingClass: "standard",
    badges: "Best Seller",
    active: true,
    seoTitle: "Custom Engraved Family Cutting Board | Bridle & Birch",
    seoDesc:
      "Personalized walnut cutting board laser-engraved with your family name. A Southern heirloom gift.",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: "cutting-boards",
    category: { id: "cutting-boards", name: "Cutting Boards", slug: "cutting-boards" },
    customFields: [
      {
        id: "cf-1",
        productId: "placeholder-cutting-board",
        label: "Family Name",
        type: "text",
        placeholder: "e.g. Henderson",
        defaultValue: null,
        maxLength: 20,
        required: true,
        renderX: 25,
        renderY: 38,
        renderWidth: 50,
        renderHeight: 24,
        renderAlign: "center",
        renderColor: "#3d2511",
        fontStyle: "Great Vibes",
      },
      {
        id: "cf-2",
        productId: "placeholder-cutting-board",
        label: "Est. Year",
        type: "text",
        placeholder: "e.g. 1987",
        defaultValue: null,
        maxLength: 4,
        required: false,
        renderX: 36,
        renderY: 62,
        renderWidth: 28,
        renderHeight: 12,
        renderAlign: "center",
        renderColor: "#3d2511",
        fontStyle: "Lato",
      },
    ],
    reviews: [
      {
        id: "rev-1",
        productId: "placeholder-cutting-board",
        author: "Margaret T.",
        rating: 5,
        text: "Absolutely stunning. I ordered this as a wedding gift and the couple was in tears. The quality of the walnut is exceptional and the engraving is deep and precise.",
        verified: true,
        createdAt: new Date("2025-11-12"),
      },
      {
        id: "rev-2",
        productId: "placeholder-cutting-board",
        author: "James R.",
        rating: 5,
        text: "Third board I've ordered from Bridle & Birch. Gave one to my parents for their anniversary, one as a housewarming gift, and finally kept one for myself. Worth every penny.",
        verified: true,
        createdAt: new Date("2025-09-03"),
      },
    ],
  },
  {
    id: "placeholder-whiskey-set",
    slug: "whiskey-decanter-set",
    name: "Whiskey & Decanter Set",
    description:
      "A hand-blown crystal decanter paired with two double old-fashioned glasses, each engraved with the recipient's initials or a short personal message. Arrives in a cream ribbon-tied gift box. The kind of gift that earns shelf space in a home bar forever.",
    price: 78,
    imageUrl: "",
    productType: "glass",
    previewType: "drinkware",
    turnaround: "3–5 business days",
    shippingClass: "fragile",
    badges: "Gift Ready",
    active: true,
    seoTitle: "Engraved Whiskey Decanter Set | Bridle & Birch",
    seoDesc:
      "Custom engraved crystal decanter and whiskey glass set. Perfect for weddings, corporate gifts, and groomsmen.",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: "bar-sets",
    category: { id: "bar-sets", name: "Bar & Whiskey Sets", slug: "bar-sets" },
    customFields: [
      {
        id: "cf-3",
        productId: "placeholder-whiskey-set",
        label: "Monogram or Name",
        type: "text",
        placeholder: "e.g. W or William",
        defaultValue: null,
        maxLength: 12,
        required: true,
        renderX: 30,
        renderY: 40,
        renderWidth: 40,
        renderHeight: 20,
        renderAlign: "center",
        renderColor: "#2a2a2a",
        fontStyle: "Great Vibes",
      },
    ],
    reviews: [
      {
        id: "rev-3",
        productId: "placeholder-whiskey-set",
        author: "Sarah K.",
        rating: 5,
        text: "Bought this for my husband's 40th and he immediately displayed it in the living room. The engraving on the crystal is so precise it looks like it came from a luxury brand.",
        verified: true,
        createdAt: new Date("2025-12-01"),
      },
    ],
  },
  {
    id: "placeholder-coasters",
    slug: "marble-coaster-set",
    name: "Marble Coaster Set",
    description:
      "Four genuine marble coasters, each laser-engraved with a monogram, floral motif, or custom design of your choice. Backed with felt to protect any surface. Presented in a linen sleeve. A practical gift that doesn't feel practical.",
    price: 42,
    imageUrl: "",
    productType: "glass",
    previewType: "coaster",
    turnaround: "2–4 business days",
    shippingClass: "standard",
    badges: null,
    active: true,
    seoTitle: "Custom Engraved Marble Coasters | Bridle & Birch",
    seoDesc:
      "Set of four genuine marble coasters laser-engraved with your monogram or design. Housewarming and wedding gift.",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: "coasters",
    category: { id: "coasters", name: "Coasters & Trivets", slug: "coasters" },
    customFields: [
      {
        id: "cf-4",
        productId: "placeholder-coasters",
        label: "Monogram (1–3 letters)",
        type: "text",
        placeholder: "e.g. J or JMT",
        defaultValue: null,
        maxLength: 3,
        required: true,
        renderX: 30,
        renderY: 35,
        renderWidth: 40,
        renderHeight: 30,
        renderAlign: "center",
        renderColor: "#4a3728",
        fontStyle: "Great Vibes",
      },
    ],
    reviews: [
      {
        id: "rev-4",
        productId: "placeholder-coasters",
        author: "Diana L.",
        rating: 4,
        text: "Beautiful quality. The engraving is clean and the marble is real — not a cheap substitute. Only gave 4 stars because delivery took an extra day, but I'd absolutely order again.",
        verified: true,
        createdAt: new Date("2025-10-18"),
      },
    ],
  },
  {
    id: "placeholder-baby-block",
    slug: "baby-name-block",
    name: "Baby Name Block",
    description:
      "A solid maple keepsake block engraved with the baby's name, birth date, weight, and length. Finished in natural oil. Small enough for a nursery shelf, meaningful enough to keep for decades. Pairs beautifully with our other baby-collection pieces.",
    price: 36,
    imageUrl: "",
    productType: "wood",
    previewType: "sign",
    turnaround: "2–4 business days",
    shippingClass: "standard",
    badges: "New",
    active: true,
    seoTitle: "Custom Baby Name Keepsake Block | Bridle & Birch",
    seoDesc:
      "Engraved maple baby name block with birth date and stats. A nursery keepsake gift they'll treasure.",
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: "baby",
    category: { id: "baby", name: "Baby & Kids", slug: "baby" },
    customFields: [
      {
        id: "cf-5",
        productId: "placeholder-baby-block",
        label: "Baby's Name",
        type: "text",
        placeholder: "e.g. Charlotte",
        defaultValue: null,
        maxLength: 16,
        required: true,
        renderX: 20,
        renderY: 25,
        renderWidth: 60,
        renderHeight: 20,
        renderAlign: "center",
        renderColor: "#3d2511",
        fontStyle: "Great Vibes",
      },
      {
        id: "cf-6",
        productId: "placeholder-baby-block",
        label: "Birth Date",
        type: "text",
        placeholder: "e.g. March 4, 2025",
        defaultValue: null,
        maxLength: 20,
        required: false,
        renderX: 20,
        renderY: 50,
        renderWidth: 60,
        renderHeight: 14,
        renderAlign: "center",
        renderColor: "#3d2511",
        fontStyle: "Lato",
      },
    ],
    reviews: [],
  },
];

export function getPlaceholderBySlug(slug: string): PlaceholderProduct | undefined {
  return PLACEHOLDER_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}
