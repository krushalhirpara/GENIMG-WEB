import { useState, useCallback, useRef, useEffect } from 'react';

export const useGenerationTimer = (initialTime = 12) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'extended' | 'error'>('idle');
  const timerRef = useRef<NodeJS.Timeout>(null);

  const startTimer = useCallback(() => {
    setIsGenerating(true);
    setStatus('generating');
    setTimeLeft(initialTime);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus('extended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialTime]);

  const stopTimer = useCallback((success = true) => {
    setIsGenerating(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus(success ? 'success' : 'error');
  }, []);

  const resetTimer = useCallback(() => {
    setIsGenerating(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(initialTime);
    setStatus('idle');
  }, [initialTime]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { timeLeft, isGenerating, status, startTimer, stopTimer, resetTimer };
};
