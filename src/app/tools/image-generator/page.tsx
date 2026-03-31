"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Sparkles, Download, Wand2, Image as ImageIcon, RefreshCw } from "lucide-react";
import { useGenerationTimer } from "@/hooks/useGenerationTimer";
import { TimerDisplay } from "@/components/ui/TimerDisplay";

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1 (Square)");
  const [style, setStyle] = useState("Photorealistic");

  const { timeLeft, isGenerating, status, startTimer, stopTimer, resetTimer } = useGenerationTimer(12);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setError("");
    setLoading(true);
    startTimer();

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "image-generator",
          prompt: prompt,
          aspectRatio: aspectRatio,
          style: style,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Generation failed");
      }

      setResult(data.image);
      stopTimer(true);
    } catch (err: any) {
      console.error("Generator Error:", err);
      setError(err.message || "Something went wrong");
      stopTimer(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setResult(null);
    setError("");
    resetTimer();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold heading-cursive text-gradient mb-4">AI Image Generator</h1>
        <p className="text-gray-400 text-lg">Turn your imagination into stunning visuals in seconds. Completely Free.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Controls */}
        <div className="space-y-6">
          <GlassCard hoverEffect={false}>
            <form onSubmit={handleGenerate}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300 block">Your Prompt</label>
                {result && (
                  <button 
                    type="button" 
                    onClick={handleReset}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic cyberpunk city at night with neon signs and flying cars, high resolution..."
                rows={4}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors mb-6 resize-none"
              />
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Aspect Ratio</label>
                  <select 
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none text-sm cursor-pointer"
                  >
                    <option className="bg-gray-900" value="1:1">1:1 (Square)</option>
                    <option className="bg-gray-900" value="16:9">16:9 (Landscape)</option>
                    <option className="bg-gray-900" value="9:16">9:16 (Portrait)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Style</label>
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none text-sm cursor-pointer"
                  >
                    <option className="bg-gray-900">Photorealistic</option>
                    <option className="bg-gray-900">Anime</option>
                    <option className="bg-gray-900">Digital Art</option>
                    <option className="bg-gray-900">3D Render</option>
                    <option className="bg-gray-900">Cinematic</option>
                  </select>
                </div>
              </div>

              {error && <div className="text-red-400 text-sm mb-4 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">{error}</div>}
              
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className={`flex-1 font-bold py-6 transition-all duration-300 ${result ? 'bg-white text-black hover:bg-white/90 shadow-xl' : 'shadow-purple-500/30 bg-gradient-to-r from-purple-600 to-blue-500 text-white'}`} 
                  disabled={loading || !prompt.trim()}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 animate-spin" /> Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5" /> {result ? "Generate New" : "Generate Image"}
                    </span>
                  )}
                </Button>

                {result && !loading && (
                  <Button 
                    type="button"
                    onClick={() => handleGenerate()}
                    variant="secondary"
                    className="px-6 border-white/10 hover:bg-white/10"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                )}
              </div>
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

        {/* Right Side: Preview */}
        <div className="bg-white/5 border border-white/10 rounded-2xl min-h-[400px] flex items-center justify-center relative overflow-hidden group">
          {result ? (
            <>
              <Image src={result} alt="Generated result" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a href={result} download="generated-image.png" className="contents">
                  <Button variant="secondary">
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                </a>
                <Button variant="outline" onClick={() => handleGenerate()} className="bg-white/10 backdrop-blur-md border-white/20">
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </Button>
              </div>
            </>
          ) : loading ? (
            <div className="text-center px-6">
              <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-purple-400 font-medium animate-pulse">Generating image...</p>
              <p className="text-xs text-gray-500 mt-2">This usually takes 5-10 seconds</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-8">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your generated image will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
