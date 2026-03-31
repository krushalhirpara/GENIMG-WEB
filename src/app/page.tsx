"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Image as ImageIcon, Sparkles, Wand2, Shirt, Video, CheckCircle2, Download, Loader2 } from "lucide-react";
import { useGenerationTimer } from "@/hooks/useGenerationTimer";
import { TimerDisplay } from "@/components/ui/TimerDisplay";


export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  
  const { timeLeft, isGenerating, status, startTimer, stopTimer, resetTimer } = useGenerationTimer(12);

  // Handle hash-based scrolling
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // Scroll on initial load
    handleHashScroll();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const handleHeroGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError("");
    setLoading(true);
    setResult(null);
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
        }),
      });

      if (!res.ok) {
        let errorMsg = "Generation failed";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setResult(data.image);
      stopTimer(true);
    } catch (err: any) {
      console.error("Hero Generation Error:", err);
      setError(err.message || "Something went wrong");
      stopTimer(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pb-20 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 mb-2 animate-fade-in-up">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-medium text-white/90">Public Access: AI Tools are now free for everyone!</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold animate-fade-in-up pb-2 leading-tight">
            <span className="text-gradient text-glow">Generate AI Images</span>
            <br /> <span className="text-white">Instantly</span>
          </h1>
          
          <p className="font-poppins text-[20px] leading-[1.6] font-normal text-white/80 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Create stunning visuals, enhance photos, and model products with our public suite of AI design tools. No login required.
          </p>

          <div className="pt-12 w-full max-w-5xl mx-auto animate-fade-in-up delay-200">
            <form onSubmit={handleHeroGenerate} className="relative flex flex-col md:flex-row items-center w-full glass rounded-2xl md:rounded-full p-2 md:p-3 border border-white/10 shadow-2xl focus-within:border-purple-500/30 transition-all duration-300">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create in vivid detail..." 
                className="w-full bg-transparent border-none outline-none px-6 py-4 text-lg text-white placeholder:text-gray-400"
              />
              <div className="w-full md:w-auto p-1 md:p-0">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto md:min-w-[220px] rounded-xl md:rounded-full py-7 text-lg font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                    </span>
                  ) : (
                    "Generate Now ✧"
                  )}
                </Button>
              </div>
            </form>

            <TimerDisplay status={status} timeLeft={timeLeft} isGenerating={isGenerating} />
            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

            {/* Quick Result Preview */}
            {result && (
              <GlassCard className="mt-8 max-w-2xl mx-auto overflow-hidden animate-scale-in">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <Image src={result} alt="Quick generate result" fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 italic font-medium truncate max-w-[70%]">"{prompt}"</p>
                  <a href={result} download="genimages-hero.png" className="contents">
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </a>
                </div>
              </GlassCard>
            )}

            {!result && !loading && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Link href="/tools/image-generator">
                  <Button variant="secondary">Start Creating</Button>
                </Link>
                <Link href="#tools">
                  <Button variant="outline">Explore all tools</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
 
      {/* How It Works Section */}
      <section className="py-20 px-6 relative z-10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold heading-cursive text-gradient mb-6 pb-2">How GenImages works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Simple four-step process to generate professional quality visuals instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step lines (desktop) */}
            <div className="hidden lg:block absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -z-10" />

            <div className="flex flex-col items-center text-center group animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl glass mb-6 flex items-center justify-center border-white/10 group-hover:border-purple-500/30 transition-all duration-300 shadow-xl shadow-purple-500/5">
                <Wand2 className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Enter Prompt</h3>
              <p className="text-gray-500 text-sm">Describe what you want in vivid detail using simple English.</p>
            </div>

            <div className="flex flex-col items-center text-center group animate-fade-in-up delay-100">
              <div className="w-16 h-16 rounded-2xl glass mb-6 flex items-center justify-center border-white/10 group-hover:border-blue-500/30 transition-all duration-300 shadow-xl shadow-blue-500/5">
                <ImageIcon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Choose Tool</h3>
              <p className="text-gray-500 text-sm">Select from our suite of AI tools for images, videos or product modeling.</p>
            </div>

            <div className="flex flex-col items-center text-center group animate-fade-in-up delay-200">
              <div className="w-16 h-16 rounded-2xl glass mb-6 flex items-center justify-center border-white/10 group-hover:border-orange-500/30 transition-all duration-300 shadow-xl shadow-orange-500/5">
                <Sparkles className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Generate</h3>
              <p className="text-gray-500 text-sm">Our high-end AI models build your vision in seconds, for free!</p>
            </div>

            <div className="flex flex-col items-center text-center group animate-fade-in-up delay-300">
              <div className="w-16 h-16 rounded-2xl glass mb-6 flex items-center justify-center border-white/10 group-hover:border-pink-500/30 transition-all duration-300 shadow-xl shadow-pink-500/5">
                <Download className="w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">4. Download</h3>
              <p className="text-gray-500 text-sm">Instantly save your high-resolution results directly to your device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold heading-cursive text-gradient mb-6 pb-2">Tools to create in seconds</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to turn your imagination into reality. Powered by state-of-the-art AI models, now open to all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="flex flex-col h-full group">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-xl bg-white/5 object-cover">
                <Image src="/images/tool1.png" alt="AI Image Generator" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">AI Image Generator</h3>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">Transform your text prompts into breathtaking, high-resolution masterpieces.</p>
              <Link href="/tools/image-generator" className="mt-auto">
                <Button variant="tryNow" className="w-full">Try Now</Button>
              </Link>
            </GlassCard>

            <GlassCard className="flex flex-col h-full group">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-xl bg-white/5 object-cover">
                <Image src="/images/tool2.png" alt="Image Enhancer" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                  <Wand2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Image Enhancer</h3>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">Upscale and sharpen your low-quality images to stunning 4K resolution.</p>
              <Link href="/tools/image-enhancer" className="mt-auto">
                <Button variant="tryNow" className="w-full">Try Now</Button>
              </Link>
            </GlassCard>

            <GlassCard className="flex flex-col h-full group">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-xl bg-white/5 object-cover">
                <Image src="/images/tool3.png" alt="Product Modeling" fill className="object-cover top-center group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
                  <Shirt className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Product Modeling</h3>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">Generate professional lifestyle shots of your products on virtual models.</p>
              <Link href="/tools/product-modeling" className="mt-auto">
                <Button variant="tryNow" className="w-full">Try Now</Button>
              </Link>
            </GlassCard>

            <GlassCard className="flex flex-col h-full group">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-xl bg-white/5 object-cover">
                <Image src="/images/tool4.png" alt="Video Generator" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 shrink-0">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Video Generator</h3>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">Bring your static prompts to life with immersive, cinematic AI video generation.</p>
              <Link href="/tools/video-generator" className="mt-auto">
                <Button variant="tryNow" className="w-full">Try Now</Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">About GenImages</h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  GenImages is a state-of-the-art AI-powered creation platform designed for modern creators, marketers, and designers. We have removed all barriers to entry, making our premium suite of design tools available to everyone for free.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  Whether you're looking to generate high-quality marketing assets, enhance existing photos, or create immersive AI videos, our platform delivers fast, professional results in seconds—no account required.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300">
                    <Sparkles className="w-4 h-4" /> 100% Free
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-300">
                    <CheckCircle2 className="w-4 h-4" /> Professional Quality
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-orange-300">
                    <Wand2 className="w-4 h-4" /> No Login Required
                  </div>
                </div>
              </div>
              
              <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden glass border-white/10 shadow-2xl">
                <Image 
                  src="/images/tool1.png" 
                  alt="AI Creation Illustration" 
                  fill 
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl border-white/20">
                  <p className="text-sm font-medium text-white italic">"Transforming vision into visual perfection with the power of artificial intelligence, now open to the world."</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
        </div>

        <div className="max-w-4xl mx-auto glass p-12 rounded-[2rem] border-white/10 text-center relative z-10 shadow-2xl animate-fade-in-up overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16" />
          
          <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 heading-cursive">Ready to transform your vision?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of creators using GenImages to build the future of visual content. Start creating professional assets instantly!
          </p>
          <Link href="/tools/image-generator">
            <Button className="px-12 py-8 text-xl font-bold shadow-xl shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 transition-transform duration-300">
              Generate Now ✧
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

