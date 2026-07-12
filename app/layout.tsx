import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Navbar from "./components/navbar";
import Letterbox from "./components/letterbox";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#080807",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://studio.mahanghafarian.com"),
  title: "Mahan Ghafarian Studio | Photography & Videography",
  description:
    "The visual work of Mahan Ghafarian — photography and videography portfolio. Portraits, landscapes, street photography, and short films shot, edited, and graded end to end.",
  keywords: [
    "Mahan Ghafarian",
    "Photography",
    "Videography",
    "Photographer",
    "Filmmaker",
    "Video Editing",
    "Color Grading",
    "Portrait Photography",
    "Toronto Photographer",
  ],
  authors: [{ name: "Mahan Ghafarian" }],
  creator: "Mahan Ghafarian",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studio.mahanghafarian.com",
    title: "Mahan Ghafarian Studio | Photography & Videography",
    description:
      "Photography and videography portfolio of Mahan Ghafarian. Portraits, landscapes, street photography, and short films.",
    siteName: "Mahan Ghafarian Studio",
    images: [
      {
        url: "/portrait.jpg",
        width: 1200,
        height: 630,
        alt: "Mahan Ghafarian Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahan Ghafarian Studio | Photography & Videography",
    description:
      "Photography and videography portfolio of Mahan Ghafarian. Portraits, landscapes, street photography, and short films.",
    images: ["/portrait.jpg"],
    creator: "@qwzynx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/Mahan_Ghafarian_Logo.png",
    shortcut: "/Mahan_Ghafarian_Logo.png",
    apple: "/Mahan_Ghafarian_Logo.png",
  },
  alternates: {
    canonical: "https://studio.mahanghafarian.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mahan Ghafarian",
    url: "https://studio.mahanghafarian.com",
    image: "https://studio.mahanghafarian.com/portrait.jpg",
    sameAs: [
      "https://mahanghafarian.com",
      "https://github.com/qwzynx",
      "https://linkedin.com/in/mahan-ghafarian-b02ba0298/",
      "https://www.instagram.com/qwzynx/",
    ],
    jobTitle: "Photographer & Videographer",
    description:
      "Photographer and videographer. Portraits, landscapes, street photography, and short films — shot, edited, and graded end to end.",
  };

  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} h-full antialiased dark scroll-smooth snap-y snap-proximity`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex bg-background text-foreground film-grain">
        <Letterbox />
        <Navbar />
        <main className="flex-1 pl-0 md:pl-20 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
