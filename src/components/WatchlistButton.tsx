"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { toast } from "@/lib/toast";

interface Props {
  ticker: string;
  size?: "sm" | "md";
}

export default function WatchlistButton({ ticker, size = "md" }: Props) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(isInWatchlist(ticker));
    const handler = () => setSaved(isInWatchlist(ticker));
    window.addEventListener("mizan.watchlist.changed", handler);
    return () => window.removeEventListener("mizan.watchlist.changed", handler);
  }, [ticker]);

  function toggle() {
    if (saved) {
      removeFromWatchlist(ticker);
      toast(`Removed ${ticker} from watchlist`, { tone: "info" });
    } else {
      addToWatchlist(ticker);
      toast(`Saved ${ticker} to watchlist`, { tone: "success" });
    }
  }

  if (!mounted) return null;

  const sz = size === "sm" ? "h-7 px-2 text-xs" : "h-9 px-3 text-sm";
  return (
    <button
      type="button"
      onClick={toggle}
      className={
        "inline-flex items-center gap-1.5 rounded-md border transition-colors " +
        sz + " " +
        (saved
          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800")
      }
      aria-label={saved ? `Remove ${ticker} from watchlist` : `Save ${ticker} to watchlist`}
    >
      {saved
        ? <BookmarkCheck size={size === "sm" ? 12 : 14} className="text-amber-600" />
        : <Bookmark size={size === "sm" ? 12 : 14} />}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
