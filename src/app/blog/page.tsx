import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog · HalalGauge",
  description: "Essays on halal investing, scholarly variation, and what existing products get wrong.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <article className="space-y-8">
      <div>
        <div className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800">
          The HalalGauge letter
        </div>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Essays on halal investing.</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          The kind of thoughtful, current, plain-language analysis halal-investing
          decisions deserve. Written for Muslim investors and the people who serve
          them.
        </p>
      </div>

      <div className="space-y-3">
        {posts.length === 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            No posts yet.
          </div>
        )}
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}
            className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-navy-300 hover:shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{p.date}</div>
            <h2 className="mt-1 text-xl font-bold text-gray-900">{p.title}</h2>
            <p className="mt-2 text-sm text-gray-700">{p.description || p.excerpt}</p>
            <div className="mt-3 text-xs font-medium text-navy-700">Read essay →</div>
          </Link>
        ))}
      </div>
    </article>
  );
}
