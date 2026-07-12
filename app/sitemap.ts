import { MetadataRoute } from 'next'
import { collections } from './lib/collections'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://studio.mahanghafarian.com'
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/photos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...collections.map((collection) => ({
      url: `${baseUrl}/photos/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
