import type { Metadata } from "next";
import "./globals.css";
import { getSessionUser } from "@/lib/auth";
import { CartProvider } from "@/components/cart-context";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Bridle & Birch | Southern Charm & Fine Engravings",
  description: "Bespoke laser engraved gifts crafted with Southern charm, featuring cutting boards, whiskey sets, custom coasters, realtor closing gifts, and more.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch logged in user details server-side
  const user = await getSessionUser();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="layout-container">
        <CartProvider>
          <Header user={user} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
