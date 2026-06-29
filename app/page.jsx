"use client";
import { useState, useEffect, useRef } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = n =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M"
  : n >= 1000    ? (n / 1000).toFixed(1) + "K"
  : String(n ?? 0);

const GRADS = [
  "from-pink-950 via-rose-900","from-green-950 via-teal-900","from-red-900 via-gray-900",
  "from-red-950 via-slate-900","from-emerald-950 via-slate-900","from-indigo-900 via-slate-900",
  "from-purple-950 via-blue-950","from-zinc-950 via-gray-900","from-orange-950 via-red-900",
  "from-amber-950 via-slate-900","from-teal-950 via-slate-900","from-violet-950 via-slate-900",
  "from-green-900 via-emerald-900","from-orange-900 via-yellow-900","from-cyan-950 via-blue-900",
  "from-blue-950 via-sky-900","from-blue-950 via-slate-900","from-blue-900 via-indigo-900",
  "from-cyan-900 via-blue-900","from-stone-950 via-slate-900",
];
const getGrad = str => GRADS[Math.abs([...str].reduce((a, c) => a + c.charCodeAt(0), 0)) % GRADS.length];

const GC = {
  ACTION:       "bg-red-500/20 text-red-400 border-red-500/30",
  FANTASY:      "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ROMANCE:      "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "SCI-FI":     "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  ADVENTURE:    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ISEKAI:       "bg-green-500/20 text-green-400 border-green-500/30",
  DARK:         "bg-gray-500/20 text-gray-300 border-gray-500/30",
  MAGIC:        "bg-violet-500/20 text-violet-400 border-violet-500/30",
  NINJA:        "bg-lime-500/20 text-lime-400 border-lime-500/30",
  MECHA:        "bg-teal-500/20 text-teal-400 border-teal-500/30",
  THRILLER:     "bg-rose-500/20 text-rose-400 border-rose-500/30",
  SCHOOL:       "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SUPERNATURAL: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  PSYCH:        "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

// ── Slide offset ──────────────────────────────────────────────────────────────
const slideOff = (i, cur, n) => {
  const raw = (i - cur + n) % n;
  return raw === 0 ? 0 : raw <= Math.floor(n / 2) ? raw * 100 : (raw - n) * 100;
};

// ── Featured Slider ───────────────────────────────────────────────────────────
function FeaturedSlider({ list, onSelect }) {
  const [cur, setCur]   = useState(0);
  const timer           = useRef(null);
  const touchX          = useRef(null);
  const n               = list.length;

  const go = idx => setCur(((idx % n) + n) % n);

  const resetTimer = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setCur(c => (c + 1) % n), 4500);
  };

  useEffect(() => { resetTimer(); return () => clearInterval(timer.current); }, [n]);

  if (!n) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl mx-4"
      style={{ height: 295 }}
      onTouchStart={e  => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current !== null) {
          const d = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) { go(cur + (d > 0 ? 1 : -1)); resetTimer(); }
          touchX.current = null;
        }
      }}
    >
      {list.map((a, i) => (
        <div
          key={a._id}
          className={`absolute inset-0 bg-gradient-to-br ${getGrad(a.title)} to-slate-950`}
          style={{ transform: `translateX(${slideOff(i, cur, n)}%)`, transition: "transform 0.45s cubic-bezier(.4,0,.2,1)" }}
          onClick={() => onSelect(a)}
        >
          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/20" />

          {/* actual image if provided */}
          {a.image_url && (
            <img
              src={a.image_url} alt={a.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              onError={e => { e.target.style.display = "none"; }}
            />
          )}

          {/* giant letter watermark */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
            <span style={{ fontSize: 170, fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>
              {a.title[0]}
            </span>
          </div>

          {/* rank badge */}
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
              style={{ background: "rgba(0,180,255,0.18)", color: "#00B4FF", border: "1px solid rgba(0,180,255,0.35)" }}>
              #{i + 1} TOP VIEW
            </span>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.45)" }}>
            <span className="text-xs text-white">👁</span>
            <span className="text-xs text-white font-bold">{fmt(a.views)}</span>
          </div>

          {/* bottom content */}
          <div className="absolute bottom-14 left-0 right-0 px-5">
            <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">Featured Anime</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
              {(a.genres || []).map(g => (
                <span key={g} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${GC[g] || "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>{g}</span>
              ))}
            </div>
            <h2 className="text-white font-black leading-tight mb-3" style={{ fontSize: 22 }}>{a.title}</h2>
            <button
              className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2 active:scale-95 transition-transform"
              onClick={e => { e.stopPropagation(); onSelect(a); }}
            >▶ Watch</button>
          </div>
        </div>
      ))}

      {/* dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
        {list.map((_, j) => (
          <button key={j} className="pointer-events-auto"
            onClick={e => { e.stopPropagation(); go(j); resetTimer(); }}
            style={{ width: j === cur ? 22 : 7, height: 7, borderRadius: 4,
              background: j === cur ? "#00B4FF" : "rgba(255,255,255,0.3)", transition: "all .35s" }} />
        ))}
      </div>
    </div>
  );
}

// ── Anime Card ────────────────────────────────────────────────────────────────
function AnimeCard({ anime, onClick }) {
  return (
    <div onClick={() => onClick(anime)}
      className="relative flex-shrink-0 w-36 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform duration-150"
      style={{ height: 215, background: "#141B2D", border: "1px solid rgba(255,255,255,0.07)" }}>
      {/* gradient bg */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getGrad(anime.title)} to-slate-950`} />
      {/* real image */}
      {anime.image_url && (
        <img src={anime.image_url} alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          onError={e => { e.target.style.display = "none"; }} />
      )}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
        <span style={{ fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.06)" }}>{anime.title[0]}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex flex-wrap gap-1 mb-1.5">
          {(anime.genres || []).slice(0, 1).map(g => (
            <span key={g} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${GC[g] || "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>{g}</span>
          ))}
        </div>
        <p className="text-white text-xs font-bold leading-tight line-clamp-2 mb-1.5">{anime.title}</p>
        <span className="text-[10px] text-gray-400">👁 {fmt(anime.views)}</span>
      </div>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ anime, onClose }) {
  if (!anime) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-t-3xl overflow-hidden"
        style={{ background: "#0D1117" }}
        onClick={e => e.stopPropagation()}>
        {/* handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>
        {/* banner */}
        <div className={`relative bg-gradient-to-br ${getGrad(anime.title)} to-slate-950`} style={{ height: 210 }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent" />
          {anime.image_url && (
            <img src={anime.image_url} alt={anime.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              onError={e => { e.target.style.display = "none"; }} />
          )}
          <div className="absolute inset-0 flex items-center justify-center select-none overflow-hidden">
            <span style={{ fontSize: 140, fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>
              {anime.title[0]}
            </span>
          </div>
          <div className="absolute top-4 left-4">
            <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">Featured Anime</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(anime.genres || []).map(g => (
                <span key={g} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${GC[g] || ""}`}>{g}</span>
              ))}
            </div>
            <h2 className="text-white font-black text-xl leading-tight">{anime.title}</h2>
          </div>
        </div>
        {/* stats */}
        <div className="flex gap-2 px-5 py-4">
          <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
            👁 {fmt(anime.views)} Views
          </span>
        </div>
        {/* buttons */}
        <div className="flex gap-2 px-5 pb-8">
          <a href={anime.watch_link || "#"} target="_blank" rel="noopener noreferrer"
            className="flex-1 py-3 rounded-2xl text-sm font-black text-white text-center active:scale-95 transition-transform flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#00B4FF,#0077BB)" }}>
            ▶ Watch Now
          </a>
          <button onClick={onClose}
            className="px-4 py-3 rounded-2xl text-sm font-bold text-gray-400"
            style={{ background: "rgba(255,255,255,0.07)" }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ── Mail Panel ────────────────────────────────────────────────────────────────
const MAILS = [
  { text: "New anime added!",            unread: true  },
  { text: "Backup complete",             unread: true  },
  { text: "Website updated to v2.0",     unread: false },
  { text: "Welcome to AniIndex!",        unread: false },
];

function MailPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: "#141B2D", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
          <span className="text-white font-bold">Inbox</span>
          <span className="text-gray-500 text-sm">{MAILS.length} messages</span>
        </div>
        {MAILS.map((m, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: m.unread ? "#60A5FA" : "transparent", border: m.unread ? "none" : "1px solid #374151" }} />
            <span className={`text-sm ${m.unread ? "text-white" : "text-gray-500"}`}>{m.text}</span>
          </div>
        ))}
        <button onClick={onClose} className="w-full py-3 text-gray-500 text-sm hover:text-gray-300 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [anime,    setAnime]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [mailOpen, setMailOpen] = useState(false);

  // fetch from API every 30s
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch("/api/anime");
        const json = await res.json();
        if (json.ok) setAnime(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // featured first, then top by views
  const top5 = [...anime]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.views ?? 0) - (a.views ?? 0);
    })
    .slice(0, 5);

  // group by first letter (filtered)
  const sections = anime
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
    .reduce((acc, a) => {
      const L = a.title[0].toUpperCase();
      (acc[L] = acc[L] || []).push(a);
      return acc;
    }, {});

  const sortedSections = Object.entries(sections).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="min-h-screen max-w-sm mx-auto" style={{ background: "#0D1117", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(13,17,23,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-black text-black text-sm">A</div>
          <span className="text-white font-black text-base">अनिलॉट</span>
        </div>
        <button onClick={() => setMailOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold"
          style={{ background: "rgba(255,255,255,0.08)" }}>
          <span>✉️</span>
          <span className="text-white">Mail</span>
          <span className="text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center"
            style={{ background: "#3B82F6" }}>
            {MAILS.filter(m => m.unread).length}
          </span>
        </button>
      </div>

      <div style={{ overflowY: "auto", scrollbarWidth: "none" }}>
        <p className="text-center text-blue-400 text-sm font-semibold py-3">✦ Discover Your Favourite Anime ✦</p>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && anime.length === 0 && (
          <div className="text-center py-20 px-8">
            <div className="text-5xl mb-3">🎌</div>
            <p className="text-white font-bold text-base">No anime found</p>
            <p className="text-gray-500 text-sm mt-1">Add anime using the bot</p>
          </div>
        )}

        {/* Slider */}
        {!loading && top5.length > 0 && <FeaturedSlider list={top5} onSelect={setSelected} />}

        {/* Search */}
        {!loading && anime.length > 0 && (
          <div className="px-4 mt-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search anime..."
                className="w-full pl-9 pr-9 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
                style={{ background: "#141B2D", border: "1px solid rgba(255,255,255,0.07)" }} />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">✕</button>
              )}
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="mt-5 pb-10">
          {sortedSections.map(([letter, list]) => (
            <div key={letter} className="mb-5">
              <div className="flex items-center gap-3 px-4 mb-3">
                <span className="text-white font-black text-lg">{letter}</span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,rgba(0,180,255,0.5),transparent)" }} />
              </div>
              <div className="flex gap-2.5 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: "none" }}>
                {list.map(a => <AnimeCard key={a._id} anime={a} onClick={setSelected} />)}
              </div>
            </div>
          ))}

          {!loading && anime.length > 0 && sortedSections.length === 0 && (
            <div className="text-center py-20 px-8">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-white font-bold">No results for "{search}"</p>
              <p className="text-gray-500 text-sm mt-1">Try a different title</p>
            </div>
          )}
        </div>
      </div>

      {selected && <DetailModal anime={selected} onClose={() => setSelected(null)} />}
      {mailOpen  && <MailPanel onClose={() => setMailOpen(false)} />}
    </div>
  );
}
