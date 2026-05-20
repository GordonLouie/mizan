import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mizan.app";
  const now = new Date();
  const routes = [
    { url: "", priority: 1.0, change: "weekly" as const },
    { url: "/screen", priority: 0.9, change: "weekly" as const },
    { url: "/universe", priority: 0.9, change: "weekly" as const },
    { url: "/portfolio", priority: 0.8, change: "weekly" as const },
    { url: "/purification", priority: 0.7, change: "weekly" as const },
    { url: "/ask", priority: 0.8, change: "weekly" as const },
    { url: "/compare", priority: 0.6, change: "monthly" as const },
    { url: "/methodology", priority: 0.7, change: "monthly" as const },
    { url: "/about", priority: 0.5, change: "monthly" as const },
    { url: "/roadmap", priority: 0.4, change: "monthly" as const },
    { url: "/help", priority: 0.4, change: "monthly" as const },
    { url: "/terms", priority: 0.2, change: "yearly" as const },
    { url: "/privacy", priority: 0.2, change: "yearly" as const },
  ];
  return routes.map((r) => ({
    url: base + r.url,
    lastModified: now,
    changeFrequency: r.change,
    priority: r.priority,
  }));
}
