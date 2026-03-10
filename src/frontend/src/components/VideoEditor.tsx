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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowLeftRight,
  Bot,
  Check,
  Download,
  FileSpreadsheet,
  FileText,
  Film,
  Image,
  Layers,
  LayoutTemplate,
  Loader2,
  MessageSquare,
  Mic,
  Music,
  Palette,
  Pause,
  Play,
  Plus,
  Save,
  Scissors,
  Send,
  Shapes,
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
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
}: {
  videoUrl: string | null;
  texts: TextItem[];
  filter: FilterType;
  filterIntensity: number;
  onUpload: (file: File) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
        className="w-full flex-1 flex items-center justify-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5 p-10 rounded-2xl cursor-pointer w-full max-w-lg mx-auto"
          style={{
            background: "oklch(0.10 0.012 280)",
            border: "2px dashed oklch(0.30 0.04 305 / 0.6)",
          }}
          onClick={() => fileInputRef.current?.click()}
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
              Supports MP4, MOV, WebM · Click to browse
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            data-ocid="editor.upload_button"
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
    <div ref={containerRef} className="w-full flex-1 flex flex-col">
      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{ height: dims.h, background: "#000" }}
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
              onClick={() =>
                setPreviewId(previewId === track.id ? null : track.id)
              }
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      toast.success("Voiceover recorded! (preview only)");
      setSeconds(0);
    } else {
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "oklch(0.12 0.015 280)",
        border: "1px solid oklch(0.20 0.02 280)",
      }}
    >
      <p className="text-sm font-semibold mb-3">Record Voiceover</p>
      <div className="flex items-center gap-3">
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
        {!recording && (
          <p className="text-xs text-muted-foreground">
            Click mic to start recording
          </p>
        )}
      </div>
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
            onClick={() => {
              setPlaying(playing === track.title ? null : track.title);
              toast.info(
                playing === track.title
                  ? "Stopped"
                  : `Now playing: ${track.title}`,
              );
            }}
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
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) {
      toast.error("Please enter some text first");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success("AI Voice preview ready (demo mode)");
    }, 1800);
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

      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating}
        data-ocid="audio.aivoice.generate_button"
        className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
        style={{
          background: generating
            ? "oklch(0.30 0.08 305)"
            : "linear-gradient(135deg, oklch(0.55 0.22 305), oklch(0.55 0.18 240))",
          color: "white",
          opacity: generating ? 0.7 : 1,
        }}
      >
        {generating ? (
          <>
            <span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />{" "}
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" /> Generate Voice
          </>
        )}
      </button>
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
}: {
  duration: number;
  startTime: number;
  endTime: number;
  setStartTime: (v: number) => void;
  setEndTime: (v: number) => void;
}) {
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const dur = duration || 60;

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
            {/* Colored range */}
            <div
              className="absolute inset-y-4 rounded-full"
              style={{
                left: `${(startTime / dur) * 100}%`,
                right: `${100 - (endTime / dur) * 100}%`,
                background:
                  "linear-gradient(90deg, oklch(0.58 0.22 305 / 0.4), oklch(0.52 0.25 280 / 0.4))",
              }}
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Total Duration: {fmt(dur)}
        </div>
      </div>
    </div>
  );
}

// ─── Export Modal ─────────────────────────────────────────────────────────────
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

  const startExport = async () => {
    setExporting(true);
    setDone(false);
    await new Promise((r) => setTimeout(r, 2500));
    setExporting(false);
    setDone(true);
  };

  const handleClose = () => {
    setDone(false);
    setExporting(false);
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
              {videoUrl && (
                <a
                  href={videoUrl}
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
              disabled={!videoUrl || exporting}
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
            <p className="text-xs text-muted-foreground text-center">
              Upload a video first to export.
            </p>
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
function TemplatesPanel() {
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
function ElementsPanel() {
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
                  onClick={() => toast.success(`${item} added to video!`)}
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
                  onClick={() => toast.success(`${item} added to video!`)}
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

  function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Enter a prompt first");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success("Preview generated!");
    }, 1500);
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

      {/* Recent generations placeholder */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Recent
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-16 rounded-lg flex items-center justify-center"
              style={{ border: "1.5px dashed oklch(0.25 0.03 280)" }}
            >
              <Image className="w-5 h-5 opacity-20" />
            </div>
          ))}
        </div>
        <p className="text-[9px] text-muted-foreground text-center mt-2">
          AI generation creates placeholder previews
        </p>
      </div>
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

  const handleFile = (file: File) => {
    setFileName(file.name);
    setProgress(0);
    setDone(false);
    setConverting(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setDone(true);
        setConverting(false);
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
            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Conversion simulated — in production this would use a server-side converter",
                )
              }
              data-ocid="converter.primary_button"
              className="w-full py-1.5 rounded-md text-xs font-medium"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 305), oklch(0.50 0.20 280))",
                color: "white",
              }}
            >
              ✅ Download Ready — Click to Save
            </button>
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
}

const AI_RESPONSES: AIResponseEntry[] = [
  {
    keywords: ["background", "bg", "wallpaper"],
    response:
      "Click the **BG tab** (gradient icon) in the left sidebar to change your video background. Choose solid colors, gradients, or patterns!",
    suggestions: [
      "How to add gradient bg?",
      "Change background color",
      "Use pattern background",
    ],
  },
  {
    keywords: ["music", "song", "track", "audio add"],
    response:
      "Open the **Music tab** 🎵 to browse 100+ tracks — Lo-Fi, Bollywood, Jazz, Rock, K-Pop and more! You can also Record a Voiceover or Generate AI Voice.",
    suggestions: [
      "Add Bollywood music",
      "Record voiceover",
      "Generate AI voice",
    ],
  },
  {
    keywords: ["text", "title", "caption", "subtitle", "word"],
    response:
      "Use the **Text tab** (T icon) to add text overlays. Customize font, color, size, and position (top / center / bottom)!",
    suggestions: [
      "How to change font?",
      "Add subtitle captions",
      "Change text color",
    ],
  },
  {
    keywords: ["filter", "bright", "warm", "cool", "vintage", "color grade"],
    response:
      "Click the **Filters tab** to apply effects like Bright, Warm, Cool, Vintage, B&W, Cinematic and more!",
    suggestions: [
      "Apply cinematic filter",
      "Make video bright",
      "Try vintage look",
    ],
  },
  {
    keywords: ["trim", "cut", "shorten", "clip", "length"],
    response:
      "Use the **Trim tab** (scissors icon) to set the start and end time of your video clip.",
    suggestions: ["Set start time", "Cut end of video", "How to trim?"],
  },
  {
    keywords: ["export", "download", "save", "render", "output"],
    response:
      "Click the **Export button** in the top toolbar. Choose 720p or 1080p resolution, and MP4 or WebM format!",
    suggestions: ["Export in 1080p", "Download as MP4", "Save my project"],
  },
  {
    keywords: ["green screen", "chroma", "background remove", "remove bg"],
    response:
      "Use the **Chroma Key tab** (magic wand icon) to remove green/blue screen backgrounds. Adjust Similarity and Smoothness sliders!",
    suggestions: [
      "Set chroma color",
      "Adjust similarity",
      "Remove green screen",
    ],
  },
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
    ],
    response:
      "Go to the **Convert tab** in the sidebar to convert files: PDF→PNG, MP4→MP3, Excel→CSV, Word→TXT and more!",
    suggestions: ["Convert video to MP3", "PDF to PNG", "Excel to CSV"],
  },
  {
    keywords: ["template", "preset", "ready made"],
    response:
      "Browse the **Templates tab** for ready-made video templates. Filter by category and apply in one click!",
    suggestions: [
      "Show business templates",
      "Apply template",
      "Browse templates",
    ],
  },
  {
    keywords: ["brand", "logo", "brand kit", "colors"],
    response:
      "Use the **Brand Kit tab** to set your brand colors, upload your logo, and choose brand fonts for consistent videos!",
    suggestions: ["Add my logo", "Set brand colors", "Choose brand font"],
  },
  {
    keywords: ["element", "shape", "sticker", "icon"],
    response:
      "Click the **Elements tab** to add shapes, stickers, lines, and decorative borders to your video!",
    suggestions: ["Add a shape", "Insert sticker", "Draw a line"],
  },
  {
    keywords: ["effect", "animation", "transition", "glitch", "zoom"],
    response:
      "Open the **Apps tab** to find Video Effects (Glitch, Zoom, Blur), Animations (Fade, Bounce, Spin), and Subtitle tools!",
    suggestions: ["Add glitch effect", "Fade in animation", "Auto subtitles"],
  },
  {
    keywords: ["magic", "ai generate", "generate image", "ai image"],
    response:
      "The **Magic Media tab** (sparkle icon) lets you generate AI-style images, graphics and visual assets with a text prompt!",
    suggestions: [
      "Generate a background",
      "Create AI graphic",
      "Try Magic Media",
    ],
  },
  {
    keywords: ["upload", "import", "add video", "add image", "add file"],
    response:
      "Use the **Uploads tab** to drag-and-drop or browse your own images, videos, and audio files into the editor!",
    suggestions: ["Upload my video", "Import an image", "Add audio file"],
  },
  {
    keywords: ["voiceover", "record", "mic", "microphone"],
    response:
      "Go to **Music tab → Record Voiceover** section. Click the microphone button to record your voice directly in the browser!",
    suggestions: ["Start recording", "How to use mic?", "Add narration"],
  },
  {
    keywords: ["help", "how", "guide", "tutorial", "start", "begin"],
    response:
      "Here's a quick workflow: 1️⃣ Upload video → 2️⃣ Add Text/Music → 3️⃣ Apply Filters → 4️⃣ Trim if needed → 5️⃣ Export! Ask me about any specific tool.",
    suggestions: ["Add music to video", "Apply a filter", "Export my video"],
  },
  {
    keywords: ["project", "plan", "build", "create", "make video"],
    response:
      "Great! Tell me what kind of video you're making: Social Media Reel, Promo/Ad, Tutorial, or Event Highlights? I'll suggest the best tools!",
    suggestions: ["Social media reel", "Promo video", "Tutorial video"],
  },
  {
    keywords: ["social media", "reel", "instagram", "youtube", "tiktok"],
    response:
      "For **Social Media Reels**: Use a Bright or Warm filter, add catchy text with bold fonts, pick an upbeat music track, and export at 1080p MP4!",
    suggestions: ["Apply bright filter", "Add bold text", "Pick upbeat music"],
  },
  {
    keywords: ["promo", "advertisement", "ad", "marketing"],
    response:
      "For a **Promo Video**: Start with a Template, add your Brand Kit logo/colors, use a Cinematic filter, add engaging text overlays, and export in 1080p!",
    suggestions: ["Browse templates", "Set up brand kit", "Add logo"],
  },
  {
    keywords: ["tutorial", "educational", "teaching", "explain"],
    response:
      "For a **Tutorial Video**: Add text captions using the Text tab, enable Auto Subtitles in Apps tab, use a clear Lo-Fi background track, and trim your clips!",
    suggestions: ["Add text captions", "Auto subtitles", "Add lo-fi music"],
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
    text: "I can help with that! Could you be more specific? For example: 'add music', 'change background', 'add text overlay' or 'export video'.",
    suggestions: DEFAULT_SUGGESTIONS,
  },
  {
    text: "Let me guide you! What are you trying to do with your video? Tell me the goal and I'll point you to the right tool.",
    suggestions: [
      "Edit video",
      "Add effects",
      "Convert file",
      "Build a project",
    ],
  },
  {
    text: "Sure! Here are things I can help with — music, filters, text, trimming, background, export, file conversion, and more. What do you need?",
    suggestions: DEFAULT_SUGGESTIONS,
  },
];

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  suggestions?: string[];
}

function AIChatbox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "bot",
      text: "Hi! I'm **Meena AI Assistant** 🎬 I can help you build great videos — ask me about music, filters, text, effects, or say 'help' for a quick guide!",
      suggestions: [
        "Add music",
        "Apply filter",
        "Add text overlay",
        "How to export?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once

  const clearChat = () => {
    setMessages([
      {
        id: "init",
        role: "bot",
        text: "Chat cleared! How can I help you with your video? 🎬",
        suggestions: [
          "Add music",
          "Apply filter",
          "Add text overlay",
          "How to export?",
        ],
      },
    ]);
  };

  const processInput = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply =
        FALLBACK_RESPONSES[
          Math.floor(Math.random() * FALLBACK_RESPONSES.length)
        ];
      for (const r of AI_RESPONSES) {
        if (r.keywords.some((k) => lower.includes(k))) {
          reply = {
            text: r.response,
            suggestions: r.suggestions ?? DEFAULT_SUGGESTIONS,
          };
          break;
        }
      }
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: reply.text,
          suggestions: reply.suggestions,
        },
      ]);
    }, 900);
  };

  const send = () => {
    if (input.trim()) processInput(input.trim());
  };

  const renderText = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) => {
      const k = `rt-${i}`;
      return i % 2 === 1 ? (
        <strong key={k} className="font-semibold text-white">
          {part}
        </strong>
      ) : (
        <span key={k}>{part}</span>
      );
    });

  return (
    <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div
          className="w-80 rounded-xl overflow-hidden shadow-2xl flex flex-col"
          style={{
            height: "480px",
            background: "oklch(0.10 0.015 280)",
            border: "1px solid oklch(0.22 0.04 280)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-2 flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.30 0.15 305), oklch(0.25 0.12 280))",
            }}
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold text-white">
                Meena AI Assistant
              </span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full text-white/80"
                style={{ background: "oklch(0.40 0.18 305 / 0.5)" }}
              >
                Smart
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={clearChat}
                className="text-white/60 hover:text-white transition-colors text-[9px]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-ocid="chat.close_button"
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className="max-w-[90%] px-2.5 py-1.5 rounded-lg text-[11px] leading-relaxed"
                  style={
                    m.role === "user"
                      ? { background: "oklch(0.50 0.20 305)", color: "white" }
                      : {
                          background: "oklch(0.16 0.025 280)",
                          color: "oklch(0.80 0.05 280)",
                          border: "1px solid oklch(0.22 0.03 280)",
                        }
                  }
                >
                  {m.role === "bot" ? renderText(m.text) : m.text}
                </div>
                {m.role === "bot" &&
                  m.suggestions &&
                  m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 max-w-[90%]">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => processInput(s)}
                          className="text-[9px] px-2 py-0.5 rounded-full border transition-all hover:scale-105"
                          style={{
                            border: "1px solid oklch(0.40 0.15 305)",
                            color: "oklch(0.75 0.12 305)",
                            background: "oklch(0.14 0.025 280)",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 rounded-lg"
                  style={{
                    background: "oklch(0.16 0.025 280)",
                    border: "1px solid oklch(0.22 0.03 280)",
                  }}
                >
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          background: "oklch(0.55 0.15 305)",
                          animationDelay: `${i * 150}ms`,
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 p-2 border-t"
            style={{ borderColor: "oklch(0.20 0.03 280)" }}
          >
            <div className="flex gap-1.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask me anything..."
                data-ocid="chat.input"
                className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg outline-none"
                style={{
                  background: "oklch(0.16 0.025 280)",
                  border: "1px solid oklch(0.25 0.05 280)",
                  color: "oklch(0.85 0.05 280)",
                }}
              />
              <button
                type="button"
                onClick={send}
                data-ocid="chat.primary_button"
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 305), oklch(0.50 0.20 280))",
                }}
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-ocid="chat.open_modal_button"
        className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.22 305), oklch(0.45 0.18 280))",
        }}
      >
        {open ? (
          <X className="w-4 h-4 text-white" />
        ) : (
          <MessageSquare className="w-4 h-4 text-white" />
        )}
      </button>
    </div>
  );
}

// ─── Main VideoEditor ─────────────────────────────────────────────────────────
export default function VideoEditor({
  onBack,
  isLoggedIn = false,
  onLogout,
}: { onBack: () => void; isLoggedIn?: boolean; onLogout?: () => void }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("My Project");

  // Text state
  const [texts, setTexts] = useState<TextItem[]>([]);

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

  // UI state
  const [exportOpen, setExportOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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
        {/* Left Panel — Tools */}
        <aside
          className="w-64 flex-shrink-0 flex flex-col overflow-hidden border-r"
          style={{
            background: "oklch(0.09 0.01 280)",
            borderColor: "oklch(0.18 0.02 280)",
          }}
        >
          <Tabs
            defaultValue="text"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList
              className="grid grid-cols-11 m-2 h-8 flex-shrink-0 rounded-lg"
              style={{ background: "oklch(0.12 0.015 280)" }}
            >
              <TabsTrigger
                value="text"
                className="text-xs rounded-md"
                data-ocid="editor.text.tab"
              >
                <Type className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="music"
                className="text-xs rounded-md"
                data-ocid="editor.music.tab"
              >
                <Music className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="audio"
                className="text-xs rounded-md"
                data-ocid="editor.audio.tab"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="filters"
                className="text-xs rounded-md"
                data-ocid="editor.filters.tab"
              >
                <Film className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="trim"
                className="text-xs rounded-md"
                data-ocid="editor.trim.tab"
              >
                <Scissors className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="background"
                className="text-xs rounded-md"
                data-ocid="editor.background.tab"
              >
                <Image className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="apps"
                className="text-xs rounded-md"
                data-ocid="editor.apps.tab"
              >
                <Layers className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="magic"
                className="text-xs rounded-md"
                data-ocid="editor.magic.tab"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="uploads"
                className="text-xs rounded-md"
                data-ocid="editor.uploads.tab"
              >
                <Upload className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="chroma"
                className="text-xs rounded-md"
                data-ocid="editor.chroma.tab"
              >
                <Wand2 className="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="convert"
                className="text-xs rounded-md"
                data-ocid="editor.convert.tab"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </TabsTrigger>
            </TabsList>

            {/* Tab labels */}
            <div className="flex px-2 mb-1">
              {[
                { val: "text", label: "Text" },
                { val: "music", label: "Music" },
                { val: "audio", label: "Audio" },
                { val: "filters", label: "Filters" },
                { val: "trim", label: "Trim" },
                { val: "brand", label: "Brand" },
                { val: "templates", label: "Templates" },
                { val: "elements", label: "Elements" },
                { val: "background", label: "BG" },
                { val: "apps", label: "Apps" },
                { val: "magic", label: "Magic" },
                { val: "uploads", label: "Upload" },
                { val: "chroma", label: "Chroma" },
              ].map((t) => (
                <span
                  key={t.val}
                  className="flex-1 text-center text-[9px] text-muted-foreground"
                >
                  {t.label}
                </span>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="text" className="m-0 mt-0">
                <TextPanel texts={texts} setTexts={setTexts} />
              </TabsContent>
              <TabsContent value="music" className="m-0 mt-0">
                <MusicPanel
                  activeTrack={activeTrack}
                  setActiveTrack={setActiveTrack}
                  musicVolume={musicVolume}
                  setMusicVolume={setMusicVolume}
                />
              </TabsContent>
              <TabsContent value="audio" className="m-0 mt-0">
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
              </TabsContent>
              <TabsContent value="filters" className="m-0 mt-0">
                <FiltersPanel
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  intensity={filterIntensity}
                  setIntensity={setFilterIntensity}
                />
              </TabsContent>
              <TabsContent value="trim" className="m-0 mt-0">
                <TrimPanel
                  duration={duration}
                  startTime={startTime}
                  endTime={endTime}
                  setStartTime={setStartTime}
                  setEndTime={setEndTime}
                />
              </TabsContent>
              <TabsContent value="brand" className="m-0 mt-0">
                <BrandKitPanel />
              </TabsContent>
              <TabsContent value="templates" className="m-0 mt-0">
                <TemplatesPanel />
              </TabsContent>
              <TabsContent value="elements" className="m-0 mt-0">
                <ElementsPanel />
              </TabsContent>
              <TabsContent value="background" className="m-0 mt-0">
                <BackgroundPanel />
              </TabsContent>
              <TabsContent value="apps" className="m-0 mt-0">
                <AppsPanel />
              </TabsContent>
              <TabsContent value="magic" className="m-0 mt-0">
                <MagicMediaPanel />
              </TabsContent>
              <TabsContent value="uploads" className="m-0 mt-0">
                <UploadsPanel />
              </TabsContent>
              <TabsContent value="chroma" className="m-0 mt-0">
                <ChromaKeyPanel />
              </TabsContent>
              <TabsContent value="convert" className="m-0 mt-0">
                <FileConverterPanel />
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Center — Video Preview */}
        <main
          className="flex-1 flex flex-col overflow-hidden relative"
          style={{ background: "oklch(0.07 0.008 280)" }}
        >
          <AIChatbox />
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
    </div>
  );
}
