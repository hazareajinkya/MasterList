import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Master List - Discover Your Path",
  description: "Learn From Past Alumni Paths Studying Abroad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

