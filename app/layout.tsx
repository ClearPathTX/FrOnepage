import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Forward Recovery | California Substance Abuse Treatment",
  description: "Forward Recovery is California's premier substance abuse treatment facility offering detox, residential, and outpatient programs in Los Angeles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} antialiased`} style={{ fontFamily: 'Lato, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
