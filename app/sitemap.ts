import type { MetadataRoute } from "next";
import { siteUrl } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-05");

  return [
    {
      url: siteUrl.toString(),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/personal", siteUrl).toString(),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
