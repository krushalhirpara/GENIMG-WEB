"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Sparkles, Download, Video, PlayCircle } from "lucide-react";
import { useGenerationTimer } from "@/hooks/useGenerationTimer";
import { TimerDisplay } from "@/components/ui/TimerDisplay";

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState("5 Seconds");
  const [motion, setMotion] = useState("Dynamic (High)");

  const { timeLeft, isGenerating, status, startTimer, stopTimer } = useGenerationTimer(12);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError("");
    setLoading(true);

    // Automatic Motion Selection Logic
    const fastKeywords = ["fast", "motion", "hyperlapse", "car", "running", "action", "speed", "dynamic", "zoom"];
    const lowercasePrompt = prompt.toLowerCase();
    if (fastKeywords.some(keyword => lowercasePrompt.includes(keyword))) {
      setMotion("Dynamic (High)");
      console.log("⚡ Auto-set Motion: Dynamic (High)");
    }

    startTimer();

    try {
      const res = await fetch("/api/video-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          duration: duration,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Video generation failed. Please try again.");
      }

      setResult(data.videoUrl);
      stopTimer(true);
    } catch (err: any) {
      console.error("Video Generator Error:", err);
      setError(err.message || "Something went wrong");
      stopTimer(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "generated-video.mp4";
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold heading-cursive text-gradient mb-4">Video Generator</h1>
        <p className="text-gray-400 text-lg">Bring your prompts to life with cinematic AI motion. Completely Free.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <GlassCard hoverEffect={false}>
            <form onSubmit={handleGenerate}>
              <label className="text-sm font-medium text-gray-300 block mb-2">Video Scene Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Cinematic drone shot of an alien planet with beautiful purple oceans and glowing flora..."
                rows={5}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors mb-6 resize-none"
              />
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Duration</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none text-sm cursor-pointer"
                  >
                    <option className="bg-gray-900">5 Seconds</option>
                    <option className="bg-gray-900">10 Seconds</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Motion Scale</label>
                  <select 
                    value={motion}
                    onChange={(e) => setMotion(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none text-sm cursor-pointer"
                  >
                    <option className="bg-gray-900">Dynamic (High)</option>
                    <option className="bg-gray-900">Subtle (Low)</option>
                  </select>
                </div>
              </div>

              {error && <div className="text-red-400 text-sm mb-4 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">{error}</div>}
              
              <Button 
                type="submit" 
                className={`w-full font-bold py-6 transition-all duration-300 ${result ? 'bg-white text-black hover:bg-white/90 shadow-xl' : 'shadow-pink-500/30 bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-500 hover:to-purple-400 text-white'}`} 
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Video className="w-5 h-5 animate-spin" /> Generating video...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5" /> Generate Video
                  </span>
                )}
              </Button>
              <TimerDisplay status={status} timeLeft={timeLeft} isGenerating={isGenerating} />
            </form>
          </GlassCard>

          <div className="glass rounded-xl p-4 flex items-center justify-between text-sm border-white/10">
            <span className="text-gray-400">Status:</span>
            <span className={`font-bold px-3 py-1 rounded-full border anim-pulse transition-colors ${result ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-blue-400 bg-blue-500/20 border-blue-500/30'}`}>
              {loading ? "Generating..." : result ? "Video generated successfully" : "Ready"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl min-h-[400px] flex items-center justify-center relative overflow-hidden group">
            {result ? (
              <div className="relative w-full h-full animate-fade-in">
                <video 
                  src={result} 
                  controls 
                  autoPlay 
                  muted
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    console.error("Video Load Error");
                    setError("Video not available. The generated file could not be played.");
                    setResult(null);
                  }}
                />
              </div>
            ) : loading ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-pink-400 font-medium animate-pulse">Generating video...</p>
              </div>
            ) : (
              <div className="text-center text-gray-500 p-8">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Your generated video will appear here.</p>
              </div>
            )}
          </div>

          {result && !loading && (
            <div className="flex justify-center animate-fade-in">
              <Button 
                onClick={handleDownload}
                variant="secondary"
                className="w-full md:w-auto px-12 py-6 text-lg"
              >
                <Download className="w-5 h-5 mr-3" /> Download Video
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

