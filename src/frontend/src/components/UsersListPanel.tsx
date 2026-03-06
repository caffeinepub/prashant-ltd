import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  AlertCircle,
  Crown,
  Loader2,
  Search,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { UserProfile } from "../backend.d";
import { useActor } from "../hooks/useActor";

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncatePrincipal(id: string): string {
  if (id.length <= 20) return id;
  return `${id.slice(0, 10)}...${id.slice(-6)}`;
}

export default function UsersListPanel() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { actor, isFetching } = useActor();

  useEffect(() => {
    if (!actor || isFetching) return;
    setLoading(true);
    setError(null);
    actor
      .getAllUserProfile()
      .then((profiles) => {
        setUsers(profiles);
      })
      .catch(() => {
        setError("Failed to load users. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [actor, isFetching]);

  const filtered = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()),
  );

  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div
      className="px-6 py-6 space-y-6 overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            User Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Admin view — all registered users
          </p>
        </div>

        {/* Stats summary */}
        {!loading && !error && (
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                background: "oklch(0.55 0.22 278 / 0.12)",
                border: "1px solid oklch(0.55 0.22 278 / 0.3)",
                color: "oklch(0.75 0.18 278)",
              }}
            >
              <Users className="w-3.5 h-3.5" />
              {users.length} Total
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                background: "oklch(0.65 0.18 160 / 0.12)",
                border: "1px solid oklch(0.65 0.18 160 / 0.3)",
                color: "oklch(0.72 0.18 160)",
              }}
            >
              <Activity className="w-3.5 h-3.5" />
              {activeCount} Active
            </span>
          </div>
        )}
      </motion.div>

      {/* Search */}
      {!loading && !error && users.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="users.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="pl-9 bg-input/50 border-border/60 focus:border-primary/60"
          />
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div
          data-ocid="users.loading_state"
          className="flex flex-col items-center justify-center py-20 gap-3"
        >
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          data-ocid="users.error_state"
          className="glass-card rounded-xl p-8 flex flex-col items-center gap-3 text-center"
        >
          <AlertCircle className="w-10 h-10 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && users.length === 0 && (
        <motion.div
          data-ocid="users.empty_state"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-2xl py-16 flex flex-col items-center justify-center text-center gap-4"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "oklch(0.55 0.22 278 / 0.1)",
              border: "1px solid oklch(0.55 0.22 278 / 0.2)",
            }}
          >
            <Users className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No users yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Users will appear here once they sign up and create a profile.
            </p>
          </div>
        </motion.div>
      )}

      {/* Users table */}
      {!loading && !error && users.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          data-ocid="users.list"
          className="glass-card rounded-2xl overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow
                style={{ borderColor: "oklch(0.22 0.03 270 / 0.6)" }}
                className="hover:bg-transparent"
              >
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 pl-5">
                  User
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 hidden sm:table-cell">
                  Principal ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 hidden md:table-cell">
                  Joined
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 text-right pr-5">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(search ? filtered : users).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-sm text-muted-foreground"
                  >
                    No users match your search.
                  </TableCell>
                </TableRow>
              ) : (
                (search ? filtered : users).map((user, i) => (
                  <TableRow
                    key={user.id}
                    data-ocid={`users.item.${i + 1}`}
                    style={{ borderColor: "oklch(0.18 0.025 270 / 0.5)" }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* User column */}
                    <TableCell className="py-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, oklch(0.55 0.24 ${(i * 40 + 240) % 360}), oklch(0.55 0.2 ${(i * 40 + 200) % 360}))`,
                          }}
                        >
                          {user.displayName?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-none">
                            {user.displayName || "Unnamed User"}
                          </p>
                          {/* Show truncated ID below name on mobile */}
                          <p className="text-[11px] text-muted-foreground font-mono sm:hidden truncate max-w-[120px]">
                            {truncatePrincipal(user.id)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Principal ID column */}
                    <TableCell className="py-3.5 hidden sm:table-cell">
                      <span
                        className="text-xs font-mono text-muted-foreground"
                        title={user.id}
                      >
                        {truncatePrincipal(user.id)}
                      </span>
                    </TableCell>

                    {/* Joined date column */}
                    <TableCell className="py-3.5 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(user.joinedDate)}
                      </span>
                    </TableCell>

                    {/* Status column */}
                    <TableCell className="py-3.5 pr-5 text-right">
                      {user.isActive ? (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: "oklch(0.65 0.18 160 / 0.15)",
                            border: "1px solid oklch(0.65 0.18 160 / 0.35)",
                            color: "oklch(0.72 0.18 160)",
                          }}
                        >
                          <UserCheck className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: "oklch(0.5 0.02 270 / 0.15)",
                            border: "1px solid oklch(0.4 0.03 270 / 0.35)",
                            color: "oklch(0.58 0.02 270)",
                          }}
                        >
                          <UserMinus className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}
