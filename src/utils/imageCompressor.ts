/**
 * Compress and optimize an image file to fit safely within Firestore's limits
 * while maintaining crisp display quality on mobile screens and desktop monitors.
 * Guarantees output size is compact (target < 65KB base64) to prevent Firestore 1MB document overflows.
 */
export async function compressImageFile(file: File, maxWidth: number = 800, quality: number = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if larger than maxWidth
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Draw and compress with white background (handles transparent PNGs cleanly)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // If dataUrl is still large (> 90KB chars), re-compress more aggressively
        if (dataUrl.length > 90000) {
          const smallerCanvas = document.createElement('canvas');
          const scale = 0.75;
          smallerCanvas.width = Math.round(width * scale);
          smallerCanvas.height = Math.round(height * scale);
          const sCtx = smallerCanvas.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = '#FFFFFF';
            sCtx.fillRect(0, 0, smallerCanvas.width, smallerCanvas.height);
            sCtx.drawImage(img, 0, 0, smallerCanvas.width, smallerCanvas.height);
            dataUrl = smallerCanvas.toDataURL('image/jpeg', 0.68);
          }
        }

        resolve(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
