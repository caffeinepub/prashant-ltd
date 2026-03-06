import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Calendar,
  Edit3,
  FileText,
  Loader2,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tag: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "prashantltd_blog_posts";

function loadPosts(): BlogPostData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BlogPostData[];
  } catch {
    return [];
  }
}

function savePosts(posts: BlogPostData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// ─── Empty form ───────────────────────────────────────────────────────────────

const emptyForm: Omit<BlogPostData, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  tag: "",
  published: false,
};

// ─── Tag color helper ─────────────────────────────────────────────────────────

function tagStyles(tag: string) {
  const lower = tag.toLowerCase();
  if (lower === "engineering")
    return {
      bg: "oklch(0.55 0.22 278 / 0.15)",
      border: "oklch(0.55 0.22 278 / 0.35)",
      text: "oklch(0.78 0.16 278)",
    };
  if (lower === "security")
    return {
      bg: "oklch(0.65 0.18 160 / 0.15)",
      border: "oklch(0.65 0.18 160 / 0.35)",
      text: "oklch(0.72 0.18 160)",
    };
  if (lower === "company")
    return {
      bg: "oklch(0.7 0.16 55 / 0.15)",
      border: "oklch(0.7 0.16 55 / 0.35)",
      text: "oklch(0.75 0.16 55)",
    };
  return {
    bg: "oklch(0.55 0.22 278 / 0.12)",
    border: "oklch(0.55 0.22 278 / 0.3)",
    text: "oklch(0.78 0.16 278)",
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Post Card ────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: BlogPostData;
  index: number;
  onEdit: (post: BlogPostData) => void;
  onDelete: (post: BlogPostData) => void;
}

function PostCard({ post, index, onEdit, onDelete }: PostCardProps) {
  const colors = tagStyles(post.tag);
  return (
    <motion.div
      data-ocid={`blog_manager.post.item.${index}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-4"
      style={{
        background: "oklch(0.11 0.018 270)",
        border: "1px solid oklch(0.20 0.03 270 / 0.7)",
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "oklch(0.55 0.22 278 / 0.10)",
          border: "1px solid oklch(0.55 0.22 278 / 0.2)",
        }}
      >
        <FileText className="w-5 h-5 text-primary" />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h3 className="text-sm font-semibold text-foreground truncate max-w-xs">
            {post.title || "Untitled"}
          </h3>
          {/* Published / Draft badge */}
          {post.published ? (
            <span
              className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.65 0.18 160 / 0.15)",
                border: "1px solid oklch(0.65 0.18 160 / 0.35)",
                color: "oklch(0.72 0.18 160)",
              }}
            >
              Published
            </span>
          ) : (
            <span
              className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.55 0.02 270 / 0.18)",
                border: "1px solid oklch(0.35 0.03 270 / 0.4)",
                color: "oklch(0.58 0.02 270)",
              }}
            >
              Draft
            </span>
          )}
          {/* Tag */}
          {post.tag && (
            <span
              className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              {post.tag}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
          {post.excerpt || "No excerpt."}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {post.author || "Unknown"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0 sm:mt-0 mt-1">
        <button
          type="button"
          data-ocid={`blog_manager.post.edit_button.${index}`}
          onClick={() => onEdit(post)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          style={{
            background: "oklch(0.16 0.025 270)",
            border: "1px solid oklch(0.25 0.04 270 / 0.6)",
          }}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          type="button"
          data-ocid={`blog_manager.post.delete_button.${index}`}
          onClick={() => onDelete(post)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: "oklch(0.55 0.22 25 / 0.10)",
            border: "1px solid oklch(0.55 0.22 25 / 0.25)",
            color: "oklch(0.65 0.2 25)",
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </motion.div>
  );
}

// ─── Blog Manager Panel ───────────────────────────────────────────────────────

export default function BlogManagerPanel() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPostData | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] =
    useState<Omit<BlogPostData, "id" | "createdAt" | "updatedAt">>(emptyForm);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadPosts();
    // Sort newest first
    loaded.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setPosts(loaded);
  }, []);

  // ── Open "new post" dialog
  const openNew = () => {
    setEditingPost(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  // ── Open "edit" dialog
  const openEdit = (post: BlogPostData) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      tag: post.tag,
      published: post.published,
    });
    setDialogOpen(true);
  };

  // ── Save (create or update)
  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    setSaving(true);

    setTimeout(() => {
      const now = new Date().toISOString();
      let updated: BlogPostData[];

      if (editingPost) {
        updated = posts.map((p) =>
          p.id === editingPost.id
            ? { ...editingPost, ...form, updatedAt: now }
            : p,
        );
        toast.success("Post updated successfully.");
      } else {
        const newPost: BlogPostData = {
          id: Date.now().toString(),
          ...form,
          createdAt: now,
          updatedAt: now,
        };
        updated = [newPost, ...posts];
        toast.success("Post created successfully.");
      }

      // Re-sort by createdAt descending
      updated.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      savePosts(updated);
      setPosts(updated);
      setSaving(false);
      setDialogOpen(false);
    }, 300);
  };

  // ── Delete
  const handleDelete = () => {
    if (!deleteTarget) return;
    const updated = posts.filter((p) => p.id !== deleteTarget.id);
    savePosts(updated);
    setPosts(updated);
    setDeleteTarget(null);
    toast.success("Post deleted.");
  };

  return (
    <div
      className="px-6 py-6 space-y-6 overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "oklch(0.55 0.22 278 / 0.12)",
              border: "1px solid oklch(0.55 0.22 278 / 0.25)",
            }}
          >
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Blog Manager
            </h2>
            <p className="text-xs text-muted-foreground">
              {posts.length} post{posts.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Badge
            className="text-xs font-semibold"
            style={{
              background: "oklch(0.55 0.22 278 / 0.15)",
              border: "1px solid oklch(0.55 0.22 278 / 0.3)",
              color: "oklch(0.78 0.16 278)",
            }}
          >
            {posts.filter((p) => p.published).length} published
          </Badge>
        </div>

        <button
          type="button"
          data-ocid="blog_manager.new_post.button"
          onClick={openNew}
          className="btn-gradient flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </motion.div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <motion.div
          data-ocid="blog_manager.post.empty_state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-20 text-center gap-4 rounded-2xl"
          style={{
            background: "oklch(0.10 0.016 270)",
            border: "1px dashed oklch(0.25 0.04 270 / 0.6)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "oklch(0.55 0.22 278 / 0.08)",
              border: "1px solid oklch(0.55 0.22 278 / 0.18)",
            }}
          >
            <BookOpen className="w-8 h-8 text-primary opacity-60" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              No blog posts yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Create your first post to share updates, tutorials, and stories
              with your readers.
            </p>
          </div>
          <button
            type="button"
            data-ocid="blog_manager.new_post.button"
            onClick={openNew}
            className="btn-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white mt-1"
          >
            <Plus className="w-4 h-4" />
            Create First Post
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              index={i + 1}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* ── Create / Edit Dialog ──────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg w-full max-h-[90vh] overflow-y-auto"
          style={{
            background: "oklch(0.10 0.016 270)",
            border: "1px solid oklch(0.22 0.035 270)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              {editingPost ? "Edit Post" : "New Post"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Title */}
            <div>
              <Label
                htmlFor="blog-title"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="blog-title"
                data-ocid="blog_manager.form.title.input"
                placeholder="Enter post title..."
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="bg-input/40 border-border/60 focus:border-primary/60 text-sm"
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label
                htmlFor="blog-excerpt"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Excerpt
              </Label>
              <Textarea
                id="blog-excerpt"
                data-ocid="blog_manager.form.excerpt.textarea"
                placeholder="A short summary of your post (shown in the blog list)..."
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                rows={2}
                className="bg-input/40 border-border/60 focus:border-primary/60 text-sm resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <Label
                htmlFor="blog-content"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Content
              </Label>
              <Textarea
                id="blog-content"
                data-ocid="blog_manager.form.content.textarea"
                placeholder="Write your full post content here..."
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={6}
                className="bg-input/40 border-border/60 focus:border-primary/60 text-sm resize-none"
              />
            </div>

            {/* Author + Tag row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="blog-author"
                  className="text-xs font-medium text-muted-foreground mb-1.5 block"
                >
                  Author
                </Label>
                <Input
                  id="blog-author"
                  data-ocid="blog_manager.form.author.input"
                  placeholder="Author name"
                  value={form.author}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, author: e.target.value }))
                  }
                  className="bg-input/40 border-border/60 focus:border-primary/60 text-sm"
                />
              </div>
              <div>
                <Label
                  htmlFor="blog-tag"
                  className="text-xs font-medium text-muted-foreground mb-1.5 block"
                >
                  Tag
                </Label>
                <Input
                  id="blog-tag"
                  data-ocid="blog_manager.form.tag.input"
                  placeholder="Engineering / Security / Company"
                  value={form.tag}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tag: e.target.value }))
                  }
                  className="bg-input/40 border-border/60 focus:border-primary/60 text-sm"
                />
              </div>
            </div>

            {/* Published toggle */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: "oklch(0.13 0.02 270)",
                border: "1px solid oklch(0.22 0.03 270 / 0.5)",
              }}
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  Publish Post
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Published posts appear on the public blog section
                </p>
              </div>
              <Switch
                id="blog-published"
                data-ocid="blog_manager.form.published.switch"
                checked={form.published}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, published: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <button
              type="button"
              data-ocid="blog_manager.form.cancel_button"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{
                background: "oklch(0.16 0.025 270)",
                border: "1px solid oklch(0.25 0.04 270 / 0.6)",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              data-ocid="blog_manager.form.submit_button"
              onClick={handleSave}
              disabled={saving}
              className="btn-gradient flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : editingPost ? (
                "Update Post"
              ) : (
                "Save Post"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ───────────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent
          style={{
            background: "oklch(0.10 0.016 270)",
            border: "1px solid oklch(0.22 0.035 270)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              "{deleteTarget?.title || "This post"}" will be permanently
              deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="blog_manager.delete.cancel_button"
              className="text-sm font-medium"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="blog_manager.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-semibold"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
