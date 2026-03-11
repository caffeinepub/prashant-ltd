import {
  Fingerprint,
  KeyRound,
  Loader2,
  Shield,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginPageProps {
  onNavigateHome: () => void;
}

export default function LoginPage({ onNavigateHome }: LoginPageProps) {
  const { login, isLoggingIn } = useInternetIdentity();

  const steps = [
    {
      icon: Sparkles,
      title: "Click 'Login with Internet Identity'",
      description:
        "A secure login popup will open. This is powered by ICP blockchain.",
    },
    {
      icon: Fingerprint,
      title: "Use Fingerprint, Face ID or Passkey",
      description:
        "No password needed. Use your device's built-in security (fingerprint or face unlock).",
    },
    {
      icon: Shield,
      title: "You're in!",
      description:
        "Your account is secured and private. No email or password is stored.",
    },
  ];

  const devices = [
    { label: "Android", note: "Fingerprint or PIN" },
    { label: "iPhone / iPad", note: "Face ID or Touch ID" },
    { label: "Windows PC", note: "Windows Hello or Security Key" },
    { label: "Mac", note: "Touch ID or Passkey" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.08 0.012 270)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-5 border-b"
        style={{ borderColor: "oklch(0.16 0.025 270)" }}
      >
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5"
          data-ocid="login.home.link"
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center btn-gradient">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            Meena<span className="text-gradient"> Video Editor</span>
          </span>
        </button>

        <button
          type="button"
          onClick={onNavigateHome}
          data-ocid="login.back.button"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Home
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Login card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="rounded-2xl p-8"
              style={{
                background: "oklch(0.11 0.018 270)",
                border: "1px solid oklch(0.22 0.03 270)",
              }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 btn-gradient">
                <KeyRound className="w-7 h-7 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome to Meena Video Editor
              </h1>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Use your account or create a new one. No password required —
                login is secured by Internet Identity.
              </p>

              {/* Login button */}
              <button
                type="button"
                data-ocid="login.primary_button"
                onClick={login}
                disabled={isLoggingIn}
                className="btn-gradient w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-3 text-base disabled:opacity-60 disabled:cursor-not-allowed mb-4"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5" />
                    Login with Internet Identity
                  </>
                )}
              </button>

              {isLoggingIn && (
                <motion.div
                  data-ocid="login.loading_state"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-muted-foreground py-2"
                >
                  A popup has opened. Please complete login there.
                </motion.div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div
                  className="flex-1 h-px"
                  style={{ background: "oklch(0.22 0.03 270)" }}
                />
                <span className="text-xs text-muted-foreground">
                  Secured by ICP Blockchain
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "oklch(0.22 0.03 270)" }}
                />
              </div>

              {/* Privacy note */}
              <p className="text-center text-xs text-muted-foreground leading-relaxed">
                By continuing, you agree to our{" "}
                <span className="text-primary/80">Terms of Use</span> and{" "}
                <span className="text-primary/80">Privacy Policy</span>.
                <br />
                No email or password is stored — ever.
              </p>
            </div>

            {/* Device compatibility */}
            <div
              className="mt-5 rounded-xl p-5"
              style={{
                background: "oklch(0.11 0.018 270)",
                border: "1px solid oklch(0.22 0.03 270)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Works on all devices
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {devices.map((d) => (
                  <div
                    key={d.label}
                    className="rounded-lg px-3 py-2"
                    style={{ background: "oklch(0.14 0.02 270)" }}
                  >
                    <div className="text-xs font-semibold text-foreground">
                      {d.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {d.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: How it works */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-5"
          >
            <div>
              <span className="badge-gradient inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
                <Shield className="w-3 h-3" />
                How to Login
              </span>
              <h2 className="text-xl font-bold text-foreground mb-1">
                3 simple steps
              </h2>
              <p className="text-sm text-muted-foreground">
                Internet Identity is the most secure way to login — no
                passwords, no data leaks.
              </p>
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              >
                <div
                  className="rounded-xl p-5 flex items-start gap-4"
                  style={{
                    background: "oklch(0.11 0.018 270)",
                    border: "1px solid oklch(0.22 0.03 270)",
                  }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center btn-gradient">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <div
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: "oklch(0.45 0.22 278)",
                        fontSize: "10px",
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Info card */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "oklch(0.45 0.22 278 / 0.08)",
                border: "1px solid oklch(0.55 0.22 278 / 0.25)",
              }}
            >
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">
                    Why no Google / Email login?
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This website runs on the ICP blockchain. Internet Identity
                    is a blockchain-based login that is more secure than Google
                    or email -- your data is never stored on any central server
                    and cannot be hacked or leaked.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
