import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OET Listening Practice - Dr Ahmed Elgendy",
  description:
    "Master your OET listening skills with comprehensive practice materials and expert guidance from Dr Ahmed Elgendy",
    generator: 'v0.app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics /> {/* ⬅️ add this */}
      </body>
    </html>
  );
}
