import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  FolderOpen,
  Loader2,
  Pause,
  Pencil,
  Plus,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type ProjectStatus = "active" | "paused" | "completed";

interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string;
    color: string;
    border: string;
    textColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  active: {
    label: "Active",
    color: "oklch(0.65 0.18 160 / 0.15)",
    border: "oklch(0.65 0.18 160 / 0.35)",
    textColor: "oklch(0.72 0.18 160)",
    icon: Zap,
  },
  paused: {
    label: "Paused",
    color: "oklch(0.7 0.16 55 / 0.15)",
    border: "oklch(0.7 0.16 55 / 0.35)",
    textColor: "oklch(0.75 0.16 55)",
    icon: Pause,
  },
  completed: {
    label: "Completed",
    color: "oklch(0.6 0.18 220 / 0.15)",
    border: "oklch(0.6 0.18 220 / 0.35)",
    textColor: "oklch(0.72 0.18 220)",
    icon: CheckCircle2,
  },
};

const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "AI Chat Integration",
    description:
      "Integrate the Prashant AI assistant into the main product dashboard for real-time customer support.",
    status: "active",
    createdAt: "Jan 12, 2025",
  },
  {
    id: "2",
    title: "Analytics Dashboard",
    description:
      "Build a comprehensive metrics dashboard showing query volume, response times, and user engagement.",
    status: "paused",
    createdAt: "Feb 3, 2025",
  },
  {
    id: "3",
    title: "API Documentation Portal",
    description:
      "Create an interactive documentation portal with live code examples and sandbox environment.",
    status: "completed",
    createdAt: "Dec 20, 2024",
  },
];

interface ProjectFormData {
  title: string;
  description: string;
  status: ProjectStatus;
}

const EMPTY_FORM: ProjectFormData = {
  title: "",
  description: "",
  status: "active",
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      status: project.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    // Simulate async save
    await new Promise((r) => setTimeout(r, 400));

    if (editingId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title: form.title.trim(),
                description: form.description.trim(),
                status: form.status,
              }
            : p,
        ),
      );
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setProjects((prev) => [newProject, ...prev]);
    }
    setSaving(false);
    closeForm();
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

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
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            My Projects
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button
          type="button"
          data-ocid="projects.add_button"
          onClick={openCreate}
          className="btn-gradient text-white border-0 flex items-center gap-2"
          style={{ background: undefined }}
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </motion.div>

      {/* Create / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass-card rounded-2xl p-6 space-y-4"
            style={{ border: "1px solid oklch(0.55 0.22 278 / 0.35)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-foreground">
                {editingId ? "Edit Project" : "Create New Project"}
              </h3>
              <button
                type="button"
                data-ocid="projects.close_button"
                onClick={closeForm}
                className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="project-title"
                  className="text-sm text-muted-foreground mb-1.5 block"
                >
                  Project Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="project-title"
                  data-ocid="projects.input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. AI Chat Integration"
                  className="bg-input/50 border-border/60 focus:border-primary/60"
                  maxLength={80}
                />
              </div>

              <div>
                <Label
                  htmlFor="project-description"
                  className="text-sm text-muted-foreground mb-1.5 block"
                >
                  Description
                </Label>
                <Textarea
                  id="project-description"
                  data-ocid="projects.textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="What is this project about?"
                  rows={3}
                  className="bg-input/50 border-border/60 focus:border-primary/60 resize-none"
                  maxLength={300}
                />
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-1.5 block">
                  Status
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, status: v as ProjectStatus }))
                  }
                >
                  <SelectTrigger
                    data-ocid="projects.select"
                    className="bg-input/50 border-border/60 focus:border-primary/60"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                data-ocid="projects.save_button"
                onClick={handleSave}
                disabled={!form.title.trim() || saving}
                className="btn-gradient text-white border-0"
                style={{ background: undefined }}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Save Changes"
                ) : (
                  "Create Project"
                )}
              </Button>
              <Button
                type="button"
                data-ocid="projects.cancel_button"
                variant="outline"
                onClick={closeForm}
                className="border-border/60 text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      {projects.length === 0 ? (
        <motion.div
          data-ocid="projects.empty_state"
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
            <FolderOpen className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No projects yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Create your first project to start organizing your work.
            </p>
          </div>
          <Button
            type="button"
            data-ocid="projects.add_button"
            onClick={openCreate}
            className="btn-gradient text-white border-0 mt-2"
            style={{ background: undefined }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Project
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, i) => {
            const statusConf = STATUS_CONFIG[project.status];
            const StatusIcon = statusConf.icon;
            return (
              <motion.div
                key={project.id}
                data-ocid={`projects.item.${i + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                layout
              >
                <div className="glass-card glass-card-hover rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    {/* Status indicator */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: statusConf.color,
                        border: `1px solid ${statusConf.border}`,
                        color: statusConf.textColor,
                      }}
                    >
                      <StatusIcon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {project.title}
                        </h3>
                        <Badge
                          className="text-[11px] px-2 py-0.5 rounded-full font-medium border"
                          style={{
                            background: statusConf.color,
                            borderColor: statusConf.border,
                            color: statusConf.textColor,
                          }}
                        >
                          <StatusIcon className="w-2.5 h-2.5 mr-1" />
                          {statusConf.label}
                        </Badge>
                      </div>
                      {project.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                          {project.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Created {project.createdAt}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        data-ocid={`projects.edit_button.${i + 1}`}
                        onClick={() => openEdit(project)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
                        aria-label={`Edit ${project.title}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirm === project.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            data-ocid={`projects.confirm_button.${i + 1}`}
                            onClick={() => handleDelete(project.id)}
                            className="px-2 py-1 rounded-lg text-xs font-medium text-white bg-destructive/90 hover:bg-destructive transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            data-ocid={`projects.cancel_button.${i + 1}`}
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:bg-white/10 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          data-ocid={`projects.delete_button.${i + 1}`}
                          onClick={() => setDeleteConfirm(project.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          aria-label={`Delete ${project.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Summary footer */}
      {projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground pt-2"
        >
          {(["active", "paused", "completed"] as ProjectStatus[]).map(
            (status) => {
              const count = projects.filter((p) => p.status === status).length;
              if (count === 0) return null;
              const conf = STATUS_CONFIG[status];
              return (
                <span
                  key={status}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{
                    background: conf.color,
                    border: `1px solid ${conf.border}`,
                  }}
                >
                  <conf.icon className="w-3 h-3" />
                  {count} {conf.label}
                </span>
              );
            },
          )}
          {projects.some((p) => p.status === "active") && (
            <span className="flex items-center gap-1 text-primary">
              <AlertCircle className="w-3 h-3" />
              {projects.filter((p) => p.status === "active").length} in progress
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}
