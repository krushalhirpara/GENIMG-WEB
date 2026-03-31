"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Sparkles, Download, Wand2, UploadCloud, X } from "lucide-react";
import { useGenerationTimer } from "@/hooks/useGenerationTimer";
import { TimerDisplay } from "@/components/ui/TimerDisplay";

export default function ImageEnhancerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [style, setStyle] = useState("4x AI Upscale (Recommended)");

  const { timeLeft, isGenerating, status, startTimer, stopTimer } = useGenerationTimer(12);

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an image to enhance.");
      return;
    }

    setError("");
    setLoading(true);
    startTimer();

    try {
      const base64Image = await toBase64(file);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "image-enhancer",
          prompt: prompt || "Upscale and enhance this image, high quality, professional finish",
          style: style,
          image: base64Image,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Enhancement failed. Please try a different image.");
      }

      setResult(data.image);
      stopTimer(true);
    } catch (err: any) {
      console.error("Enhancer Error:", err);
      setError(err.message || "An unexpected error occurred");
      stopTimer(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold heading-cursive text-gradient mb-4">Image Enhancer</h1>
        <p className="text-gray-400 text-lg">Upscale and sharpen your low-quality images. Premium AI Quality.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <GlassCard hoverEffect={false}>
            <form onSubmit={handleGenerate}>
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-300 block mb-2">Upload Image to Enhance</label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors bg-white/5 cursor-pointer relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                    id="image-upload" 
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className="w-10 h-10 text-gray-400 mb-2 group-hover:text-blue-400 transition-colors" />
                    <span className="text-white font-medium">Click to upload raw photo</span>
                    <span className="text-gray-500 text-xs mt-1">Supports PNG, JPG, WEBP</span>
                  </label>
                </div>
              </div>

              {preview && (
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Original Preview</p>
                  <div className="relative aspect-video max-h-[200px] rounded-xl overflow-hidden border border-white/10 group">
                    <Image src={preview} alt="Original preview" fill className="object-contain bg-black/20" />
                    <button 
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-300 block mb-2">Enhancement Instructions (Optional)</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Fix facial details and remove noise..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors mb-2 resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 block mb-2">Enhancement Level</label>
                <select 
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none text-sm cursor-pointer"
                >
                  <option className="bg-gray-900">4x AI Upscale (Recommended)</option>
                  <option className="bg-gray-900">2x Fast Upscale</option>
                  <option className="bg-gray-900">Face Restoration</option>
                  <option className="bg-gray-900">Ultra-HD Detail</option>
                </select>
              </div>

              {error && <div className="text-red-400 text-sm mb-4 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">{error}</div>}
              
              <Button 
                type="submit" 
                className={`w-full font-bold py-6 transition-all duration-300 ${result ? 'bg-white text-black hover:bg-white/90 shadow-xl' : 'shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white'}`} 
                disabled={loading || !file}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 animate-spin" /> Enhancing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5" /> Enhance Image
                  </span>
                )}
              </Button>
              <TimerDisplay status={status} timeLeft={timeLeft} isGenerating={isGenerating} />
            </form>
          </GlassCard>

          <div className="glass rounded-xl p-4 flex items-center justify-between text-sm">
            <span className="text-gray-400">Status:</span>
            <span className="font-bold text-green-400 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 anim-pulse">
              Active
            </span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl min-h-[400px] flex items-center justify-center relative overflow-hidden group">
          {result ? (
            <>
              <Image src={result} alt="Enhanced result" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a href={result} download="enhanced-image.png" className="contents">
                  <Button variant="secondary">
                    <Download className="w-4 h-4 mr-2" /> Download HQ
                  </Button>
                </a>
              </div>
            </>
          ) : loading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-blue-400 font-medium animate-pulse">Generating image...</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-8">
              <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your enhanced image will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

