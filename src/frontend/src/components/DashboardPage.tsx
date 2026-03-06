import {
  Activity,
  Bot,
  ChevronRight,
  Clock,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Send,
  Settings,
  Shield,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage, UserProfile, UserStats } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type DashboardTab = "overview" | "chat" | "settings";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: bigint;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function mapChatMessage(m: ChatMessage, idx: number): Message {
  return {
    id: String(idx),
    content: m.content,
    role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
    timestamp: m.timestamp,
  };
}

// ─── Chat Interface (reused in dashboard) ────────────────────────────────────
function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { actor, isFetching } = useActor();

  useEffect(() => {
    if (actor && !isFetching) {
      actor
        .getChatHistory()
        .then((history) => {
          if (history && history.length > 0) {
            setMessages(history.map(mapChatMessage));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [actor, isFetching]);

  const msgCount = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgCount]);

  const handleSend = async () => {
    if (!input.trim() || !actor || sending) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    try {
      const response = await actor.sendMessage(userMsg.content);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: response.content,
          role: "assistant",
          timestamp: response.timestamp,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Sorry, something went wrong. Please try again.",
          role: "assistant",
          timestamp: BigInt(Date.now()) * BigInt(1_000_000),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
        style={{ scrollbarWidth: "thin" }}
      >
        {loading ? (
          <div
            data-ocid="dashboard.chat.loading_state"
            className="flex items-center justify-center h-full"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div
            data-ocid="dashboard.chat.empty_state"
            className="flex flex-col items-center justify-center h-full gap-4 text-center"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: "oklch(0.55 0.22 278 / 0.1)",
                border: "1px solid oklch(0.55 0.22 278 / 0.2)",
              }}
            >
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Start a Conversation
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Ask Prashant AI anything — it's here to help you build smarter.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg.id}
              data-ocid={`dashboard.chat.item.${i + 1}`}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" ? "btn-gradient" : ""
                }`}
                style={
                  msg.role === "assistant"
                    ? {
                        background: "oklch(0.55 0.22 278 / 0.15)",
                        border: "1px solid oklch(0.55 0.22 278 / 0.3)",
                      }
                    : undefined
                }
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
              <div
                className={`max-w-[70%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-tr-sm text-white"
                      : "rounded-tl-sm text-foreground"
                  }`}
                  style={
                    msg.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.55 0.24 278), oklch(0.55 0.2 220))",
                        }
                      : {
                          background: "oklch(0.14 0.022 270)",
                          border: "1px solid oklch(0.22 0.03 270 / 0.6)",
                        }
                  }
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "oklch(0.55 0.22 278 / 0.15)",
                border: "1px solid oklch(0.55 0.22 278 / 0.3)",
              }}
            >
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-sm"
              style={{
                background: "oklch(0.14 0.022 270)",
                border: "1px solid oklch(0.22 0.03 270 / 0.6)",
              }}
            >
              <div className="flex gap-1.5 items-center">
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="px-6 py-4 border-t"
        style={{ borderColor: "oklch(0.20 0.03 270 / 0.6)" }}
      >
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{
            background: "oklch(0.13 0.022 270)",
            border: "1px solid oklch(0.25 0.04 270 / 0.8)",
          }}
        >
          <input
            type="text"
            data-ocid="dashboard.chat.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Prashant AI..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            disabled={sending}
          />
          <button
            type="button"
            data-ocid="dashboard.chat.submit_button"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-9 h-9 rounded-lg btn-gradient flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────────────────────────
interface OverviewTabProps {
  profile: UserProfile | null;
  stats: UserStats | null;
  recentMessages: Message[];
  onNewChat: () => void;
}

function OverviewTab({
  profile,
  stats,
  recentMessages,
  onNewChat,
}: OverviewTabProps) {
  return (
    <div
      className="px-6 py-6 space-y-6 overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* Welcome card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.05 278), oklch(0.15 0.04 220))",
          border: "1px solid oklch(0.55 0.22 278 / 0.3)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl"
          style={{ background: "oklch(0.65 0.24 278)" }}
        />
        <h2 className="text-xl font-bold text-foreground mb-1 relative">
          Welcome back,{" "}
          <span className="text-gradient">
            {profile?.displayName ?? "User"}
          </span>
          !
        </h2>
        <p className="text-sm text-muted-foreground relative">
          Here's your account overview for today.
        </p>
        <div className="flex gap-3 mt-4 relative">
          <button
            type="button"
            data-ocid="dashboard.overview.primary_button"
            onClick={onNewChat}
            className="btn-gradient px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            New Chat
          </button>
          <button
            type="button"
            data-ocid="dashboard.overview.secondary_button"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 hover:bg-white/10"
            style={{
              border: "1px solid oklch(0.35 0.06 270)",
              color: "oklch(0.80 0.01 270)",
            }}
          >
            <Settings className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Messages",
            value: stats ? String(stats.totalMessages) : "0",
            icon: MessageSquare,
            color: "oklch(0.65 0.22 278)",
            ocid: "dashboard.stats.card.1",
          },
          {
            label: "Account Status",
            value: stats?.accountStatus ? "Active" : "Inactive",
            icon: Activity,
            color: stats?.accountStatus
              ? "oklch(0.65 0.18 160)"
              : "oklch(0.65 0.18 30)",
            ocid: "dashboard.stats.card.2",
          },
          {
            label: "Member Since",
            value: stats ? formatDate(stats.joinedDate).split(",")[0] : "—",
            icon: Clock,
            color: "oklch(0.68 0.18 220)",
            ocid: "dashboard.stats.card.3",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            data-ocid={stat.ocid}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${stat.color} / 0.12`,
                    border: `1px solid ${stat.color} / 0.25`,
                    backgroundColor: `color-mix(in oklch, ${stat.color} 12%, transparent)`,
                    borderColor: `color-mix(in oklch, ${stat.color} 25%, transparent)`,
                  }}
                >
                  <stat.icon
                    className="w-4 h-4"
                    style={{ color: stat.color }}
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        className="glass-card rounded-xl"
      >
        <div
          className="px-5 py-4 border-b"
          style={{ borderColor: "oklch(0.22 0.03 270 / 0.6)" }}
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Conversations
          </h3>
        </div>
        <div
          className="divide-y"
          style={{ borderColor: "oklch(0.18 0.025 270 / 0.5)" }}
        >
          {recentMessages.length === 0 ? (
            <div
              data-ocid="dashboard.overview.empty_state"
              className="px-5 py-8 text-center"
            >
              <p className="text-sm text-muted-foreground">
                No recent conversations yet.{" "}
                <button
                  type="button"
                  onClick={onNewChat}
                  className="text-primary hover:underline"
                >
                  Start chatting!
                </button>
              </p>
            </div>
          ) : (
            recentMessages.slice(0, 5).map((msg, i) => (
              <div
                key={msg.id}
                data-ocid={`dashboard.overview.item.${i + 1}`}
                className="px-5 py-3 flex items-start gap-3 hover:bg-white/3 transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={
                    msg.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.55 0.24 278), oklch(0.55 0.2 220))",
                        }
                      : {
                          background: "oklch(0.55 0.22 278 / 0.15)",
                          border: "1px solid oklch(0.55 0.22 278 / 0.3)",
                        }
                  }
                >
                  {msg.role === "user" ? (
                    <User className="w-3 h-3 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {msg.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
interface SettingsTabProps {
  profile: UserProfile | null;
  principalId: string;
}

function SettingsTab({ profile, principalId }: SettingsTabProps) {
  return (
    <div
      className="px-6 py-6 space-y-4 overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        data-ocid="dashboard.settings.card"
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold btn-gradient">
            {profile?.displayName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {profile?.displayName ?? "User"}
            </h3>
            <span
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full mt-1"
              style={{
                background: "oklch(0.65 0.18 160 / 0.15)",
                border: "1px solid oklch(0.65 0.18 160 / 0.3)",
                color: "oklch(0.75 0.18 160)",
              }}
            >
              <Activity className="w-3 h-3" />
              {profile?.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              label: "Display Name",
              value: profile?.displayName ?? "User",
              icon: Users,
            },
            {
              label: "Account Status",
              value: profile?.isActive ? "Active" : "Inactive",
              icon: Shield,
            },
            {
              label: "Member Since",
              value: profile?.joinedDate ? formatDate(profile.joinedDate) : "—",
              icon: Clock,
            },
          ].map((field) => (
            <div
              key={field.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "oklch(0.13 0.02 270)" }}
            >
              <field.icon className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm text-foreground font-medium truncate">
                  {field.value}
                </p>
              </div>
            </div>
          ))}

          {/* Principal ID */}
          <div
            className="px-4 py-3 rounded-xl"
            style={{ background: "oklch(0.13 0.02 270)" }}
          >
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Principal ID
            </p>
            <p
              data-ocid="dashboard.settings.panel"
              className="text-xs text-primary/80 font-mono break-all leading-relaxed"
            >
              {principalId}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
interface DashboardPageProps {
  onNavigateHome: () => void;
}

export default function DashboardPage({ onNavigateHome }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const { identity, clear } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const principalId = identity?.getPrincipal().toString() ?? "";

  // Redirect if not logged in
  useEffect(() => {
    if (!identity || identity.getPrincipal().isAnonymous()) {
      onNavigateHome();
    }
  }, [identity, onNavigateHome]);

  // Load data on mount
  useEffect(() => {
    if (!actor || isFetching) return;
    setLoadingData(true);
    Promise.all([
      actor.getCallerUserProfile(),
      actor.getUserStats(),
      actor.getChatHistory(),
    ])
      .then(([p, s, h]) => {
        setProfile(p);
        setStats(s);
        if (h && h.length > 0) {
          setRecentMessages(h.map(mapChatMessage));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [actor, isFetching]);

  const sidebarLinks: {
    id: DashboardTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    ocid: string;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      ocid: "dashboard.nav.overview.link",
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageSquare,
      ocid: "dashboard.nav.chat.link",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      ocid: "dashboard.nav.settings.link",
    },
  ];

  const handleLogout = () => {
    clear();
    onNavigateHome();
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.07 0.01 270)" }}
    >
      {/* Sidebar (desktop) */}
      <aside
        className="hidden md:flex flex-col w-64 flex-shrink-0 border-r"
        style={{
          background: "oklch(0.09 0.015 270)",
          borderColor: "oklch(0.18 0.028 270)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-5 py-5 border-b"
          style={{ borderColor: "oklch(0.18 0.028 270)" }}
        >
          <button
            type="button"
            data-ocid="dashboard.nav.home.link"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center btn-gradient">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              Prashant<span className="text-gradient"> Ltd</span>
            </span>
          </button>
        </div>

        {/* User info */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: "oklch(0.18 0.028 270)" }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold btn-gradient flex-shrink-0">
            {profile?.displayName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {profile?.displayName ?? "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {principalId.slice(0, 18)}...
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              data-ocid={link.ocid}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === link.id
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
              style={
                activeTab === link.id
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.45 0.22 278 / 0.5), oklch(0.45 0.2 220 / 0.5))",
                      border: "1px solid oklch(0.55 0.22 278 / 0.35)",
                    }
                  : undefined
              }
            >
              <link.icon className="w-4 h-4" />
              {link.label}
              {activeTab === link.id && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="p-3 border-t"
          style={{ borderColor: "oklch(0.18 0.028 270)" }}
        >
          <button
            type="button"
            data-ocid="dashboard.logout.button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "oklch(0.09 0.015 270)",
          borderColor: "oklch(0.18 0.028 270)",
        }}
      >
        <button
          type="button"
          data-ocid="dashboard.nav.home.link"
          onClick={onNavigateHome}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center btn-gradient">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-foreground">
            Prashant<span className="text-gradient"> Ltd</span>
          </span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {sidebarLinks.find((l) => l.id === activeTab)?.label}
          </span>
          <button
            type="button"
            data-ocid="dashboard.nav.toggle"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close nav"
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="absolute left-0 top-0 bottom-0 w-64 flex flex-col border-r"
              style={{
                background: "oklch(0.09 0.015 270)",
                borderColor: "oklch(0.18 0.028 270)",
              }}
            >
              <div className="px-4 py-4 space-y-1 mt-4">
                {sidebarLinks.map((link) => (
                  <button
                    type="button"
                    key={link.id}
                    data-ocid={link.ocid}
                    onClick={() => {
                      setActiveTab(link.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === link.id
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                    style={
                      activeTab === link.id
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(0.45 0.22 278 / 0.5), oklch(0.45 0.2 220 / 0.5))",
                            border: "1px solid oklch(0.55 0.22 278 / 0.35)",
                          }
                        : undefined
                    }
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </button>
                ))}
              </div>
              <div className="mt-auto p-4">
                <button
                  type="button"
                  data-ocid="dashboard.logout.button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen md:min-h-0 pt-14 md:pt-0">
        {/* Content header */}
        <div
          className="hidden md:flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "oklch(0.18 0.028 270)" }}
        >
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {activeTab === "overview" && "Overview"}
              {activeTab === "chat" && "AI Chat"}
              {activeTab === "settings" && "Settings"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeTab === "overview" && "Your account at a glance"}
              {activeTab === "chat" && "Chat with Prashant AI"}
              {activeTab === "settings" && "Your account information"}
            </p>
          </div>
          <button
            type="button"
            data-ocid="dashboard.logout.button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loadingData ? (
            <div
              data-ocid="dashboard.loading_state"
              className="flex items-center justify-center flex-1"
            >
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading your dashboard...
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-y-auto"
                >
                  <OverviewTab
                    profile={profile}
                    stats={stats}
                    recentMessages={recentMessages}
                    onNewChat={() => setActiveTab("chat")}
                  />
                </motion.div>
              )}
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <ChatInterface />
                </motion.div>
              )}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-y-auto"
                >
                  <SettingsTab profile={profile} principalId={principalId} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
