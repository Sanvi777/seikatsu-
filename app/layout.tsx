import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seikatsu — Japan Settlement Guide",
  description: "Everything you need to settle into Japan, in the right order.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}