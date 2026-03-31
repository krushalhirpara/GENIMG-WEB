"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Sparkles, Download, Wand2, UploadCloud, Users, X, RefreshCw } from "lucide-react";
import { useGenerationTimer } from "@/hooks/useGenerationTimer";
import { TimerDisplay } from "@/components/ui/TimerDisplay";

export default function ProductModelingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [faceFile, setFaceFile] = useState<File | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [modelType, setModelType] = useState("Female Model");
  const [detectedType, setDetectedType] = useState<"clothing" | "shoes" | "accessories" | "furniture" | "other">("other");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { timeLeft, isGenerating, status, startTimer, stopTimer, resetTimer } = useGenerationTimer(12);

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
      
      const fileName = selectedFile.name.toLowerCase();
      const promptLower = prompt.toLowerCase();
      
      if (fileName.includes("shirt") || fileName.includes("tshirt") || fileName.includes("dress") || fileName.includes("jeans") || fileName.includes("clothing") || fileName.includes("apparel")) {
        setDetectedType("clothing");
        setModelType("Studio Model");
      } else if (fileName.includes("shoe") || fileName.includes("sneaker") || fileName.includes("boot") || fileName.includes("footwear")) {
        setDetectedType("shoes");
        setModelType("Walking Pose");
      } else if (fileName.includes("bag") || fileName.includes("watch") || fileName.includes("jewelry") || fileName.includes("accessory") || fileName.includes("handbag")) {
        setDetectedType("accessories");
        setModelType("Close-up Model");
      } else if (fileName.includes("chair") || fileName.includes("table") || fileName.includes("sofa") || fileName.includes("furniture") || fileName.includes("bed")) {
        setDetectedType("furniture");
        setModelType("Interior Scene");
      } else {
        setDetectedType("other");
        setModelType("Product Only");
      }
    }
  };

  const handleFaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFaceFile(selectedFile);
      setFacePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!file || !prompt.trim()) {
      setError("Please upload a product image and enter a description.");
      return;
    }

    setError("");
    setLoading(true);
    startTimer();

    try {
      const productBase64 = await toBase64(file);
      const faceBase64 = faceFile ? await toBase64(faceFile) : null;

      // Ensure we send a valid aspect ratio string for Stability API v2beta
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "product-modeling",
          prompt: prompt,
          style: modelType,
          aspectRatio: "1:1", // Mandatory for Stability v2beta Core/Ultra
          productImage: productBase64,
          faceImage: faceBase64,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "AI failed to generate. Please try again.");
      }

      setResult(data.image);
      stopTimer(true);
    } catch (err: any) {
      console.error("Modeling Error:", err);
      setError(err.message || "An unexpected error occurred during generation");
      stopTimer(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setFaceFile(null);
    setFacePreview(null);
    setPrompt("");
    setResult(null);
    setError("");
    resetTimer();
  };

  const renderModelOptions = () => {
    switch (detectedType) {
      case "clothing":
        return (
          <>
            <option className="bg-gray-900">Studio Model</option>
            <option className="bg-gray-900">Lifestyle Model</option>
            <option className="bg-gray-900">Outdoor Model</option>
            <option className="bg-gray-900">Fashion Shoot</option>
            <option className="bg-gray-900">Ecommerce White Background</option>
          </>
        );
      case "shoes":
        return (
          <>
            <option className="bg-gray-900">Walking Pose</option>
            <option className="bg-gray-900">Street Style</option>
            <option className="bg-gray-900">Gym Scene</option>
          </>
        );
      case "accessories":
        return (
          <>
            <option className="bg-gray-900">Close-up Model</option>
            <option className="bg-gray-900">Hand Focus</option>
            <option className="bg-gray-900">Premium Shoot</option>
          </>
        );
      case "furniture":
        return (
          <>
            <option className="bg-gray-900">Interior Scene</option>
            <option className="bg-gray-900">Lifestyle Room Setup</option>
          </>
        );
      default:
        return (
          <>
            <option className="bg-gray-900">Product Only</option>
            <option className="bg-gray-900">Hand Model</option>
            <option className="bg-gray-900">Lifestyle Scene</option>
          </>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold heading-cursive text-gradient mb-4">Product Modeling</h1>
        <p className="text-gray-400 text-lg">Generate AI models wearing your products. Premium Ecommerce Quality.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Controls */}
        <div className="space-y-6">
          <GlassCard hoverEffect={false}>
            <form onSubmit={handleGenerate}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Upload Product Image</label>
                <div className="flex gap-2">
                  {file && (
                    <button 
                      type="button" 
                      onClick={handleReset}
                      className="text-[10px] text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider"
                    >
                      Reset
                    </button>
                  )}
                  {file && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                      Detected: {detectedType}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 mb-4 text-center hover:border-orange-500/50 transition-colors bg-white/5 cursor-pointer relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="product-upload" 
                />
                <label htmlFor="product-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-orange-400 transition-colors" />
                  <span className="text-white text-sm font-medium">Click to upload flat lay or product shot</span>
                </label>
              </div>

              {preview && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Product Preview</p>
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                      <Image src={preview} alt="Product preview" fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => { setFile(null); setPreview(null); }}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {facePreview && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Face Identity Preview</p>
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                        <Image src={facePreview} alt="Face preview" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setFaceFile(null); setFacePreview(null); }}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 block mb-2">Model Scene / Pose</label>
                <select 
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 text-sm appearance-none cursor-pointer"
                >
                  {renderModelOptions()}
                </select>
              </div>

              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col gap-1 mb-2">
                  <label className="text-sm font-medium text-gray-300">Upload Face (Identity Reference)</label>
                  <p className="text-[10px] text-gray-500">The same face will be preserved on the AI model</p>
                </div>
                <div className="border border-white/10 rounded-xl p-3 bg-white/5 hover:border-orange-500/30 transition-colors">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFaceChange}
                    className="text-xs text-gray-400 file:bg-orange-500/20 file:border-none file:text-orange-400 file:px-3 file:py-1 file:rounded-lg file:mr-3 file:cursor-pointer file:font-bold hover:file:bg-orange-500/30" 
                  />
                </div>
              </div>

              <label className="text-sm font-medium text-gray-300 block mb-2">Model Description / Style</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A high-end fashion shoot in a minimalist studio..."
                rows={3}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors mb-6 resize-none"
              />

              {error && <div className="text-red-400 text-sm mb-4 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">{error}</div>}
              
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className={`flex-1 font-bold py-6 transition-all duration-300 ${result ? 'bg-white text-black hover:bg-white/90 shadow-xl' : 'shadow-orange-500/30 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white'}`} 
                  disabled={loading || !file || !prompt.trim()}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 animate-spin" /> {result ? 'Regenerating...' : 'Generating model...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5" /> {result ? "Generate New Shoot" : "Generate Shoot"}
                    </span>
                  )}
                </Button>

                {result && !loading && (
                  <Button 
                    type="button"
                    onClick={() => handleGenerate()}
                    variant="secondary"
                    className="px-6 border-white/10 hover:bg-white/10 bg-orange-500/10 text-orange-400"
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
              <Image src={result} alt="Product modeled result" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a href={result} download="product-model.png" className="contents">
                  <Button variant="secondary">
                    <Download className="w-4 h-4 mr-2" /> Download Photo
                  </Button>
                </a>
                <Button variant="outline" onClick={() => handleGenerate()} className="bg-white/10 backdrop-blur-md border-white/20">
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </Button>
              </div>
            </>
          ) : loading ? (
            <div className="text-center px-6">
              <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-orange-400 font-medium animate-pulse">Generating image...</p>
              <p className="text-xs text-gray-500 mt-2">Professional studio lighting takes ~5-10s</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-8">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your professional shoot will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
