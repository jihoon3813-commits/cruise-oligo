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
  
  // YouTube detection
  const isYouTube = finalSrc?.includes('youtube.com') || finalSrc?.includes('youtu.be');
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div ref={ref} style={{ ...style, position: 'relative', overflow: 'hidden' }} className={className}>
      <AnimatePresence>
        {!loaded && !isYouTube && (
           <motion.div 
             initial={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#f1f5f9', zIndex: 1 }}
           />
        )}
      </AnimatePresence>

      {isYouTube ? (
        <iframe
          src={`https://www.youtube.com/embed/${getYouTubeId(finalSrc)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeId(finalSrc)}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1`}
          style={{ 
            width: '300%', // Over-scale to hide black bars/branding
            height: '100%', 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none' 
          }}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          onLoad={() => setLoaded(true)}
        />
      ) : isVideo ? (
        <video 
          src={finalSrc} 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="metadata" 
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
