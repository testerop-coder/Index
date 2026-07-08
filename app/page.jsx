"use client";
import { useState, useEffect, useRef } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = n =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M"
  : n >= 1000    ? (n / 1000).toFixed(1) + "K"
  : String(n ?? 0);

const GC = {
  ACTION:       "bg-red-500/20 text-red-400 border-red-500/30",
  FANTASY:      "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ROMANCE:      "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "SCI-FI":     "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  ADVENTURE:    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ISEKAI:       "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  DARK:         "bg-gray-500/20 text-gray-300 border-gray-500/30",
  MAGIC:        "bg-violet-500/20 text-violet-400 border-violet-500/30",
  NINJA:        "bg-lime-500/20 text-lime-400 border-lime-500/30",
  MECHA:        "bg-teal-500/20 text-teal-400 border-teal-500/30",
  THRILLER:     "bg-rose-500/20 text-rose-400 border-rose-500/30",
  SCHOOL:       "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SUPERNATURAL: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  PSYCH:        "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  SPORTS:       "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  COMEDY:       "bg-green-500/20 text-green-400 border-green-500/30",
};

const BTN_COLORS = [
  "linear-gradient(135deg,#FF2D2D,#A30000)",
  "linear-gradient(135deg,#7C3AED,#5B21B6)",
  "linear-gradient(135deg,#059669,#047857)",
  "linear-gradient(135deg,#D97706,#B45309)",
  "linear-gradient(135deg,#2563EB,#1D4ED8)",
];

// ── Crunchyroll-style full-bleed slider ─────────────────────────────────────
function CrunchySlider({ list, onSelect }) {
  const [cur, setCur] = useState(0);
  const timer  = useRef(null);
  const touchX = useRef(null);
  const n = list.length;

  const go = i => setCur(((i % n) + n) % n);
  const resetTimer = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setCur(c => (c + 1) % n), 5000);
  };
  useEffect(() => { resetTimer(); return () => clearInterval(timer.current); }, [n]);
  if (!n) return null;

  const a = list[cur];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 460 }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current !== null) {
          const d = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) { go(cur + (d > 0 ? 1 : -1)); resetTimer(); }
          touchX.current = null;
        }
      }}
    >
      {/* Full bleed image */}
      {a.image_url ? (
        <img
          src={a.image_url} alt={a.title} key={a._id}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: "fadeIn 0.6s ease" }}
          onError={e => { e.target.style.opacity = 0; }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg,#3a0a0a,#0A0606)" }}>
          <span style={{ fontSize: 200, fontWeight: 900, color: "rgba(255,45,45,0.06)" }}>{a.title[0]}</span>
        </div>
      )}

      {/* Gradient fade to black at bottom */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top, #0A0606 0%, rgba(10,6,6,0.85) 22%, rgba(10,6,6,0.15) 55%, transparent 75%)"
      }} />
      {/* Top fade for header readability */}
      <div className="absolute top-0 left-0 right-0 h-24" style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)"
      }} />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
        <h2 className="text-white font-black leading-none mb-2 tracking-tight"
          style={{ fontSize: 28, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
          {a.title}
        </h2>
        <p className="text-gray-300 text-xs mb-4">
          {(a.genres || []).join(", ")}
        </p>
        <div className="flex gap-2">
          <button onClick={() => onSelect(a)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-black text-sm active:scale-95 transition-transform"
            style={{ background: "#FF2D2D", color: "white", letterSpacing: 0.5 }}>
            ▶ START WATCHING
          </button>
          <button onClick={() => onSelect(a)}
            className="w-14 flex items-center justify-center rounded-lg active:scale-95 transition-transform"
            style={{ border: "2px solid #FF2D2D" }}>
            <span style={{ color: "#FF2D2D", fontSize: 18 }}>🔖</span>
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1.5">
        {list.map((_, j) => (
          <div key={j} onClick={() => { go(j); resetTimer(); }}
            style={{
              width: j === cur ? 18 : 6, height: 6, borderRadius: 3,
              background: j === cur ? "#FF2D2D" : "rgba(255,255,255,0.35)",
              transition: "all .3s", cursor: "pointer"
            }} />
        ))}
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}

// ── Anime Card ────────────────────────────────────────────────────────────────
function AnimeCard({ anime, onClick }) {
  return (
    <div onClick={() => onClick(anime)}
      className="relative flex-shrink-0 w-36 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform duration-150"
      style={{ height: 215, background: "#1A0F0F", border: "1px solid rgba(255,45,45,0.12)" }}>
      {anime.image_url ? (
        <img src={anime.image_url} alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => { e.target.style.display = "none"; }} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(180deg,#2a0808,#0A0606)" }}>
          <span style={{ fontSize: 80, fontWeight: 900, color: "rgba(255,45,45,0.08)" }}>{anime.title[0]}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex flex-wrap gap-1 mb-1.5">
          {(anime.genres || []).slice(0, 1).map(g => (
            <span key={g} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${GC[g] || "bg-red-500/20 text-red-400 border-red-500/30"}`}>{g}</span>
          ))}
        </div>
        <p className="text-white text-xs font-bold leading-tight line-clamp-2 mb-1.5">{anime.title}</p>
      </div>
    </div>
  );
}

// ── Centered-Poster Detail Modal ─────────────────────────────────────────────
function DetailModal({ anime, onClose }) {
  if (!anime) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }} />

      <div className="relative w-full max-w-xs flex flex-col items-center text-center max-h-[90vh] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
        onClick={e => e.stopPropagation()}>

        {/* Poster card */}
        <div className="rounded-2xl overflow-hidden mb-5 flex-shrink-0"
          style={{
            width: 190, height: 260,
            background: "#1A0F0F",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,45,45,0.2)"
          }}>
          {anime.image_url ? (
            <img src={anime.image_url} alt={anime.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.opacity = 0.15; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(180deg,#2a0808,#0A0606)" }}>
              <span style={{ fontSize: 90, fontWeight: 900, color: "rgba(255,45,45,0.1)" }}>{anime.title[0]}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-white font-black text-2xl mb-3 px-2" style={{ letterSpacing: -0.5 }}>
          "{anime.title}"
        </h2>

        {/* Genres */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {(anime.genres || []).map(g => (
            <span key={g} className={`text-xs font-bold px-3 py-1 rounded-full border ${GC[g] || "bg-red-500/20 text-red-400 border-red-500/30"}`}>{g}</span>
          ))}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5 pb-4">
          {(anime.buttons && anime.buttons.length > 0) ? (
            anime.buttons.map((btn, i) => (
              <button key={i}
                onClick={() => { if (btn.link) window.open(btn.link, "_blank", "noopener,noreferrer"); }}
                onContextMenu={e => e.preventDefault()}
                className="w-full py-3.5 rounded-full text-sm font-black text-white text-center active:scale-95 transition-transform select-none"
                style={{ background: BTN_COLORS[i % BTN_COLORS.length] }}>
                ▶ {btn.name}
              </button>
            ))
          ) : (
            <button
              onClick={() => { if (anime.watch_link) window.open(anime.watch_link, "_blank", "noopener,noreferrer"); }}
              onContextMenu={e => e.preventDefault()}
              className="w-full py-3.5 rounded-full text-sm font-black text-white text-center active:scale-95 transition-transform select-none"
              style={{ background: BTN_COLORS[0] }}>
              ▶ Watch Now
            </button>
          )}
          <button onClick={onClose}
            className="w-full py-3 rounded-full text-sm font-bold text-gray-400 mt-1 active:scale-95 transition-transform"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mail Panel ────────────────────────────────────────────────────────────────
const MAILS = [
  { text: "New anime added!",        unread: true  },
  { text: "Backup complete",         unread: true  },
  { text: "Website updated",         unread: false },
  { text: "Welcome to अनिलॉट!",       unread: false },
];

function MailPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: "#1A0F0F", border: "1px solid rgba(255,45,45,0.15)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
          <span className="text-white font-bold">Inbox</span>
          <span className="text-gray-500 text-sm">{MAILS.length} messages</span>
        </div>
        {MAILS.map((m, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: m.unread ? "#FF2D2D" : "transparent", border: m.unread ? "none" : "1px solid #374151" }} />
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

  const featuredAnime = anime.filter(a => a.featured);
  const sliderList = featuredAnime.length > 0
    ? featuredAnime.sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    : [...anime].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5);

  const sections = anime
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
    .reduce((acc, a) => {
      const L = a.title[0].toUpperCase();
      (acc[L] = acc[L] || []).push(a);
      return acc;
    }, {});

  const sortedSections = Object.entries(sections).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="min-h-screen max-w-sm mx-auto" style={{ background: "#0A0606", fontFamily: "'Inter', sans-serif" }}>

      {/* Header floats over slider */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3" style={{ background: "transparent" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center font-black text-white text-sm">A</div>
          <span className="text-white font-black text-base" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Anilot Hindi</span>
        </div>
        <button
          onClick={() => window.open("https://t.me/Paiid_Ads_bot", "_blank", "noopener,noreferrer")}
          onContextMenu={e => e.preventDefault()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl select-none"
          style={{ background: "rgba(0,0,0,0.4)" }}>
          <span className="text-sm">🛟</span>
          <span className="text-white text-sm font-semibold">Support</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
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

      {/* Slider — pulled up under header */}
      {!loading && sliderList.length > 0 && (
        <div style={{ marginTop: -56 }}>
          <CrunchySlider list={sliderList} onSelect={setSelected} />
        </div>
      )}

      <div style={{ overflowY: "auto", scrollbarWidth: "none" }}>
        {/* Search */}
        {!loading && anime.length > 0 && (
          <div className="px-4 mt-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search anime..."
                className="w-full pl-9 pr-9 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
                style={{ background: "#1A0F0F", border: "1px solid rgba(255,45,45,0.15)" }} />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">✕</button>
              )}
            </div>
          </div>
        )}

        {/* Ongoing Anime button */}
        {!loading && anime.length > 0 && (
          <div className="px-4 mt-3">
            <button
              onClick={() => window.open("https://t.me/langda_aambot?start=req_LTEwMDI5MzI3NTczMDk", "_blank", "noopener,noreferrer")}
              onContextMenu={e => e.preventDefault()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white active:scale-95 transition-transform select-none"
              style={{ background: "linear-gradient(135deg,#2AABEE,#229ED9)" }}>
              <span style={{ fontSize: 16 }}>📨</span>
              Ongoing Anime
            </button>
          </div>
        )}

        {/* Sections */}
        <div className="mt-5 pb-10">
          {sortedSections.map(([letter, list]) => (
            <div key={letter} className="mb-5">
              <div className="flex items-center gap-3 px-4 mb-3">
                <span className="text-white font-black text-lg">{letter}</span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,rgba(255,45,45,0.5),transparent)" }} />
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
    </div>
  );
  }
            
