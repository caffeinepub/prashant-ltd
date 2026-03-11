import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Film,
  Layers,
  MessageSquare,
  Mic,
  Music,
  Play,
  Scissors,
  Sparkles,
  Star,
  Type,
  Upload,
  Video,
  Volume2,
  Wand2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface LandingPageProps {
  onOpenEditor: () => void;
  onDashboard?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const FEATURES = [
  {
    icon: Music,
    title: "Add Music",
    desc: "Layer background tracks — lo-fi, cinematic, upbeat — or upload your own audio file.",
    color: "oklch(0.62 0.22 305)",
  },
  {
    icon: Type,
    title: "Text Overlays",
    desc: "Add animated titles, subtitles, and captions with custom fonts, sizes and colors.",
    color: "oklch(0.65 0.20 260)",
  },
  {
    icon: Volume2,
    title: "Audio Enhance",
    desc: "Boost voice clarity, reduce background noise, and balance audio levels automatically.",
    color: "oklch(0.60 0.22 330)",
  },
  {
    icon: Film,
    title: "Video Filters",
    desc: "Apply cinematic filters — Warm, Vintage, B&W, Vivid — with adjustable intensity.",
    color: "oklch(0.65 0.18 200)",
  },
  {
    icon: Scissors,
    title: "Trim & Cut",
    desc: "Precisely trim your video with a timeline editor. Set in and out points visually.",
    color: "oklch(0.68 0.18 150)",
  },
  {
    icon: Download,
    title: "Export HD",
    desc: "Export in 720p or 1080p MP4/WebM. Fast render with no watermarks on Pro.",
    color: "oklch(0.62 0.22 305)",
  },
];

const CAROUSEL_FEATURES = [
  {
    icon: Layers,
    title: "Brand Kit",
    desc: "Save your brand colors, fonts, and logos. Apply them instantly across all your projects.",
    color: "oklch(0.65 0.22 270)",
    tag: "Branding",
  },
  {
    icon: Film,
    title: "Templates",
    desc: "Start with 8+ professionally designed video templates for any content type.",
    color: "oklch(0.62 0.22 305)",
    tag: "Quick Start",
  },
  {
    icon: Sparkles,
    title: "Elements",
    desc: "Add shapes, stickers, lines, borders, and decorative elements to your canvas.",
    color: "oklch(0.68 0.20 75)",
    tag: "Design",
  },
  {
    icon: Wand2,
    title: "Background",
    desc: "Choose from solid colors, stunning gradients, and geometric patterns for your backdrop.",
    color: "oklch(0.60 0.22 195)",
    tag: "Visual",
  },
  {
    icon: Zap,
    title: "Apps & Effects",
    desc: "Video effects, animation presets, avatars, and auto-subtitle tools in one panel.",
    color: "oklch(0.65 0.24 45)",
    tag: "Effects",
  },
  {
    icon: Sparkles,
    title: "Magic Media",
    desc: "AI-powered media generation UI — create images, graphics, and 3D assets from prompts.",
    color: "oklch(0.60 0.26 305)",
    tag: "AI",
  },
  {
    icon: Upload,
    title: "Uploads",
    desc: "Drag & drop your images, videos, and audio files. Manage all your media in one place.",
    color: "oklch(0.65 0.18 150)",
    tag: "Media",
  },
  {
    icon: Video,
    title: "Chroma Key",
    desc: "Green screen / chroma key tool with color picker, similarity, and spill reduction controls.",
    color: "oklch(0.62 0.22 145)",
    tag: "VFX",
  },
  {
    icon: Music,
    title: "Audio Library",
    desc: "Browse 100+ tracks across Lo-Fi, Bollywood, Jazz, K-Pop, Synthwave, and more genres.",
    color: "oklch(0.60 0.22 330)",
    tag: "Audio",
  },
  {
    icon: Mic,
    title: "Record Voiceover",
    desc: "Record your voice directly in the browser with one click. Instant playback and preview.",
    color: "oklch(0.65 0.20 260)",
    tag: "Voice",
  },
  {
    icon: Volume2,
    title: "Generate AI Voice",
    desc: "Type any text and convert to natural speech. Choose from Natural, News Anchor, Storyteller styles.",
    color: "oklch(0.62 0.22 305)",
    tag: "AI",
  },
  {
    icon: Download,
    title: "File Converter",
    desc: "Convert PDF, PNG, JPG, MP4, MP3, Excel, Word, PowerPoint files right in the editor.",
    color: "oklch(0.65 0.18 200)",
    tag: "Tools",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbox",
    desc: "Smart command-based assistant — type what you want and it applies the best edits automatically.",
    color: "oklch(0.60 0.24 270)",
    tag: "AI",
  },
  {
    icon: Zap,
    title: "Export HD",
    desc: "Export in 720p or 1080p MP4/WebM with fast render. No watermarks on Pro plan.",
    color: "oklch(0.68 0.20 75)",
    tag: "Export",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload Your Video",
    desc: "Drop any MP4, MOV or WebM file. We support up to 4K source files.",
    icon: Upload,
  },
  {
    step: "02",
    title: "Add Effects",
    desc: "Apply music, text overlays, filters, and audio enhancements in real-time.",
    icon: Wand2,
  },
  {
    step: "03",
    title: "Export & Share",
    desc: "Render your video at full quality and download or share instantly.",
    icon: Play,
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "Perfect for casual creators",
    features: [
      "Upload up to 3 videos",
      "Basic filters (5 presets)",
      "Text overlays (2 items)",
      "720p export",
      "5 preset music tracks",
      "Meena watermark",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    desc: "For serious content creators",
    features: [
      "Unlimited video uploads",
      "All 8 filters + custom intensity",
      "Unlimited text overlays",
      "1080p HD export",
      "30+ music tracks + upload own",
      "No watermark",
      "Audio enhance & noise reduction",
      "Priority support",
    ],
    cta: "Start Pro — $9.99/mo",
    highlighted: true,
  },
];

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "YouTuber, 180K subs",
    text: "Meena cut my editing time in half. The audio enhancement feature alone is worth it — my videos sound studio-quality now.",
    stars: 5,
  },
  {
    name: "Priya Nair",
    role: "Instagram Reels Creator",
    text: "I was using CapCut before but Meena's filter system is smoother and the music tracks are way more varied. Love it!",
    stars: 5,
  },
  {
    name: "Rohit Verma",
    role: "Wedding Videographer",
    text: "The cinematic filters + trim tool combo makes highlight reels super fast to produce. My clients are impressed.",
    stars: 5,
  },
];

const FAQ = [
  {
    q: "Do I need to install any software?",
    a: "No — Meena runs entirely in your browser. Just upload your video and start editing instantly.",
  },
  {
    q: "What video formats are supported?",
    a: "We support MP4, MOV, WebM, and AVI. Output is available in MP4 or WebM format.",
  },
  {
    q: "Is my video stored on your servers?",
    a: "No. All processing happens locally in your browser. Your videos never leave your device.",
  },
  {
    q: "Can I use Meena on mobile?",
    a: "Yes! Meena is fully responsive and works great on iOS and Android browsers.",
  },
  {
    q: "How do I cancel my Pro subscription?",
    a: "You can cancel anytime from your account settings. No hidden fees or penalties.",
  },
];

// ─── Features Carousel ────────────────────────────────────────────────────────
function FeaturesCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = CAROUSEL_FEATURES.length;

  // Visible cards count based on window width
  const [visibleCount, setVisibleCount] = useState(3);
  useEffect(() => {
    function update() {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = total - visibleCount;

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(goNext, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, goNext]);

  // Recalculate maxIndex when visibleCount changes
  useEffect(() => {
    setCurrent((prev) => Math.min(prev, total - visibleCount));
  }, [visibleCount, total]);

  const visibleItems = CAROUSEL_FEATURES.slice(current, current + visibleCount);

  return (
    <section
      className="py-24 px-4 sm:px-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.07 0.008 280) 0%, oklch(0.09 0.012 285) 50%, oklch(0.07 0.008 280) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp}>
            <Badge
              className="mb-4 px-4 py-1.5 text-sm"
              style={{
                background: "oklch(0.58 0.22 270 / 0.15)",
                border: "1px solid oklch(0.58 0.22 270 / 0.4)",
                color: "oklch(0.80 0.16 270)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
              All Features
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl font-bold mb-4"
          >
            Everything You Need to <span className="text-gradient">Create</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            From AI-powered tools to professional editing features — Meena gives
            you the complete creative studio.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            data-ocid="features.carousel.panel"
          >
            {/* Cards container */}
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current}
                  initial={{ x: direction * 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction * -60, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid gap-5"
                  style={{
                    gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
                  }}
                >
                  {visibleItems.map((feat, idx) => {
                    const globalIdx = current + idx;
                    return (
                      <div
                        key={`${feat.title}-${globalIdx}`}
                        data-ocid={`features.carousel.item.${globalIdx + 1}`}
                        className="group relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] cursor-default"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.13 0.02 280 / 0.9), oklch(0.10 0.015 290 / 0.8))",
                          border: `1px solid ${feat.color}30`,
                          backdropFilter: "blur(16px)",
                          boxShadow: `0 4px 40px ${feat.color}12, inset 0 1px 0 oklch(1 0 0 / 0.04)`,
                        }}
                      >
                        {/* Glow orb */}
                        <div
                          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity"
                          style={{
                            background: feat.color,
                            filter: "blur(40px)",
                            transform: "translate(30%, -30%)",
                          }}
                        />

                        {/* Icon + tag row */}
                        <div className="flex items-start justify-between relative z-10">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                            style={{
                              background: `${feat.color}18`,
                              border: `1px solid ${feat.color}35`,
                              boxShadow: `0 0 24px ${feat.color}20`,
                            }}
                          >
                            <feat.icon
                              className="w-5 h-5"
                              style={{ color: feat.color }}
                            />
                          </div>
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              background: `${feat.color}15`,
                              color: feat.color,
                              border: `1px solid ${feat.color}30`,
                            }}
                          >
                            {feat.tag}
                          </span>
                        </div>

                        {/* Text */}
                        <div className="relative z-10">
                          <h3 className="font-display font-bold text-lg mb-1.5 text-foreground">
                            {feat.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {feat.desc}
                          </p>
                        </div>

                        {/* Bottom accent line */}
                        <div
                          className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${feat.color}60, transparent)`,
                          }}
                        />
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prev / Next arrows */}
            <button
              type="button"
              onClick={goPrev}
              data-ocid="features.carousel.prev_button"
              className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 hidden sm:flex"
              style={{
                background: "oklch(0.14 0.025 280)",
                border: "1px solid oklch(0.28 0.04 280)",
                boxShadow: "0 4px 20px oklch(0 0 0 / 0.4)",
              }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={goNext}
              data-ocid="features.carousel.next_button"
              className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 hidden sm:flex"
              style={{
                background: "oklch(0.14 0.025 280)",
                border: "1px solid oklch(0.28 0.04 280)",
                boxShadow: "0 4px 20px oklch(0 0 0 / 0.4)",
              }}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Mobile arrows */}
          <div className="flex sm:hidden justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={goPrev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "oklch(0.14 0.025 280)",
                border: "1px solid oklch(0.28 0.04 280)",
              }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "oklch(0.14 0.025 280)",
                border: "1px solid oklch(0.28 0.04 280)",
              }}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {CAROUSEL_FEATURES.slice(0, maxIndex + 1).map((feat, i) => (
              <button
                key={feat.title}
                type="button"
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === current ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    i === current
                      ? "oklch(0.65 0.22 270)"
                      : "oklch(0.30 0.03 280)",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          {/* Pause indicator */}
          {paused && (
            <p className="text-center text-xs text-muted-foreground mt-3 opacity-60">
              Paused — move cursor away to resume
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Navbar({
  onOpenEditor,
  onDashboard,
}: { onOpenEditor: () => void; onDashboard?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40"
      style={{
        background: "oklch(0.07 0.008 280 / 0.92)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/generated/meena-logo.dim_80x80.png"
            alt="Meena"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="font-display text-xl font-bold tracking-tight">
            Meena<span className="text-gradient"> Editor</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="px-3 py-2 rounded-lg hover:text-foreground hover:bg-white/5 transition-colors"
              data-ocid={`nav.${item.toLowerCase().replace(/ /g, "-")}.link`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {onDashboard && (
            <Button
              onClick={onDashboard}
              data-ocid="nav.dashboard.button"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              Dashboard
            </Button>
          )}
          <Button
            onClick={onOpenEditor}
            data-ocid="nav.open_editor.button"
            className="btn-gradient text-white font-semibold px-5 rounded-xl border-0 hidden sm:flex"
          >
            Open Editor
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-muted-foreground"
            data-ocid="nav.mobile.toggle"
          >
            <span className="sr-only">Menu</span>
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden border-t border-border/40 px-4 py-3 space-y-1"
          style={{ background: "oklch(0.08 0.01 280)" }}
        >
          {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              {item}
            </a>
          ))}
          <Button
            onClick={onOpenEditor}
            className="btn-gradient text-white w-full mt-2 border-0"
          >
            Open Editor
          </Button>
        </div>
      )}
    </header>
  );
}

export default function LandingPage({
  onOpenEditor,
  onDashboard,
}: LandingPageProps) {
  return (
    <div className="relative">
      <Navbar onOpenEditor={onOpenEditor} onDashboard={onDashboard} />

      {/* Hero */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Background mesh */}
        <div className="absolute inset-0 hero-mesh" />
        {/* Hero image at low opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/meena-hero-bg.dim_1200x600.jpg')",
            opacity: 0.1,
            mixBlendMode: "luminosity",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.07 0.008 280))",
          }}
        />
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "oklch(0.52 0.22 270 / 0.12)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "oklch(0.50 0.24 305 / 0.10)",
            filter: "blur(50px)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: "oklch(0.55 0.20 195 / 0.08)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{
            duration: 11,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="space-y-6"
          >
            <motion.div variants={fadeUp}>
              <Badge
                className="mb-4 px-4 py-1.5 text-sm font-medium"
                style={{
                  background: "oklch(0.58 0.22 305 / 0.15)",
                  border: "1px solid oklch(0.58 0.22 305 / 0.4)",
                  color: "oklch(0.80 0.18 305)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                Professional Video Editing in Your Browser
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.02] tracking-tight"
            >
              Edit Videos <br className="hidden sm:block" />
              <span className="text-gradient">Like a Pro</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Add music, overlay text, enhance audio, apply cinematic filters —
              all inside your browser. No downloads. No complexity. Just
              results.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
            >
              <Button
                size="lg"
                onClick={onOpenEditor}
                data-ocid="hero.start_editing.button"
                className="btn-gradient glow-primary text-white text-base font-semibold px-8 rounded-xl border-0 h-13"
              >
                <Film className="w-5 h-5 mr-2" />
                Start Editing Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                data-ocid="hero.watch_demo.button"
                className="border-border/60 text-foreground hover:bg-white/5 text-base px-8 rounded-xl h-13"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4"
            >
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" /> No installation
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" /> Free forever plan
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" /> Privacy-first
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge
                className="mb-4"
                style={{
                  background: "oklch(0.58 0.22 305 / 0.12)",
                  border: "1px solid oklch(0.58 0.22 305 / 0.3)",
                  color: "oklch(0.75 0.18 305)",
                }}
              >
                Everything You Need
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl font-bold mb-4"
            >
              Powerful Editing Tools
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              From quick social clips to cinematic short films — Meena has every
              tool you need.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Card
                  className="glass h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-glow group"
                  style={{ borderColor: "oklch(0.22 0.025 280 / 0.6)" }}
                >
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `${f.color}1A`,
                        border: `1px solid ${f.color}40`,
                        boxShadow: `0 0 20px ${f.color}20`,
                      }}
                    >
                      <f.icon
                        className="w-5.5 h-5.5"
                        style={{ color: f.color }}
                      />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Auto-Sliding All Features Carousel */}
      <FeaturesCarousel />

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6"
        style={{ background: "oklch(0.09 0.01 280)" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl font-bold mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg"
            >
              Three simple steps to your perfect video.
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute hidden lg:block top-12 left-[16.66%] right-[16.66%] h-px"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.58 0.22 305 / 0.5), oklch(0.52 0.25 280 / 0.5))",
              }}
            />

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10"
            >
              {HOW_IT_WORKS.map((step) => (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div
                    className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center glow-sm relative"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.20 0.04 305), oklch(0.15 0.02 280))",
                      border: "1px solid oklch(0.35 0.08 305 / 0.5)",
                    }}
                  >
                    <step.icon
                      className="w-9 h-9"
                      style={{ color: "oklch(0.72 0.20 305)" }}
                    />
                    <span
                      className="absolute -top-3 -right-3 font-mono text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "oklch(0.58 0.22 305)",
                        color: "white",
                      }}
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl font-bold mb-4"
            >
              Loved by Creators
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {TESTIMONIALS.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card
                  className="glass h-full"
                  style={{ borderColor: "oklch(0.22 0.025 280 / 0.6)" }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {[1, 2, 3, 4, 5].slice(0, t.stars).map((n) => (
                        <Star
                          key={n}
                          className="w-4 h-4 fill-current"
                          style={{ color: "oklch(0.78 0.18 75)" }}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      "{t.text}"
                    </p>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-24 px-4 sm:px-6"
        style={{ background: "oklch(0.09 0.01 280)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl font-bold mb-4"
            >
              Simple Pricing
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg"
            >
              Start free. Upgrade when you're ready to go pro.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {PRICING.map((plan) => (
              <motion.div key={plan.name} variants={fadeUp}>
                <Card
                  className="h-full relative overflow-hidden"
                  style={{
                    background: plan.highlighted
                      ? "linear-gradient(160deg, oklch(0.15 0.04 305), oklch(0.12 0.02 280))"
                      : "oklch(0.10 0.012 280)",
                    border: plan.highlighted
                      ? "1px solid oklch(0.58 0.22 305 / 0.5)"
                      : "1px solid oklch(0.20 0.02 280)",
                    boxShadow: plan.highlighted
                      ? "0 0 40px oklch(0.58 0.22 305 / 0.2)"
                      : "none",
                  }}
                >
                  {plan.highlighted && (
                    <div
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ background: "oklch(0.58 0.22 305)" }}
                    >
                      <Zap className="w-3 h-3 inline mr-1" />
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-7">
                    <h3 className="font-display text-2xl font-bold mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-5">
                      {plan.desc}
                    </p>
                    <div className="flex items-end gap-1 mb-7">
                      <span className="font-display text-5xl font-extrabold">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground mb-2">
                        {plan.period}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <Check
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{
                              color: plan.highlighted
                                ? "oklch(0.72 0.20 305)"
                                : "oklch(0.55 0.15 305)",
                            }}
                          />
                          <span
                            className={
                              plan.highlighted
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={onOpenEditor}
                      data-ocid={`pricing.${plan.name.toLowerCase()}.button`}
                      className={`w-full rounded-xl h-11 font-semibold ${
                        plan.highlighted
                          ? "btn-gradient text-white border-0"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl font-bold mb-4"
            >
              Frequently Asked
            </motion.h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="rounded-xl px-1 border"
                style={{ borderColor: "oklch(0.20 0.02 280)" }}
                data-ocid={`faq.item.${i + 1}`}
              >
                <AccordionTrigger className="px-4 py-4 font-semibold hover:no-underline text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center rounded-2xl p-12 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.16 0.04 305), oklch(0.12 0.025 280))",
              border: "1px solid oklch(0.35 0.08 305 / 0.4)",
              boxShadow: "0 0 60px oklch(0.58 0.22 305 / 0.15)",
            }}
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Start Editing Today
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join 50,000+ creators. No credit card required.
            </p>
            <Button
              size="lg"
              onClick={onOpenEditor}
              data-ocid="cta.open_editor.button"
              className="btn-gradient glow-primary text-white text-base font-semibold px-10 rounded-xl border-0 h-13"
            >
              <Film className="w-5 h-5 mr-2" />
              Open Meena Editor
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-border/40 py-10 px-4 sm:px-6"
        style={{ background: "oklch(0.07 0.008 280)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/generated/meena-logo.dim_80x80.png"
              alt="Meena"
              className="w-7 h-7 rounded-lg object-cover"
            />
            <span className="font-display font-bold">Meena Editor</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <a href="/#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="/#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="/#" className="hover:text-foreground transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
