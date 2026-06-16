import type { Metadata } from "next";
import { Playfair_Display, Nunito_Sans, Lora, Great_Vibes } from "next/font/google";
import "./globals.css";
import { getSessionUser } from "@/lib/auth";
import { CartProvider } from "@/components/cart-context";
import Header from "@/components/header";
import Footer from "@/components/footer";

/* ── Google Fonts via next/font ───────────────────────────────── */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bridle & Birch | Southern Keepsake Goods",
  description:
    "Bespoke laser-engraved gifts crafted with Southern charm — cutting boards, whiskey sets, custom coasters, realtor closing gifts, and more.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${nunitoSans.variable} ${lora.variable} ${greatVibes.variable}`}
    >
      <body>
        <CartProvider>
          <Header user={user} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
