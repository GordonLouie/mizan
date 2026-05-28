"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Newspaper } from "lucide-react";

type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsState, setNewsState] = useState<FormState>("idle");

  function validateEmail(s: string) {
    return /^\S+@\S+\.\S+$/.test(s);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !validateEmail(email) || !message.trim()) {
      setState("error");
      return;
    }
    setState("sending");
    // Build a mailto: link as graceful fallback (works without any backend).
    const to = topicEmail(topic);
    const subject = `[${topic}] ${name}`;
    const body = `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`;
    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      window.location.href = url;
      setState("sent");
    }, 300);
  }

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(newsletterEmail)) { setNewsState("error"); return; }
    setNewsState("sending");
    // Mailto fallback — in production this hits the Beehiiv / Substack endpoint.
    const url = `mailto:newsletter@mizaninvesting.com?subject=${encodeURIComponent("Subscribe to Mizan newsletter")}&body=${encodeURIComponent("Please add " + newsletterEmail + " to the Mizan newsletter list.")}`;
    setTimeout(() => {
      window.location.href = url;
      setNewsState("sent");
    }, 300);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          jk reads every email personally. Expect a reply within 48 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900">Send a message</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Your name" required>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-navy-400 focus:bg-white focus:outline-none" placeholder="jk" />
            </Field>
            <Field label="Your email" required>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-navy-400 focus:bg-white focus:outline-none" placeholder="you@example.com" />
            </Field>
          </div>

          <Field label="Topic">
            <select value={topic} onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-navy-400 focus:bg-white focus:outline-none">
              <option value="general">General question</option>
              <option value="press">Press inquiry</option>
              <option value="investors">Investor</option>
              <option value="methodology">Methodology / correction</option>
              <option value="partnership">Partnership</option>
              <option value="bug">Bug report</option>
              <option value="hardship">Student / hardship discount</option>
              <option value="privacy">Privacy / data</option>
            </select>
          </Field>

          <Field label="Message" required>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-navy-400 focus:bg-white focus:outline-none" placeholder="What's on your mind?" />
          </Field>

          {state === "error" && (
            <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={14} /> Please fill in name, a valid email, and a message.
            </div>
          )}
          {state === "sent" && (
            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              <CheckCircle2 size={14} /> Your email client opened. Send it to finish.
            </div>
          )}

          <button type="submit" disabled={state === "sending"}
            className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
            <Send size={14} /> {state === "sending" ? "Opening your mail app…" : "Send"}
          </button>

          <p className="text-xs text-gray-500">
            This form opens your default email app pre-filled. In production it
            posts directly via a backend endpoint.
          </p>
        </form>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Mail size={14} /> Direct email
            </h3>
            <ul className="mt-3 space-y-1 text-xs text-gray-700">
              <li><strong>General:</strong> <a href="mailto:hello@mizaninvesting.com" className="text-navy-700 underline">hello@mizaninvesting.com</a></li>
              <li><strong>Press:</strong> <a href="mailto:press@mizaninvesting.com" className="text-navy-700 underline">press@mizaninvesting.com</a></li>
              <li><strong>Investors:</strong> <a href="mailto:investors@mizaninvesting.com" className="text-navy-700 underline">investors@mizaninvesting.com</a></li>
              <li><strong>Methodology:</strong> <a href="mailto:methodology@mizaninvesting.com" className="text-navy-700 underline">methodology@mizaninvesting.com</a></li>
              <li><strong>Privacy:</strong> <a href="mailto:privacy@mizaninvesting.com" className="text-navy-700 underline">privacy@mizaninvesting.com</a></li>
              <li><strong>Legal:</strong> <a href="mailto:legal@mizaninvesting.com" className="text-navy-700 underline">legal@mizaninvesting.com</a></li>
            </ul>
          </div>

          <form onSubmit={handleNewsletter} className="rounded-xl border border-navy-200 bg-navy-50 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <Newspaper size={14} /> The monthly Mizan letter
            </h3>
            <p className="mt-2 text-xs text-navy-800">
              One essay a month on halal investing, scholarly variation, and the
              gaps in current products. No promo, no fluff.
            </p>
            <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-3 w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm focus:border-navy-500 focus:outline-none" />
            <button type="submit" disabled={newsState === "sending"}
              className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md bg-navy-800 px-3 py-2 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-60">
              Subscribe
            </button>
            {newsState === "error" && <div className="mt-2 text-xs text-rose-700">Enter a valid email.</div>}
            {newsState === "sent" && <div className="mt-2 text-xs text-emerald-700">Email app opened — send to finish.</div>}
          </form>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function topicEmail(topic: string): string {
  switch (topic) {
    case "press": return "press@mizaninvesting.com";
    case "investors": return "investors@mizaninvesting.com";
    case "methodology": return "methodology@mizaninvesting.com";
    case "privacy": return "privacy@mizaninvesting.com";
    case "bug": return "support@mizaninvesting.com";
    case "hardship": return "hello@mizaninvesting.com";
    case "partnership": return "hello@mizaninvesting.com";
    default: return "hello@mizaninvesting.com";
  }
}
