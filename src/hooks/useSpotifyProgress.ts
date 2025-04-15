import { useEffect, useState } from 'react';

export const useSpotifyProgress = (start: number, end: number) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const now = Date.now();
      const total = end - start;
      const elapsed = now - start;
      setProgress(Math.min((elapsed / total) * 100, 100));
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, [start, end]);

  return progress;
};
