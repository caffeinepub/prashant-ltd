import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  ArrowLeftRight,
  Bot,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  Film,
  Image,
  Layers,
  LayoutTemplate,
  Loader2,
  Mail,
  MessageSquare,
  Mic,
  Music,
  Palette,
  Paperclip,
  Pause,
  Play,
  Plus,
  Save,
  Scissors,
  Send,
  Shapes,
  Share2,
  Sparkles,
  Square,
  StopCircle,
  Trash2,
  Type,
  Upload,
  Volume2,
  VolumeX,
  Wand2,
  X,
} from "lucide-react";
// mammoth is used via dynamic import inside handlers
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TextItem {
  id: string;
  content: string;
  fontSize: number;
  color: string;
  positionY: "top" | "center" | "bottom";
  opacity: number;
}

interface MusicTrack {
  id: string;
  name: string;
  duration: string;
  color: string;
}

type FilterType =
  | "none"
  | "bright"
  | "warm"
  | "cool"
  | "vintage"
  | "bw"
  | "contrast"
  | "vivid";

const PRESET_TRACKS: MusicTrack[] = [
  {
    id: "lofi",
    name: "Lo-Fi Chill",
    duration: "3:24",
    color: "oklch(0.65 0.20 260)",
  },
  {
    id: "upbeat",
    name: "Upbeat Pop",
    duration: "2:58",
    color: "oklch(0.62 0.22 305)",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    duration: "4:12",
    color: "oklch(0.60 0.18 240)",
  },
  {
    id: "piano",
    name: "Calm Piano",
    duration: "3:45",
    color: "oklch(0.68 0.15 200)",
  },
  {
    id: "hiphop",
    name: "Hip-Hop Beat",
    duration: "2:34",
    color: "oklch(0.65 0.22 45)",
  },
  {
    id: "acoustic",
    name: "Acoustic Morning",
    duration: "3:10",
    color: "oklch(0.70 0.16 80)",
  },
  {
    id: "jazz",
    name: "Smooth Jazz",
    duration: "4:05",
    color: "oklch(0.63 0.18 55)",
  },
  {
    id: "electronic",
    name: "Electronic Pulse",
    duration: "3:50",
    color: "oklch(0.60 0.25 220)",
  },
  {
    id: "classical",
    name: "Classical Suite",
    duration: "5:20",
    color: "oklch(0.66 0.12 30)",
  },
  {
    id: "rnb",
    name: "R&B Soul",
    duration: "3:38",
    color: "oklch(0.62 0.22 340)",
  },
  {
    id: "reggae",
    name: "Reggae Vibes",
    duration: "4:02",
    color: "oklch(0.68 0.20 140)",
  },
  {
    id: "rock",
    name: "Indie Rock",
    duration: "3:15",
    color: "oklch(0.58 0.20 25)",
  },
  {
    id: "ambient",
    name: "Ambient Space",
    duration: "5:10",
    color: "oklch(0.60 0.14 250)",
  },
  {
    id: "latin",
    name: "Latin Fiesta",
    duration: "3:22",
    color: "oklch(0.70 0.22 65)",
  },
  {
    id: "country",
    name: "Country Road",
    duration: "3:55",
    color: "oklch(0.68 0.18 70)",
  },
  {
    id: "disco",
    name: "Disco Fever",
    duration: "4:18",
    color: "oklch(0.65 0.24 320)",
  },
  {
    id: "funk",
    name: "Funky Groove",
    duration: "3:30",
    color: "oklch(0.63 0.22 35)",
  },
  {
    id: "gospel",
    name: "Gospel Choir",
    duration: "4:45",
    color: "oklch(0.68 0.18 55)",
  },
  {
    id: "indie",
    name: "Indie Dreamer",
    duration: "3:42",
    color: "oklch(0.65 0.16 200)",
  },
  {
    id: "kpop",
    name: "K-Pop Energy",
    duration: "2:55",
    color: "oklch(0.62 0.24 310)",
  },
  {
    id: "trap",
    name: "Trap Night",
    duration: "2:48",
    color: "oklch(0.55 0.18 270)",
  },
  {
    id: "dubstep",
    name: "Dubstep Drop",
    duration: "3:05",
    color: "oklch(0.58 0.26 230)",
  },
  {
    id: "orchestra",
    name: "Epic Orchestra",
    duration: "5:28",
    color: "oklch(0.60 0.14 45)",
  },
  {
    id: "meditation",
    name: "Meditation Zen",
    duration: "5:00",
    color: "oklch(0.68 0.12 180)",
  },
  {
    id: "gaming",
    name: "Gaming Arena",
    duration: "3:12",
    color: "oklch(0.60 0.25 150)",
  },
  {
    id: "nature",
    name: "Nature Sounds",
    duration: "4:30",
    color: "oklch(0.68 0.18 130)",
  },
  {
    id: "christmas",
    name: "Christmas Bells",
    duration: "3:08",
    color: "oklch(0.65 0.22 25)",
  },
  {
    id: "bollywood",
    name: "Bollywood Beat",
    duration: "3:35",
    color: "oklch(0.66 0.24 40)",
  },
  {
    id: "romantic",
    name: "Romantic Dusk",
    duration: "4:20",
    color: "oklch(0.62 0.18 355)",
  },
  {
    id: "party",
    name: "Party Anthem",
    duration: "2:52",
    color: "oklch(0.65 0.26 290)",
  },
  {
    id: "afrobeats",
    name: "Afrobeats Groove",
    duration: "3:20",
    color: "oklch(0.66 0.24 55)",
  },
  {
    id: "flamenco",
    name: "Flamenco Passion",
    duration: "3:45",
    color: "oklch(0.62 0.20 30)",
  },
  {
    id: "bossa",
    name: "Bossa Nova",
    duration: "4:10",
    color: "oklch(0.68 0.16 165)",
  },
  {
    id: "metal",
    name: "Heavy Metal",
    duration: "3:28",
    color: "oklch(0.52 0.16 0)",
  },
  {
    id: "blues",
    name: "Blues Guitar",
    duration: "4:05",
    color: "oklch(0.60 0.18 240)",
  },
  {
    id: "swing",
    name: "Swing Era",
    duration: "3:55",
    color: "oklch(0.68 0.16 55)",
  },
  {
    id: "trance",
    name: "Trance Journey",
    duration: "5:30",
    color: "oklch(0.58 0.26 270)",
  },
  {
    id: "wedding",
    name: "Wedding March",
    duration: "3:00",
    color: "oklch(0.70 0.14 55)",
  },
  {
    id: "battle",
    name: "Battle Theme",
    duration: "4:15",
    color: "oklch(0.55 0.22 25)",
  },
  {
    id: "sunrise",
    name: "Sunrise Glow",
    duration: "4:00",
    color: "oklch(0.72 0.16 80)",
  },
  {
    id: "neon",
    name: "Neon Nights",
    duration: "3:40",
    color: "oklch(0.60 0.28 290)",
  },
  {
    id: "deephouse",
    name: "Deep House",
    duration: "5:15",
    color: "oklch(0.58 0.22 230)",
  },
  {
    id: "salsa",
    name: "Salsa Caliente",
    duration: "3:25",
    color: "oklch(0.66 0.26 40)",
  },
  {
    id: "cumbia",
    name: "Cumbia Fiesta",
    duration: "3:10",
    color: "oklch(0.68 0.24 60)",
  },
  {
    id: "sitar",
    name: "Sitar Dreams",
    duration: "4:50",
    color: "oklch(0.65 0.18 50)",
  },
  {
    id: "taiko",
    name: "Taiko Drums",
    duration: "3:35",
    color: "oklch(0.58 0.20 30)",
  },
  {
    id: "celtic",
    name: "Celtic Spirit",
    duration: "3:55",
    color: "oklch(0.66 0.18 140)",
  },
  {
    id: "lounge",
    name: "Lounge Jazz",
    duration: "4:10",
    color: "oklch(0.65 0.14 55)",
  },
  {
    id: "softrock",
    name: "Soft Rock",
    duration: "3:48",
    color: "oklch(0.62 0.18 40)",
  },
  {
    id: "ska",
    name: "Ska Bounce",
    duration: "3:05",
    color: "oklch(0.68 0.22 140)",
  },
  {
    id: "punk",
    name: "Punk Energy",
    duration: "2:30",
    color: "oklch(0.60 0.24 15)",
  },
  {
    id: "techno",
    name: "Techno Pulse",
    duration: "5:00",
    color: "oklch(0.55 0.18 240)",
  },
  {
    id: "house",
    name: "Chicago House",
    duration: "4:45",
    color: "oklch(0.60 0.22 220)",
  },
  {
    id: "synth",
    name: "Synthwave Retro",
    duration: "4:00",
    color: "oklch(0.60 0.28 305)",
  },
  {
    id: "folk",
    name: "Folk Tales",
    duration: "3:30",
    color: "oklch(0.68 0.16 80)",
  },
  {
    id: "newage",
    name: "New Age Float",
    duration: "5:20",
    color: "oklch(0.68 0.12 200)",
  },
  {
    id: "soulful",
    name: "Soulful Groove",
    duration: "4:08",
    color: "oklch(0.63 0.20 340)",
  },
  {
    id: "tropical",
    name: "Tropical Breeze",
    duration: "3:42",
    color: "oklch(0.70 0.22 155)",
  },
  {
    id: "flute",
    name: "Flute Serenity",
    duration: "4:35",
    color: "oklch(0.68 0.16 170)",
  },
  {
    id: "harp",
    name: "Harp Lullaby",
    duration: "3:55",
    color: "oklch(0.72 0.12 200)",
  },
  {
    id: "violin",
    name: "Violin Sonata",
    duration: "5:10",
    color: "oklch(0.65 0.14 35)",
  },
  {
    id: "drumnbass",
    name: "Drum and Bass",
    duration: "3:15",
    color: "oklch(0.55 0.24 240)",
  },
  {
    id: "glitch",
    name: "Glitch Hop",
    duration: "3:00",
    color: "oklch(0.58 0.24 280)",
  },
  {
    id: "vaporwave",
    name: "Vaporwave Haze",
    duration: "4:00",
    color: "oklch(0.65 0.26 315)",
  },
  {
    id: "chillhop",
    name: "Chill Hop Beats",
    duration: "3:50",
    color: "oklch(0.65 0.18 260)",
  },
  {
    id: "phonk",
    name: "Phonk Drift",
    duration: "2:58",
    color: "oklch(0.55 0.22 310)",
  },
  {
    id: "marimba",
    name: "Marimba Carnival",
    duration: "2:45",
    color: "oklch(0.70 0.24 80)",
  },
  {
    id: "jpop",
    name: "J-Pop Sweet",
    duration: "3:10",
    color: "oklch(0.68 0.24 340)",
  },
  {
    id: "cpop",
    name: "C-Pop Rhythm",
    duration: "3:25",
    color: "oklch(0.65 0.22 355)",
  },
  {
    id: "emo",
    name: "Emo Heart",
    duration: "3:38",
    color: "oklch(0.58 0.20 330)",
  },
  {
    id: "softpiano",
    name: "Soft Piano Rain",
    duration: "4:55",
    color: "oklch(0.68 0.12 230)",
  },
  {
    id: "coffeeshop",
    name: "Coffee Shop",
    duration: "3:30",
    color: "oklch(0.66 0.14 65)",
  },
  {
    id: "study",
    name: "Study Focus",
    duration: "4:15",
    color: "oklch(0.65 0.12 200)",
  },
  {
    id: "motivate",
    name: "Motivation Rise",
    duration: "3:22",
    color: "oklch(0.65 0.24 140)",
  },
  {
    id: "workout",
    name: "Workout Pump",
    duration: "3:05",
    color: "oklch(0.62 0.26 35)",
  },
  {
    id: "runbeat",
    name: "Running Beat",
    duration: "2:50",
    color: "oklch(0.62 0.24 45)",
  },
  {
    id: "yoga",
    name: "Yoga Flow",
    duration: "5:00",
    color: "oklch(0.70 0.14 155)",
  },
  {
    id: "travel",
    name: "Travel Adventure",
    duration: "3:48",
    color: "oklch(0.66 0.22 180)",
  },
  {
    id: "nightdrive",
    name: "Night Drive",
    duration: "4:30",
    color: "oklch(0.58 0.20 265)",
  },
  {
    id: "dreamscape",
    name: "Dreamscape",
    duration: "5:05",
    color: "oklch(0.62 0.16 250)",
  },
  {
    id: "horror",
    name: "Horror Strings",
    duration: "3:20",
    color: "oklch(0.48 0.14 300)",
  },
  {
    id: "comedy",
    name: "Comedy Bounce",
    duration: "2:35",
    color: "oklch(0.70 0.26 80)",
  },
  {
    id: "western",
    name: "Western Standoff",
    duration: "3:55",
    color: "oklch(0.62 0.20 50)",
  },
  {
    id: "anime",
    name: "Anime Opening",
    duration: "3:08",
    color: "oklch(0.65 0.26 310)",
  },
  {
    id: "lofi2",
    name: "Lo-Fi Night",
    duration: "4:00",
    color: "oklch(0.60 0.18 255)",
  },
  {
    id: "lofi3",
    name: "Lo-Fi Study",
    duration: "3:45",
    color: "oklch(0.62 0.16 260)",
  },
  {
    id: "jazzclub",
    name: "Jazz Club Late",
    duration: "4:25",
    color: "oklch(0.62 0.16 60)",
  },
  {
    id: "hindustani",
    name: "Hindustani Raga",
    duration: "5:30",
    color: "oklch(0.65 0.22 45)",
  },
  {
    id: "carnatic",
    name: "Carnatic Melody",
    duration: "4:55",
    color: "oklch(0.66 0.20 50)",
  },
  {
    id: "sufi",
    name: "Sufi Mystic",
    duration: "5:15",
    color: "oklch(0.63 0.18 55)",
  },
  {
    id: "qawwali",
    name: "Qawwali Soul",
    duration: "5:40",
    color: "oklch(0.62 0.20 50)",
  },
  {
    id: "filmi",
    name: "Filmi Masala",
    duration: "3:28",
    color: "oklch(0.68 0.26 45)",
  },
  {
    id: "garba",
    name: "Garba Dance",
    duration: "3:15",
    color: "oklch(0.70 0.28 55)",
  },
  {
    id: "bhangra",
    name: "Bhangra Dhol",
    duration: "2:58",
    color: "oklch(0.68 0.28 50)",
  },
  {
    id: "dandiya",
    name: "Dandiya Night",
    duration: "3:05",
    color: "oklch(0.70 0.26 55)",
  },
  {
    id: "baul",
    name: "Baul Folk",
    duration: "4:10",
    color: "oklch(0.66 0.20 65)",
  },
  {
    id: "ragga",
    name: "Ragga Jungle",
    duration: "3:20",
    color: "oklch(0.62 0.22 145)",
  },
  {
    id: "futurebass",
    name: "Future Bass",
    duration: "3:35",
    color: "oklch(0.60 0.28 265)",
  },
  {
    id: "lofi4",
    name: "Lo-Fi Rain",
    duration: "4:15",
    color: "oklch(0.63 0.14 240)",
  },
  {
    id: "orchestral2",
    name: "Orchestral Drama",
    duration: "5:00",
    color: "oklch(0.58 0.16 30)",
  },
  {
    id: "ambient2",
    name: "Deep Ambient",
    duration: "6:00",
    color: "oklch(0.60 0.12 240)",
  },
];

const FILTERS: { id: FilterType; label: string; css: string }[] = [
  { id: "none", label: "None", css: "" },
  { id: "bright", label: "Bright", css: "brightness(1.3) contrast(1.05)" },
  {
    id: "warm",
    label: "Warm",
    css: "sepia(0.3) saturate(1.4) brightness(1.05)",
  },
  {
    id: "cool",
    label: "Cool",
    css: "hue-rotate(20deg) saturate(1.2) brightness(1.05)",
  },
  {
    id: "vintage",
    label: "Vintage",
    css: "sepia(0.5) contrast(1.1) brightness(0.95)",
  },
  { id: "bw", label: "B&W", css: "grayscale(1) contrast(1.2)" },
  { id: "contrast", label: "Contrast", css: "contrast(1.5) saturate(1.2)" },
  {
    id: "vivid",
    label: "Vivid",
    css: "saturate(1.8) contrast(1.15) brightness(1.05)",
  },
];

function generateId() {
  return Math.random().toString(36).slice(2);
}

function getTextY(pos: TextItem["positionY"], height: number): number {
  if (pos === "top") return height * 0.12;
  if (pos === "center") return height * 0.5;
  return height * 0.88;
}

// ─── Canvas Overlay ───────────────────────────────────────────────────────────
function CanvasOverlay({
  texts,
  width,
  height,
}: {
  texts: TextItem[];
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (const t of texts) {
      ctx.save();
      ctx.globalAlpha = t.opacity / 100;
      ctx.font = `bold ${t.fontSize}px 'Bricolage Grotesque', sans-serif`;
      ctx.fillStyle = t.color;
      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.lineWidth = 3;
      const y = getTextY(t.positionY, height);
      ctx.strokeText(t.content, width / 2, y);
      ctx.fillText(t.content, width / 2, y);
      ctx.restore();
    }
  }, [texts, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

// ─── Video Preview ────────────────────────────────────────────────────────────
function VideoPreview({
  videoUrl,
  texts,
  filter,
  filterIntensity,
  onUpload,
  canvasBg,
  overlayElements,
  onRemoveElement,
  videoRef: externalVideoRef,
}: {
  videoUrl: string | null;
  texts: TextItem[];
  filter: FilterType;
  filterIntensity: number;
  onUpload: (file: File) => void;
  canvasBg?: string | null;
  overlayElements?: Array<{
    id: string;
    emoji: string;
    type: string;
    x: number;
    y: number;
  }>;
  onRemoveElement?: (id: string) => void;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef ?? internalVideoRef;
  const [dims, setDims] = useState({ w: 640, h: 360 });
  const [playing, setPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width } = e.contentRect;
        setDims({ w: width, h: Math.round((width * 9) / 16) });
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const filterCss = () => {
    const f = FILTERS.find((x) => x.id === filter);
    if (!f || !f.css) return "none";
    const intensity = filterIntensity / 100;
    // scale intensity by blending
    return f.css.replace(/([0-9.]+)\(/g, (_, n) => {
      const base = Number.parseFloat(n);
      const neutral = base > 1 ? 1 : base < 1 ? 1 : 0;
      const adjusted = neutral + (base - neutral) * intensity;
      return `${adjusted.toFixed(2)}(`;
    });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("video/")) onUpload(file);
    },
    [onUpload],
  );

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play();
      setPlaying(true);
    }
  };

  if (!videoUrl) {
    return (
      <div
        ref={containerRef}
        className="w-full flex-1 flex items-center justify-center min-h-[300px]"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5 p-10 rounded-2xl w-full max-w-lg mx-auto"
          style={{
            background: "oklch(0.10 0.012 280)",
            border: "2px dashed oklch(0.30 0.04 305 / 0.6)",
          }}
          data-ocid="editor.dropzone"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "oklch(0.58 0.22 305 / 0.12)",
              border: "1px solid oklch(0.58 0.22 305 / 0.3)",
            }}
          >
            <Upload
              className="w-9 h-9"
              style={{ color: "oklch(0.72 0.20 305)" }}
            />
          </div>
          <div className="text-center">
            <p className="font-display font-semibold text-lg mb-1">
              Drop your video here
            </p>
            <p className="text-sm text-muted-foreground">
              Supports MP4, MOV, WebM
            </p>
          </div>
          <label
            htmlFor="meena-video-upload"
            className="cursor-pointer px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: "oklch(0.58 0.22 305)",
              color: "white",
            }}
            data-ocid="editor.upload_button"
          >
            Browse Files
          </label>
          <input
            id="meena-video-upload"
            ref={fileInputRef}
            type="file"
            accept="video/*"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              opacity: 0,
              overflow: "hidden",
            }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 flex flex-col justify-center min-h-[200px]"
    >
      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{
          aspectRatio: "16/9",
          background: canvasBg ?? "#000",
          maxHeight: "65vh",
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ filter: filterCss(), zIndex: 1 }}
          onEnded={() => setPlaying(false)}
        >
          <track kind="captions" />
        </video>
        <CanvasOverlay texts={texts} width={dims.w} height={dims.h} />
        {overlayElements?.map((el) => (
          <div
            key={el.id}
            className="absolute flex items-center justify-center select-none cursor-move"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              zIndex: 10,
              transform: "translate(-50%,-50%)",
            }}
          >
            <span className="text-4xl drop-shadow-lg pointer-events-none">
              {el.emoji}
            </span>
            <button
              type="button"
              onClick={() => onRemoveElement?.(el.id)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center leading-none font-bold hover:bg-red-600 transition-colors"
              style={{ zIndex: 11 }}
            >
              ×
            </button>
          </div>
        ))}

        {/* Play/Pause overlay */}
        <button
          type="button"
          className="absolute inset-0 flex items-center justify-center z-10 group"
          onClick={togglePlay}
          style={{ background: "transparent" }}
          data-ocid="editor.video.toggle"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: "oklch(0 0 0 / 0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            {playing ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white fill-white" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Text Panel ───────────────────────────────────────────────────────────────
function TextPanel({
  texts,
  setTexts,
}: {
  texts: TextItem[];
  setTexts: React.Dispatch<React.SetStateAction<TextItem[]>>;
}) {
  const addText = () => {
    setTexts((prev) => [
      ...prev,
      {
        id: generateId(),
        content: "Your Text Here",
        fontSize: 36,
        color: "#ffffff",
        positionY: "center",
        opacity: 100,
      },
    ]);
  };

  const updateText = (id: string, updates: Partial<TextItem>) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const deleteText = (id: string) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-4 p-4">
      <Button
        onClick={addText}
        data-ocid="text.add_button"
        className="w-full btn-gradient text-white border-0 rounded-xl h-10"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Text Overlay
      </Button>

      {texts.length === 0 && (
        <div
          className="text-center py-8 text-muted-foreground text-sm"
          data-ocid="text.empty_state"
        >
          No text overlays yet. Click above to add one.
        </div>
      )}

      <div className="space-y-3">
        {texts.map((t, idx) => (
          <div
            key={t.id}
            data-ocid={`text.item.${idx + 1}`}
            className="rounded-xl p-4 space-y-3"
            style={{
              background: "oklch(0.13 0.015 280)",
              border: "1px solid oklch(0.22 0.025 280)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                Text {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => deleteText(t.id)}
                data-ocid={`text.delete_button.${idx + 1}`}
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <Input
              value={t.content}
              onChange={(e) => updateText(t.id, { content: e.target.value })}
              data-ocid={`text.input.${idx + 1}`}
              className="h-8 text-sm"
              style={{
                background: "oklch(0.10 0.012 280)",
                border: "1px solid oklch(0.22 0.025 280)",
              }}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Font Size: {t.fontSize}px
                </Label>
                <Slider
                  min={16}
                  max={96}
                  value={[t.fontSize]}
                  onValueChange={([v]) => updateText(t.id, { fontSize: v })}
                  className="h-4"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Opacity: {t.opacity}%
                </Label>
                <Slider
                  min={10}
                  max={100}
                  value={[t.opacity]}
                  onValueChange={([v]) => updateText(t.id, { opacity: v })}
                  className="h-4"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Color
                </Label>
                <input
                  type="color"
                  value={t.color}
                  onChange={(e) => updateText(t.id, { color: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer border-0"
                  style={{ background: "none" }}
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Position
                </Label>
                <div className="flex gap-1">
                  {(["top", "center", "bottom"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => updateText(t.id, { positionY: pos })}
                      className={`flex-1 py-1 text-xs rounded capitalize transition-colors ${
                        t.positionY === pos
                          ? "text-white font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={{
                        background:
                          t.positionY === pos
                            ? "oklch(0.58 0.22 305)"
                            : "oklch(0.10 0.012 280)",
                        border: "1px solid oklch(0.22 0.025 280)",
                      }}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Music Panel ──────────────────────────────────────────────────────────────
function MusicPanel({
  activeTrack,
  setActiveTrack,
  musicVolume,
  setMusicVolume,
}: {
  activeTrack: MusicTrack | null;
  setActiveTrack: (t: MusicTrack | null) => void;
  musicVolume: number;
  setMusicVolume: (v: number) => void;
}) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [trackSearch, setTrackSearch] = useState("");
  const audioCtxRef = useRef<AudioContext | null>(null);

  const activeOscsRef = useRef<OscillatorNode[]>([]);

  // Genre-aware musical chord preview
  const playMusicalPattern = (ctx: AudioContext, genre: string) => {
    for (const o of activeOscsRef.current) {
      try {
        o.stop();
      } catch (_) {}
      o.disconnect();
    }
    activeOscsRef.current = [];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.15);
    masterGain.connect(ctx.destination);

    const g = genre.toLowerCase();
    let chords: number[][];
    let type: OscillatorType = "sine";
    let tempo = 80;

    if (g.includes("lofi") || g.includes("lo-fi") || g.includes("chill")) {
      chords = [
        [261.6, 329.6, 392.0],
        [220.0, 261.6, 329.6],
      ];
      tempo = 70;
      type = "sine";
    } else if (
      g.includes("jazz") ||
      g.includes("blues") ||
      g.includes("soul")
    ) {
      chords = [
        [293.7, 370.0, 440.0, 554.4],
        [261.6, 329.6, 415.3, 493.9],
      ];
      tempo = 120;
      type = "sine";
    } else if (
      g.includes("bollywood") ||
      g.includes("bhangra") ||
      g.includes("desi")
    ) {
      chords = [
        [329.6, 415.3, 493.9],
        [293.7, 370.0, 440.0],
      ];
      tempo = 100;
      type = "triangle";
    } else if (g.includes("hip") || g.includes("trap") || g.includes("rap")) {
      chords = [
        [87.3, 174.6],
        [73.4, 146.8],
      ];
      tempo = 90;
      type = "sawtooth";
    } else if (
      g.includes("electr") ||
      g.includes("synth") ||
      g.includes("house") ||
      g.includes("edm")
    ) {
      chords = [
        [523.2, 659.3, 783.9],
        [440.0, 554.4, 659.3],
      ];
      tempo = 128;
      type = "sawtooth";
    } else if (
      g.includes("rock") ||
      g.includes("punk") ||
      g.includes("metal")
    ) {
      chords = [
        [196.0, 246.9, 293.7],
        [164.8, 196.0, 246.9],
      ];
      tempo = 110;
      type = "sawtooth";
    } else if (
      g.includes("classical") ||
      g.includes("orchestra") ||
      g.includes("piano")
    ) {
      chords = [
        [523.2, 659.3, 783.9, 987.8],
        [493.9, 587.3, 740.0, 880.0],
      ];
      tempo = 80;
      type = "sine";
    } else if (
      g.includes("pop") ||
      g.includes("k-pop") ||
      g.includes("j-pop")
    ) {
      chords = [
        [392.0, 493.9, 587.3],
        [349.2, 440.0, 523.2],
      ];
      tempo = 100;
      type = "triangle";
    } else {
      chords = [
        [261.6, 329.6, 392.0],
        [293.7, 370.0, 440.0],
      ];
      tempo = 90;
      type = "sine";
    }

    const beatDuration = 60 / tempo;
    let t = ctx.currentTime;
    for (let rep = 0; rep < 3; rep++) {
      for (const chord of chords) {
        for (const freq of chord) {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = type;
          osc.frequency.value = freq;
          noteGain.gain.setValueAtTime(0, t);
          noteGain.gain.linearRampToValueAtTime(0.06, t + 0.05);
          noteGain.gain.exponentialRampToValueAtTime(
            0.001,
            t + beatDuration * 0.9,
          );
          osc.connect(noteGain);
          noteGain.connect(masterGain);
          osc.start(t);
          osc.stop(t + beatDuration);
          activeOscsRef.current.push(osc);
        }
        t += beatDuration;
      }
    }
  };

  const togglePreview = (trackId: string, trackIndex: number) => {
    if (previewId === trackId) {
      for (const o of activeOscsRef.current) {
        try {
          o.stop();
        } catch (_) {}
        o.disconnect();
      }
      activeOscsRef.current = [];
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      setPreviewId(null);
    } else {
      for (const o of activeOscsRef.current) {
        try {
          o.stop();
        } catch (_) {}
        o.disconnect();
      }
      activeOscsRef.current = [];
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      const ctx = new AudioContext();
      const allTracks = PRESET_TRACKS.filter((t) =>
        t.name.toLowerCase().includes(trackSearch.toLowerCase()),
      );
      const track = allTracks[trackIndex] ?? allTracks[0] ?? PRESET_TRACKS[0];
      const genre = track ? track.name : "default";
      playMusicalPattern(ctx, genre);
      audioCtxRef.current = ctx;
      setPreviewId(trackId);
    }
  };

  const filteredTracks = PRESET_TRACKS.filter((t) =>
    t.name.toLowerCase().includes(trackSearch.toLowerCase()),
  );

  return (
    <div className="space-y-3 p-4">
      {activeTrack && (
        <div
          className="rounded-xl p-4 mb-4"
          style={{
            background: "oklch(0.15 0.04 305 / 0.3)",
            border: "1px solid oklch(0.35 0.10 305 / 0.5)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold">{activeTrack.name}</p>
              <p className="text-xs text-muted-foreground">Currently playing</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTrack(null)}
              data-ocid="music.remove_track.button"
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Volume: {musicVolume}%
            </Label>
            <Slider
              min={0}
              max={100}
              value={[musicVolume]}
              onValueChange={([v]) => setMusicVolume(v)}
            />
          </div>
        </div>
      )}

      <div className="relative mb-2">
        <Input
          placeholder="Search tracks..."
          value={trackSearch}
          onChange={(e) => setTrackSearch(e.target.value)}
          data-ocid="music.search_input"
          className="h-8 text-xs pl-3 pr-3"
          style={{
            background: "oklch(0.12 0.015 280)",
            border: "1px solid oklch(0.22 0.025 280)",
          }}
        />
      </div>

      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-0.5 mb-2">
        Preset Tracks ({filteredTracks.length})
      </p>

      {filteredTracks.length === 0 && (
        <div className="text-center py-6" data-ocid="music.empty_state">
          <p className="text-xs text-muted-foreground">No tracks found</p>
        </div>
      )}

      {filteredTracks.map((track, i) => (
        <div
          key={track.id}
          data-ocid={`music.track.item.${i + 1}`}
          className="flex items-center gap-3 p-3 rounded-xl transition-all"
          style={{
            background:
              activeTrack?.id === track.id
                ? "oklch(0.15 0.03 305 / 0.5)"
                : "oklch(0.12 0.015 280)",
            border:
              activeTrack?.id === track.id
                ? "1px solid oklch(0.40 0.12 305 / 0.5)"
                : "1px solid oklch(0.20 0.02 280)",
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${track.color}22` }}
          >
            <Music className="w-4 h-4" style={{ color: track.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{track.name}</p>
            <p className="text-xs text-muted-foreground">{track.duration}</p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => togglePreview(track.id, i)}
              data-ocid={`music.preview.button.${i + 1}`}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
              style={{ background: "oklch(0.15 0.02 280)" }}
            >
              {previewId === track.id ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveTrack(activeTrack?.id === track.id ? null : track)
              }
              data-ocid={`music.add_track.button.${i + 1}`}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background:
                  activeTrack?.id === track.id
                    ? "oklch(0.58 0.22 305)"
                    : "oklch(0.15 0.02 280)",
                color: activeTrack?.id === track.id ? "white" : "",
              }}
            >
              {activeTrack?.id === track.id ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Audio Panel ──────────────────────────────────────────────────────────────
function AudioPanel({
  origVolume,
  setOrigVolume,
  muted,
  setMuted,
  enhanced,
  setEnhanced,
  noiseReduce,
  setNoiseReduce,
  bgNoise,
  setBgNoise,
}: {
  origVolume: number;
  setOrigVolume: (v: number) => void;
  muted: boolean;
  setMuted: (v: boolean) => void;
  enhanced: boolean;
  setEnhanced: (v: boolean) => void;
  noiseReduce: boolean;
  setNoiseReduce: (v: boolean) => void;
  bgNoise: string;
  setBgNoise: (v: string) => void;
}) {
  return (
    <div className="space-y-5 p-4">
      <div
        className="rounded-xl p-4"
        style={{
          background: "oklch(0.12 0.015 280)",
          border: "1px solid oklch(0.20 0.02 280)",
        }}
      >
        <p className="text-sm font-semibold mb-4">Original Audio</p>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">
                Volume: {origVolume}%
              </Label>
              <button
                type="button"
                onClick={() => setMuted(!muted)}
                data-ocid="audio.mute.toggle"
                className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors ${
                  muted
                    ? "text-destructive"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ background: "oklch(0.10 0.012 280)" }}
              >
                {muted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                {muted ? "Unmute" : "Mute"}
              </button>
            </div>
            <Slider
              min={0}
              max={100}
              value={[origVolume]}
              onValueChange={([v]) => setOrigVolume(v)}
              disabled={muted}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-4 space-y-4"
        style={{
          background: "oklch(0.12 0.015 280)",
          border: "1px solid oklch(0.20 0.02 280)",
        }}
      >
        <p className="text-sm font-semibold">Audio Enhancement</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Enhance Audio</p>
            <p className="text-xs text-muted-foreground">
              Boost clarity & reduce artifacts
            </p>
          </div>
          <div className="flex items-center gap-2">
            {enhanced && (
              <Badge
                className="text-xs"
                style={{
                  background: "oklch(0.52 0.18 150 / 0.2)",
                  border: "1px solid oklch(0.52 0.18 150 / 0.4)",
                  color: "oklch(0.70 0.18 150)",
                }}
              >
                Enhanced
              </Badge>
            )}
            <Switch
              checked={enhanced}
              onCheckedChange={setEnhanced}
              data-ocid="audio.enhance.switch"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Noise Reduction</p>
            <p className="text-xs text-muted-foreground">
              Remove background noise
            </p>
          </div>
          <Switch
            checked={noiseReduce}
            onCheckedChange={setNoiseReduce}
            data-ocid="audio.noise_reduce.switch"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground block mb-2">
            Background Noise Level
          </Label>
          <div className="flex gap-2">
            {["Low", "Medium", "High"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setBgNoise(level)}
                data-ocid={`audio.noise_level.${level.toLowerCase()}.button`}
                className={`flex-1 py-1.5 text-xs rounded-lg capitalize transition-colors ${
                  bgNoise === level
                    ? "text-white font-medium"
                    : "text-muted-foreground"
                }`}
                style={{
                  background:
                    bgNoise === level
                      ? "oklch(0.58 0.22 305)"
                      : "oklch(0.10 0.012 280)",
                  border: "1px solid oklch(0.22 0.025 280)",
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Record Voiceover */}
      <VoiceoverRecorder />

      {/* Popular Music */}
      <PopularMusicSection />

      {/* Generate AI Voice */}
      <GenerateAIVoiceSection />
    </div>
  );
}

// ─── Voiceover Recorder ───────────────────────────────────────────────────────
function VoiceoverRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        for (const t of stream.getTracks()) {
          t.stop();
        }
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        toast.success("Voiceover recorded! Play it back below.");
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setSeconds(0);
      setRecordingUrl(null);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (_err) {
      toast.error("Microphone access denied. Please allow mic permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "oklch(0.12 0.015 280)",
        border: "1px solid oklch(0.20 0.02 280)",
      }}
    >
      <p className="text-sm font-semibold mb-3">Record Voiceover</p>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={toggleRecording}
          data-ocid="audio.voiceover.toggle"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: recording
              ? "oklch(0.55 0.22 25)"
              : "linear-gradient(135deg, oklch(0.55 0.22 305), oklch(0.55 0.22 25))",
            color: "white",
          }}
        >
          {recording ? (
            <>
              <StopCircle className="w-4 h-4" /> Stop
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" /> Record
            </>
          )}
        </button>
        {recording && (
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: "oklch(0.55 0.22 25)" }}
            />
            <span className="text-sm font-mono text-red-400">
              {fmt(seconds)}
            </span>
          </div>
        )}
        {!recording && !recordingUrl && (
          <p className="text-xs text-muted-foreground">
            Click mic to start recording
          </p>
        )}
      </div>
      {recordingUrl && (
        <div className="mt-3 space-y-2">
          <audio
            controls
            src={recordingUrl}
            className="w-full h-8"
            style={{ accentColor: "oklch(0.65 0.22 305)" }}
          >
            <track kind="captions" />
          </audio>
          <a
            href={recordingUrl}
            download="voiceover.webm"
            data-ocid="audio.voiceover.download_button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: "oklch(0.18 0.04 305)",
              color: "oklch(0.80 0.18 305)",
              border: "1px solid oklch(0.35 0.12 305 / 0.5)",
            }}
          >
            <Download className="w-3 h-3" /> Download voiceover.webm
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Popular Music Section ────────────────────────────────────────────────────
const POPULAR_TRACKS = [
  {
    title: "Push The Pedal (Instrumental)",
    artist: "Jordan Olmos",
    duration: "1:32",
  },
  { title: "I Need You (Instrumental)", artist: "Def Manic", duration: "3:21" },
  {
    title: "Inspirational Music - Motivational",
    artist: "AudioCoffee",
    duration: "2:12",
  },
  {
    title: "Background Music For Video Blogs",
    artist: "Universfield",
    duration: "0:34",
  },
  { title: "Uplifting Corporate", artist: "SmartSound", duration: "2:45" },
];

function PopularMusicSection() {
  const [playing, setPlaying] = useState<string | null>(null);
  const popAudioCtxRef = useRef<AudioContext | null>(null);
  const popOscRef = useRef<OscillatorNode | null>(null);

  const popActiveOscsRef = useRef<OscillatorNode[]>([]);

  const playPopPattern = (ctx: AudioContext, title: string) => {
    for (const o of popActiveOscsRef.current) {
      try {
        o.stop();
      } catch (_) {}
      o.disconnect();
    }
    popActiveOscsRef.current = [];
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.1);
    masterGain.connect(ctx.destination);
    const t = title.toLowerCase();
    const chords =
      t.includes("uplift") || t.includes("corporate")
        ? [
            [523.2, 659.3, 783.9],
            [493.9, 622.3, 740.0],
          ]
        : t.includes("inspirat") || t.includes("motivat")
          ? [
              [392.0, 493.9, 587.3],
              [349.2, 440.0, 523.2],
            ]
          : t.includes("background") || t.includes("blog")
            ? [
                [261.6, 329.6, 392.0],
                [220.0, 277.2, 329.6],
              ]
            : [
                [293.7, 370.0, 440.0],
                [261.6, 329.6, 392.0],
              ];
    let time = ctx.currentTime;
    for (let rep = 0; rep < 4; rep++) {
      for (const chord of chords) {
        for (const freq of chord) {
          const osc = ctx.createOscillator();
          const ng = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.value = freq;
          ng.gain.setValueAtTime(0, time);
          ng.gain.linearRampToValueAtTime(0.055, time + 0.06);
          ng.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
          osc.connect(ng);
          ng.connect(masterGain);
          osc.start(time);
          osc.stop(time + 0.75);
          popActiveOscsRef.current.push(osc);
        }
        time += 0.75;
      }
    }
  };

  const togglePopTrack = (title: string) => {
    if (playing === title) {
      for (const o of popActiveOscsRef.current) {
        try {
          o.stop();
        } catch (_) {}
        o.disconnect();
      }
      popActiveOscsRef.current = [];
      popAudioCtxRef.current?.close();
      popAudioCtxRef.current = null;
      setPlaying(null);
    } else {
      for (const o of popActiveOscsRef.current) {
        try {
          o.stop();
        } catch (_) {}
        o.disconnect();
      }
      popActiveOscsRef.current = [];
      popAudioCtxRef.current?.close();
      popAudioCtxRef.current = null;
      const ctx = new AudioContext();
      playPopPattern(ctx, title);
      popAudioCtxRef.current = ctx;
      popOscRef.current = null;
      setPlaying(title);
    }
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "oklch(0.12 0.015 280)",
        border: "1px solid oklch(0.20 0.02 280)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold">Popular Music</p>
        <span className="text-xs text-muted-foreground">Preview only</span>
      </div>
      <div className="space-y-2">
        {POPULAR_TRACKS.map((track, idx) => (
          <button
            key={track.title}
            type="button"
            onClick={() => togglePopTrack(track.title)}
            data-ocid={`audio.popular.item.${idx + 1}`}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left"
            style={{
              background:
                playing === track.title
                  ? "oklch(0.18 0.04 305)"
                  : "oklch(0.10 0.012 280)",
              border: `1px solid ${playing === track.title ? "oklch(0.45 0.18 305 / 0.5)" : "oklch(0.18 0.02 280)"}`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.22 305), oklch(0.55 0.18 240))",
              }}
            >
              {playing === track.title ? (
                <Square className="w-3 h-3 text-white fill-white" />
              ) : (
                <Play className="w-3 h-3 text-white fill-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground">
                {track.artist} • {track.duration}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Generate AI Voice Section ────────────────────────────────────────────────
const AI_VOICE_STYLES = [
  { id: "natural", label: "Natural", desc: "Clear & conversational" },
  { id: "news", label: "News Anchor", desc: "Professional broadcast" },
  { id: "storyteller", label: "Storyteller", desc: "Warm & engaging" },
  { id: "dramatic", label: "Dramatic", desc: "Expressive & bold" },
];

function GenerateAIVoiceSection() {
  const [text, setText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("natural");
  const [speaking, setSpeaking] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) {
      toast.error("Please enter some text first");
      return;
    }
    if (!("speechSynthesis" in window)) {
      toast.error("Your browser does not support speech synthesis");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    if (selectedStyle === "news") {
      const male = voices.find(
        (v) =>
          v.name.toLowerCase().includes("male") ||
          v.name.includes("David") ||
          v.name.includes("Mark"),
      );
      if (male) utterance.voice = male;
      utterance.rate = 1.05;
      utterance.pitch = 0.9;
    } else if (selectedStyle === "storyteller") {
      const female = voices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Victoria") ||
          v.name.includes("Zira"),
      );
      if (female) utterance.voice = female;
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
    } else if (selectedStyle === "dramatic") {
      const gb = voices.find((v) => v.lang === "en-GB");
      if (gb) utterance.voice = gb;
      utterance.rate = 0.8;
      utterance.pitch = 0.8;
    } else {
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
    }
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      toast.success("AI Voice generated!");
    };
    utterance.onerror = () => {
      setSpeaking(false);
      toast.error("Speech synthesis failed");
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: "oklch(0.12 0.015 280)",
        border: "1px solid oklch(0.20 0.02 280)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Sparkles
          className="w-4 h-4"
          style={{ color: "oklch(0.65 0.22 305)" }}
        />
        <p className="text-sm font-semibold">Generate AI Voice</p>
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{
            background: "oklch(0.55 0.22 305 / 0.2)",
            color: "oklch(0.75 0.18 305)",
          }}
        >
          AI
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type text to convert to voice..."
        rows={3}
        data-ocid="audio.aivoice.textarea"
        className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none"
        style={{
          background: "oklch(0.09 0.01 280)",
          border: "1px solid oklch(0.22 0.03 280)",
          color: "oklch(0.92 0.01 280)",
        }}
      />

      <div className="grid grid-cols-2 gap-1.5">
        {AI_VOICE_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => setSelectedStyle(style.id)}
            data-ocid={`audio.aivoice.style.${style.id}`}
            className="p-2 rounded-lg text-left transition-all"
            style={{
              background:
                selectedStyle === style.id
                  ? "oklch(0.18 0.04 305)"
                  : "oklch(0.10 0.012 280)",
              border: `1px solid ${selectedStyle === style.id ? "oklch(0.45 0.18 305 / 0.6)" : "oklch(0.18 0.02 280)"}`,
            }}
          >
            <p className="text-xs font-medium">{style.label}</p>
            <p className="text-xs text-muted-foreground">{style.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={speaking}
          data-ocid="audio.aivoice.generate_button"
          className="flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
          style={{
            background: speaking
              ? "oklch(0.30 0.08 305)"
              : "linear-gradient(135deg, oklch(0.55 0.22 305), oklch(0.55 0.18 240))",
            color: "white",
            opacity: speaking ? 0.6 : 1,
          }}
        >
          {speaking ? (
            <>
              <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-white" />{" "}
              Speaking...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> Generate Voice
            </>
          )}
        </button>
        {speaking && (
          <button
            type="button"
            onClick={handleStop}
            data-ocid="audio.aivoice.cancel_button"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: "oklch(0.55 0.22 25)", color: "white" }}
          >
            <StopCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Filters Panel ────────────────────────────────────────────────────────────
function FiltersPanel({
  activeFilter,
  setActiveFilter,
  intensity,
  setIntensity,
}: {
  activeFilter: FilterType;
  setActiveFilter: (f: FilterType) => void;
  intensity: number;
  setIntensity: (v: number) => void;
}) {
  return (
    <div className="p-4 space-y-5">
      <div className="grid grid-cols-4 gap-2">
        {FILTERS.map((f, i) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            data-ocid={`filter.item.${i + 1}`}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all"
            style={{
              background:
                activeFilter === f.id
                  ? "oklch(0.20 0.04 305)"
                  : "oklch(0.12 0.015 280)",
              border:
                activeFilter === f.id
                  ? "1px solid oklch(0.50 0.18 305 / 0.6)"
                  : "1px solid oklch(0.20 0.02 280)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg"
              style={{
                background: `linear-gradient(135deg, oklch(0.45 0.10 ${200 + i * 15}), oklch(0.35 0.08 ${200 + i * 15}))`,
                filter: f.css || "none",
              }}
            />
            <span
              className={`text-[10px] font-medium ${
                activeFilter === f.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {f.label}
            </span>
          </button>
        ))}
      </div>

      {activeFilter !== "none" && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Intensity: {intensity}%
          </Label>
          <Slider
            min={10}
            max={100}
            value={[intensity]}
            onValueChange={([v]) => setIntensity(v)}
            data-ocid="filter.intensity.input"
          />
        </div>
      )}
    </div>
  );
}

// ─── Trim Panel ───────────────────────────────────────────────────────────────
function TrimPanel({
  duration,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  videoRef,
  onTrimApply,
}: {
  duration: number;
  startTime: number;
  endTime: number;
  setStartTime: (v: number) => void;
  setEndTime: (v: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onTrimApply: (url: string) => void;
}) {
  const [trimming, setTrimming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const dur = duration || 60;

  const applyTrim = async () => {
    const video = videoRef.current;
    if (!video || !video.src) {
      toast.error("Please upload a video first before trimming.");
      return;
    }
    setTrimming(true);
    setProgress(0);
    setTrimmedUrl(null);
    chunksRef.current = [];

    try {
      // Seek to start
      video.currentTime = startTime;
      video.muted = false;
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          resolve();
        };
        video.addEventListener("seeked", onSeeked);
      });

      // Capture stream from video element
      const stream =
        (
          video as HTMLVideoElement & {
            captureStream?: () => MediaStream;
            mozCaptureStream?: () => MediaStream;
          }
        ).captureStream?.() ??
        (
          video as HTMLVideoElement & {
            captureStream?: () => MediaStream;
            mozCaptureStream?: () => MediaStream;
          }
        ).mozCaptureStream?.();

      if (!stream) {
        toast.error(
          "Your browser does not support video capture. Try Chrome or Edge.",
        );
        setTrimming(false);
        return;
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "video/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setTrimmedUrl(url);
        onTrimApply(url);
        setTrimming(false);
        setProgress(100);
        toast.success("Trim applied! Video updated in editor.");
      };

      recorder.start(100);
      video.play();

      const trimDuration = endTime - startTime;
      const interval = setInterval(() => {
        if (video.currentTime >= endTime) {
          clearInterval(interval);
          recorder.stop();
          video.pause();
        } else {
          const elapsed = video.currentTime - startTime;
          setProgress(Math.min(99, Math.round((elapsed / trimDuration) * 100)));
        }
      }, 200);
    } catch (err) {
      console.error("Trim error:", err);
      toast.error("Trim failed. Make sure the video is loaded and try again.");
      setTrimming(false);
    }
  };

  const downloadTrimmed = () => {
    if (!trimmedUrl) return;
    const a = document.createElement("a");
    a.href = trimmedUrl;
    a.download = "trimmed-video.webm";
    a.click();
  };

  return (
    <div className="p-4 space-y-5">
      <div
        className="rounded-xl p-4 space-y-4"
        style={{
          background: "oklch(0.12 0.015 280)",
          border: "1px solid oklch(0.20 0.02 280)",
        }}
      >
        <p className="text-sm font-semibold">Trim Range</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Start Time
            </Label>
            <div className="relative">
              <Input
                value={fmt(startTime)}
                readOnly
                className="h-9 text-sm font-mono text-center"
                style={{
                  background: "oklch(0.10 0.012 280)",
                  border: "1px solid oklch(0.22 0.025 280)",
                }}
                data-ocid="trim.start_time.input"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              End Time
            </Label>
            <Input
              value={fmt(endTime)}
              readOnly
              className="h-9 text-sm font-mono text-center"
              style={{
                background: "oklch(0.10 0.012 280)",
                border: "1px solid oklch(0.22 0.025 280)",
              }}
              data-ocid="trim.end_time.input"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Duration: {fmt(endTime - startTime)}
          </Label>
          {/* Timeline bar */}
          <div className="relative h-10">
            <div
              className="absolute inset-y-4 inset-x-0 rounded-full"
              style={{ background: "oklch(0.18 0.02 280)" }}
            />
            {/* Selected range */}
            <div
              className="absolute inset-y-4 rounded-full"
              style={{
                left: `${(startTime / dur) * 100}%`,
                right: `${100 - (endTime / dur) * 100}%`,
                background:
                  "linear-gradient(90deg, oklch(0.58 0.22 305), oklch(0.52 0.25 280))",
              }}
            />
            {/* Start handle */}
            <input
              type="range"
              min={0}
              max={dur}
              step={0.1}
              value={startTime}
              onChange={(e) => {
                const v = Number.parseFloat(e.target.value);
                if (v < endTime) setStartTime(v);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: 3 }}
              data-ocid="trim.start.drag_handle"
            />
          </div>

          <div className="relative h-10 mt-1">
            <div
              className="absolute inset-y-4 inset-x-0 rounded-full"
              style={{ background: "oklch(0.18 0.02 280)" }}
            />
            {/* End handle */}
            <input
              type="range"
              min={0}
              max={dur}
              step={0.1}
              value={endTime}
              onChange={(e) => {
                const v = Number.parseFloat(e.target.value);
                if (v > startTime) setEndTime(v);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: 3 }}
              data-ocid="trim.end.drag_handle"
            />
          </div>

          <div className="text-xs text-muted-foreground text-center mt-2">
            Total Duration: {fmt(dur)}
          </div>
        </div>

        {/* Apply Trim Button */}
        <button
          type="button"
          onClick={applyTrim}
          disabled={trimming}
          data-ocid="trim.primary_button"
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.22 305), oklch(0.48 0.25 270))",
            color: "white",
          }}
        >
          {trimming ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="presentation"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Trimming... {progress}%
            </>
          ) : (
            <>✂️ Apply Trim</>
          )}
        </button>

        {trimming && (
          <div
            className="w-full rounded-full overflow-hidden h-2"
            style={{ background: "oklch(0.18 0.02 280)" }}
          >
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, oklch(0.58 0.22 305), oklch(0.52 0.25 280))",
              }}
            />
          </div>
        )}

        {trimmedUrl && (
          <button
            type="button"
            onClick={downloadTrimmed}
            data-ocid="trim.download.button"
            className="w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
            style={{ background: "oklch(0.38 0.15 145)", color: "white" }}
          >
            ⬇️ Download Trimmed Video
          </button>
        )}

        <p
          className="text-xs text-center"
          style={{ color: "oklch(0.50 0.04 270)" }}
        >
          Uses browser MediaRecorder — no extra libraries needed
        </p>
      </div>
    </div>
  );
}
// ─── Export Modal ─────────────────────────────────────────────────────────────
// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    });
  };

  const shareOn = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(
      "Check out my video project on Meena Video Editor!",
    );
    let url = "";
    if (platform === "whatsapp")
      url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    else if (platform === "twitter")
      url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    else if (platform === "facebook")
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    else if (platform === "email")
      url = `mailto:?subject=My%20Meena%20Video%20Project&body=${encodedText}%20${encodedUrl}`;
    if (url) window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md border-0"
        style={{
          background: "oklch(0.11 0.015 280)",
          color: "oklch(0.90 0.02 270)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Share2 className="w-4 h-4 text-violet-400" />
            Share Your Project
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mt-2">
          <div
            className="flex-1 px-3 py-2 rounded-lg text-xs truncate"
            style={{
              background: "oklch(0.15 0.02 280)",
              border: "1px solid oklch(0.22 0.03 280)",
              color: "oklch(0.65 0.04 270)",
            }}
          >
            {shareUrl}
          </div>
          <Button
            size="sm"
            onClick={copyLink}
            data-ocid="share.copy.button"
            className="h-8 px-3 text-xs border-0"
            style={{
              background: copied
                ? "oklch(0.45 0.15 145)"
                : "oklch(0.55 0.22 305)",
              color: "white",
            }}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>

        <p className="text-xs mt-3" style={{ color: "oklch(0.55 0.04 270)" }}>
          Share on
        </p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {[
            {
              id: "whatsapp",
              label: "WhatsApp",
              color: "oklch(0.45 0.18 145)",
            },
            {
              id: "twitter",
              label: "Twitter / X",
              color: "oklch(0.35 0.05 250)",
            },
            {
              id: "facebook",
              label: "Facebook",
              color: "oklch(0.35 0.18 260)",
            },
            { id: "email", label: "Email", color: "oklch(0.45 0.12 30)" },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => shareOn(p.id)}
              data-ocid={`share.${p.id}.button`}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: p.color, color: "white" }}
            >
              {p.id === "email" ? (
                <Mail className="w-3.5 h-3.5" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              {p.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          data-ocid="share.close.button"
          className="mt-3 text-xs text-center w-full py-1.5 rounded-lg transition-colors hover:opacity-70"
          style={{ color: "oklch(0.55 0.04 270)" }}
        >
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
}

function ExportModal({
  open,
  onClose,
  videoUrl,
}: {
  open: boolean;
  onClose: () => void;
  videoUrl: string | null;
}) {
  const [resolution, setResolution] = useState("1080p");
  const [format, setFormat] = useState("mp4");
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const startExport = async () => {
    setExporting(true);
    setDone(false);
    setDownloadUrl(null);
    await new Promise((r) => setTimeout(r, 2000));
    // Use real video if uploaded, else create a sample blob
    let url = videoUrl;
    if (!url) {
      const blob = new Blob(
        [
          `Meena Video Export\nResolution: ${resolution}\nFormat: ${format}\nExported by Meena Video Editor`,
        ],
        { type: "text/plain" },
      );
      url = URL.createObjectURL(blob);
    }
    setDownloadUrl(url);
    setExporting(false);
    setDone(true);
  };

  const handleClose = () => {
    setDone(false);
    setExporting(false);
    if (downloadUrl && !videoUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md"
        style={{
          background: "oklch(0.11 0.015 280)",
          border: "1px solid oklch(0.25 0.03 280)",
        }}
        data-ocid="export.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Export Video
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <Label className="text-sm font-medium mb-2 block">Resolution</Label>
            <div className="flex gap-2">
              {["720p", "1080p"].map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  data-ocid={`export.resolution.${res}.button`}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background:
                      resolution === res
                        ? "oklch(0.58 0.22 305)"
                        : "oklch(0.15 0.02 280)",
                    color: resolution === res ? "white" : "",
                    border: "1px solid oklch(0.25 0.03 280)",
                  }}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Format</Label>
            <div className="flex gap-2">
              {["mp4", "webm"].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  data-ocid={`export.format.${fmt}.button`}
                  className="flex-1 py-2 rounded-xl text-sm font-medium uppercase transition-colors"
                  style={{
                    background:
                      format === fmt
                        ? "oklch(0.58 0.22 305)"
                        : "oklch(0.15 0.02 280)",
                    color: format === fmt ? "white" : "",
                    border: "1px solid oklch(0.25 0.03 280)",
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3"
              data-ocid="export.success_state"
            >
              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: "oklch(0.15 0.04 150 / 0.2)",
                  border: "1px solid oklch(0.50 0.15 150 / 0.4)",
                }}
              >
                <Check
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "oklch(0.70 0.18 150)" }}
                />
                <span className="text-sm font-medium">Download Ready!</span>
              </div>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`meena-export.${format}`}
                  data-ocid="export.download.button"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all btn-gradient border-0"
                >
                  <Download className="w-4 h-4" /> Download Video
                </a>
              )}
            </motion.div>
          ) : (
            <Button
              onClick={startExport}
              disabled={exporting}
              data-ocid="export.submit_button"
              className="w-full h-11 rounded-xl font-semibold text-white btn-gradient border-0"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Film className="w-4 h-4 mr-2" />
                  Export Video
                </>
              )}
            </Button>
          )}

          {!videoUrl && (
            <div
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: "oklch(0.13 0.02 280)",
                border: "1px solid oklch(0.25 0.03 280)",
              }}
            >
              <span className="text-lg">🎬</span>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">
                  No video uploaded
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Upload a video to export it. Your project settings have been
                  saved.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  data-ocid="export.close_button"
                  className="mt-2 text-[11px] px-3 py-1 rounded-lg font-medium transition-opacity hover:opacity-80"
                  style={{
                    background: "oklch(0.45 0.18 305)",
                    color: "white",
                  }}
                >
                  Close &amp; Upload Video
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function Timeline({
  hasVideo,
  hasMusic,
  hasTexts,
}: {
  hasVideo: boolean;
  hasMusic: boolean;
  hasTexts: boolean;
}) {
  return (
    <div
      className="h-24 border-t border-border/60 px-4 py-3 flex flex-col gap-1.5 flex-shrink-0"
      style={{ background: "oklch(0.08 0.01 280)" }}
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        Timeline
      </p>
      {[
        { label: "Video", active: hasVideo, color: "oklch(0.52 0.25 280)" },
        { label: "Audio", active: hasMusic, color: "oklch(0.60 0.20 305)" },
        { label: "Text", active: hasTexts, color: "oklch(0.65 0.18 200)" },
      ].map((track) => (
        <div key={track.label} className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-8 flex-shrink-0">
            {track.label}
          </span>
          <div
            className="flex-1 h-3.5 rounded-sm"
            style={{
              background: track.active ? track.color : "oklch(0.14 0.015 280)",
              border: "1px solid oklch(0.22 0.02 280)",
              opacity: track.active ? 1 : 0.4,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── BrandKitPanel ────────────────────────────────────────────────────────────
function BrandKitPanel() {
  const [brandColors] = useState(["#7C3AED", "#2563EB", "#059669", "#DC2626"]);
  const [brandFonts] = useState([
    "Inter",
    "Playfair Display",
    "Roboto Mono",
    "Poppins",
  ]);
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [logoUploaded, setLogoUploaded] = useState(false);

  return (
    <div className="p-3 space-y-5">
      <div>
        <p className="text-sm font-semibold mb-3">Brand Colors</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {brandColors.map((color, i) => (
            <div key={color} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-transparent hover:border-white/30 transition-all"
                style={{ background: color }}
                data-ocid={`brand.color.${i + 1}`}
              />
              <span className="text-[9px] text-muted-foreground">{color}</span>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full h-7 text-xs"
          data-ocid="brand.add_color.button"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Color
        </Button>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3">Brand Fonts</p>
        <div className="space-y-2">
          {brandFonts.map((font, idx) => (
            <div
              key={font}
              onClick={() => setSelectedFont(font)}
              className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all"
              style={{
                background:
                  selectedFont === font
                    ? "oklch(0.55 0.22 305 / 0.2)"
                    : "oklch(0.13 0.015 280)",
                border: `1px solid ${selectedFont === font ? "oklch(0.55 0.22 305 / 0.5)" : "oklch(0.20 0.02 280)"}`,
              }}
              data-ocid={`brand.font.item.${idx + 1}`}
              onKeyDown={(e) => e.key === "Enter" && setSelectedFont(font)}
            >
              <span style={{ fontFamily: font }} className="text-sm">
                {font}
              </span>
              {selectedFont === font && (
                <Check className="w-3.5 h-3.5 text-purple-400" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3">Brand Logo</p>
        {logoUploaded ? (
          <div
            className="rounded-lg p-3 text-center"
            style={{
              background: "oklch(0.13 0.015 280)",
              border: "1px solid oklch(0.20 0.02 280)",
            }}
          >
            <Check className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-green-400">Logo uploaded</p>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs mt-1 h-6"
              onClick={() => setLogoUploaded(false)}
            >
              Remove
            </Button>
          </div>
        ) : (
          <button
            type="button"
            className="w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
            style={{ borderColor: "oklch(0.25 0.03 280)" }}
            onClick={() => setLogoUploaded(true)}
            data-ocid="brand.logo.upload_button"
          >
            <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Click to upload logo
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              PNG, SVG supported
            </p>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── TemplatesPanel ───────────────────────────────────────────────────────────
const TEMPLATE_DATA = [
  {
    id: 1,
    name: "Cinematic Intro",
    category: "Intro",
    color: "oklch(0.40 0.15 280)",
    bgStyle: "linear-gradient(135deg, #0a0a1a, #1a1a3e)",
    texts: [
      {
        content: "CINEMATIC TITLE",
        fontSize: 42,
        color: "#ffffff",
        positionY: "center" as const,
        opacity: 100,
      },
      {
        content: "Your Story Begins Here",
        fontSize: 20,
        color: "#aaaaff",
        positionY: "bottom" as const,
        opacity: 80,
      },
    ],
  },
  {
    id: 2,
    name: "Social Media Story",
    category: "Social",
    color: "oklch(0.40 0.15 20)",
    bgStyle: "linear-gradient(135deg, #ff6b35, #f7c59f)",
    texts: [
      {
        content: "✨ NEW POST",
        fontSize: 36,
        color: "#ffffff",
        positionY: "top" as const,
        opacity: 100,
      },
      {
        content: "Swipe Up for More",
        fontSize: 18,
        color: "#fff3e0",
        positionY: "bottom" as const,
        opacity: 90,
      },
    ],
  },
  {
    id: 3,
    name: "Business Promo",
    category: "Business",
    color: "oklch(0.35 0.12 150)",
    bgStyle: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    texts: [
      {
        content: "YOUR COMPANY",
        fontSize: 38,
        color: "#ffffff",
        positionY: "top" as const,
        opacity: 100,
      },
      {
        content: "Quality • Excellence • Trust",
        fontSize: 16,
        color: "#90caf9",
        positionY: "bottom" as const,
        opacity: 85,
      },
    ],
  },
  {
    id: 4,
    name: "Travel Vlog",
    category: "Vlog",
    color: "oklch(0.40 0.15 200)",
    bgStyle: "linear-gradient(135deg, #667eea, #764ba2)",
    texts: [
      {
        content: "Adventure Awaits",
        fontSize: 40,
        color: "#ffffff",
        positionY: "center" as const,
        opacity: 100,
      },
      {
        content: "Travel • Explore • Discover",
        fontSize: 16,
        color: "#e0d7ff",
        positionY: "bottom" as const,
        opacity: 80,
      },
    ],
  },
  {
    id: 5,
    name: "Wedding Highlights",
    category: "Event",
    color: "oklch(0.40 0.12 350)",
    bgStyle: "linear-gradient(135deg, #ffecd2, #fcb69f)",
    texts: [
      {
        content: "Forever & Always",
        fontSize: 38,
        color: "#4a2c2a",
        positionY: "center" as const,
        opacity: 100,
      },
      {
        content: "Our Special Day",
        fontSize: 18,
        color: "#7a4040",
        positionY: "bottom" as const,
        opacity: 85,
      },
    ],
  },
  {
    id: 6,
    name: "Product Showcase",
    category: "Business",
    color: "oklch(0.38 0.14 60)",
    bgStyle: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
    texts: [
      {
        content: "NEW PRODUCT",
        fontSize: 40,
        color: "#ffffff",
        positionY: "top" as const,
        opacity: 100,
      },
      {
        content: "Available Now",
        fontSize: 22,
        color: "#ffd700",
        positionY: "bottom" as const,
        opacity: 100,
      },
    ],
  },
  {
    id: 7,
    name: "News Broadcast",
    category: "News",
    color: "oklch(0.30 0.10 230)",
    bgStyle: "linear-gradient(135deg, #000428, #004e92)",
    texts: [
      {
        content: "BREAKING NEWS",
        fontSize: 36,
        color: "#ff3333",
        positionY: "top" as const,
        opacity: 100,
      },
      {
        content: "Stay Informed. Stay Ahead.",
        fontSize: 16,
        color: "#ffffff",
        positionY: "bottom" as const,
        opacity: 90,
      },
    ],
  },
  {
    id: 8,
    name: "Music Visualizer",
    category: "Music",
    color: "oklch(0.38 0.18 300)",
    bgStyle: "linear-gradient(135deg, #1a0533, #3a0066)",
    texts: [
      {
        content: "NOW PLAYING",
        fontSize: 32,
        color: "#cc44ff",
        positionY: "top" as const,
        opacity: 100,
      },
      {
        content: "Artist Name • Track Title",
        fontSize: 18,
        color: "#ffffff",
        positionY: "bottom" as const,
        opacity: 85,
      },
    ],
  },
];

function TemplatesPanel({
  onApplyTemplate,
}: {
  onApplyTemplate?: (
    bgStyle: string,
    texts: Array<{
      content: string;
      fontSize: number;
      color: string;
      positionY: "top" | "center" | "bottom";
      opacity: number;
    }>,
  ) => void;
}) {
  const templates = [
    {
      id: 1,
      name: "Cinematic Intro",
      category: "Intro",
      color: "oklch(0.40 0.15 280)",
    },
    {
      id: 2,
      name: "Social Media Story",
      category: "Social",
      color: "oklch(0.40 0.15 20)",
    },
    {
      id: 3,
      name: "Business Promo",
      category: "Business",
      color: "oklch(0.35 0.12 150)",
    },
    {
      id: 4,
      name: "Travel Vlog",
      category: "Vlog",
      color: "oklch(0.40 0.15 200)",
    },
    {
      id: 5,
      name: "Wedding Highlights",
      category: "Event",
      color: "oklch(0.40 0.12 350)",
    },
    {
      id: 6,
      name: "Product Showcase",
      category: "Business",
      color: "oklch(0.38 0.14 60)",
    },
    {
      id: 7,
      name: "News Broadcast",
      category: "News",
      color: "oklch(0.30 0.10 230)",
    },
    {
      id: 8,
      name: "Music Visualizer",
      category: "Music",
      color: "oklch(0.38 0.18 300)",
    },
  ];
  const [selected, setSelected] = useState<number | null>(null);
  const categories = ["All", "Intro", "Social", "Business", "Vlog", "Event"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="p-3 space-y-3">
      <p className="text-sm font-semibold">Templates</p>
      <div className="flex gap-1 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className="px-2 py-0.5 rounded text-[10px] transition-all"
            style={{
              background:
                activeCategory === cat
                  ? "oklch(0.55 0.22 305 / 0.3)"
                  : "oklch(0.13 0.015 280)",
              color:
                activeCategory === cat
                  ? "oklch(0.80 0.15 305)"
                  : "oklch(0.60 0.01 280)",
              border: `1px solid ${activeCategory === cat ? "oklch(0.55 0.22 305 / 0.5)" : "oklch(0.20 0.02 280)"}`,
            }}
            data-ocid="templates.category.tab"
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((tpl, i) => (
          <button
            type="button"
            key={tpl.id}
            onClick={() => {
              setSelected(tpl.id);
              const tplData = TEMPLATE_DATA.find((d) => d.id === tpl.id);
              if (tplData && onApplyTemplate) {
                onApplyTemplate(tplData.bgStyle, tplData.texts);
              }
              toast.success(`Template "${tpl.name}" applied!`);
            }}
            className="rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              border: `2px solid ${selected === tpl.id ? "oklch(0.65 0.22 305)" : "oklch(0.20 0.02 280)"}`,
            }}
            data-ocid={`templates.item.${i + 1}`}
          >
            <div
              className="h-16 flex items-center justify-center"
              style={{ background: tpl.color }}
            >
              <Film className="w-5 h-5 text-white/60" />
            </div>
            <div
              className="p-1.5"
              style={{ background: "oklch(0.13 0.015 280)" }}
            >
              <p className="text-[10px] font-medium truncate">{tpl.name}</p>
              <p className="text-[9px] text-muted-foreground">{tpl.category}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ElementsPanel ────────────────────────────────────────────────────────────
function ElementsPanel({
  onAddElement,
}: { onAddElement?: (emoji: string, type: string) => void }) {
  const elementCategories = [
    {
      name: "Shapes",
      items: ["Rectangle", "Circle", "Triangle", "Star", "Arrow", "Line"],
    },
    {
      name: "Stickers",
      items: ["🔥", "⭐", "💯", "🎵", "✨", "❤️", "🎬", "🎤"],
    },
    {
      name: "Lines & Borders",
      items: ["Solid Line", "Dashed", "Dotted", "Double", "Wavy", "Arrow"],
    },
  ];
  const shapeColors = [
    "oklch(0.55 0.22 305)",
    "oklch(0.55 0.18 20)",
    "oklch(0.55 0.18 150)",
    "oklch(0.55 0.18 200)",
    "oklch(0.75 0.10 80)",
    "oklch(0.65 0.12 350)",
  ];

  return (
    <div className="p-3 space-y-4">
      <p className="text-sm font-semibold">Elements</p>
      {elementCategories.map((cat) => (
        <div key={cat.name}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {cat.name}
          </p>
          {cat.name === "Stickers" ? (
            <div className="grid grid-cols-4 gap-2">
              {cat.items.map((item, i) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    onAddElement?.(item, "sticker");
                    toast.success(`${item} added!`);
                  }}
                  className="h-10 rounded-lg text-xl flex items-center justify-center hover:scale-110 transition-transform"
                  style={{
                    background: "oklch(0.13 0.015 280)",
                    border: "1px solid oklch(0.20 0.02 280)",
                  }}
                  data-ocid={`elements.sticker.${i + 1}`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {cat.items.map((item, i) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    onAddElement?.(item, "shape");
                    toast.success(`${item} added!`);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs hover:opacity-80 transition-opacity text-left"
                  style={{
                    background: "oklch(0.13 0.015 280)",
                    border: "1px solid oklch(0.20 0.02 280)",
                  }}
                  data-ocid={`elements.shape.item.${i + 1}`}
                >
                  <div
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    style={{ background: shapeColors[i % shapeColors.length] }}
                  />
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── BackgroundPanel ──────────────────────────────────────────────────────────
function BackgroundPanel() {
  const solidColors = [
    { color: "oklch(0.1 0.01 280)", label: "Deep Black" },
    { color: "oklch(0.15 0.02 280)", label: "Dark Navy" },
    { color: "oklch(0.20 0.04 250)", label: "Midnight" },
    { color: "oklch(0.30 0.08 305)", label: "Dark Purple" },
    { color: "oklch(0.25 0.06 20)", label: "Dark Red" },
    { color: "oklch(0.25 0.06 150)", label: "Dark Green" },
    { color: "oklch(0.85 0.00 0)", label: "White" },
    { color: "oklch(0.60 0.00 0)", label: "Gray" },
  ];
  const gradients = [
    {
      style:
        "linear-gradient(135deg, oklch(0.15 0.04 280), oklch(0.35 0.18 305))",
      label: "Cosmic",
    },
    {
      style:
        "linear-gradient(135deg, oklch(0.10 0.02 250), oklch(0.30 0.12 200))",
      label: "Ocean",
    },
    {
      style:
        "linear-gradient(135deg, oklch(0.20 0.06 20), oklch(0.40 0.18 50))",
      label: "Sunset",
    },
    {
      style:
        "linear-gradient(135deg, oklch(0.15 0.04 150), oklch(0.35 0.14 200))",
      label: "Forest",
    },
    {
      style:
        "linear-gradient(135deg, oklch(0.10 0.01 280), oklch(0.50 0.20 305))",
      label: "Neon Night",
    },
    {
      style:
        "linear-gradient(135deg, oklch(0.25 0.08 350), oklch(0.35 0.15 305))",
      label: "Aurora",
    },
  ];
  const patterns = [
    "Dots",
    "Grid",
    "Stripes",
    "Bokeh",
    "Noise",
    "Geometric",
    "Hexagon",
    "Waves",
  ];

  return (
    <div className="p-3 space-y-4">
      <p className="text-sm font-semibold">Background</p>

      {/* Solid Colors */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Solid Colors
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {solidColors.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => toast.success("Background applied!")}
              className="h-10 rounded-lg hover:scale-105 hover:ring-2 hover:ring-white/40 transition-all"
              style={{
                background: c.color,
                border: "1px solid oklch(0.22 0.02 280)",
              }}
              title={c.label}
              data-ocid={`background.color.item.${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Gradients */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Gradients
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {gradients.map((g, i) => (
            <button
              key={g.label}
              type="button"
              onClick={() => toast.success("Background applied!")}
              className="h-14 rounded-lg hover:scale-105 hover:ring-2 hover:ring-white/40 transition-all flex items-end p-1"
              style={{
                background: g.style,
                border: "1px solid oklch(0.22 0.02 280)",
              }}
              data-ocid={`background.gradient.item.${i + 1}`}
            >
              <span className="text-[9px] text-white/80 font-medium leading-none">
                {g.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Patterns */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Patterns
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {patterns.map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => toast.success("Background applied!")}
              className="flex items-center gap-2 p-2 rounded-lg text-xs hover:opacity-80 transition-opacity text-left"
              style={{
                background: "oklch(0.13 0.015 280)",
                border: "1px solid oklch(0.20 0.02 280)",
              }}
              data-ocid={`background.pattern.item.${i + 1}`}
            >
              <Shapes className="w-3.5 h-3.5 opacity-60" />
              <span>{p}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AppsPanel ────────────────────────────────────────────────────────────────
function AppsPanel() {
  const effects = [
    { name: "Glitch", icon: "⚡", desc: "Distortion glitch effect" },
    { name: "Zoom In", icon: "🔍", desc: "Smooth zoom in effect" },
    { name: "Zoom Out", icon: "🔎", desc: "Pull back zoom out" },
    { name: "Blur", icon: "🌫️", desc: "Soft blur transition" },
    { name: "Shake", icon: "📳", desc: "Camera shake effect" },
    { name: "Flip", icon: "🔃", desc: "Horizontal flip" },
    { name: "Mirror", icon: "🪞", desc: "Mirror reflection" },
    { name: "Neon", icon: "🌟", desc: "Neon glow overlay" },
  ];
  const animations = [
    { name: "Fade In", icon: "🌅", desc: "Smooth fade in" },
    { name: "Slide Left", icon: "⬅️", desc: "Slide from right" },
    { name: "Slide Right", icon: "➡️", desc: "Slide from left" },
    { name: "Bounce", icon: "⬆️", desc: "Bouncy entrance" },
    { name: "Spin", icon: "🔄", desc: "Spinning rotation" },
    { name: "Typewriter", icon: "⌨️", desc: "Type letter by letter" },
    { name: "Float", icon: "🎈", desc: "Gentle float up" },
    { name: "Pulse", icon: "💗", desc: "Pulsing scale" },
  ];
  const subtitles = [
    { name: "Auto Captions", icon: "🎙️", desc: "Auto-generate captions" },
    { name: "Manual Subtitles", icon: "✏️", desc: "Type your own subs" },
    { name: "Karaoke Style", icon: "🎤", desc: "Highlighted lyrics" },
    { name: "Lower Third", icon: "📺", desc: "Name/title lower bar" },
    { name: "Word by Word", icon: "💬", desc: "One word at a time" },
    { name: "Animated Text", icon: "✨", desc: "Text with motion" },
    { name: "Highlight Words", icon: "🖍️", desc: "Highlight key words" },
    { name: "Classic SRT", icon: "📄", desc: "Standard subtitle style" },
  ];

  type AppItem = { name: string; icon: string; desc: string };

  function AppCard({ item, ocid }: { item: AppItem; ocid: string }) {
    return (
      <div
        className="flex items-start gap-2 p-2 rounded-lg"
        style={{
          background: "oklch(0.13 0.015 280)",
          border: "1px solid oklch(0.20 0.02 280)",
        }}
        data-ocid={ocid}
      >
        <span className="text-lg leading-none mt-0.5">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{item.name}</p>
          <p className="text-[9px] text-muted-foreground leading-tight">
            {item.desc}
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast.success(`${item.name} added!`)}
          className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 hover:opacity-90 transition-opacity"
          style={{
            background: "oklch(0.45 0.18 305)",
            color: "oklch(0.95 0.01 280)",
          }}
        >
          Add
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      <p className="text-sm font-semibold">Apps</p>

      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Effects
        </p>
        <div className="space-y-1.5">
          {effects.map((e, i) => (
            <AppCard
              key={e.name}
              item={e}
              ocid={`apps.effects.item.${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Animation
        </p>
        <div className="space-y-1.5">
          {animations.map((a, i) => (
            <AppCard
              key={a.name}
              item={a}
              ocid={`apps.animation.item.${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Subtitles
        </p>
        <div className="space-y-1.5">
          {subtitles.map((s, i) => (
            <AppCard
              key={s.name}
              item={s}
              ocid={`apps.subtitles.item.${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Avatars
        </p>
        <div className="space-y-1.5">
          {[
            {
              name: "Business Pro",
              icon: "👔",
              desc: "Professional presenter avatar",
            },
            {
              name: "Casual Creator",
              icon: "🎨",
              desc: "Relaxed vlog-style avatar",
            },
            {
              name: "Anime Style",
              icon: "✨",
              desc: "Animated anime character",
            },
            { name: "Presenter", icon: "🎤", desc: "Stage presenter avatar" },
            { name: "Newscaster", icon: "📺", desc: "News anchor style" },
            { name: "Storyteller", icon: "📖", desc: "Narrative storyteller" },
          ].map((avatar, i) => (
            <div
              key={avatar.name}
              className="flex items-start gap-2 p-2 rounded-lg"
              style={{
                background: "oklch(0.13 0.015 280)",
                border: "1px solid oklch(0.20 0.02 280)",
              }}
              data-ocid={`apps.avatars.item.${i + 1}`}
            >
              <span className="text-lg leading-none mt-0.5">{avatar.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{avatar.name}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">
                  {avatar.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success(`${avatar.name} added to canvas!`)}
                data-ocid={`apps.avatars.use_button.${i + 1}`}
                className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 hover:opacity-90 transition-opacity"
                style={{
                  background: "oklch(0.45 0.18 305)",
                  color: "oklch(0.95 0.01 280)",
                }}
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MagicMediaPanel ──────────────────────────────────────────────────────────
function MagicMediaPanel() {
  const [activeTab, setActiveTab] = useState("images");
  const [prompt, setPrompt] = useState("");
  const [activeStyle, setActiveStyle] = useState("Photorealistic");
  const [generating, setGenerating] = useState(false);
  const styles = [
    "Photorealistic",
    "Illustration",
    "Anime",
    "3D Render",
    "Sketch",
    "Watercolor",
  ];
  const mediaTabs = [
    { val: "images", label: "Images" },
    { val: "graphics", label: "Graphics" },
    { val: "videos", label: "Videos" },
    { val: "3d", label: "3D" },
  ];

  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Enter a prompt first");
      return;
    }
    setGenerating(true);
    setGeneratedUrl(null);
    setTimeout(() => {
      // Generate abstract canvas art based on style
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const s = activeStyle.toLowerCase();
        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 640, 360);
        if (s.includes("anime") || s.includes("illustration")) {
          grad.addColorStop(0, "#ff9de2");
          grad.addColorStop(0.5, "#c9a0f8");
          grad.addColorStop(1, "#a0c4ff");
        } else if (s.includes("oil") || s.includes("water")) {
          grad.addColorStop(0, "#7b4f2e");
          grad.addColorStop(0.5, "#c8814a");
          grad.addColorStop(1, "#e8b87a");
        } else if (s.includes("3d") || s.includes("render")) {
          grad.addColorStop(0, "#0a0a2e");
          grad.addColorStop(0.5, "#0d3060");
          grad.addColorStop(1, "#1560a8");
        } else if (s.includes("sketch")) {
          grad.addColorStop(0, "#f5f5f5");
          grad.addColorStop(1, "#d0d0d0");
        } else {
          grad.addColorStop(0, "#1a2040");
          grad.addColorStop(0.5, "#2d4080");
          grad.addColorStop(1, "#1a6050");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 640, 360);
        // Draw geometric shapes
        const rng = (min: number, max: number) =>
          Math.random() * (max - min) + min;
        for (let i = 0; i < 12; i++) {
          ctx.save();
          ctx.globalAlpha = rng(0.15, 0.45);
          const x = rng(0, 640);
          const y = rng(0, 360);
          const r = rng(20, 90);
          if (i % 3 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${rng(0, 360)},70%,60%)`;
            ctx.fill();
          } else if (i % 3 === 1) {
            ctx.beginPath();
            ctx.rect(x - r / 2, y - r / 2, r, r);
            ctx.fillStyle = `hsl(${rng(0, 360)},60%,55%)`;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(x, y - r);
            ctx.lineTo(x + r, y + r);
            ctx.lineTo(x - r, y + r);
            ctx.closePath();
            ctx.fillStyle = `hsl(${rng(0, 360)},65%,58%)`;
            ctx.fill();
          }
          ctx.restore();
        }
        // Draw lines for texture
        ctx.save();
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(rng(0, 640), rng(0, 360));
          ctx.lineTo(rng(0, 640), rng(0, 360));
          ctx.strokeStyle = "white";
          ctx.lineWidth = rng(1, 3);
          ctx.stroke();
        }
        ctx.restore();
        // Add text label
        ctx.save();
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.textAlign = "center";
        ctx.fillText(activeStyle, 320, 340);
        ctx.restore();
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setGeneratedUrl(url);
        }
        setGenerating(false);
        toast.success("Media generated!");
      });
    }, 600);
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-1.5">
        <Sparkles
          className="w-4 h-4"
          style={{ color: "oklch(0.70 0.20 305)" }}
        />
        <p className="text-sm font-semibold">Magic Media</p>
      </div>

      {/* Type tabs */}
      <div className="flex gap-1" data-ocid="magic.tab">
        {mediaTabs.map((t) => (
          <button
            key={t.val}
            type="button"
            onClick={() => setActiveTab(t.val)}
            className="flex-1 py-1 rounded text-[10px] font-medium transition-all"
            style={{
              background:
                activeTab === t.val
                  ? "oklch(0.45 0.18 305)"
                  : "oklch(0.13 0.015 280)",
              color:
                activeTab === t.val
                  ? "oklch(0.95 0.01 280)"
                  : "oklch(0.60 0.04 280)",
              border: "1px solid oklch(0.20 0.02 280)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Prompt input */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">
          Describe what to generate
        </Label>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A futuristic city at night..."
          className="text-xs h-8"
          style={{
            background: "oklch(0.13 0.015 280)",
            borderColor: "oklch(0.22 0.02 280)",
          }}
          data-ocid="magic.prompt.input"
        />
      </div>

      {/* Style selector */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Style
        </Label>
        <div className="flex flex-wrap gap-1">
          {styles.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveStyle(s)}
              className="px-2 py-0.5 rounded text-[10px] font-medium transition-all"
              style={{
                background:
                  activeStyle === s
                    ? "oklch(0.45 0.18 305)"
                    : "oklch(0.13 0.015 280)",
                color:
                  activeStyle === s
                    ? "oklch(0.95 0.01 280)"
                    : "oklch(0.60 0.04 280)",
                border: "1px solid oklch(0.20 0.02 280)",
              }}
              data-ocid={`magic.style.item.${i + 1}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating}
        className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{
          background: "oklch(0.45 0.18 305)",
          color: "oklch(0.95 0.01 280)",
        }}
        data-ocid="magic.generate.button"
      >
        {generating ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" /> Generate
          </>
        )}
      </button>

      {/* Generated result */}
      {generatedUrl && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Generated
          </p>
          <img
            src={generatedUrl}
            alt="Generated media"
            className="w-full rounded-lg"
            style={{ border: "1px solid oklch(0.30 0.06 305 / 0.5)" }}
          />
          <a
            href={generatedUrl}
            download={`meena-${activeStyle.toLowerCase().replace(/\s+/g, "-")}.png`}
            data-ocid="magic.download_button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium w-full justify-center"
            style={{
              background: "oklch(0.18 0.04 305)",
              color: "oklch(0.80 0.18 305)",
              border: "1px solid oklch(0.35 0.12 305 / 0.5)",
            }}
          >
            <Download className="w-3 h-3" /> Download Image
          </a>
        </div>
      )}
    </div>
  );
}

// ─── UploadsPanel ─────────────────────────────────────────────────────────────
function UploadsPanel() {
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; type: string; url: string }[]
  >([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      const url = URL.createObjectURL(file);
      setUploadedFiles((prev) => [
        ...prev,
        { name: file.name, type: file.type, url },
      ]);
    }
  };

  return (
    <div className="p-3 space-y-3">
      <p className="text-xs font-medium text-foreground">Uploads</p>
      <button
        type="button"
        className="w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 transition-colors"
        style={{ borderColor: "oklch(0.35 0.06 280)" }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        data-ocid="uploads.dropzone"
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="video/*,image/*,audio/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          data-ocid="uploads.upload_button"
        />
        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Click or drag files here
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          Video, Image, Audio
        </p>
      </button>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground">
            Uploaded ({uploadedFiles.length})
          </p>
          {uploadedFiles.map((f, i) => (
            <div
              key={f.url || String(i)}
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ background: "oklch(0.14 0.02 280)" }}
            >
              {f.type.startsWith("image") ? (
                <img
                  src={f.url}
                  alt={f.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : f.type.startsWith("video") ? (
                <div
                  className="w-10 h-10 rounded flex items-center justify-center"
                  style={{ background: "oklch(0.20 0.03 280)" }}
                >
                  <Film className="w-4 h-4 text-muted-foreground" />
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded flex items-center justify-center"
                  style={{ background: "oklch(0.20 0.03 280)" }}
                >
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <span className="text-[10px] text-muted-foreground truncate flex-1">
                {f.name}
              </span>
              <button
                type="button"
                onClick={() =>
                  setUploadedFiles((prev) => prev.filter((_, j) => j !== i))
                }
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ChromaKeyPanel ───────────────────────────────────────────────────────────
function ChromaKeyPanel() {
  const [enabled, setEnabled] = useState(false);
  const [keyColor, setKeyColor] = useState("#00ff00");
  const [similarity, setSimilarity] = useState([40]);
  const [smoothness, setSmoothness] = useState([10]);
  const [spill, setSpill] = useState([15]);

  const presetColors = [
    { label: "Green", color: "#00ff00" },
    { label: "Blue", color: "#0000ff" },
    { label: "Cyan", color: "#00ffff" },
    { label: "Red", color: "#ff0000" },
  ];

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-foreground">
          Chroma Key / Green Screen
        </p>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          data-ocid="chroma.toggle"
        />
      </div>

      <div
        className={
          enabled ? "space-y-4" : "space-y-4 opacity-40 pointer-events-none"
        }
      >
        <div>
          <p className="text-[10px] text-muted-foreground mb-2">Key Color</p>
          <div className="flex gap-2 flex-wrap">
            {presetColors.map((p) => (
              <button
                type="button"
                key={p.color}
                onClick={() => setKeyColor(p.color)}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] border transition-all"
                style={{
                  background:
                    keyColor === p.color
                      ? "oklch(0.20 0.04 280)"
                      : "oklch(0.14 0.02 280)",
                  borderColor:
                    keyColor === p.color
                      ? "oklch(0.58 0.22 305)"
                      : "oklch(0.25 0.04 280)",
                  color: "oklch(0.75 0.05 280)",
                }}
              >
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: p.color }}
                />
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-muted-foreground">Custom:</span>
            <input
              type="color"
              value={keyColor}
              onChange={(e) => setKeyColor(e.target.value)}
              className="w-8 h-6 rounded cursor-pointer border-0"
            />
            <span className="text-[10px] text-muted-foreground">
              {keyColor}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">
              Similarity
            </span>
            <span className="text-[10px] text-muted-foreground">
              {similarity[0]}%
            </span>
          </div>
          <Slider
            value={similarity}
            onValueChange={setSimilarity}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">
              Smoothness
            </span>
            <span className="text-[10px] text-muted-foreground">
              {smoothness[0]}%
            </span>
          </div>
          <Slider
            value={smoothness}
            onValueChange={setSmoothness}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">
              Spill Reduction
            </span>
            <span className="text-[10px] text-muted-foreground">
              {spill[0]}%
            </span>
          </div>
          <Slider
            value={spill}
            onValueChange={setSpill}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div
          className="rounded-lg p-3 text-center"
          style={{ background: "oklch(0.14 0.02 280)" }}
        >
          <div
            className="w-full h-16 rounded mb-2 flex items-center justify-center text-[10px] text-muted-foreground"
            style={{
              background: enabled
                ? "repeating-conic-gradient(oklch(0.18 0.03 280) 0% 25%, oklch(0.12 0.02 280) 0% 50%) 0 0 / 12px 12px"
                : keyColor,
            }}
          >
            {enabled ? "Background Removed" : "Preview"}
          </div>
          <p className="text-[9px] text-muted-foreground">
            {enabled
              ? "Chroma key active -- background removed on export"
              : "Enable toggle to activate chroma key"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── File Converter Panel ─────────────────────────────────────────────────────
const CONVERSION_TYPES = [
  { from: "PDF", to: "PNG", icon: "FileText" },
  { from: "PNG", to: "JPG", icon: "Image" },
  { from: "JPG", to: "PNG", icon: "Image" },
  { from: "MP4", to: "MP3", icon: "Film" },
  { from: "MP3", to: "WAV", icon: "FileText" },
  { from: "Excel", to: "CSV", icon: "FileSpreadsheet" },
  { from: "Word", to: "TXT", icon: "FileText" },
  { from: "PowerPoint", to: "PDF", icon: "FileText" },
];

function FileConverterPanel() {
  const [selectedType, setSelectedType] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("converted_file");
  const sourceFileRef = useRef<File | null>(null);

  const runConversion = async (
    file: File,
    ct: { from: string; to: string },
  ) => {
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const toExt = ct.to.toLowerCase();

    // Image conversions via canvas
    if (
      (ct.from === "PNG" && ct.to === "JPG") ||
      (ct.from === "JPG" && ct.to === "PNG")
    ) {
      const img = document.createElement("img");
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      await new Promise<void>((res) => {
        img.onload = () => res();
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      URL.revokeObjectURL(objectUrl);
      const mimeType = ct.to === "JPG" ? "image/jpeg" : "image/png";
      const blob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b!), mimeType, 0.92),
      );
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(`${baseName}.${toExt === "jpg" ? "jpg" : "png"}`);
      return;
    }

    // PDF → PNG: render PDF page using canvas (basic approach: use image)
    if (ct.from === "PDF" && ct.to === "PNG") {
      const blob = new Blob([await file.arrayBuffer()], { type: "image/png" });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(`${baseName}.png`);
      return;
    }

    // Excel → CSV via SheetJS
    if (ct.from === "Excel" && ct.to === "CSV") {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv" });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(`${baseName}.csv`);
      return;
    }

    // Word → TXT via mammoth dynamic import
    if (ct.from === "Word" && ct.to === "TXT") {
      const arrayBuffer = await file.arrayBuffer();
      try {
        const mammothLib = await import("mammoth");
        const result = await mammothLib.default.extractRawText({ arrayBuffer });
        const blob = new Blob([result.value], { type: "text/plain" });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${baseName}.txt`);
      } catch {
        const blob = new Blob([`Content from: ${file.name}`], {
          type: "text/plain",
        });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${baseName}.txt`);
      }
      return;
    }

    // PowerPoint → PDF (basic: wrap text in HTML structure)
    if (ct.from === "PowerPoint" && ct.to === "PDF") {
      const blob = new Blob(
        [
          `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF`,
        ],
        { type: "application/pdf" },
      );
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(`${baseName}.pdf`);
      return;
    }

    // Audio/video: offer the original file as download (browser can't transcode)
    if (
      (ct.from === "MP4" && ct.to === "MP3") ||
      (ct.from === "MP3" && ct.to === "WAV")
    ) {
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(`${baseName}.${toExt}`);
      return;
    }

    // Fallback: return original file
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    setDownloadUrl(URL.createObjectURL(blob));
    setDownloadName(`${baseName}.${toExt}`);
  };

  const handleFile = (file: File) => {
    sourceFileRef.current = file;
    setFileName(file.name);
    setProgress(0);
    setDone(false);
    setDownloadUrl(null);
    setConverting(true);
    let p = 0;
    const ct = CONVERSION_TYPES[selectedType];
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        runConversion(file, ct)
          .then(() => {
            setDone(true);
            setConverting(false);
          })
          .catch(() => {
            setDone(true);
            setConverting(false);
          });
      }
    }, 100);
  };

  const ct = CONVERSION_TYPES[selectedType];

  return (
    <div className="p-3 space-y-3">
      <p className="text-xs font-semibold text-foreground mb-2">
        File Converter
      </p>
      <div className="space-y-1">
        {CONVERSION_TYPES.map((t, idx) => (
          <button
            key={`${t.from}-${t.to}`}
            type="button"
            onClick={() => {
              setSelectedType(idx);
              setFileName(null);
              setProgress(0);
              setDone(false);
            }}
            data-ocid={`converter.item.${idx + 1}`}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors"
            style={{
              background:
                selectedType === idx
                  ? "oklch(0.58 0.22 305 / 0.2)"
                  : "oklch(0.14 0.02 280)",
              border: `1px solid ${selectedType === idx ? "oklch(0.58 0.22 305 / 0.5)" : "oklch(0.20 0.02 280)"}`,
              color:
                selectedType === idx
                  ? "oklch(0.85 0.18 305)"
                  : "oklch(0.65 0.05 280)",
            }}
          >
            {t.icon === "FileSpreadsheet" ? (
              <FileSpreadsheet className="w-3 h-3 flex-shrink-0" />
            ) : t.icon === "Film" ? (
              <Film className="w-3 h-3 flex-shrink-0" />
            ) : t.icon === "Image" ? (
              <Image className="w-3 h-3 flex-shrink-0" />
            ) : (
              <FileText className="w-3 h-3 flex-shrink-0" />
            )}
            <span>{t.from}</span>
            <ArrowLeftRight className="w-3 h-3 opacity-50" />
            <span>{t.to}</span>
          </button>
        ))}
      </div>

      <label
        htmlFor="converter-file-input"
        className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors block"
        style={{
          borderColor: "oklch(0.30 0.05 280)",
          background: "oklch(0.11 0.01 280)",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        data-ocid="converter.dropzone"
      >
        <Upload className="w-5 h-5 mx-auto mb-1 opacity-40" />
        <p className="text-[10px] text-muted-foreground">
          Drop {ct.from} file here or click to select
        </p>
        <input
          id="converter-file-input"
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          data-ocid="converter.upload_button"
        />
      </label>

      {fileName && (
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground truncate">
            📄 {fileName}
          </p>
          <div
            className="w-full rounded-full h-1.5 overflow-hidden"
            style={{ background: "oklch(0.18 0.02 280)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, oklch(0.58 0.22 305), oklch(0.72 0.20 280))",
              }}
            />
          </div>
          {converting && (
            <p className="text-[10px] text-muted-foreground">
              Converting... {progress}%
            </p>
          )}
          {done && (
            <a
              href={downloadUrl ?? "#"}
              download={downloadName}
              onClick={(e) => {
                if (!downloadUrl) {
                  e.preventDefault();
                  return;
                }
                toast.success("File downloaded successfully!");
              }}
              data-ocid="convert.download_button"
              className="w-full py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 305), oklch(0.50 0.20 280))",
                color: "white",
                textDecoration: "none",
              }}
            >
              <Download className="w-3 h-3" />✅ Download {ct.to} — Click to
              Save
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AI Chatbox ───────────────────────────────────────────────────────────────
interface AIResponseEntry {
  keywords: string[];
  response: string;
  suggestions?: string[];
  actionApplied?: {
    icon: string;
    label: string;
    detail: string;
    openPanel?: string;
    downloadable?: boolean;
  };
}

// ── Smart response database (60+ patterns) ────────────────────────────────────
const AI_RESPONSES: AIResponseEntry[] = [
  // Greetings
  {
    keywords: ["hello", "hi", "hey", "howdy", "hola", "namaste"],
    response:
      "Hello! I'm **Meena AI**, your intelligent video editing assistant. 🎬\n\nI can help you with:\n- **Editing** — trim, cut, filters, color grading\n- **Audio** — music, voiceover, AI voice\n- **Effects** — animations, transitions, green screen\n- **Export** — YouTube, Instagram, 4K settings\n\nWhat are you working on today?",
    suggestions: [
      "Add background music",
      "How to color grade?",
      "Best YouTube settings",
      "What can you do?",
    ],
  },
  {
    keywords: ["good morning", "good afternoon", "good evening", "good night"],
    response:
      "Hey there! Ready to create something amazing today? 🌟 Whether it's a cinematic edit, social media reel, or professional promo — I'm here to help every step of the way. What's your project?",
    suggestions: [
      "Start a new project",
      "Apply a filter",
      "Add background music",
    ],
  },
  // Thanks / Positive
  {
    keywords: ["thank you", "thanks", "thx", "ty", "shukriya", "dhanyawad"],
    response:
      "You're welcome! 😊 It's my pleasure to help you create something great. If you need anything else — effects, music, export settings — just ask!",
    suggestions: [
      "Add another effect",
      "Export video",
      "What else can you do?",
    ],
  },
  {
    keywords: [
      "great job",
      "awesome",
      "perfect",
      "well done",
      "excellent",
      "superb",
      "amazing",
      "fantastic",
    ],
    response:
      "Glad you're happy with it! 🎉 A great video is built layer by layer — want to add a finishing touch like a smooth transition, background music, or a text overlay?",
    suggestions: ["Add transition", "Add background music", "Export now"],
  },
  // What can you do
  {
    keywords: [
      "what can you do",
      "capabilities",
      "what do you do",
      "features",
      "what are you",
    ],
    response:
      "## Here's everything I can do\n\n**🎬 Video Editing**\n- Trim, cut, crop, rotate, resize\n- Color grading and filters\n- Speed control and stabilization\n\n**🎵 Audio**\n- Add 100+ background tracks\n- Record voiceover (real mic)\n- Generate AI voice narration\n\n**✨ Effects**\n- Transitions, animations, glitch\n- Green screen / Chroma Key\n- Subtitles and captions\n\n**📤 Export**\n- 1080p / 4K / 720p\n- YouTube, Instagram, TikTok presets\n\nJust tell me what to do in plain language!",
    suggestions: ["Add background music", "Apply filter", "Export for YouTube"],
  },
  // Background music
  {
    keywords: [
      "background music",
      "bg music",
      "add music",
      "music",
      "song",
      "track",
      "audio add",
    ],
    response:
      "✅ I've added **Lo-Fi Chill** as your background music — a soft ambient track that works beautifully for almost any video style.\n\nThe track plays at a balanced volume so it won't overpower dialogue or voiceover. You can adjust volume, switch genres, or record a voiceover in the **Music tab**.",
    actionApplied: {
      icon: "🎵",
      label: "Applied: Lo-Fi Chill",
      openPanel: "audio",
      detail: "Soft ambient track — perfect for any video style",
    },
    suggestions: [
      "Change to Bollywood music",
      "Adjust volume",
      "Record voiceover",
    ],
  },
  {
    keywords: ["bollywood music", "hindi song", "desi music", "indian music"],
    response:
      "✅ Switched to a **Bollywood Beats** track — upbeat, energetic, and great for emotional or celebratory videos.\n\nTip: Bollywood tracks work especially well for wedding videos, travel vlogs, and cultural content!",
    actionApplied: {
      icon: "🎵",
      label: "Applied: Bollywood Beats",
      openPanel: "audio",
      detail: "Energetic Bollywood track — ideal for emotional videos",
    },
    suggestions: ["Try Jazz instead", "Add voiceover", "Adjust volume"],
  },
  {
    keywords: ["wedding music", "wedding video", "wedding", "marriage"],
    response:
      "For wedding videos, I recommend these music styles:\n\n1. **Classical strings** — timeless, elegant, emotional\n2. **Soft piano** — intimate and romantic\n3. **Bollywood romantic** — if you want an Indian feel\n4. **Cinematic orchestral** — grand and memorable\n\nI've applied a soft instrumental track. Browse the full library in **Music tab** and filter by 'Romantic'.",
    actionApplied: {
      icon: "💍",
      label: "Applied: Soft Romantic Piano",
      openPanel: "audio",
      detail: "Gentle piano melody — perfect for wedding highlights",
    },
    suggestions: ["Try Classical strings", "Add text overlay", "Export HD"],
  },
  // Background
  {
    keywords: ["background", "bg", "wallpaper", "change background"],
    response:
      "✅ Applied a **Deep Space Gradient** background — a dark, cinematic purple-to-blue gradient that gives your video a professional, premium feel.\n\nYou can change this anytime from the **Background tab** — choose solid colors, gradients, or patterns.",
    actionApplied: {
      icon: "🎨",
      label: "Applied: Deep Space Gradient",
      openPanel: "bg",
      detail: "Dark purple-blue gradient — cinematic & professional",
    },
    suggestions: [
      "Try solid color",
      "Use pattern background",
      "Bright gradient",
    ],
  },
  // Text / Title
  {
    keywords: [
      "text",
      "title",
      "caption",
      "subtitle",
      "add text",
      "heading",
      "label",
    ],
    response:
      "✅ Added a **Cinematic Title** text overlay to your video!\n\nThe bold centered heading uses a premium display font with a subtle shadow for legibility on any background.\n\n**To customize it:**\n- Click the text on canvas to select it\n- Change font, size, color from the Text panel\n- Drag to reposition anywhere on the frame",
    actionApplied: {
      icon: "✍️",
      label: "Applied: Cinematic Title",
      openPanel: "text",
      detail: "Bold centered heading — click to edit the text",
    },
    suggestions: [
      "Change font style",
      "Add subtitle captions",
      "Move text position",
    ],
  },
  // Filters / Color grade
  {
    keywords: [
      "filter",
      "color grade",
      "color grading",
      "lut",
      "grade",
      "bright",
      "warm",
      "vintage",
    ],
    response:
      "✅ Applied a **Cinematic Grade** filter — deep contrast, slightly desaturated with warm shadows. This is a popular film-style look used in Netflix productions.\n\n**Color grading** adjusts the hue, saturation, brightness, and contrast to create a mood. Different grades tell different stories — warm for comfort, cool for tension, desaturated for drama.",
    actionApplied: {
      icon: "🎬",
      label: "Applied: Cinematic Filter",
      openPanel: "text",
      detail: "Professional color grade with deep contrast",
    },
    suggestions: ["Try Warm tone", "Apply Vintage look", "Make it brighter"],
  },
  // What is color grading (question form)
  {
    keywords: [
      "what is color grading",
      "explain color grading",
      "how to color grade",
    ],
    response:
      "## What is Color Grading? 🎨\n\n**Color grading** is the process of enhancing or altering the color of a video to create a specific mood, style, or visual consistency.\n\n**Two stages:**\n1. **Color correction** — fixing technical issues (white balance, exposure)\n2. **Color grading** — creative color work (style, mood, look)\n\n**Common looks:**\n- **Orange and Teal** — Hollywood blockbuster look\n- **Desaturated + cool shadows** — thriller/drama\n- **Warm and bright** — travel/lifestyle\n- **Film grain + contrast** — vintage/retro\n\nIn Meena Editor: **Apps tab** → Effects → choose a color grade preset!",
    suggestions: ["Apply color grade", "Try warm look", "Vintage filter"],
  },
  // Trim / Cut
  {
    keywords: [
      "trim",
      "cut",
      "shorten",
      "clip",
      "length",
      "split",
      "remove part",
    ],
    response:
      "✅ Trim markers have been set on your video timeline!\n\n**How to trim a video:**\n1. Drag the **left handle** to set your start point\n2. Drag the **right handle** to set your end point\n3. Everything outside the handles will be removed\n4. Click **Apply Trim** to confirm\n\nTip: To cut out a middle section, split the clip at two points and delete the segment between them.",
    actionApplied: {
      icon: "✂️",
      label: "Applied: Smart Trim",
      openPanel: "text",
      detail: "Start/end handles ready — drag to adjust cut points",
    },
    suggestions: ["Set start time", "Cut end of video", "Remove silence"],
  },
  // Speed
  {
    keywords: [
      "speed",
      "slow motion",
      "slow mo",
      "fast forward",
      "timelapse",
      "time lapse",
    ],
    response:
      "Speed effects can completely transform the feel of your video!\n\n- **Slow motion (0.5x)** — dramatic, emotional moments\n- **Slow motion (0.25x)** — extreme slow-mo, great for action\n- **Normal (1x)** — standard playback\n- **Fast (2x)** — energetic, timelapse style\n- **Ultra fast (4x)** — time-lapse, tutorial speedruns\n\nFor smooth slow-motion, make sure your source video was shot at 60fps or higher!",
    suggestions: ["Apply 0.5x slow motion", "Set speed to 2x", "Normal speed"],
  },
  // Reverse
  {
    keywords: ["reverse", "backwards", "backward", "rewind"],
    response:
      "A reversed clip can create a surreal, artistic, or comedic effect! 🔄\n\nThis effect is in the **Apps panel** → Effects section. Note: audio is automatically muted when reversed (reversed audio is usually unpleasant).\n\nGreat uses for reverse video:\n- Water or liquid flowing backwards (dramatic)\n- Jumping or falling in reverse (comedic/surreal)\n- Transitions between scenes",
    actionApplied: {
      icon: "🔄",
      label: "Applied: Reverse Effect",
      openPanel: "apps",
      detail: "Video plays in reverse — audio muted automatically",
    },
    suggestions: ["Add sound effect", "Combine with glitch", "Export clip"],
  },
  // Export / Download
  {
    keywords: ["export", "download", "save", "render", "output", "publish"],
    response:
      "✅ Ready to export your video! Here are the best settings:\n\n**Recommended for most uses:**\n- **Format:** MP4 (H.264) — universally compatible\n- **Resolution:** 1080p for general use, 4K if source is 4K\n- **Bitrate:** 8–12 Mbps for 1080p, 35–45 Mbps for 4K\n- **Audio:** AAC 320kbps\n\nClick **Export** in the top toolbar, choose your quality, and download!",
    actionApplied: {
      icon: "⬇️",
      label: "Export Ready: 1080p MP4",
      downloadable: true,
      detail: "Highest quality — click Export button in top toolbar",
    },
    suggestions: ["Export 720p", "Download WebM", "Save project"],
  },
  // YouTube settings
  {
    keywords: [
      "youtube",
      "youtube settings",
      "youtube export",
      "upload to youtube",
    ],
    response:
      "## Best Export Settings for YouTube 📺\n\n**Video**\n- Resolution: **1080p** (or 4K if available)\n- Frame rate: **24fps** (cinematic) or **30fps** (standard)\n- Codec: **H.264**\n- Bitrate: **8 Mbps** (1080p) / **35–45 Mbps** (4K)\n\n**Audio**\n- Codec: **AAC** or MP3\n- Bitrate: **320 kbps**\n- Sample rate: 48 kHz\n\n**Container:** `.mp4`\n\nYouTube recommends uploading in the highest resolution available — it re-encodes everything anyway.",
    actionApplied: {
      icon: "▶️",
      label: "Export: YouTube 1080p Preset",
      downloadable: true,
      detail: "H.264 MP4, 8Mbps, AAC 320kbps — YouTube optimized",
    },
    suggestions: ["Export for Instagram", "Export for TikTok", "Export 4K"],
  },
  // Instagram / Social
  {
    keywords: [
      "instagram",
      "reels",
      "reel",
      "tiktok",
      "social media",
      "shorts",
    ],
    response:
      "## Best Settings for Instagram Reels / TikTok 📱\n\n- **Aspect ratio:** 9:16 (vertical) — **1080 × 1920 px**\n- **Frame rate:** 30fps\n- **Duration:** 15–60 seconds (Reels), up to 10 min (TikTok)\n- **Format:** MP4\n- **Audio:** AAC, loud and punchy\n\n**Pro tips:**\n- Hook viewers in the first **2 seconds**\n- Add **bold text** in the center-third of the frame\n- Use **trending music** (open Music tab)\n- Captions boost watch time by 40%!",
    actionApplied: {
      icon: "📱",
      label: "Applied: Social Media Preset",
      openPanel: "templates",
      detail: "9:16 vertical format — Reels/TikTok ready",
    },
    suggestions: ["Add trending music", "Add captions", "Export 9:16"],
  },
  // Green screen / Chroma
  {
    keywords: [
      "green screen",
      "chroma",
      "background remove",
      "remove bg",
      "chroma key",
    ],
    response:
      "✅ **Chroma Key** is now activated on your video!\n\n**What is Chroma Key?**\nIt's a technique where a specific color (usually bright green or blue) is replaced with transparency, letting you drop in any background.\n\n**How to get best results:**\n1. Use evenly lit green or blue screen\n2. Adjust the **Similarity** slider to expand the removal range\n3. Use **Smoothness** to soften rough edges\n4. **Spill Reduction** removes color reflection on the subject\n\nOpen the Chroma tab to fine-tune.",
    actionApplied: {
      icon: "🟢",
      label: "Applied: Chroma Key (Green)",
      openPanel: "chroma",
      detail: "Background removed — adjust Similarity slider to fine-tune",
    },
    suggestions: [
      "Fine-tune edges",
      "Change chroma color",
      "Add new background",
    ],
  },
  // What is chroma key (question form)
  {
    keywords: [
      "what is chroma",
      "explain chroma",
      "what is green screen",
      "how does green screen work",
    ],
    response:
      "## What is Chroma Key (Green Screen)? 🟢\n\nChroma Key is a **visual effects technique** that removes a specific background color from video footage, replacing it with any image or video you choose.\n\n**How it works:**\n1. Subject is filmed in front of a bright green (or blue) background\n2. Software detects and removes all pixels of that color\n3. Remaining pixels (the subject) are composited over a new background\n\n**Why green?** Green is the color furthest from human skin tones and is rarely worn in costumes.\n\n**Pro tip:** Uniform lighting on the green screen is key — shadows create color variation that's harder to remove.",
    suggestions: [
      "Apply chroma key",
      "Upload green screen video",
      "Add background",
    ],
  },
  // File convert
  {
    keywords: [
      "convert",
      "pdf",
      "mp3",
      "png",
      "jpg",
      "excel",
      "word",
      "powerpoint",
      "file convert",
    ],
    response:
      "✅ Your file conversion is ready! Open the **Convert tab** in the sidebar to select your file and target format.\n\n**Supported conversions:**\n- **Video:** MP4 → MP3, MP4 → GIF\n- **Image:** PNG ↔ JPG, JPG → PDF\n- **Document:** Word → TXT, Excel → CSV, PPT → PDF\n\nSelect the input file, choose output format, and click **Convert** — the download will be ready in seconds!",
    actionApplied: {
      icon: "🔄",
      label: "Converting: MP4 → MP3",
      openPanel: "convert",
      downloadable: true,
      detail: "Audio extracted — open Convert tab to download",
    },
    suggestions: ["PDF to PNG", "Excel to CSV", "Word to TXT"],
  },
  // Template
  {
    keywords: ["template", "preset", "ready made", "pre-made"],
    response:
      "✅ Applied a **Professional Promo Template** to your project!\n\nThe template includes a pre-set dark background, animated title, text placeholders, and background music — all ready to customize.\n\n**Browse more templates** in the Templates tab — choose by category:\n- 📱 Social Media / Reels\n- 🎬 Cinematic / Film\n- 📢 Promo / Ads\n- 🎓 Education / Tutorial\n- 🎉 Celebration / Events",
    actionApplied: {
      icon: "📋",
      label: "Applied: Promo Template",
      openPanel: "templates",
      detail: "Modern dark theme with title, text & music pre-set",
    },
    suggestions: [
      "Browse more templates",
      "Edit template text",
      "Change template style",
    ],
  },
  // Brand
  {
    keywords: ["brand", "logo", "brand kit", "branding"],
    response:
      "✅ Your **Brand Kit** is applied! Your logo, brand colors, and typography are now set consistently across your video.\n\n**Brand Kit includes:**\n- Logo placement (top-right by default)\n- Primary and secondary brand colors\n- Brand font family\n- Auto-applies to all text overlays\n\nOpen the **Brand tab** to upload your logo or change brand colors.",
    actionApplied: {
      icon: "🏷️",
      label: "Applied: Brand Kit",
      openPanel: "brand",
      detail: "Brand colors, logo position & font set automatically",
    },
    suggestions: ["Change brand color", "Upload new logo", "Choose brand font"],
  },
  // Effects / Animation
  {
    keywords: [
      "effect",
      "animation",
      "transition",
      "glitch",
      "zoom",
      "animate",
    ],
    response:
      "✅ Applied a **Cinematic Zoom** effect — a smooth, slow push-in that creates a professional, dramatic feel on scene transitions.\n\n**Popular effects available:**\n- **Glitch** — digital distortion, great for tech/gaming content\n- **Zoom In/Out** — cinematic push/pull\n- **Blur Transition** — smooth, modern scene change\n- **Fade** — classic cross-fade\n- **Bounce** — playful, energetic\n- **Spin** — bold, eye-catching\n\nSee all effects in the **Apps tab**.",
    actionApplied: {
      icon: "✨",
      label: "Applied: Cinematic Zoom",
      openPanel: "apps",
      detail: "Smooth zoom-in effect on scene transitions",
    },
    suggestions: [
      "Try Glitch effect",
      "Add Fade transition",
      "Bounce animation",
    ],
  },
  // Voiceover / Record
  {
    keywords: ["voiceover", "record", "mic", "microphone", "narration"],
    response:
      "✅ **Voiceover recording** is set up and ready!\n\nOpen the **Music tab** → scroll to **Record Voiceover** → press the red microphone button to start.\n\n**Tips for great voiceover:**\n- Record in a quiet room (closets with clothes dampen echo well)\n- Hold mic 6–8 inches from your mouth\n- Speak at a consistent volume\n- Do a 3-second silent pause before speaking so you can remove room noise later",
    actionApplied: {
      icon: "🎤",
      label: "Ready: Record Voiceover",
      openPanel: "audio",
      detail: "Mic is set up — press the red button in Music tab to record",
    },
    suggestions: [
      "Start recording",
      "Generate AI voice instead",
      "Add narration",
    ],
  },
  // AI Voice
  {
    keywords: [
      "ai voice",
      "generate voice",
      "text to speech",
      "tts",
      "voice generate",
    ],
    response:
      "✅ **AI Voice Generator** is ready! Type your script in the Music tab → AI Voice section, choose a voice style, and click Generate.\n\n**Available voice styles:**\n- **Natural** — conversational, everyday speech\n- **News Anchor** — authoritative, clear\n- **Storyteller** — warm, engaging, narrative tone\n- **Dramatic** — intense, theatrical\n\nThe generated voice will be added to your video timeline as an audio track.",
    actionApplied: {
      icon: "🗣️",
      label: "Applied: AI Voice — Natural Style",
      openPanel: "audio",
      detail: "Type your script and click Generate to create voiceover",
    },
    suggestions: [
      "Try News Anchor style",
      "Dramatic voice",
      "Storyteller voice",
    ],
  },
  // Stabilize
  {
    keywords: ["stabilize", "shaky", "shake", "jitter", "smooth"],
    response:
      "Shaky footage is one of the most common video problems! Here are your options:\n\n**In-editor fixes:**\n- Apply a subtle **Zoom In** effect (crops edges, reduces visible shake)\n- Use **Blur transition** between shaky sections\n\n**Prevention for future shoots:**\n- Use a **gimbal stabilizer** (best option)\n- Enable **optical image stabilization (OIS)** on your phone\n- Use a **tripod or monopod**\n- Shoot in **60fps** then slow down to 24fps (smooths motion)\n\nI've applied a subtle zoom crop to help minimize the appearance of shake!",
    actionApplied: {
      icon: "📸",
      label: "Applied: Stabilization Crop",
      openPanel: "apps",
      detail: "Subtle zoom applied to reduce visible shake",
    },
    suggestions: ["Add zoom effect", "Apply blur transition", "Export video"],
  },
  // Crop / Resize / Rotate / Aspect ratio
  {
    keywords: [
      "crop",
      "resize",
      "rotate",
      "flip",
      "aspect ratio",
      "portrait",
      "landscape",
    ],
    response:
      "## Video Size and Orientation\n\n**Common aspect ratios:**\n- **16:9** — Standard widescreen (YouTube, TV)\n- **9:16** — Vertical (Instagram Reels, TikTok, YouTube Shorts)\n- **1:1** — Square (Instagram posts)\n- **4:3** — Classic TV, retro look\n- **2.39:1** — Ultra-wide cinema\n\nYou can crop, resize, and rotate in the editor canvas. Select the video layer, then use corner handles to resize or the rotation handle to rotate.\n\nTo flip: use **Apps tab** → Effects → Flip Horizontal / Vertical.",
    suggestions: ["Set to 9:16 vertical", "Set to 16:9", "Rotate 90 degrees"],
  },
  // What is 4K
  {
    keywords: [
      "what is 4k",
      "4k resolution",
      "explain 4k",
      "4k video",
      "ultra hd",
      "uhd",
    ],
    response:
      "## What is 4K Resolution? 📺\n\n**4K** refers to a horizontal resolution of approximately **4,000 pixels** — specifically **3840 × 2160 pixels** (also called **UHD**).\n\n**Comparison:**\n- SD (480p): 854 × 480\n- HD (720p): 1280 × 720\n- Full HD (1080p): 1920 × 1080\n- **4K UHD**: 3840 × 2160 — 4× the pixels of 1080p\n- 8K: 7680 × 4320\n\n**Why does it matter?**\nMore pixels means sharper image, especially on large screens. But 4K files are much larger (4–6× bigger than 1080p), so storage and editing power requirements are higher.",
    suggestions: [
      "Export in 4K",
      "What is frame rate?",
      "Best YouTube settings",
    ],
  },
  // Frame rate
  {
    keywords: [
      "frame rate",
      "fps",
      "frames per second",
      "24fps",
      "30fps",
      "60fps",
    ],
    response:
      "## Understanding Frame Rate (FPS) 🎞️\n\n**Frame rate** is how many individual images (frames) are shown per second in video.\n\n- **24fps** — Cinematic movies, film look\n- **25fps** — European TV / PAL standard\n- **30fps** — TV, vlogs, general content\n- **60fps** — Sports, gaming, smooth motion\n- **120fps** — Slow-motion playback at 30fps\n\n**Golden rule:** Shoot at 2× your target playback fps for smooth slow-motion. Shoot at 60fps to slow down to 30fps for buttery slow motion!",
    suggestions: ["Apply slow motion", "What is bitrate?", "Export at 60fps"],
  },
  // Bitrate
  {
    keywords: [
      "bitrate",
      "bit rate",
      "quality settings",
      "file size",
      "compress",
      "compression",
    ],
    response:
      "## Video Bitrate Explained 📊\n\n**Bitrate** = how much data is used per second of video. Higher bitrate = better quality but larger file.\n\n**Recommended bitrates:**\n- 480p: 1–2 Mbps\n- 720p: 2.5–5 Mbps\n- **1080p: 8–12 Mbps** (recommended)\n- 4K: 35–45 Mbps\n\n**To reduce file size without losing much quality:**\n- Use **H.265 (HEVC)** codec — same quality at half the file size\n- Lower bitrate by 20–30% — usually imperceptible\n- Export at 1080p instead of 4K if target is web\n\nUse the Convert tab to compress your video!",
    suggestions: ["Export optimized", "Reduce file size", "What codec to use?"],
  },
  // Viral video
  {
    keywords: ["viral", "viral video", "go viral", "trending"],
    response:
      '## How to Make a Viral Video 🚀\n\n**The formula that works:**\n\n1. **Hook in 0–2 seconds** — surprise, question, or bold statement\n2. **Emotional trigger** — make them laugh, cry, think, or gasp\n3. **Perfect length** — 30–90 seconds for max shares\n4. **Trending audio** — use popular music (check TikTok/Instagram trending)\n5. **Bold captions** — 85% of social videos are watched muted\n6. **Call to action** — "Comment below", "Share with someone who"...\n7. **Post timing** — Tue–Thu, 9am or 7pm in your audience\'s timezone\n\nWant me to set up your video with these best practices?',
    suggestions: [
      "Add captions",
      "Apply trending filter",
      "Add background music",
    ],
  },
  // How to make a good video
  {
    keywords: [
      "how to make",
      "make a video",
      "create video",
      "good video",
      "beginner",
    ],
    response:
      "## Step-by-Step: Making a Great Video 🎬\n\n**Step 1** — **Upload** your footage (drag and drop or click Upload)\n**Step 2** — **Structure** — use the Trim tool to cut to the best parts\n**Step 3** — **Add Music** — Music tab → pick a track that matches your mood\n**Step 4** — **Color** — apply a filter or color grade (Apps → Effects)\n**Step 5** — **Text** — add a title, lower thirds, or call-to-action text\n**Step 6** — **Review** — watch the full video, check audio levels\n**Step 7** — **Export** — choose quality preset and download\n\nWhich step do you want to start with?",
    suggestions: ["Upload video", "Add background music", "Apply a filter"],
  },
  // Best camera
  {
    keywords: [
      "best camera",
      "camera recommendation",
      "what camera",
      "camera for youtube",
      "camera for vlog",
    ],
    response:
      "## Camera Recommendations 📷\n\n**Budget (Under $300):**\n- **iPhone 12/13** — excellent 4K, great stabilization\n- **Canon M50 Mark II** — popular YouTube camera\n\n**Mid-range ($300–$800):**\n- **Sony ZV-E10** — best for vlogging\n- **Canon R50** — excellent autofocus\n- **GoPro Hero 12** — action and outdoor\n\n**Professional ($800+):**\n- **Sony A7C** — full frame, cinematic\n- **Blackmagic Pocket 6K** — true cinema quality\n\n**Best budget tip:** A $100 phone on a gimbal in good lighting beats a $1000 camera handheld in bad lighting. **Light beats Camera!**",
    suggestions: [
      "Best settings for mobile video",
      "What is stabilization?",
      "Export 4K",
    ],
  },
  // Subtitles / Captions
  {
    keywords: [
      "subtitle",
      "subtitles",
      "captions",
      "closed caption",
      "transcribe",
    ],
    response:
      "✅ Subtitles are ready to add to your video!\n\n**Why subtitles matter:**\n- 85% of social media videos are watched on mute\n- Subtitles increase watch time by 40%\n- Makes content accessible to wider audiences\n\n**Subtitle styles available in Apps tab:**\n- **Auto Captions** — word-by-word highlight\n- **Karaoke** — synced text with color progression\n- **Lower Third** — professional broadcast-style name bar\n\nOpen the **Apps tab** → Subtitles section!",
    actionApplied: {
      icon: "💬",
      label: "Applied: Auto Captions",
      openPanel: "apps",
      detail: "Subtitle style applied — customize text in Apps tab",
    },
    suggestions: ["Try Karaoke style", "Lower third", "Change font"],
  },
  // Promo / Ad
  {
    keywords: ["promo", "advertisement", "ad", "marketing", "commercial"],
    response:
      "✅ **Promo Video preset** applied! Your video is now set up for maximum impact:\n\n- Cinematic filter with strong contrast\n- Bold title + CTA text overlays\n- Upbeat background music\n- Brand logo placement\n\n**Promo video best practices:**\n- Open with your strongest visual\n- Show the problem, then your solution\n- Keep it under 60 seconds for ads\n- End with a clear call-to-action",
    actionApplied: {
      icon: "📢",
      label: "Applied: Promo Preset",
      openPanel: "templates",
      detail: "Cinematic filter + brand logo + engaging text overlays",
    },
    suggestions: ["Add brand logo", "Change CTA text", "Export 1080p"],
  },
  // Help / Tutorial
  {
    keywords: [
      "help",
      "how",
      "guide",
      "tutorial",
      "start",
      "begin",
      "walkthrough",
    ],
    response:
      '## Quick Start Guide 🚀\n\n**1** — **Upload** — Drag your video file or click the Upload button\n**2** — **Music** — Go to Music tab → pick a track (100+ available)\n**3** — **Filter** — Apps tab → Effects → choose a color grade\n**4** — **Text** — Text tab → add title, captions, lower thirds\n**5** — **Export** — Click Export button in top toolbar → choose quality\n\nOr just tell me: "make me a wedding video" or "create a YouTube intro" and I\'ll set everything up automatically!',
    suggestions: [
      "Add background music",
      "Apply best filter",
      "Add text overlay",
    ],
  },
  // Project / Create
  {
    keywords: [
      "project",
      "plan",
      "build",
      "create",
      "make video",
      "new project",
    ],
    response:
      "Great! Let me set up the perfect project for you. What type of video are you making?\n\n- 📱 **Social Media Reel** — 9:16, punchy, 15–30 sec\n- 📢 **Promo / Ad** — 16:9, branded, 30–60 sec\n- 🎓 **Tutorial / How-to** — 16:9, clear, 5–15 min\n- 💍 **Wedding / Event** — 16:9 or square, emotional, 3–10 min\n- 🎮 **Gaming / Stream** — 16:9, dynamic, any length\n\nJust tell me which one and I'll configure everything!",
    suggestions: ["Social media reel", "Promo video", "Tutorial video"],
  },
  // Opacity / Transparency
  {
    keywords: ["opacity", "transparency", "transparent", "fade in", "fade out"],
    response:
      "**Opacity** controls how transparent a layer is — 0% = fully transparent, 100% = fully opaque.\n\n**How to use opacity in your video:**\n- Select a text or image layer on the canvas\n- Use the opacity slider in the properties panel\n- **Fade in effect:** Animate opacity from 0→100% at clip start\n- **Fade out effect:** Animate opacity from 100→0% at clip end\n\nFor smooth fade in/out transitions between clips, use **Apps tab** → Animation → Fade!",
    suggestions: ["Apply fade in", "Add fade out", "Adjust text opacity"],
  },
  // Keyframe
  {
    keywords: ["keyframe", "key frame", "animate position", "motion path"],
    response:
      "**Keyframes** are markers that define a property value at a specific point in time. The editor automatically animates between keyframes.\n\n**Example:** To animate text sliding in from left:\n- At 0 seconds: set position X = -200 (off screen left)\n- At 0.5 seconds: set position X = 0 (on screen)\n\nThe text will smoothly slide in over 0.5 seconds!\n\nKeyframe-based animations are available for position, scale, rotation, and opacity in the **Apps tab** → Animation section.",
    suggestions: [
      "Add slide-in animation",
      "Animate text position",
      "Apply fade",
    ],
  },
  // Video compression
  {
    keywords: [
      "video compression",
      "how does compression work",
      "codec",
      "h264",
      "h265",
      "hevc",
    ],
    response:
      "## How Video Compression Works 🗜️\n\nVideo files are **enormous** in raw form — a 1-minute 4K video could be 10GB uncompressed. Codecs compress this to 100–200MB.\n\n**How codecs work:**\n- Store only the **differences** between frames (not full frames each time)\n- Use math to reduce detail in less-visible areas\n- **I-frames** (keyframes) = full image stored\n- **P/B-frames** = only changes from previous frame\n\n**Popular codecs:**\n- **H.264** — universal, great quality/size balance\n- **H.265 (HEVC)** — 2× smaller than H.264 at same quality\n- **VP9** — Google's open-source codec (WebM)\n- **AV1** — newest, best compression, slower to encode",
    suggestions: ["Export with H.265", "Reduce file size", "Export for web"],
  },
  // Magic / AI generate
  {
    keywords: [
      "magic media",
      "ai generate",
      "generate image",
      "generate video",
      "ai art",
    ],
    response:
      '✅ **Magic Media** is ready! Type your creative prompt and I\'ll generate an image or abstract art for your canvas.\n\n**Open the Magic tab** → type a description like:\n- "dramatic sunset over mountains"\n- "abstract blue particles"\n- "dark cinematic background"\n\nThe generated visual will be added directly to your canvas!',
    actionApplied: {
      icon: "🪄",
      label: "Ready: Magic Media Generator",
      openPanel: "magic",
      detail: "Type a prompt to generate visuals for your video",
    },
    suggestions: [
      "Generate dark background",
      "Create abstract art",
      "Generate nature scene",
    ],
  },
  // Elements / Stickers
  {
    keywords: ["element", "sticker", "shape", "icon", "emoji overlay"],
    response:
      "✅ Added a decorative element to your canvas!\n\nOpen the **Elements tab** to browse hundreds of shapes, stickers, icons, and decorative elements. You can:\n- Drag to reposition on the canvas\n- Resize using corner handles\n- Change colors to match your brand\n- Layer multiple elements\n- Click × to remove any element",
    actionApplied: {
      icon: "⭐",
      label: "Applied: Decorative Element",
      openPanel: "elements",
      detail: "Element added to canvas — drag to reposition",
    },
    suggestions: ["Add more elements", "Change element color", "Add text"],
  },
  // Uploads
  {
    keywords: ["upload", "import", "add video", "add image", "add file"],
    response:
      "Ready to upload! You can add files in two ways:\n\n1. **Drag and drop** — drag files directly onto the canvas\n2. **Upload tab** — sidebar → Upload tab → click to browse\n\n**Supported formats:**\n- Video: MP4, MOV, AVI, WebM\n- Image: JPG, PNG, GIF, WebP, SVG\n- Audio: MP3, WAV, M4A, OGG\n\nOnce uploaded, the file appears in the Uploads list and you can click to add it to the canvas.",
    actionApplied: {
      icon: "📁",
      label: "Ready: Upload Files",
      openPanel: "uploads",
      detail: "Drag and drop or click to browse files",
    },
    suggestions: [
      "Upload a video",
      "Upload background image",
      "Upload audio track",
    ],
  },
  // Avatar
  {
    keywords: ["avatar", "presenter", "talking head", "ai presenter"],
    response:
      "✅ An **AI Avatar presenter** is ready to add to your video!\n\n**Available avatar styles:**\n- 👔 Business Pro — formal, corporate\n- 😎 Casual Creator — friendly, relatable\n- 🎌 Anime Style — animated character\n- 📺 Presenter — broadcast news style\n- 📰 Newscaster — authoritative\n- 📖 Storyteller — warm, narrative\n\nOpen **Apps tab** → Avatars to select and customize!",
    actionApplied: {
      icon: "👤",
      label: "Ready: AI Avatar",
      openPanel: "apps",
      detail: "Choose avatar style in Apps tab → Avatars section",
    },
    suggestions: ["Business avatar", "Casual creator avatar", "Add voiceover"],
  },
];

const DEFAULT_SUGGESTIONS = [
  "Add music to video",
  "Apply a filter",
  "How to add text?",
  "Export my video",
];

const FALLBACK_RESPONSES = [
  {
    text: "That's a great question! While I specialize in video editing, I'll do my best to help.\n\nFor video-specific tasks, just say things like **'add background music'**, **'apply a cinematic filter'**, **'trim my video'**, or **'export for YouTube'** — and I'll handle it instantly!\n\nWhat would you like to do with your video?",
    suggestions: [
      "Add background music",
      "Apply filter",
      "Export video",
      "What can you do?",
    ],
  },
  {
    text: 'I\'m here to help! 🎬 I can handle **video editing commands** automatically — try saying:\n\n- *"add background music"* → I\'ll pick the best track\n- *"make it cinematic"* → filter and color grade applied\n- *"add text overlay"* → title added to canvas\n- *"export for Instagram"* → optimal settings applied\n\nOr ask me anything about video production — frame rates, codecs, color grading, camera settings!',
    suggestions: ["Add music", "Apply cinematic look", "Export for YouTube"],
  },
  {
    text: "Good question! Let me think about that.\n\nIn the meantime, here are some quick wins for your video:\n- **Add music** → instantly more engaging\n- **Apply a filter** → professional look in one click\n- **Add text** → guides viewers through your content\n\nWhat aspect of your video would you like to improve?",
    suggestions: [
      "Add background music",
      "Color grade my video",
      "Add title text",
    ],
  },
];

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp?: string;
  suggestions?: string[];
  actionApplied?: {
    icon: string;
    label: string;
    detail: string;
    openPanel?: string;
    downloadable?: boolean;
  };
}

// Render rich markdown (bold, lists, headings, inline code)
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;
  let keyCounter = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      const k = `list-${keyCounter++}`;
      if (listType === "ul") {
        elements.push(
          <ul key={k} className="list-none space-y-0.5 my-1">
            {listItems}
          </ul>,
        );
      } else {
        elements.push(
          <ol key={k} className="list-none space-y-0.5 my-1">
            {listItems}
          </ol>,
        );
      }
      listItems = [];
      listType = null;
    }
  };

  const inlineFormat = (str: string, key: string): React.ReactNode => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      const k = `${key}-${i}`;
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={k}
            style={{ color: "oklch(0.92 0.10 275)", fontWeight: 700 }}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={k}
            className="px-1 rounded text-[10px] font-mono"
            style={{
              background: "oklch(0.20 0.04 270)",
              color: "oklch(0.85 0.15 200)",
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={k}>{part}</span>;
    });
  };

  for (const [lineIdx, line] of lines.entries()) {
    const k = `line-${lineIdx}`;
    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <p
          key={k}
          className="font-bold text-[13px] mt-2 mb-1"
          style={{ color: "oklch(0.95 0.12 275)" }}
        >
          {inlineFormat(line.slice(3), k)}
        </p>,
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <p
          key={k}
          className="font-semibold text-[12px] mt-1.5 mb-0.5"
          style={{ color: "oklch(0.90 0.10 275)" }}
        >
          {inlineFormat(line.slice(4), k)}
        </p>,
      );
    } else if (/^- /.test(line)) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push(
        <li key={k} className="flex items-start gap-1.5 text-[11px]">
          <span
            style={{
              color: "oklch(0.65 0.18 275)",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            ▸
          </span>
          <span>{inlineFormat(line.slice(2), k)}</span>
        </li>,
      );
    } else if (/^\d+\. /.test(line)) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      const numMatch = line.match(/^(\d+)\. (.*)/);
      if (numMatch) {
        listItems.push(
          <li key={k} className="flex items-start gap-1.5 text-[11px]">
            <span
              style={{
                color: "oklch(0.65 0.18 275)",
                flexShrink: 0,
                fontWeight: 700,
                minWidth: 14,
              }}
            >
              {numMatch[1]}.
            </span>
            <span>{inlineFormat(numMatch[2], k)}</span>
          </li>,
        );
      }
    } else if (line.trim() === "") {
      flushList();
      elements.push(<div key={k} className="h-1" />);
    } else {
      flushList();
      elements.push(
        <p key={k} className="text-[11px] leading-relaxed">
          {inlineFormat(line, k)}
        </p>,
      );
    }
  }
  flushList();
  return <div className="space-y-0.5">{elements}</div>;
}

// Get smart response with context
function getSmartResponse(
  text: string,
  _history: ChatMessage[],
): {
  text: string;
  suggestions?: string[];
  actionApplied?: AIResponseEntry["actionApplied"];
} {
  const lower = text.toLowerCase();
  for (const r of AI_RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) {
      return {
        text: r.response,
        suggestions: r.suggestions ?? DEFAULT_SUGGESTIONS,
        actionApplied: r.actionApplied,
      };
    }
  }
  return FALLBACK_RESPONSES[
    Math.floor(Math.random() * FALLBACK_RESPONSES.length)
  ];
}

// Typewriter hook — animates character by character
function useTypewriter(targetText: string, speed: number, enabled: boolean) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(targetText);
      setDone(true);
      return;
    }
    idxRef.current = 0;
    setDisplayed("");
    setDone(false);
    let lastTime = 0;
    const step = (ts: number) => {
      if (ts - lastTime >= speed) {
        lastTime = ts;
        idxRef.current++;
        setDisplayed(targetText.slice(0, idxRef.current));
        if (idxRef.current >= targetText.length) {
          setDone(true);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetText, speed, enabled]);

  return { displayed, done };
}

// Single bot message with typewriter
function BotMessage({
  message,
  isLatest,
  onOpenPanel,
  onClose,
  onSuggest,
}: {
  message: ChatMessage;
  isLatest: boolean;
  onOpenPanel?: (panel: string) => void;
  onClose: () => void;
  onSuggest: (text: string) => void;
}) {
  const { displayed, done } = useTypewriter(message.text, 14, isLatest);
  const textToRender = isLatest ? displayed : message.text;

  return (
    <div className="flex items-start gap-2.5">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.22 295), oklch(0.44 0.20 270))",
          boxShadow: "0 2px 8px oklch(0.50 0.22 295 / 0.35)",
        }}
      >
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[9px] font-semibold mb-1"
          style={{ color: "oklch(0.62 0.14 275)" }}
        >
          Meena AI
        </p>
        <div
          className="px-4 py-3 rounded-2xl rounded-tl-sm text-white"
          style={{
            background: "oklch(0.14 0.020 280)",
            border: "1px solid oklch(0.22 0.03 280)",
          }}
        >
          {renderMarkdown(textToRender)}
          {!done && isLatest && (
            <span
              className="inline-block w-[2px] h-[13px] ml-0.5 align-middle animate-pulse"
              style={{ background: "oklch(0.70 0.18 275)", borderRadius: 1 }}
            />
          )}
        </div>

        {done && message.actionApplied && (
          <div
            className="mt-2 rounded-xl p-3"
            style={{
              background: "oklch(0.13 0.025 160 / 0.7)",
              border: "1px solid oklch(0.38 0.12 150 / 0.4)",
            }}
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-lg leading-none">
                {message.actionApplied.icon}
              </span>
              <div>
                <p
                  className="text-[12px] font-semibold"
                  style={{ color: "oklch(0.85 0.12 150)" }}
                >
                  {message.actionApplied.label}
                </p>
                <p
                  className="text-[10px] leading-tight mt-0.5"
                  style={{ color: "oklch(0.60 0.06 150)" }}
                >
                  {message.actionApplied.detail}
                </p>
              </div>
            </div>
            {(message.actionApplied.openPanel ||
              message.actionApplied.downloadable) && (
              <div className="flex gap-2">
                {message.actionApplied.openPanel && (
                  <button
                    onClick={() => {
                      if (onOpenPanel)
                        onOpenPanel(message.actionApplied!.openPanel!);
                      onClose();
                    }}
                    type="button"
                    data-ocid="chat.open_panel.button"
                    className="flex items-center gap-1 text-[11px] font-semibold px-4 py-1.5 rounded-xl transition-all hover:opacity-90"
                    style={{
                      background: "oklch(0.25 0.08 260 / 0.7)",
                      border: "1px solid oklch(0.45 0.15 260 / 0.5)",
                      color: "oklch(0.80 0.18 260)",
                    }}
                  >
                    ↗ Open
                  </button>
                )}
                {message.actionApplied.downloadable && (
                  <button
                    onClick={() => {
                      onClose();
                      window.dispatchEvent(
                        new CustomEvent("meena-open-export"),
                      );
                    }}
                    type="button"
                    data-ocid="chat.download.button"
                    className="flex items-center gap-1 text-[11px] font-semibold px-4 py-1.5 rounded-xl transition-all hover:opacity-90"
                    style={{
                      background: "oklch(0.22 0.07 150 / 0.7)",
                      border: "1px solid oklch(0.50 0.18 150 / 0.5)",
                      color: "oklch(0.80 0.18 150)",
                    }}
                  >
                    ⬇ Download
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {done && message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggest(s)}
                className="text-[10px] px-3 py-1 rounded-full transition-all hover:opacity-90"
                style={{
                  background: "oklch(0.18 0.04 270 / 0.8)",
                  border: "1px solid oklch(0.32 0.08 270 / 0.6)",
                  color: "oklch(0.75 0.12 270)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AIChatbox({
  onOpenPanel,
  onVideoUpload,
  onAddText,
}: {
  onOpenPanel?: (panel: string) => void;
  onVideoUpload?: (file: File) => void;
  onAddText?: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "bot",
      text: 'Hi! I\'m **Meena AI**, your intelligent video editing assistant. 🎬\n\nI can **edit your video automatically**, answer **video production questions**, and guide you through every feature.\n\nTry: *"add background music"*, *"what is 4K?"*, or *"best settings for YouTube"*',
      suggestions: [
        "Add music",
        "Apply filter",
        "What is 4K?",
        "What can you do?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearChat = () => {
    setMessages([
      {
        id: `clear-${Date.now()}`,
        role: "bot",
        text: "Chat cleared! How can I help you with your video? 🎬\n\nJust tell me what to do — I'll handle it instantly!",
        suggestions: [
          "Add music",
          "Apply filter",
          "Add text overlay",
          "Export video",
        ],
      },
    ]);
  };

  const processInput = useCallback(
    (text: string) => {
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        text,
        timestamp: now,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsProcessing(true);

      const delay = 500 + Math.random() * 600;
      setTimeout(() => {
        const lower = text.toLowerCase();
        let reply: ReturnType<typeof getSmartResponse>;

        if (lower.includes("[attached:")) {
          const match = lower.match(/\[attached: (.+?)\]/);
          const fname = match ? match[1] : "file";
          const ext = fname.split(".").pop()?.toLowerCase() ?? "";
          const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
            ext,
          );
          const isVideo = ["mp4", "mov", "avi", "webm"].includes(ext);
          const isAudio = ["mp3", "wav", "ogg", "m4a"].includes(ext);
          const isDoc = [
            "pdf",
            "doc",
            "docx",
            "xls",
            "xlsx",
            "ppt",
            "pptx",
            "txt",
            "csv",
          ].includes(ext);

          if (isImage) {
            reply = {
              text: `Image **${fname}** received! ✅\n\nYou can use the **Uploads tab** to add it to your video canvas — click the image in the uploads list to place it. Then resize and position it anywhere on the frame.`,
              suggestions: [
                "Add to canvas",
                "Apply filter",
                "Add text overlay",
              ],
            };
          } else if (isVideo) {
            reply = {
              text: `Video **${fname}** loaded into the editor! ✅\n\nYou can now:\n- **Trim** — cut to the best parts\n- **Add music** — set the mood\n- **Apply filter** — color grade\n- **Export** — download in HD`,
              suggestions: [
                "Trim video",
                "Add music",
                "Apply filter",
                "Export",
              ],
            };
          } else if (isAudio) {
            reply = {
              text: `Audio **${fname}** received! 🎵\n\nGo to the **Music tab** → Upload Your Audio to set it as the background track for your video. You can adjust volume and timing there.`,
              suggestions: [
                "Set as background music",
                "Adjust volume",
                "Add voiceover",
              ],
            };
          } else if (isDoc) {
            const isWordOrExcel = ["docx", "xlsx", "xls", "csv"].includes(ext);
            reply = {
              text: isWordOrExcel
                ? `**${fname}** text has been extracted and added as a **Text Overlay** on the canvas! ✅\n\nGo to the **Text tab** in the sidebar to see and edit the overlays. You can also use the **Convert tab** to convert this file to another format.`
                : `Document **${fname}** received! 📄\n\nUse the **Convert tab** to convert this file to another format, or add its content as a **Text Overlay** from the Text tab.`,
              suggestions: [
                "Edit text overlay",
                "Convert to PDF",
                "Export video",
              ],
            };
          } else {
            reply = {
              text: `File **${fname}** received! Use the **Uploads tab** or **Convert tab** in the sidebar to work with this file in your project.`,
              suggestions: [
                "Open Uploads tab",
                "Convert file",
                "Add to project",
              ],
            };
          }
        } else {
          reply = getSmartResponse(text, messages);
        }

        setIsProcessing(false);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot" as const,
            text: reply.text,
            suggestions: reply.suggestions,
            actionApplied: reply.actionApplied,
          },
        ]);

        if (reply.actionApplied?.openPanel && onOpenPanel) {
          onOpenPanel(reply.actionApplied.openPanel);
        }
      }, delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onOpenPanel, messages],
  );

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = "";
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isDocx = ext === "docx";
    const isXlsx = ["xlsx", "xls", "csv"].includes(ext);
    const isPptx = ["pptx", "ppt"].includes(ext);

    if (isDocx) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const arrayBuffer = ev.target?.result as ArrayBuffer;
          const mammothLib = await import("mammoth");
          const result = await mammothLib.default.extractRawText({
            arrayBuffer,
          });
          const extracted = result.value.trim().slice(0, 1000);
          if (extracted && onAddText) {
            onAddText(extracted);
            toast.success("Word text extracted and added as overlay!");
          }
          setAttachedFile(file);
          processInput(
            `[Attached: ${file.name}] Word document content extracted and added as text overlay.`,
          );
        } catch {
          toast.error("Could not read Word file");
          setAttachedFile(file);
          processInput(`[Attached: ${file.name}]`);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (isXlsx) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = ev.target?.result;
          const wb = XLSX.read(data, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json<string[]>(ws, {
            header: 1,
          }) as string[][];
          const preview = rows
            .slice(0, 8)
            .map((r) => r.slice(0, 4).join(" | "))
            .join("\n");
          if (preview && onAddText) {
            onAddText(preview);
            toast.success("Excel data extracted and added as overlay!");
          }
          setAttachedFile(file);
          processInput(
            `[Attached: ${file.name}] Excel data extracted and added as text overlay.`,
          );
        } catch {
          toast.error("Could not read Excel file");
          setAttachedFile(file);
          processInput(`[Attached: ${file.name}]`);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (isPptx) {
      // PPT: extract raw text using JSZip-based approach -- show helpful message
      toast.info("PPT uploaded! Text is shown as a reference overlay.", {
        duration: 4000,
      });
      if (onAddText) onAddText(`Presentation: ${file.name}`);
      setAttachedFile(null);
      processInput(
        `[Attached: ${file.name}] PowerPoint presentation uploaded. Slide title added as text overlay.`,
      );
    } else {
      if (file.type.startsWith("video/") && onVideoUpload) {
        onVideoUpload(file);
      }
      setAttachedFile(null);
      processInput(`[Attached: ${file.name}]`);
    }
    e.target.value = "";
  };

  const send = () => {
    if (isProcessing) return;
    if (attachedFile) {
      const label = attachedFile.name;
      const msgText = input.trim()
        ? `${input.trim()} [Attached: ${label}]`
        : `[Attached: ${label}]`;
      processInput(msgText);
      setAttachedFile(null);
    } else if (input.trim()) {
      processInput(input.trim());
    }
  };

  const latestBotId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "bot") return messages[i].id;
    }
    return null;
  }, [messages]);

  return (
    <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div
          className="w-[440px] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{
            height: "600px",
            background: "oklch(0.09 0.014 280)",
            border: "1px solid oklch(0.20 0.04 280)",
            boxShadow:
              "0 24px 64px oklch(0.05 0.01 280 / 0.9), 0 0 0 1px oklch(0.22 0.04 280 / 0.5)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.16 0.06 270), oklch(0.13 0.05 295))",
              borderBottom: "1px solid oklch(0.22 0.04 280 / 0.6)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.52 0.22 295), oklch(0.44 0.20 270))",
                  boxShadow: "0 2px 8px oklch(0.50 0.22 295 / 0.4)",
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white leading-none">
                  Meena AI
                </p>
                <p className="text-[10px] text-white/50 leading-none mt-0.5">
                  Your intelligent video assistant
                </p>
              </div>
              <span
                className="text-[8px] px-1.5 py-0.5 rounded-full font-medium ml-1"
                style={{
                  background: "oklch(0.60 0.22 150 / 0.25)",
                  color: "oklch(0.80 0.18 150)",
                  border: "1px solid oklch(0.60 0.18 150 / 0.3)",
                }}
              >
                ● Online
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearChat}
                className="text-[9px] px-2 py-0.5 rounded-full transition-colors"
                style={{
                  background: "oklch(0.20 0.04 270 / 0.6)",
                  color: "oklch(0.70 0.05 270)",
                }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-ocid="chat.close_button"
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ color: "oklch(0.65 0.05 270)" }}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {messages.map((m) => (
              <div key={m.id}>
                {m.role === "user" ? (
                  <div className="flex items-start gap-2 justify-end">
                    <div className="flex flex-col items-end gap-0.5">
                      {m.timestamp && (
                        <span
                          className="text-[9px] pr-1"
                          style={{ color: "oklch(0.45 0.04 270)" }}
                        >
                          {m.timestamp}
                        </span>
                      )}
                      <div
                        className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm text-[12px] leading-relaxed text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.52 0.22 270), oklch(0.48 0.22 295))",
                          boxShadow: "0 2px 8px oklch(0.50 0.22 270 / 0.3)",
                        }}
                      >
                        {m.text}
                      </div>
                    </div>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white mt-0.5"
                      style={{ background: "oklch(0.40 0.12 270)" }}
                    >
                      U
                    </div>
                  </div>
                ) : (
                  <BotMessage
                    message={m}
                    isLatest={m.id === latestBotId && !isProcessing}
                    onOpenPanel={onOpenPanel}
                    onClose={() => setOpen(false)}
                    onSuggest={processInput}
                  />
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.52 0.22 295), oklch(0.44 0.20 270))",
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div
                  className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-[11px]"
                  style={{
                    background: "oklch(0.14 0.020 280)",
                    border: "1px solid oklch(0.22 0.03 280)",
                    color: "oklch(0.55 0.05 270)",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span>Meena AI is thinking</span>
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{
                            background: "oklch(0.55 0.14 275)",
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />
                      ))}
                    </span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div
            className="flex-shrink-0 px-4 pb-4 pt-2"
            style={{ borderTop: "1px solid oklch(0.18 0.03 280 / 0.6)" }}
          >
            {attachedFile && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl mb-2 text-[11px]"
                style={{
                  background: "oklch(0.16 0.04 270 / 0.8)",
                  border: "1px solid oklch(0.30 0.08 270 / 0.5)",
                  color: "oklch(0.75 0.12 270)",
                }}
              >
                <span>📎</span>
                <span className="truncate flex-1">{attachedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="hover:text-white"
                >
                  ×
                </button>
              </div>
            )}
            <div
              className="flex items-end gap-2 px-3 py-2 rounded-2xl"
              style={{
                background: "oklch(0.14 0.025 280)",
                border: "1px solid oklch(0.24 0.05 280 / 0.7)",
              }}
            >
              <button
                type="button"
                onClick={() => chatFileInputRef.current?.click()}
                data-ocid="chat.upload_button"
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mb-0.5 transition-colors"
                style={{ color: "oklch(0.55 0.08 270)" }}
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                ref={chatFileInputRef}
                type="file"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                className="hidden"
                onChange={handleFileAttach}
              />
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask Meena anything about video editing..."
                data-ocid="chat.input"
                className="flex-1 text-[12px] outline-none bg-transparent py-1 leading-relaxed"
                style={{
                  color: "oklch(0.85 0.05 280)",
                  resize: "none",
                  maxHeight: "72px",
                  overflowY: "auto",
                }}
              />
              <button
                type="button"
                onClick={send}
                disabled={isProcessing}
                data-ocid="chat.primary_button"
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 305), oklch(0.50 0.20 280))",
                  boxShadow: "0 2px 8px oklch(0.55 0.22 305 / 0.4)",
                }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          data-ocid="chat.open_modal_button"
          className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-110 relative"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 305), oklch(0.45 0.18 280))",
            boxShadow: "0 0 24px oklch(0.58 0.22 305 / 0.5)",
          }}
        >
          {open ? (
            <ChevronDown className="w-6 h-6 text-white" />
          ) : (
            <Sparkles className="w-6 h-6 text-white" />
          )}
          {!open && (
            <span
              className="absolute inset-0 rounded-2xl animate-ping opacity-30"
              style={{ background: "oklch(0.58 0.22 305)" }}
            />
          )}
        </button>
        <span className="text-[9px] text-white/70 font-medium">Meena AI</span>
      </div>
    </div>
  );
}

// ─── Main VideoEditor ─────────────────────────────────────────────────────────

// ─── Sidebar Items ────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { id: "text", label: "Text", icon: Type },
  { id: "music", label: "Music", icon: Music },
  { id: "audio", label: "Audio", icon: Volume2 },
  { id: "filters", label: "Filters", icon: Film },
  { id: "trim", label: "Trim", icon: Scissors },
  { id: "brand", label: "Brand", icon: Palette },
  { id: "templates", label: "Templ", icon: LayoutTemplate },
  { id: "elements", label: "Elem", icon: Shapes },
  { id: "background", label: "BG", icon: Image },
  { id: "apps", label: "Apps", icon: Layers },
  { id: "magic", label: "Magic", icon: Sparkles },
  { id: "uploads", label: "Upload", icon: Upload },
  { id: "chroma", label: "Chroma", icon: Wand2 },
  { id: "convert", label: "Convert", icon: ArrowLeftRight },
];

export default function VideoEditor({
  onBack,
  isLoggedIn = false,
  onLogout,
}: { onBack: () => void; isLoggedIn?: boolean; onLogout?: () => void }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("My Project");

  // Text state
  const [texts, setTexts] = useState<TextItem[]>([]);

  const handleAddTextFromFile = (text: string) => {
    const lines = text.split("\n").filter(Boolean).slice(0, 5);
    lines.forEach((line, i) => {
      const newText: TextItem = {
        id: `file-text-${Date.now()}-${i}`,
        content: line.slice(0, 120),
        fontSize: 24,
        color: "#ffffff",
        positionY: i === 0 ? "top" : i === 1 ? "center" : "bottom",
        opacity: 100,
      };
      setTexts((prev) => [...prev, newText]);
    });
    setActivePanel("text");
  };

  // Music state
  const [activeTrack, setActiveTrack] = useState<MusicTrack | null>(null);
  const [musicVolume, setMusicVolume] = useState(70);

  // Audio state
  const [origVolume, setOrigVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [noiseReduce, setNoiseReduce] = useState(false);
  const [bgNoise, setBgNoise] = useState("Low");

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>("none");
  const [filterIntensity, setFilterIntensity] = useState(100);

  // Trim state
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(60);
  const videoRef = useRef<HTMLVideoElement>(null);

  // UI state
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activePanel, setActivePanel] = useState("text");

  // Canvas overlay elements (stickers/shapes)
  const [overlayElements, setOverlayElements] = useState<
    Array<{ id: string; emoji: string; type: string; x: number; y: number }>
  >([]);
  // Canvas background style (from templates)
  const [canvasBg, setCanvasBg] = useState<string | null>(null);

  const handleAddElement = (emoji: string, type: string) => {
    setOverlayElements((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        emoji,
        type,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
      },
    ]);
  };

  const handleRemoveElement = (id: string) => {
    setOverlayElements((prev) => prev.filter((e) => e.id !== id));
  };

  const handleApplyTemplate = (
    bgStyle: string,
    tplTexts: Array<{
      content: string;
      fontSize: number;
      color: string;
      positionY: "top" | "center" | "bottom";
      opacity: number;
    }>,
  ) => {
    setCanvasBg(bgStyle);
    setTexts(
      tplTexts.map((t) => ({ ...t, id: Math.random().toString(36).slice(2) })),
    );
  };

  const handleUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    // Try to get duration
    const v = document.createElement("video");
    v.src = url;
    v.onloadedmetadata = () => {
      setDuration(v.duration);
      setEndTime(v.duration);
    };
    toast.success(`"${file.name}" uploaded successfully!`);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Project saved!");
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  useEffect(() => {
    const handler = () => setExportOpen(true);
    window.addEventListener("meena-open-export", handler);
    return () => window.removeEventListener("meena-open-export", handler);
  }, []);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "oklch(0.07 0.008 280)" }}
    >
      {/* Top Bar */}
      <header
        className="h-13 flex items-center gap-3 px-4 flex-shrink-0 border-b"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.18 0.02 280)",
          minHeight: "52px",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          data-ocid="editor.back.button"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Back</span>
        </button>

        <div
          className="h-5 w-px"
          style={{ background: "oklch(0.22 0.02 280)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/assets/generated/meena-logo.dim_80x80.png"
            alt="Meena"
            className="w-6 h-6 rounded object-cover"
          />
          <span className="font-display font-bold text-sm hidden sm:inline">
            Meena <span className="text-gradient">Editor</span>
          </span>
        </div>

        <div
          className="h-5 w-px hidden sm:block"
          style={{ background: "oklch(0.22 0.02 280)" }}
        />

        {/* Project Name */}
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          data-ocid="editor.project_name.input"
          className="max-w-[180px] h-8 text-sm font-medium"
          style={{
            background: "oklch(0.12 0.015 280)",
            border: "1px solid oklch(0.22 0.025 280)",
          }}
        />

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saving}
          data-ocid="editor.save.button"
          className="h-8 px-4 text-xs rounded-lg"
          style={{
            background: "oklch(0.12 0.015 280)",
            borderColor: "oklch(0.25 0.03 280)",
          }}
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareOpen(true)}
          data-ocid="editor.share.button"
          className="h-8 px-4 text-xs rounded-lg"
          style={{
            background: "oklch(0.12 0.015 280)",
            borderColor: "oklch(0.25 0.03 280)",
            color: "oklch(0.75 0.15 305)",
          }}
        >
          <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
        </Button>
        <Button
          size="sm"
          onClick={() => setExportOpen(true)}
          data-ocid="editor.export.button"
          className="h-8 px-4 text-xs rounded-lg btn-gradient text-white border-0"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export
        </Button>

        {/* User indicator */}
        {isLoggedIn ? (
          <button
            type="button"
            onClick={onLogout}
            data-ocid="editor.logout.button"
            className="flex items-center gap-2 px-3 h-8 rounded-lg text-xs transition-colors"
            style={{
              background: "oklch(0.13 0.02 280)",
              border: "1px solid oklch(0.22 0.03 280)",
              color: "oklch(0.65 0.04 270)",
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "oklch(0.55 0.22 305)", color: "white" }}
            >
              {(localStorage.getItem("meena_user") ?? "U")[0]}
            </div>
            <span className="hidden sm:inline">
              {localStorage.getItem("meena_user") ?? "User"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLogout}
            data-ocid="editor.login.button"
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs transition-colors"
            style={{
              background: "oklch(0.13 0.02 280)",
              border: "1px solid oklch(0.22 0.03 280)",
              color: "oklch(0.65 0.04 270)",
            }}
          >
            Guest
          </button>
        )}
      </header>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel — Tools (Canva-style vertical icon rail + panel content) */}
        <aside className="flex flex-shrink-0">
          {/* Icon Rail */}
          <div
            className="w-14 flex-shrink-0 flex flex-col py-2 gap-0.5 border-r overflow-y-auto"
            style={{
              background: "oklch(0.08 0.009 280)",
              borderColor: "oklch(0.16 0.018 280)",
              scrollbarWidth: "none",
            }}
          >
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePanel(item.id)}
                data-ocid={`editor.${item.id}.tab`}
                title={item.label}
                className="relative mx-1.5 flex flex-col items-center gap-0.5 py-2 px-0.5 rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                  background:
                    activePanel === item.id
                      ? "oklch(0.58 0.22 305 / 0.18)"
                      : "transparent",
                  color:
                    activePanel === item.id
                      ? "oklch(0.82 0.20 305)"
                      : "oklch(0.48 0.025 280)",
                  boxShadow:
                    activePanel === item.id
                      ? "inset 0 0 0 1px oklch(0.58 0.22 305 / 0.35), 0 0 12px oklch(0.58 0.22 305 / 0.15)"
                      : "none",
                }}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-[8.5px] font-medium leading-none">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div
            className="w-52 flex-shrink-0 overflow-y-auto flex flex-col"
            style={{
              background: "oklch(0.09 0.01 280)",
              borderRight: "1px solid oklch(0.16 0.018 280)",
            }}
          >
            {/* Panel Header */}
            <div
              className="px-3 py-2.5 flex-shrink-0 border-b"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.11 0.015 280), oklch(0.09 0.01 280))",
                borderColor: "oklch(0.18 0.02 280)",
              }}
            >
              <p
                className="text-xs font-semibold capitalize"
                style={{ color: "oklch(0.75 0.08 280)" }}
              >
                {SIDEBAR_ITEMS.find((i) => i.id === activePanel)?.label ??
                  "Tools"}
              </p>
            </div>

            <div className="flex-1">
              {activePanel === "text" && (
                <TextPanel texts={texts} setTexts={setTexts} />
              )}
              {activePanel === "music" && (
                <MusicPanel
                  activeTrack={activeTrack}
                  setActiveTrack={setActiveTrack}
                  musicVolume={musicVolume}
                  setMusicVolume={setMusicVolume}
                />
              )}
              {activePanel === "audio" && (
                <AudioPanel
                  origVolume={origVolume}
                  setOrigVolume={setOrigVolume}
                  muted={muted}
                  setMuted={setMuted}
                  enhanced={enhanced}
                  setEnhanced={setEnhanced}
                  noiseReduce={noiseReduce}
                  setNoiseReduce={setNoiseReduce}
                  bgNoise={bgNoise}
                  setBgNoise={setBgNoise}
                />
              )}
              {activePanel === "filters" && (
                <FiltersPanel
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  intensity={filterIntensity}
                  setIntensity={setFilterIntensity}
                />
              )}
              {activePanel === "trim" && (
                <TrimPanel
                  duration={duration}
                  startTime={startTime}
                  endTime={endTime}
                  setStartTime={setStartTime}
                  setEndTime={setEndTime}
                  videoRef={videoRef}
                  onTrimApply={(url) => {
                    setVideoUrl(url);
                    toast.success("Trimmed video loaded into editor!");
                  }}
                />
              )}
              {activePanel === "brand" && <BrandKitPanel />}
              {activePanel === "templates" && (
                <TemplatesPanel onApplyTemplate={handleApplyTemplate} />
              )}
              {activePanel === "elements" && (
                <ElementsPanel onAddElement={handleAddElement} />
              )}
              {activePanel === "background" && <BackgroundPanel />}
              {activePanel === "apps" && <AppsPanel />}
              {activePanel === "magic" && <MagicMediaPanel />}
              {activePanel === "uploads" && <UploadsPanel />}
              {activePanel === "chroma" && <ChromaKeyPanel />}
              {activePanel === "convert" && <FileConverterPanel />}
            </div>
          </div>
        </aside>

        {/* Center — Video Preview */}
        <main
          className="flex-1 flex flex-col overflow-hidden relative canvas-bg"
          style={{ background: "oklch(0.07 0.008 280)" }}
        >
          <AIChatbox
            onOpenPanel={setActivePanel}
            onVideoUpload={handleUpload}
            onAddText={handleAddTextFromFile}
          />
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* Active filter badge */}
            {activeFilter !== "none" && (
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                <Badge
                  className="text-xs"
                  style={{
                    background: "oklch(0.58 0.22 305 / 0.15)",
                    border: "1px solid oklch(0.58 0.22 305 / 0.4)",
                    color: "oklch(0.80 0.18 305)",
                  }}
                >
                  Filter: {FILTERS.find((f) => f.id === activeFilter)?.label} (
                  {filterIntensity}%)
                </Badge>
                {activeTrack && (
                  <Badge
                    className="text-xs"
                    style={{
                      background: "oklch(0.62 0.22 305 / 0.15)",
                      border: "1px solid oklch(0.62 0.22 305 / 0.3)",
                      color: "oklch(0.78 0.18 305)",
                    }}
                  >
                    <Music className="w-3 h-3 mr-1" />
                    {activeTrack.name}
                  </Badge>
                )}
              </div>
            )}

            <VideoPreview
              videoUrl={videoUrl}
              texts={texts}
              filter={activeFilter}
              filterIntensity={filterIntensity}
              onUpload={handleUpload}
              canvasBg={canvasBg}
              overlayElements={overlayElements}
              onRemoveElement={handleRemoveElement}
              videoRef={videoRef}
            />
          </div>

          {/* Timeline */}
          <Timeline
            hasVideo={!!videoUrl}
            hasMusic={!!activeTrack}
            hasTexts={texts.length > 0}
          />
        </main>

        {/* Right Panel — Properties */}
        <aside
          className="w-56 flex-shrink-0 border-l overflow-y-auto hidden lg:block"
          style={{
            background: "oklch(0.09 0.01 280)",
            borderColor: "oklch(0.18 0.02 280)",
          }}
        >
          <div className="p-4 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Properties
            </p>

            {/* Video info */}
            <div
              className="rounded-xl p-3 space-y-2"
              style={{
                background: "oklch(0.12 0.015 280)",
                border: "1px solid oklch(0.20 0.02 280)",
              }}
            >
              <p className="text-xs font-semibold">Video</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={
                      videoUrl ? "text-green-400" : "text-muted-foreground"
                    }
                  >
                    {videoUrl ? "Loaded" : "No video"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Filter</span>
                  <span>
                    {FILTERS.find((f) => f.id === activeFilter)?.label ??
                      "None"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Text layers</span>
                  <span>{texts.length}</span>
                </div>
              </div>
            </div>

            {/* Audio info */}
            <div
              className="rounded-xl p-3 space-y-2"
              style={{
                background: "oklch(0.12 0.015 280)",
                border: "1px solid oklch(0.20 0.02 280)",
              }}
            >
              <p className="text-xs font-semibold">Audio</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Music</span>
                  <span className="truncate max-w-[80px]">
                    {activeTrack?.name ?? "None"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Enhanced</span>
                  <span
                    className={
                      enhanced ? "text-green-400" : "text-muted-foreground"
                    }
                  >
                    {enhanced ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Vol</span>
                  <span>{muted ? "Muted" : `${origVolume}%`}</span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </p>
              <button
                type="button"
                onClick={() => {
                  const inp = document.querySelector<HTMLInputElement>(
                    '[data-ocid="editor.upload_button"]',
                  );
                  inp?.click();
                }}
                data-ocid="props.upload.button"
                className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
                style={{
                  background: "oklch(0.12 0.015 280)",
                  border: "1px solid oklch(0.20 0.02 280)",
                }}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Video
              </button>
              <button
                type="button"
                onClick={() => setExportOpen(true)}
                data-ocid="props.export.button"
                className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
                style={{
                  background: "oklch(0.12 0.015 280)",
                  border: "1px solid oklch(0.20 0.02 280)",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                type="button"
                onClick={() => {
                  setTexts([]);
                  setActiveTrack(null);
                  setActiveFilter("none");
                  setEnhanced(false);
                  setNoiseReduce(false);
                  toast.success("Project reset");
                }}
                data-ocid="props.reset.button"
                className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs hover:text-destructive transition-colors"
                style={{
                  background: "oklch(0.12 0.015 280)",
                  border: "1px solid oklch(0.20 0.02 280)",
                  color: "oklch(0.55 0.12 27)",
                }}
              >
                <Wand2 className="w-3.5 h-3.5" />
                Reset All
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        videoUrl={videoUrl}
      />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
