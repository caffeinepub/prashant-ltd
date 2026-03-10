import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import LandingPage from "./components/LandingPage";
import VideoEditor from "./components/VideoEditor";
import VideoEditorLogin from "./components/VideoEditorLogin";

export type Page = "landing" | "login" | "editor";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("meena_logged_in");
  const [page, setPage] = useState<Page>("landing");
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  const goToEditor = () => {
    if (loggedIn) {
      setPage("editor");
    } else {
      setPage("login");
    }
  };

  const handleLogin = () => {
    setLoggedIn(true);
    setPage("editor");
  };

  const handleGuest = () => {
    setLoggedIn(false);
    setPage("editor");
  };

  const handleLogout = () => {
    localStorage.removeItem("meena_logged_in");
    localStorage.removeItem("meena_user");
    setLoggedIn(false);
    setPage("landing");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Toaster position="top-right" theme="dark" />
      <AnimatePresence mode="wait">
        {page === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onOpenEditor={goToEditor} />
          </motion.div>
        )}
        {page === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VideoEditorLogin onLogin={handleLogin} onGuest={handleGuest} />
          </motion.div>
        )}
        {page === "editor" && (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VideoEditor
              onBack={() => setPage("landing")}
              isLoggedIn={loggedIn}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
