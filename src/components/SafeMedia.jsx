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
const SafeMedia = ({ src, className, style, type = 'image', alt = "", brightness = 1, shading = 0 }) => {
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
      { rootMargin: '200px' } 
    );

    if (ref.current) {
        observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const finalSrc = isStorageId ? resolvedUrl : src;

  const innerObjectFit = style?.objectFit || 'cover';
  const innerFilter = style?.filter || `brightness(${brightness})`;
  
  const wrapperStyle = {
    position: style?.position || 'relative',
    overflow: 'hidden',
    width: style?.width || '100%',
    height: style?.height || '100%',
    minHeight: 0,
    borderRadius: style?.borderRadius,
    boxShadow: style?.boxShadow,
    maxWidth: style?.maxWidth,
    maxHeight: style?.maxHeight,
    display: style?.display || 'block',
    zIndex: style?.zIndex || 0,
    ...(style?.inset !== undefined ? { inset: style.inset } : {}),
    ...(style?.top !== undefined ? { top: style.top } : {}),
    ...(style?.left !== undefined ? { left: style.left } : {}),
    background: '#1a1a1a' // Dark background for media loading
  };

  if (!inView) {
      return <div ref={ref} style={{ ...wrapperStyle, background: '#f1f5f9' }} className={className} />;
  }

  if (isStorageId && !resolvedUrl) {
    return <div ref={ref} style={{ ...wrapperStyle, background: '#f1f5f9' }} className={className} />;
  }

  const isVideo = type === 'video' || (finalSrc && (finalSrc.endsWith('.mp4') || finalSrc.endsWith('.webm') || finalSrc.endsWith('.mov')));
  const isYouTube = finalSrc?.includes('youtube.com') || finalSrc?.includes('youtu.be');
  
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div ref={ref} style={wrapperStyle} className={className}>
      <AnimatePresence>
        {!loaded && (
           <motion.div 
             initial={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#f1f5f9', zIndex: 10 }}
           />
        )}
      </AnimatePresence>

      {isYouTube ? (
        <iframe
          src={`https://www.youtube.com/embed/${getYouTubeId(finalSrc)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeId(finalSrc)}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&playlist=${getYouTubeId(finalSrc)}`}
          style={{ 
            width: '300%', 
            height: '100%', 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            filter: innerFilter,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
            zIndex: 1
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
          style={{ width: '100%', height: '100%', objectFit: innerObjectFit, display: 'block', filter: innerFilter, opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease', zIndex: 1 }} 
          onLoadedData={() => setLoaded(true)}
        />
      ) : (
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          src={finalSrc} 
          alt={alt} 
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: innerObjectFit, display: 'block', filter: innerFilter, zIndex: 1 }} 
        />
      )}

      {/* Overlays rendered AFTER media for visual priority */}
      {brightness < 1 && (
        <div style={{ position: 'absolute', inset: 0, background: 'black', opacity: 1 - brightness, zIndex: 2, pointerEvents: 'none' }}></div>
      )}
      {shading > 0 && (
        <div style={{ position: 'absolute', inset: 0, background: 'black', opacity: shading, zIndex: 3, pointerEvents: 'none' }}></div>
      )}
    </div>
  );
};

export default SafeMedia;
