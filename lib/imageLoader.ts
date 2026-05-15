export default function imageLoader({ src, width, quality }: { src: string; width?: number; quality?: number }) {
  if (width) {
    // If using Cloudinary, we could optimize here, but for now just silencing warnings
    // Example: return src.replace('/upload/', `/upload/w_${width},q_${quality || 'auto'}/`);
  }
  return src;
}
