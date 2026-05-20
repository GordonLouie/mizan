import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPost } from "@/lib/blog";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href="/blog" className="text-xs font-medium text-navy-700 hover:text-navy-900">
          ← All essays
        </Link>
      </div>
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{post.date}</div>
      <div
        className="prose prose-slate mt-2 max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h1:text-3xl prose-h1:mt-0
          prose-h2:text-xl prose-h2:mt-8
          prose-h3:text-lg
          prose-p:text-gray-700 prose-p:leading-7
          prose-a:text-navy-700 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900
          prose-table:text-sm
          prose-th:bg-gray-50 prose-th:p-2 prose-th:text-left
          prose-td:border-t prose-td:border-gray-100 prose-td:p-2
          prose-blockquote:border-l-4 prose-blockquote:border-navy-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
          prose-li:text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="mt-10 border-t border-gray-100 pt-6 text-xs text-gray-500">
        <p>
          Read more essays at <Link href="/blog" className="text-navy-700 underline">/blog</Link>.
          Get them in your inbox: <Link href="/contact" className="text-navy-700 underline">subscribe</Link>.
        </p>
      </div>
    </article>
  );
}
