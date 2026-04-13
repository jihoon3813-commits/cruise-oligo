import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const SafeMedia = ({ src, className, style, type = 'image', alt = "" }) => {
  const isStorageId = src?.startsWith('storage:');
  const storageId = isStorageId ? src.split('storage:')[1] : null;
  const resolvedUrl = useQuery(api.files.getUrl, storageId ? { storageId } : "skip");

  const finalSrc = isStorageId ? resolvedUrl : src;

  if (isStorageId && !resolvedUrl) {
    return <div style={{ ...style, background: 'var(--bg-sub)' }} className={className}></div>;
  }

  if (type === 'video') {
    return (
      <video 
        src={finalSrc} 
        autoPlay loop muted playsInline 
        className={className} 
        style={style} 
      />
    );
  }

  return (
    <img 
      src={finalSrc} 
      alt={alt} 
      className={className} 
      style={style} 
    />
  );
};

export default SafeMedia;
