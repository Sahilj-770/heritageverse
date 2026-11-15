import type { MetadataRoute } from "next";
import { SAMPLE_MONUMENTS } from "@/data/sampleData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://heritageverse.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/plan-trip`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/conservation`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const monumentRoutes: MetadataRoute.Sitemap = SAMPLE_MONUMENTS.flatMap((m) => [
    {
      url: `${baseUrl}/heritage/${m.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/heritage/${m.slug}/3d`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tour/${m.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ]);

  return [...staticRoutes, ...monumentRoutes];
}
