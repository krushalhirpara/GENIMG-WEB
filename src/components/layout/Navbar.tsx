"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Sparkles, ChevronDown, ImageIcon, Wand2, Shirt, Video, Menu, X } from "lucide-react";

export function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const pathname = usePathname();

  const tools = [
    { name: "AI Image Generator", href: "/tools/image-generator", icon: ImageIcon },
    { name: "Image Enhancer", href: "/tools/image-enhancer", icon: Wand2 },
    { name: "Product Modeling", href: "/tools/product-modeling", icon: Shirt },
    { name: "Video Generator", href: "/tools/video-generator", icon: Video },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1200px]">
      <div className="bg-white rounded-full shadow-2xl border border-gray-100 px-6 md:px-8 py-3 md:py-4 flex items-center justify-between transition-all duration-300">
        {/* Left: Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 group shrink-0 relative z-10"
        >
          <Sparkles className="w-6 h-6 text-[#8b5cf6] group-hover:scale-110 transition-transform" />
          <span className="text-xl md:text-2xl font-bold font-poppins text-black">
            GenImages
          </span>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-black hover:text-[#8b5cf6] transition-colors">Home</Link>
          
          {/* Tools Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-black hover:text-[#8b5cf6] transition-colors">
              Explore Tools <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isToolsOpen && (
              <div className="absolute top-full -left-4 w-72 pt-4 z-50 animate-fade-in">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xl overflow-hidden flex flex-col gap-1">
                  {tools.map((tool) => (
                    <Link 
                      key={tool.name} 
                      href={tool.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-[#8b5cf6] transition-all duration-200 group"
                    >
                      <tool.icon className="w-5 h-5 text-gray-500 group-hover:text-[#8b5cf6] group-hover:scale-110 transition-all shrink-0" />
                      <span className="text-sm font-medium">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/#about" className="text-sm font-medium text-black hover:text-[#8b5cf6] transition-colors">About GenImages</Link>
        </div>

        {/* Right: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/tools/image-generator">
            <Button variant="pillNavbar" size="sm">
              Generate Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-black hover:text-[#8b5cf6] transition-colors"
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            if (!isMobileMenuOpen) setIsMobileToolsOpen(false);
          }}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-4 animate-fade-in px-2">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-2xl flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-lg font-medium text-black hover:text-[#8b5cf6]" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              
              <div className="flex flex-col">
                <button 
                  className="flex items-center justify-between w-full text-lg font-medium text-black hover:text-[#8b5cf6] py-2"
                  onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                >
                  <span>Explore Tools</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileToolsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`flex flex-col gap-3 transition-all duration-300 overflow-hidden ${isMobileToolsOpen ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  {tools.map((tool) => (
                    <Link 
                      key={tool.name} 
                      href={tool.href}
                      className="flex items-center gap-3 text-gray-600 hover:text-[#8b5cf6] py-2 pl-4 rounded-lg hover:bg-gray-50 transition-all font-poppins"
                      onClick={() => { setIsMobileMenuOpen(false); setIsMobileToolsOpen(false); }}
                    >
                      <tool.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/#about" className="text-lg font-medium text-black hover:text-[#8b5cf6]" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <Link href="/tools/image-generator" className="w-full">
                <Button variant="pillNavbar" className="w-full">Generate Now</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

