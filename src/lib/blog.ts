import fs from "fs";
import path from "path";
import { marked } from "marked";

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  keywords: string[];
}

export interface BlogPost extends BlogPostMeta {
  content: string;  // html
  excerpt: string;  // first paragraph plain text
}

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

function parseFrontmatter(raw: string): { meta: Partial<BlogPostMeta>; body: string } {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: raw };
  const block = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trimStart();
  const meta: any = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val: any = m[2].trim();
    // crude array parsing — only used for keywords
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val.slice(1, -1).split(",").map((s: string) =>
        s.trim().replace(/^"(.*)"$/, "$1"),
      );
    } else if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
  }
  return { meta, body };
}

function firstParagraph(html: string): string {
  const match = html.match(/<p>([\s\S]*?)<\/p>/);
  if (!match) return "";
  return match[1].replace(/<[^>]+>/g, "").slice(0, 240);
}

function loadOne(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
  const { meta, body } = parseFrontmatter(raw);
  const html = marked.parse(body, { async: false }) as string;
  // Derive slug from frontmatter or filename
  const slug = (meta.slug as string) || filename.replace(/\.md$/, "").replace(/^\d+_/, "").replace(/_/g, "-").toLowerCase();
  return {
    slug,
    title: meta.title || "Untitled",
    date: meta.date || "",
    author: meta.author || "jk",
    description: meta.description || "",
    keywords: meta.keywords || [],
    content: html,
    excerpt: firstParagraph(html),
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map(loadOne);
  return posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
