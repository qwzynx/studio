import type { Metadata } from "next";
import PhotoArchive from "../components/photo-archive";
import { collections } from "../lib/collections";

const url = "https://studio.mahanghafarian.com/photos";
const title = "Photo Archive | Mahan Ghafarian Studio";
const description =
  "Every developed roll in one place — portraits, street, landscapes, nature, night, studio, product, architecture, and events by Mahan Ghafarian.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    url,
    title,
    description,
    siteName: "Mahan Ghafarian Studio",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function PhotoArchivePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Photo Archive",
      description,
      url,
      hasPart: collections.map((collection) => ({
        "@type": "ImageGallery",
        name: collection.name,
        description: collection.description,
        url: `https://studio.mahanghafarian.com/photos/${collection.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Mahan Ghafarian Studio",
          item: "https://studio.mahanghafarian.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Photo Archive",
          item: url,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PhotoArchive />
    </>
  );
}
