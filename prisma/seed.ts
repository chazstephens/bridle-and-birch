import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import path from "path";
import { hashPassword } from "../src/lib/auth";

// Initialize the appropriate database client based on DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
let prisma: PrismaClient;

if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) {
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  const dbPath = path.join(process.cwd(), "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  prisma = new PrismaClient({ adapter });
}

async function main() {
  console.log("Seeding database...");

  // Clean existing database
  await prisma.review.deleteMany({});
  await prisma.customField.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Categories
  const kitchen = await prisma.category.create({
    data: { name: "Kitchen & Charcuterie", slug: "kitchen-charcuterie" },
  });

  const barware = await prisma.category.create({
    data: { name: "Barware & Glassware", slug: "barware-glassware" },
  });

  const home = await prisma.category.create({
    data: { name: "Home & Living", slug: "home-living" },
  });

  const gifts = await prisma.category.create({
    data: { name: "Realtor & Closing Gifts", slug: "realtor-gifts" },
  });

  console.log("Categories created!");

  // 2. Create Products
  
  // Product 1: Acacia Charcuterie Board
  const board = await prisma.product.create({
    data: {
      name: "Acacia Wood Charcuterie Board",
      slug: "acacia-charcuterie-board",
      description: "Handcrafted from premium acacia wood with a live edge and convenient handle. Perfect for entertaining, serving, and display. Wrapped in a delicate signature cream bow.",
      price: 58.00,
      imageUrl: "/images/mockups/charcuterie_board.jpg",
      categoryId: kitchen.id,
      productType: "wood",
      previewType: "cutting_board",
      customFields: {
        create: [
          {
            label: "Family Last Name",
            type: "text",
            placeholder: "e.g., STEPHENS",
            maxLength: 20,
            required: true,
            renderX: 50.0,
            renderY: 42.0,
            renderWidth: 70.0,
            renderHeight: 12.0,
            renderAlign: "center",
            renderColor: "#281b10",
            fontStyle: "Cinzel",
          },
          {
            label: "Established Year",
            type: "text",
            placeholder: "e.g., EST. 2026",
            maxLength: 12,
            required: false,
            renderX: 50.0,
            renderY: 58.0,
            renderWidth: 40.0,
            renderHeight: 6.0,
            renderAlign: "center",
            renderColor: "#281b10",
            fontStyle: "Montserrat",
          }
        ]
      },
      reviews: {
        create: [
          {
            author: "Sarah M.",
            rating: 5,
            text: "This charcuterie board is absolutely stunning! The laser engraving is incredibly crisp and clean, and the wood grain is beautiful. It came wrapped in a lovely cream ribbon, which made it the perfect housewarming gift.",
            verified: true,
          },
          {
            author: "James K.",
            rating: 5,
            text: "Purchased this for my wife for our anniversary. The quality of the acacia wood is top-notch, and the engraving was exactly as requested. Highly recommend Bridle & Birch!",
            verified: true,
          }
        ]
      }
    }
  });

  // Product 2: Whiskey Decanter Set
  const decanter = await prisma.product.create({
    data: {
      name: "Engraved Decanter & Whiskey Glasses Set",
      slug: "whiskey-decanter-set",
      description: "An elegant glass decanter paired with two matching lowball glasses. Features a frosted monogram engraving of your choice, evoking timeless southern sophistication.",
      price: 85.00,
      imageUrl: "/images/mockups/whiskey_set.jpg",
      categoryId: barware.id,
      productType: "glass",
      previewType: "drinkware",
      customFields: {
        create: [
          {
            label: "Monogram Initial",
            type: "text",
            placeholder: "e.g., S",
            maxLength: 1,
            required: true,
            renderX: 50.0,
            renderY: 52.0,
            renderWidth: 35.0,
            renderHeight: 25.0,
            renderAlign: "center",
            renderColor: "rgba(255, 255, 255, 0.85)", // frosted white
            fontStyle: "Cinzel",
          }
        ]
      },
      reviews: {
        create: [
          {
            author: "Eleanor P.",
            rating: 5,
            text: "Exquisite details. The glass feels heavy and high-quality, and the frosted monogram engraving looks incredibly high-end. It stands beautifully on our bar cart.",
            verified: true,
          }
        ]
      }
    }
  });

  // Product 3: Leatherette Personalized Notebook
  const notebook = await prisma.product.create({
    data: {
      name: "Personalized Leatherette Journal",
      slug: "leatherette-journal",
      description: "Richly textured leatherette journal, offering the look and feel of genuine leather. Laser engraved with a clean, dark debossed finish.",
      price: 24.00,
      imageUrl: "/images/mockups/notebook.jpg",
      categoryId: home.id,
      productType: "leather",
      previewType: "no_preview",
      customFields: {
        create: [
          {
            label: "Custom Name or Quote",
            type: "text",
            placeholder: "e.g., Write your story...",
            maxLength: 30,
            required: true,
            renderX: 50.0,
            renderY: 70.0,
            renderWidth: 60.0,
            renderHeight: 8.0,
            renderAlign: "center",
            renderColor: "#150d06", // deep debossed brown
            fontStyle: "Great Vibes",
          }
        ]
      },
      reviews: {
        create: [
          {
            author: "Rebecca G.",
            rating: 5,
            text: "Beautiful journal! The script font engraving is elegant, and the leatherette texture is surprisingly soft and premium. Perfect for journaling.",
            verified: true,
          }
        ]
      }
    }
  });

  // Product 4: Acacia & Marble Coasters
  const coasters = await prisma.product.create({
    data: {
      name: "Marble & Acacia Wood Coaster Set",
      slug: "marble-acacia-coasters",
      description: "Set of four hexagonal coasters blending clean white marble and warm acacia wood. Laser engraved with matching monogram initials.",
      price: 32.00,
      imageUrl: "/images/mockups/coasters.jpg",
      categoryId: kitchen.id,
      productType: "wood",
      previewType: "coaster",
      customFields: {
        create: [
          {
            label: "Monogram Initial",
            type: "text",
            placeholder: "e.g., H",
            maxLength: 1,
            required: true,
            renderX: 50.0,
            renderY: 50.0,
            renderWidth: 40.0,
            renderHeight: 40.0,
            renderAlign: "center",
            renderColor: "#301d0d", // engraving on wood half
            fontStyle: "Marcellus",
          }
        ]
      },
      reviews: {
        create: [
          {
            author: "Thomas D.",
            rating: 5,
            text: "Great weight to these, and they look beautiful on our coffee table. The combination of marble and wood is very modern, and the customized engraving adds a special touch.",
            verified: true,
          }
        ]
      }
    }
  });

  // Product 5: Realtor Closing Gift Set
  const realtorGift = await prisma.product.create({
    data: {
      name: "Premium Realtor Closing Gift Set",
      slug: "realtor-closing-gift-set",
      description: "The ultimate welcome home gift. Contains a large customized cutting board, a matching set of 4 coasters, and a laser-engraved wooden handle corkscrew.",
      price: 120.00,
      imageUrl: "/images/mockups/realtor_set.jpg",
      categoryId: gifts.id,
      productType: "wood",
      previewType: "no_preview",
      customFields: {
        create: [
          {
            label: "Homeowner Names",
            type: "text",
            placeholder: "e.g., The Millers",
            maxLength: 24,
            required: true,
            renderX: 50.0,
            renderY: 45.0,
            renderWidth: 70.0,
            renderHeight: 12.0,
            renderAlign: "center",
            renderColor: "#281b10",
            fontStyle: "Great Vibes",
          },
          {
            label: "Established Date",
            type: "text",
            placeholder: "e.g., June 2026",
            maxLength: 18,
            required: false,
            renderX: 50.0,
            renderY: 60.0,
            renderWidth: 50.0,
            renderHeight: 6.0,
            renderAlign: "center",
            renderColor: "#281b10",
            fontStyle: "Montserrat",
          }
        ]
      },
      reviews: {
        create: [
          {
            author: "Claire R. (Realtor)",
            rating: 5,
            text: "My clients were absolutely blown away by this gift set! It adds such a personal, elegant touch to their new home. I will definitely be ordering these for all my future closings.",
            verified: true,
          }
        ]
      }
    }
  });

  // 3. Create Users
  console.log("Creating default users...");
  const adminPasswordHash = await hashPassword("admin123");
  const customerPasswordHash = await hashPassword("customer123");

  await prisma.user.create({
    data: {
      email: "jana@bridleandbirch.com",
      name: "Jana Stephens",
      passwordHash: adminPasswordHash,
      role: "admin",
    }
  });

  await prisma.user.create({
    data: {
      email: "buyer@example.com",
      name: "John Doe",
      passwordHash: customerPasswordHash,
      role: "customer",
    }
  });
  console.log("Users created!");

  console.log("Products and Custom Fields seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
