import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  Infinity as InfinityIcon,
  Loader2,
  Lock,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface UpgradePageProps {
  onNavigateHome: () => void;
  onPaymentSuccess?: () => void;
}

const PRO_FEATURES = [
  "Unlimited queries",
  "10 active projects",
  "Priority email support",
  "Advanced analytics dashboard",
  "Custom integrations (100+)",
  "Faster response speed",
  "Custom AI personas",
  "Webhook support",
];

type PaymentState = "idle" | "loading" | "success" | "error";

export default function UpgradePage({
  onNavigateHome,
  onPaymentSuccess,
}: UpgradePageProps) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const principalId = identity?.getPrincipal().toString() ?? "";
  const shortId =
    principalId.length > 20
      ? `${principalId.slice(0, 10)}...${principalId.slice(-6)}`
      : principalId;

  const handleSubscribe = async () => {
    if (!actor) {
      setErrorMessage("Not connected. Please refresh and try again.");
      setPaymentState("error");
      return;
    }

    setPaymentState("loading");
    setErrorMessage("");

    try {
      await actor.updateAccountStatus(true);
      // Invalidate the userStats query so useSubscription re-reads from backend
      await queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setPaymentState("success");

      // After 2 seconds, redirect to dashboard
      setTimeout(() => {
        onPaymentSuccess?.();
      }, 2000);
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("Payment failed. Please try again.");
      setPaymentState("error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16"
      style={{ background: "oklch(0.08 0.012 270)" }}
    >
      {/* Background mesh */}
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
        className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.45 0.22 278)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/6 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.45 0.18 220)" }}
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            type="button"
            data-ocid="upgrade.back_button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-center mb-8"
        >
          {/* Crown badge */}
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.45 0.22 278), oklch(0.45 0.18 220))",
                boxShadow: "0 0 40px oklch(0.55 0.22 278 / 0.4)",
              }}
            >
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Upgrade to <span className="text-gradient">Pro</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto">
            Unlock unlimited access to all features and power up your workflow.
          </p>
        </motion.div>

        {/* Pro Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div
            className="relative rounded-2xl p-8 gradient-border glow-violet"
            data-ocid="upgrade.panel"
          >
            {/* Most Popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap btn-gradient">
              Most Popular
            </div>

            {/* Plan info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Pro Plan</h2>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-foreground">$29</span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
              <p className="text-muted-foreground text-sm">
                For professionals who need more power and flexibility.
              </p>
            </div>

            {/* Features list */}
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.55 0.22 278 / 0.15)" }}
                  >
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Subscribe CTA — animated states */}
            <AnimatePresence mode="wait">
              {paymentState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  data-ocid="upgrade.success_state"
                  className="w-full rounded-xl py-5 flex flex-col items-center justify-center gap-3"
                  style={{
                    background: "oklch(0.18 0.06 160 / 0.25)",
                    border: "1px solid oklch(0.55 0.18 160 / 0.4)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.55 0.18 160 / 0.15)" }}
                  >
                    <CheckCircle2
                      className="w-8 h-8"
                      style={{ color: "oklch(0.65 0.18 160)" }}
                    />
                  </motion.div>
                  <div className="text-center">
                    <p
                      className="font-bold text-lg"
                      style={{ color: "oklch(0.75 0.18 160)" }}
                    >
                      Payment Successful!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Welcome to Pro! Redirecting to your dashboard...
                    </p>
                  </div>
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: "oklch(0.65 0.18 160)" }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <button
                    type="button"
                    data-ocid="upgrade.subscribe_button"
                    onClick={handleSubscribe}
                    disabled={paymentState === "loading"}
                    className="w-full btn-gradient py-4 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {paymentState === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <CreditCard className="w-5 h-5" />
                        Subscribe Now — $29/month
                      </>
                    )}
                  </button>

                  {/* Error state */}
                  {paymentState === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      data-ocid="upgrade.error_state"
                      className="text-center text-sm text-red-400"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  {/* Trust signal */}
                  <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    Secure payment powered by Stripe. Cancel anytime.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Admin note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 rounded-xl px-5 py-4 flex items-start gap-3"
          style={{
            background: "oklch(0.13 0.025 270)",
            border: "1px solid oklch(0.22 0.03 270 / 0.6)",
          }}
        >
          <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs text-muted-foreground font-medium">
              Admin accounts have free unlimited access.
            </p>
            {principalId && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  Logged in as:
                </span>
                <code className="text-xs font-mono text-primary/80 break-all">
                  {shortId}
                </code>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-xs text-muted-foreground">
                <InfinityIcon className="w-3 h-3 inline mr-0.5 text-primary" />
                Unlimited — no usage limits on Pro plan
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
