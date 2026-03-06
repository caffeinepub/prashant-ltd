import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Menu,
  MessageSquare,
  Play,
  Plug,
  Shield,
  Sliders,
  Sparkles,
  Star,
  Twitter,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// ─── Smooth scroll helper ───────────────────────────────────────────────────
function useSmoothScroll() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return scrollTo;
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollTo = useSmoothScroll();

  // Track scroll for navbar appearance
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Pricing", id: "pricing" },
    { label: "About", id: "about" },
    { label: "FAQ", id: "faq" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
        style={{
          background: scrolled ? "oklch(0.09 0.015 270 / 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid oklch(0.22 0.03 270 / 0.6)"
            : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center btn-gradient"
              style={{ flexShrink: 0 }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Prashant<span className="text-gradient"> Ltd</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <button
                type="button"
                key={link.id}
                data-ocid={`nav.link.${i + 1}`}
                onClick={() => scrollTo(link.id)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA removed */}

          {/* Mobile hamburger */}
          <button
            type="button"
            data-ocid="nav.toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 flex flex-col"
              style={{
                background: "oklch(0.09 0.015 270)",
                borderLeft: "1px solid oklch(0.22 0.03 270)",
              }}
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-bold text-foreground">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col p-4 gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <button
                    type="button"
                    key={link.id}
                    data-ocid={`nav.link.${i + 1}`}
                    onClick={() => {
                      scrollTo(link.id);
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              {/* Mobile CTA removed */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const scrollTo = useSmoothScroll();

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-mesh overflow-hidden pt-20">
      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.8 0.02 270) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.8 0.02 270) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
        style={{ background: "oklch(0.45 0.2 278)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          background: "oklch(0.45 0.18 220)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="badge-gradient inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Introducing Prashant Ltd — The Future of AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.08]"
        >
          Build Smarter Apps
          <br />
          <span className="text-gradient">Powered by AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The most powerful AI assistant platform for modern teams. Deploy
          intelligent features in minutes, not months. Trusted by 10,000+
          developers worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={() => scrollTo("pricing")}
            className="btn-gradient px-8 py-4 rounded-xl text-base font-semibold text-white flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-ocid="hero.secondary_button"
            onClick={() => scrollTo("how-it-works")}
            className="flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold border w-full sm:w-auto justify-center transition-all hover:bg-white/5"
            style={{
              borderColor: "oklch(0.3 0.05 270)",
              color: "oklch(0.85 0.01 270)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.55 0.22 278 / 0.15)",
                border: "1px solid oklch(0.55 0.22 278 / 0.3)",
              }}
            >
              <Play className="w-3.5 h-3.5 text-primary" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-20 flex flex-wrap justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "10K+", label: "Active Users" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "50M+", label: "Queries Processed" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, oklch(0.08 0.012 270))",
        }}
      />
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Smart, context-aware responses powered by state-of-the-art large language models, fine-tuned for your domain.",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Sub-200ms median response times at any scale. Our global edge infrastructure guarantees speed worldwide.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "SOC 2 Type II certified, end-to-end encrypted, with GDPR and HIPAA compliance built in from day one.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Plug,
      title: "Deep Integrations",
      description:
        "Connect seamlessly with 100+ tools and APIs including Slack, Notion, Salesforce, GitHub, and more.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Real-time usage dashboards, query logs, performance metrics, and AI-powered insights at your fingertips.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Sliders,
      title: "Fully Customizable",
      description:
        "Tailor every aspect: tone, persona, knowledge base, response format, and UI to match your brand perfectly.",
      gradient: "from-indigo-500 to-violet-500",
    },
  ];

  return (
    <section id="features" className="section-padding section-mesh-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge-gradient inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <Zap className="w-3.5 h-3.5" />
            Platform Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Everything you need to{" "}
            <span className="text-gradient">ship AI</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete toolkit for building, deploying, and scaling AI-powered
            features — without the infrastructure headaches.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="glass-card glass-card-hover rounded-2xl p-6 h-full">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "oklch(0.55 0.22 278 / 0.12)",
                    border: "1px solid oklch(0.55 0.22 278 / 0.25)",
                  }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ─────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Users,
      title: "Sign Up",
      description:
        "Create your free account in under 30 seconds. No credit card required.",
    },
    {
      number: "02",
      icon: Sliders,
      title: "Configure",
      description:
        "Set up your AI assistant's persona, knowledge base, and response parameters.",
    },
    {
      number: "03",
      icon: Plug,
      title: "Integrate",
      description:
        "Connect your existing tools, data sources, and APIs with one-click integrations.",
    },
    {
      number: "04",
      icon: Activity,
      title: "Deploy",
      description:
        "Launch your AI assistant and scale from prototype to millions of users instantly.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="section-padding"
      style={{ background: "oklch(0.06 0.01 270)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge-gradient inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <ChevronRight className="w-3.5 h-3.5" />
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            From zero to AI in <span className="text-gradient">four steps</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our streamlined onboarding gets your AI assistant live in minutes,
            not weeks.
          </p>
        </motion.div>

        {/* Steps — horizontal on desktop */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div
            className="hidden lg:block absolute top-16 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.55 0.22 278 / 0.5), oklch(0.55 0.2 220 / 0.5))",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse-glow"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.45 0.22 278), oklch(0.45 0.2 220))",
                      zIndex: 1,
                    }}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: "oklch(0.45 0.22 278)",
                      fontSize: "10px",
                    }}
                  >
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>

                {/* Mobile connector */}
                {i < steps.length - 1 && (
                  <div
                    className="sm:hidden mt-6 w-px h-8"
                    style={{
                      background:
                        "linear-gradient(to bottom, oklch(0.55 0.22 278 / 0.5), transparent)",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────────
function PricingSection() {
  const scrollTo = useSmoothScroll();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for individuals exploring AI capabilities.",
      ocid: "pricing.free_button",
      popular: false,
      features: [
        "100 queries per month",
        "1 active project",
        "Community support",
        "Basic analytics",
        "Standard response speed",
        "API access",
      ],
      cta: "Start for Free",
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For professionals who need more power and flexibility.",
      ocid: "pricing.pro_button",
      popular: true,
      features: [
        "Unlimited queries",
        "10 active projects",
        "Priority email support",
        "Advanced analytics dashboard",
        "Custom integrations (100+)",
        "Faster response speed",
        "Custom AI personas",
        "Webhook support",
      ],
      cta: "Get Pro",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large teams needing security, scale, and compliance.",
      ocid: "pricing.enterprise_button",
      popular: false,
      features: [
        "Everything in Pro",
        "Unlimited projects",
        "Dedicated account manager",
        "99.99% SLA guarantee",
        "On-premise deployment",
        "SSO & SAML support",
        "Custom data retention",
        "Compliance reporting",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="section-padding section-mesh-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge-gradient inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <Award className="w-3.5 h-3.5" />
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free, upgrade when you need. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-full"
            >
              <div
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular ? "gradient-border glow-violet" : "glass-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap btn-gradient">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                        style={{
                          background: "oklch(0.55 0.22 278 / 0.15)",
                        }}
                      >
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  data-ocid={plan.ocid}
                  onClick={() => scrollTo("contact")}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? "btn-gradient text-white"
                      : "border hover:bg-white/5 text-foreground"
                  }`}
                  style={
                    !plan.popular
                      ? { borderColor: "oklch(0.3 0.05 270)" }
                      : undefined
                  }
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechCorp",
      initials: "SC",
      stars: 5,
      quote:
        "Prashant Ltd transformed how our team builds AI features. What used to take months now takes hours. The developer experience is unmatched — clean APIs, great docs, and support that actually responds.",
      color: "oklch(0.55 0.22 278)",
    },
    {
      name: "Marcus Johnson",
      role: "Founder at StartupXYZ",
      initials: "MJ",
      stars: 5,
      quote:
        "The speed and reliability is unmatched. We've processed over 2 million queries without a single outage. The analytics dashboard gives us insights we never had before. Worth every penny.",
      color: "oklch(0.55 0.2 220)",
    },
    {
      name: "Priya Patel",
      role: "Head of Engineering at ScaleUp",
      initials: "PP",
      stars: 5,
      quote:
        "We went from prototype to production in days, not months. The enterprise security features gave our compliance team peace of mind, and the on-premise option sealed the deal for us.",
      color: "oklch(0.6 0.18 160)",
    },
  ];

  return (
    <section
      id="testimonials"
      className="section-padding"
      style={{ background: "oklch(0.06 0.01 270)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge-gradient inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <Star className="w-3.5 h-3.5" />
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Loved by <span className="text-gradient">engineering teams</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of developers and companies already building with
            Prashant Ltd.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="glass-card glass-card-hover rounded-2xl p-6 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].slice(0, t.stars).map((n) => (
                    <Star
                      key={n}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FAQSection() {
  const faqs = [
    {
      question: "What is Prashant Ltd?",
      answer:
        "Prashant Ltd is a comprehensive AI assistant platform that enables developers and businesses to build, deploy, and scale AI-powered features. We provide the infrastructure, APIs, and tools so you can focus on building great products.",
    },
    {
      question: "How does pricing work?",
      answer:
        "We offer a generous free tier with 100 queries/month. Our Pro plan at $29/month includes unlimited queries and advanced features. Enterprise pricing is custom based on volume, SLA requirements, and deployment options.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Yes! Our free plan includes 100 queries per month, 1 active project, API access, and community support. No credit card required to get started. You can upgrade or downgrade at any time.",
    },
    {
      question: "How secure is my data?",
      answer:
        "Security is our top priority. We are SOC 2 Type II certified, use end-to-end encryption for all data in transit and at rest, and comply with GDPR, HIPAA, and CCPA. Enterprise customers can opt for on-premise deployment for complete data sovereignty.",
    },
    {
      question: "Can I integrate with my existing tools?",
      answer:
        "Absolutely. Prashant Ltd supports 100+ native integrations including Slack, Notion, Salesforce, GitHub, Jira, Zendesk, and more. We also provide a comprehensive REST API and webhook support for custom integrations.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "Free users get access to our community forum and documentation. Pro users receive priority email support with a 24-hour SLA. Enterprise customers get a dedicated account manager, 24/7 phone support, and custom SLA agreements.",
    },
  ];

  return (
    <section id="faq" className="section-padding section-mesh-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge-gradient inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <MessageSquare className="w-3.5 h-3.5" />
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Frequently asked <span className="text-gradient">questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Can't find what you're looking for? Reach out to our support team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={`item-${i + 1}`}
                data-ocid={`faq.item.${i + 1}`}
                className="glass-card rounded-xl border-0 px-5"
              >
                <AccordionTrigger className="text-left text-foreground font-semibold hover:no-underline py-5 text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  const pillars = [
    {
      icon: Zap,
      title: "Innovation First",
      description:
        "We push the boundaries of what's possible with AI, constantly shipping new capabilities and improvements.",
    },
    {
      icon: Shield,
      title: "Reliability at Scale",
      description:
        "Our infrastructure is battle-tested across billions of queries, with a 99.9% uptime guarantee.",
    },
    {
      icon: Users,
      title: "Customer-First",
      description:
        "Every decision we make starts with our customers. Your success is our mission.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "99.9%", label: "Uptime", icon: Activity },
    { value: "50M+", label: "Queries Processed", icon: Brain },
    { value: "4.9/5", label: "Customer Rating", icon: Star },
  ];

  return (
    <section
      id="about"
      className="section-padding"
      style={{ background: "oklch(0.06 0.01 270)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-gradient inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              About Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Democratizing{" "}
              <span className="text-gradient">AI for everyone</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Founded in 2024, Prashant Ltd was born from a simple observation:
              building AI-powered products was needlessly complex, expensive,
              and time-consuming. We set out to change that.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Today, we're a team of engineers, researchers, and builders united
              by a mission to make AI accessible to every developer and company
              — from solo founders to Fortune 500 enterprises.
            </p>

            {/* Value pillars */}
            <div className="space-y-4">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "oklch(0.55 0.22 278 / 0.12)",
                      border: "1px solid oklch(0.55 0.22 278 / 0.25)",
                    }}
                  >
                    <pillar.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="glass-card rounded-2xl p-6 text-center glass-card-hover">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: "oklch(0.55 0.22 278 / 0.12)",
                      border: "1px solid oklch(0.55 0.22 278 / 0.25)",
                    }}
                  >
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const nameRef = useRef<HTMLInputElement>(null);
  const { actor } = useActor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("loading");
    try {
      if (actor) {
        await actor.addContactMessage(form.name, form.email, form.message);
      }
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent! We'll get back to you within 24 hours.");
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="section-padding section-mesh-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge-gradient inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <Mail className="w-3.5 h-3.5" />
            Contact
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Get in <span className="text-gradient">touch</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have a question or ready to get started? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  data-ocid="contact.success_state"
                  className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[400px]"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "oklch(0.55 0.18 160 / 0.15)" }}
                  >
                    <CheckCircle2
                      className="w-8 h-8"
                      style={{ color: "oklch(0.65 0.18 160)" }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Thanks for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="btn-gradient px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="glass-card rounded-2xl p-6 sm:p-8 space-y-5"
                >
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Your Name
                    </label>
                    <Input
                      id="contact-name"
                      ref={nameRef}
                      data-ocid="contact.input"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      className="bg-input/50 border-border/60 focus:border-primary/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email Address
                    </label>
                    <Input
                      id="contact-email"
                      data-ocid="contact.email_input"
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                      className="bg-input/50 border-border/60 focus:border-primary/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Message
                    </label>
                    <Textarea
                      id="contact-message"
                      data-ocid="contact.textarea"
                      placeholder="Tell us about your project or ask a question..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      required
                      rows={5}
                      className="bg-input/50 border-border/60 focus:border-primary/60 resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div
                      data-ocid="contact.error_state"
                      className="text-sm text-red-400 text-center"
                    >
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    data-ocid="contact.submit_button"
                    disabled={status === "loading"}
                    className="btn-gradient w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2
                          data-ocid="contact.loading_state"
                          className="w-4 h-4 animate-spin"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Support details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {[
              {
                icon: Mail,
                title: "Email Support",
                line1: "hello@prashantltd.ai",
                line2: "For general inquiries and support",
              },
              {
                icon: Clock,
                title: "Response Time",
                line1: "< 24 hours",
                line2: "Pro users: < 4 hours, Enterprise: < 1 hour",
              },
              {
                icon: MessageSquare,
                title: "Live Chat",
                line1: "Available 9am–6pm UTC",
                line2: "Real-time help from our team",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="glass-card rounded-xl p-5 flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "oklch(0.55 0.22 278 / 0.12)",
                      border: "1px solid oklch(0.55 0.22 278 / 0.25)",
                    }}
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {item.title}
                    </h4>
                    <p className="text-foreground/80 text-sm mt-0.5">
                      {item.line1}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {item.line2}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social links */}
            <div className="glass-card rounded-xl p-5">
              <h4 className="font-semibold text-foreground text-sm mb-4">
                Follow us
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, label: "Twitter" },
                  { icon: Github, label: "GitHub" },
                  { icon: Linkedin, label: "LinkedIn" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="https://prashantltd.ai"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-white/10"
                    style={{ border: "1px solid oklch(0.22 0.03 270)" }}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = useSmoothScroll();
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  const cols = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Integrations", "Changelog"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press"],
    },
    {
      title: "Resources",
      links: ["Docs", "API Reference", "Status", "Community"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Cookie Policy", "Security"],
    },
  ];

  const anchorMap: Record<string, string> = {
    Features: "features",
    Pricing: "pricing",
    About: "about",
  };

  return (
    <footer
      className="border-t"
      style={{
        background: "oklch(0.06 0.01 270)",
        borderColor: "oklch(0.16 0.025 270)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center btn-gradient">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold">
                Prashant<span className="text-gradient"> Ltd</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-xs">
              The AI assistant platform that helps engineering teams ship
              smarter products, faster.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Twitter, label: "Twitter" },
                { Icon: Github, label: "GitHub" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="https://prashantltd.ai"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-white/5"
                  style={{ border: "1px solid oklch(0.22 0.03 270)" }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <h5 className="text-sm font-semibold text-foreground mb-4">
                {col.title}
              </h5>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    {anchorMap[link] ? (
                      <button
                        type="button"
                        onClick={() => scrollTo(anchorMap[link])}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: "oklch(0.16 0.025 270)" }}
        >
          <p className="text-sm text-muted-foreground">
            © {year} Prashant Ltd. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              className="hover:text-foreground transition-colors underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
