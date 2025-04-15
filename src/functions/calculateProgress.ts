export const calculateProgress = (start: number, end: number) => {
  return calculateProgressPercentage(start, end, Date.now());
};

const calculateProgressPercentage = (start: number, end: number, now: number) => {
  const total = end - start;
  const elapsed = now - start;
  return Math.min((elapsed / total) * 100, 100);
};
