import { Button } from "@/components/ui/button";
import {
  Film,
  Fingerprint,
  Monitor,
  Shield,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface VideoEditorLoginProps {
  onLogin: () => void;
  onGuest: () => void;
}

export default function VideoEditorLogin({
  onLogin,
  onGuest,
}: VideoEditorLoginProps) {
  const handleLogin = () => {
    localStorage.setItem("meena_logged_in", "true");
    localStorage.setItem("meena_user", "Creator");
    onLogin();
  };

  const handleGuest = () => {
    localStorage.removeItem("meena_logged_in");
    localStorage.removeItem("meena_user");
    onGuest();
  };

  const steps = [
    {
      icon: Monitor,
      label: 'Click "Login" below',
      desc: "Start the secure login process",
    },
    {
      icon: Fingerprint,
      label: "Authenticate",
      desc: "Use fingerprint, Face ID, or PIN",
    },
    { icon: Film, label: "Start Editing", desc: "Full access to all tools" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "oklch(0.08 0.02 270)",
      }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "oklch(0.50 0.25 305)" }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "oklch(0.55 0.22 200)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: "oklch(0.60 0.30 260)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2.5 mb-5 px-4 py-2 rounded-full"
            style={{
              background: "oklch(0.14 0.04 305 / 0.6)",
              border: "1px solid oklch(0.30 0.10 305 / 0.4)",
            }}
          >
            <Sparkles
              className="w-4 h-4"
              style={{ color: "oklch(0.75 0.20 305)" }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: "oklch(0.75 0.20 305)" }}
            >
              Meena Video Editor
            </span>
          </div>
          <h1
            className="text-4xl font-bold tracking-tight mb-3"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "oklch(0.95 0.02 270)",
            }}
          >
            Welcome Back
          </h1>
          <p className="text-base" style={{ color: "oklch(0.60 0.04 270)" }}>
            Sign in to access your projects and tools
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "oklch(0.11 0.02 270 / 0.8)",
            border: "1px solid oklch(0.22 0.04 270 / 0.6)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 64px oklch(0.05 0.01 270 / 0.8)",
          }}
        >
          {/* Steps */}
          <div className="space-y-3 mb-8">
            {steps.map((step, idx) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 rounded-xl px-4 py-3"
                style={{
                  background: "oklch(0.14 0.025 270 / 0.5)",
                  border: "1px solid oklch(0.20 0.03 270 / 0.4)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "oklch(0.18 0.06 305 / 0.5)",
                    border: "1px solid oklch(0.30 0.10 305 / 0.3)",
                  }}
                >
                  <step.icon
                    className="w-4 h-4"
                    style={{ color: "oklch(0.72 0.18 305)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.90 0.03 270)" }}
                  >
                    {idx + 1}. {step.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.03 270)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main login button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleLogin}
              data-ocid="login.primary_button"
              className="w-full h-12 text-base font-semibold rounded-xl transition-all duration-200"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.25 305), oklch(0.50 0.22 260))",
                color: "white",
                border: "none",
                boxShadow: "0 4px 20px oklch(0.50 0.25 305 / 0.35)",
              }}
            >
              <Shield className="w-4.5 h-4.5 mr-2" />
              Login with Internet Identity
            </Button>
          </motion.div>

          <div className="flex items-center gap-3 my-5">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.20 0.02 270)" }}
            />
            <span className="text-xs" style={{ color: "oklch(0.45 0.03 270)" }}>
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.20 0.02 270)" }}
            />
          </div>

          <Button
            onClick={handleGuest}
            data-ocid="login.secondary_button"
            variant="outline"
            className="w-full h-10 text-sm rounded-xl"
            style={{
              background: "oklch(0.13 0.02 270 / 0.5)",
              border: "1px solid oklch(0.25 0.04 270 / 0.5)",
              color: "oklch(0.65 0.04 270)",
            }}
          >
            <User className="w-4 h-4 mr-2" />
            Continue as Guest
          </Button>

          {/* Security note */}
          <div
            className="mt-6 rounded-xl px-4 py-3 flex items-start gap-3"
            style={{
              background: "oklch(0.12 0.03 200 / 0.4)",
              border: "1px solid oklch(0.22 0.06 200 / 0.3)",
            }}
          >
            <Zap
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: "oklch(0.70 0.18 200)" }}
            />
            <p
              className="text-xs leading-relaxed"
              style={{ color: "oklch(0.55 0.05 200)" }}
            >
              Internet Identity is a secure, passwordless login. No email or
              password needed — authenticate with your device biometrics or PIN.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: "oklch(0.35 0.02 270)" }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.55 0.10 305)" }}
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
