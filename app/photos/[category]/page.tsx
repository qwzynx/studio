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

  return {
    title: `${collection.name} | Mahan Ghafarian Studio`,
    description: collection.description,
    alternates: {
      canonical: `https://studio.mahanghafarian.com/photos/${collection.slug}`,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { category } = await params;
  const collection = getCollection(category);
  if (!collection) notFound();

  return <CollectionGallery collection={collection} />;
}
