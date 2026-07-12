import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionGallery from "../../components/collection-gallery";
import { collections, getCollection } from "../../lib/collections";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return collections.map((collection) => ({ category: collection.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const collection = getCollection(category);
  if (!collection) return {};

  const url = `https://studio.mahanghafarian.com/photos/${collection.slug}`;
  const cover = collection.photos[0];
  const title = `${collection.name} | Mahan Ghafarian Studio`;

  return {
    title,
    description: collection.description,
    keywords: [collection.name, collection.tagline, "Mahan Ghafarian", "Photography"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description: collection.description,
      siteName: "Mahan Ghafarian Studio",
      images: cover
        ? [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: collection.description,
      images: cover ? [cover.src] : undefined,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { category } = await params;
  const collection = getCollection(category);
  if (!collection) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: collection.name,
    description: collection.description,
    url: `https://studio.mahanghafarian.com/photos/${collection.slug}`,
    image: collection.photos.map((photo) => ({
      "@type": "ImageObject",
      contentUrl: `https://studio.mahanghafarian.com${photo.src}`,
      name: photo.title,
      description: photo.description,
      width: photo.width,
      height: photo.height,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionGallery collection={collection} />
    </>
  );
}
