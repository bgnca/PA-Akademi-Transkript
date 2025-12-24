
/**
 * Converts a Blob to a Base64 string.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Formats seconds into MM:SS format.
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parses a "MM:SS" or "MM.SS" string into seconds.
 * Robust against AI formatting errors.
 */
export const parseTimestamp = (timestamp: string): number => {
  if (!timestamp) return 0;
  
  // Replace dots and spaces with colons to standardize
  const cleanTs = timestamp.trim().replace(/\./g, ':').replace(/\s/g, '');
  
  const parts = cleanTs.split(':');
  
  if (parts.length === 2) {
    // MM:SS
    const mins = parseInt(parts[0], 10);
    const secs = parseInt(parts[1], 10);
    return (isNaN(mins) ? 0 : mins) * 60 + (isNaN(secs) ? 0 : secs);
  } else if (parts.length === 3) {
    // HH:MM:SS
    const hours = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);
    const secs = parseInt(parts[2], 10);
    return (isNaN(hours) ? 0 : hours) * 3600 + (isNaN(mins) ? 0 : mins) * 60 + (isNaN(secs) ? 0 : secs);
  }
  
  return 0;
};
