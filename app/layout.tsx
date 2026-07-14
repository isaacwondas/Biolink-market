import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OrderProvider } from "@/app/context/OrderContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biolink-market-wondas.vercel.app"),

  title: {
    default: "BioLink Market",
    template: "%s | BioLink Market",
  },

  description:
    "Create your own online storefront in minutes. Share your products, receive payments and grow your business with BioLink Market.",

  keywords: [
    "BioLink Market",
    "Storefront",
    "Online Store",
    "WhatsApp Shop",
    "Sell Online",
    "Vendor",
    "Nigeria",
    "African Creators",
    "Marketplace",
  ],

  applicationName: "BioLink Market",

  creator: "BioLink Market",

  publisher: "BioLink Market",

  authors: [
    {
      name: "BioLink Market",
    },
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://biolink-market-wondas.vercel.app",
    siteName: "BioLink Market",
    title: "BioLink Market",
    description:
      "Build your online storefront, receive payments and share one beautiful link with customers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BioLink Market",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BioLink Market",
    description:
      "Create your own online storefront and start selling in minutes.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrderProvider>{children}</OrderProvider>
      </body>
    </html>
  );
}
