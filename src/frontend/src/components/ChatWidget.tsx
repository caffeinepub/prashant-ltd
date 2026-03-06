import { Bot, Loader2, MessageSquare, Send, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

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

function mapChatMessage(m: ChatMessage, idx: number): Message {
  return {
    id: String(idx),
    content: m.content,
    role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
    timestamp: m.timestamp,
  };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  // Load chat history when widget opens and user is logged in
  useEffect(() => {
    if (open && isLoggedIn && actor && !isFetching) {
      setLoadingHistory(true);
      actor
        .getChatHistory()
        .then((history) => {
          if (history && history.length > 0) {
            setMessages(history.map(mapChatMessage));
          }
        })
        .catch(() => {})
        .finally(() => setLoadingHistory(false));
    }
  }, [open, isLoggedIn, actor, isFetching]);

  // Scroll to bottom when message count changes
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
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: "assistant",
        timestamp: response.timestamp,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, something went wrong. Please try again.",
        role: "assistant",
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      };
      setMessages((prev) => [...prev, errMsg]);
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
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        data-ocid="chat.toggle"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center btn-gradient focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
        style={{
          boxShadow: "0 8px 32px oklch(0.55 0.24 278 / 0.5)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="chat.panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] sm:w-[400px] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              height: "500px",
              background: "oklch(0.10 0.018 270)",
              border: "1px solid oklch(0.25 0.04 270 / 0.8)",
              boxShadow:
                "0 24px 80px oklch(0.08 0.012 270 / 0.8), 0 0 0 1px oklch(0.55 0.22 278 / 0.1)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderColor: "oklch(0.22 0.03 270 / 0.6)",
                background: "oklch(0.09 0.015 270)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center btn-gradient"
                  style={{ flexShrink: 0 }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Prashant AI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isLoggedIn ? "Online · Ready to help" : "Login required"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-ocid="chat.close_button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            {!isLoggedIn ? (
              /* Not logged in state */
              <div className="flex flex-col items-center justify-center h-[calc(100%-56px)] px-6 text-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
                  style={{
                    background: "oklch(0.55 0.22 278 / 0.12)",
                    border: "1px solid oklch(0.55 0.22 278 / 0.25)",
                  }}
                >
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Chat with Prashant AI
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Login to start chatting with our AI assistant and get instant
                  answers to your questions.
                </p>
                <button
                  type="button"
                  data-ocid="chat.login_button"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 mt-2 disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login to Chat"
                  )}
                </button>
              </div>
            ) : (
              /* Chat messages area */
              <div className="flex flex-col h-[calc(100%-56px)]">
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {loadingHistory ? (
                    <div
                      data-ocid="chat.loading_state"
                      className="flex items-center justify-center h-full"
                    >
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div
                      data-ocid="chat.empty_state"
                      className="flex flex-col items-center justify-center h-full gap-3 text-center"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: "oklch(0.55 0.22 278 / 0.1)",
                          border: "1px solid oklch(0.55 0.22 278 / 0.2)",
                        }}
                      >
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Start a conversation with Prashant AI
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={msg.id}
                        data-ocid={`chat.item.${i + 1}`}
                        className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === "user" ? "btn-gradient" : ""
                          }`}
                          style={
                            msg.role === "assistant"
                              ? {
                                  background: "oklch(0.55 0.22 278 / 0.15)",
                                  border:
                                    "1px solid oklch(0.55 0.22 278 / 0.3)",
                                }
                              : undefined
                          }
                        >
                          {msg.role === "user" ? (
                            <User className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Bot className="w-3.5 h-3.5 text-primary" />
                          )}
                        </div>
                        <div
                          className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}
                        >
                          <div
                            className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
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
                                    background: "oklch(0.15 0.025 270)",
                                    border:
                                      "1px solid oklch(0.22 0.03 270 / 0.6)",
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
                    <div className="flex gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "oklch(0.55 0.22 278 / 0.15)",
                          border: "1px solid oklch(0.55 0.22 278 / 0.3)",
                        }}
                      >
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div
                        className="px-4 py-3 rounded-2xl rounded-tl-sm"
                        style={{
                          background: "oklch(0.15 0.025 270)",
                          border: "1px solid oklch(0.22 0.03 270 / 0.6)",
                        }}
                      >
                        <div className="flex gap-1.5 items-center">
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input area */}
                <div
                  className="px-3 py-3 border-t"
                  style={{ borderColor: "oklch(0.22 0.03 270 / 0.6)" }}
                >
                  <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{
                      background: "oklch(0.14 0.022 270)",
                      border: "1px solid oklch(0.25 0.04 270 / 0.8)",
                    }}
                  >
                    <input
                      type="text"
                      data-ocid="chat.input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Message Prashant AI..."
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      disabled={sending}
                    />
                    <button
                      type="button"
                      data-ocid="chat.submit_button"
                      onClick={handleSend}
                      disabled={!input.trim() || sending}
                      className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                      aria-label="Send message"
                    >
                      {sending ? (
                        <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
