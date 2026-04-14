import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SafeMedia: Optimized media component for Oligo Cruise
 * - Automatically resolves storage IDs
 * - Implemented Lazy Loading (Intersection Observer)
 * - Optimized Video Preloading (preload="metadata")
 * - Smooth Fade-in Reveal for better UX
 */
const SafeMedia = ({ src, className, style, type = 'image', alt = "" }) => {
  const isStorageId = src?.startsWith('storage:');
  const storageId = isStorageId ? src.split('storage:')[1] : null;
  const resolvedUrl = useQuery(api.files.getUrl, storageId ? { storageId } : "skip");
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Load slightly before reaching it
    );

    if (ref.current) {
        observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const finalSrc = isStorageId ? resolvedUrl : src;

  // Placeholder state
  if (!inView) {
      return <div ref={ref} style={{ ...style, background: '#f1f5f9' }} className={className} />;
  }

  // Loading state
  if (isStorageId && !resolvedUrl) {
    return <div ref={ref} style={{ ...style, background: '#f1f5f9' }} className={className} />;
  }

  const isVideo = type === 'video' || (finalSrc && (finalSrc.endsWith('.mp4') || finalSrc.endsWith('.webm') || finalSrc.endsWith('.mov')));

  return (
    <div ref={ref} style={{ ...style, position: 'relative', overflow: 'hidden' }} className={className}>
      <AnimatePresence>
        {!loaded && (
           <motion.div 
             initial={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#f1f5f9', zIndex: 1 }}
           />
        )}
      </AnimatePresence>

      {isVideo ? (
        <video 
          src={finalSrc} 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="metadata" // Only load header data initially to save bandwidth
          onLoadedData={() => setLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
        />
      ) : (
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          src={finalSrc} 
          alt={alt} 
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: (style && style.objectFit) || 'cover', display: 'block' }} 
        />
      )}
    </div>
  );
};

export default SafeMedia;
