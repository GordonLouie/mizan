import type { MetadataRoute } from "next";
import { CURATED_LISTS } from "@/lib/lists";
import { listStocks } from "@/lib/data";
import { sectorSlug } from "@/lib/sectors";
import { CRYPTO_ASSETS } from "@/lib/crypto";
import { getAllPosts } from "@/lib/blog";
import { INDEXES } from "@/lib/indexes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mizaninvesting.com";
  const now = new Date();
  const routes = [
    { url: "", priority: 1.0, change: "weekly" as const },
    { url: "/screen", priority: 0.9, change: "weekly" as const },
    { url: "/halal", priority: 0.9, change: "weekly" as const },
    { url: "/indexes", priority: 0.8, change: "weekly" as const },
    { url: "/blog", priority: 0.7, change: "weekly" as const },
    { url: "/discover", priority: 0.9, change: "weekly" as const },
    { url: "/sectors", priority: 0.8, change: "weekly" as const },
    { url: "/crypto", priority: 0.8, change: "weekly" as const },
    { url: "/sukuk", priority: 0.7, change: "weekly" as const },
    { url: "/universe", priority: 0.8, change: "weekly" as const },
    { url: "/lists", priority: 0.8, change: "weekly" as const },
    { url: "/vs", priority: 0.6, change: "weekly" as const },
    { url: "/portfolio", priority: 0.8, change: "weekly" as const },
    { url: "/watchlist", priority: 0.6, change: "weekly" as const },
    { url: "/purification", priority: 0.7, change: "weekly" as const },
    { url: "/ask", priority: 0.8, change: "weekly" as const },
    { url: "/compare", priority: 0.6, change: "monthly" as const },
    { url: "/methodology", priority: 0.7, change: "monthly" as const },
    { url: "/trust", priority: 0.8, change: "weekly" as const },
    { url: "/about", priority: 0.6, change: "monthly" as const },
    { url: "/roadmap", priority: 0.4, change: "monthly" as const },
    { url: "/help", priority: 0.4, change: "monthly" as const },
    { url: "/terms", priority: 0.2, change: "yearly" as const },
    { url: "/privacy", priority: 0.2, change: "yearly" as const },
  ];
  const staticRoutes = routes.map((r) => ({
    url: base + r.url,
    lastModified: now,
    changeFrequency: r.change,
    priority: r.priority,
  }));
  const listRoutes = CURATED_LISTS.map((l) => ({
    url: `${base}/lists/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  // One sitemap entry per unique sector
  const sectors = Array.from(new Set(listStocks().map((s) => s.sector)));
  const sectorRoutes = sectors.map((s) => ({
    url: `${base}/sectors/${sectorSlug(s)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
  // One SEO page per ticker — the programmatic "Is {ticker} halal?" pages.
  const tickerRoutes = listStocks().map((s) => ({
    url: `${base}/halal/${encodeURIComponent(s.ticker)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  // One SEO page per cryptoasset — the "is {coin} halal?" pages.
  const cryptoRoutes = CRYPTO_ASSETS.map((a) => ({
    url: `${base}/crypto/${a.symbol.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  // Blog posts.
  const blogRoutes = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const indexRoutes = INDEXES.map((i) => ({
    url: `${base}/indexes/${i.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...listRoutes, ...sectorRoutes, ...tickerRoutes, ...cryptoRoutes, ...blogRoutes, ...indexRoutes];
}
