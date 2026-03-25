import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OfferUp for Business",
  description:
    "Self-serve advertising platform for OfferUp. Reach millions of local buyers, promote your listings, and run display ad campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
