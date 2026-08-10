import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbann_ai — Financial Analysis Dashboard",
  description: "Automated stock financial statement analysis and ratio breakdown.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
