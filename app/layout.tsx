import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
export const metadata: Metadata = {
  title: "DarkForum - المنتدى الحديث",
  description: "منصة نقاشات حديثة بتصميم داكن احترافي",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-dark-100 text-white min-h-screen">
        <SessionProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
