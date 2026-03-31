import React from 'react';
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  status: 'idle' | 'generating' | 'success' | 'extended' | 'error';
  timeLeft: number;
  isGenerating: boolean;
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ status, timeLeft, isGenerating, className }) => {
  if (status === 'idle') return null;

  return (
    <div className={cn("text-sm mt-3 transition-opacity duration-300", className)}>
      {status === 'generating' && (
        <p className="text-gray-400 animate-pulse">
          Generating image... Approx time: <span className="text-purple-400 font-bold">{timeLeft} seconds</span>
        </p>
      )}
      {status === 'extended' && (
        <p className="text-purple-400 animate-pulse font-medium">
          Still generating... please wait
        </p>
      )}
      {status === 'success' && (
        <p className="text-green-400 animate-fade-in font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Image generated successfully
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-400 animate-fade-in font-medium">
          Generation failed. Please try again.
        </p>
      )}
    </div>
  );
};
