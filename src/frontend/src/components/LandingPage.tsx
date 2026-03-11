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
  ChevronRight,
  Download,
  Film,
  Music,
  Play,
  Scissors,
  Sparkles,
  Star,
  Type,
  Upload,
  Volume2,
  Wand2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

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
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/meena-hero-bg.dim_1200x600.jpg')",
            opacity: 0.18,
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.35 0.12 305 / 0.25) 0%, transparent 70%), radial-gradient(ellipse at bottom, oklch(0.07 0.008 280) 60%, transparent 100%)",
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
              className="font-display text-5xl sm:text-7xl font-extrabold leading-[1.05] tracking-tight"
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

      {/* Features */}
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
                  className="glass h-full transition-all duration-300 hover:scale-[1.02] group"
                  style={{ borderColor: "oklch(0.22 0.025 280 / 0.6)" }}
                >
                  <CardContent className="p-6">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: `${f.color}22`,
                        border: `1px solid ${f.color}44`,
                      }}
                    >
                      <f.icon className="w-5 h-5" style={{ color: f.color }} />
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
