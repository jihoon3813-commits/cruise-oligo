import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { ArrowRight, ArrowUpRight, Star, ExternalLink, ChevronLeft, ChevronRight, User, X, CheckCircle2, MapPin, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeMedia from '../components/SafeMedia';

const getTextStyle = (typo, type) => {
  if (!typo?.[type]) return {};
  const t = typo[type];
  const desktopSize = t.fontSize || (type === 'title' ? 42 : 18);
  const mobileSize = Math.max(12, Math.floor(desktopSize * 0.55));
  return {
    color: t.color,
    fontSize: `clamp(${mobileSize}px, 4.2vw, ${desktopSize}px)`,
    fontFamily: t.fontFamily,
    textAlign: t.textAlign || 'inherit',
    letterSpacing: t.letterSpacing ? `${t.letterSpacing}em` : undefined,
    lineHeight: t.lineHeight || 1.4,
    display: 'block'
  };
};

const MultiLineText = ({ text, style }) => {
  if (!text) return null;
  return (
    <span style={style}>
      {text.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i !== text.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
};

const WavyText = ({ text, style }) => {
  if (!text) return null;
  const letters = Array.from(text);
  const container = { hidden: { opacity: 0 }, visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.04 * i } }) };
  const child = { visible: { opacity: 1, y: [0, -5, 0], transition: { type: "spring", damping: 12, stiffness: 200, repeat: Infinity, repeatType: "reverse", duration: 1.2 } }, hidden: { opacity: 0 } };
  return (
    <motion.div style={{ display: "flex", flexWrap: "wrap", ...style }} variants={container} initial="hidden" animate="visible">
      {letters.map((letter, index) => (<motion.span variants={child} key={index}>{letter === " " ? "\u00A0" : letter}</motion.span>))}
    </motion.div>
  );
};

const HeroText = ({ hero }) => {
  const { typography, aboveTitle, title, subtitle, belowTitle, buttons } = hero;

  const renderTextEffect = (text, type) => {
    const typo = typography?.[type] || {};
    const textStyle = getTextStyle(typography, type);
    const effect = typo.style || 'none';
    if (effect === 'box') return <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ ...textStyle, display: 'inline-block', padding: '8px 20px', background: `${typo.color}15`, border: `1px solid ${typo.color}30`, borderRadius: '100px', marginBottom: '16px', fontWeight: '800' }}>{text}</motion.span>;
    if (effect === 'wavy' && type === 'above') return <WavyText text={text} style={{ ...textStyle, marginBottom: '16px', fontWeight: '800' }} />;
    if (effect === 'italic' && type === 'below') return <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ ...textStyle, fontStyle: 'italic', marginTop: '24px', opacity: 0.9 }}>{text}</motion.span>;
    return <motion.span initial={{ opacity: 0, y: type === 'above' ? -10 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: type === 'above' ? 0 : 0.6 }} style={{ ...textStyle, marginBottom: type === 'above' ? '16px' : 0, marginTop: type === 'below' ? '24px' : 0, fontWeight: type === 'above' ? '800' : '400', opacity: type === 'below' ? 0.9 : 1 }}><MultiLineText text={text}/></motion.span>;
  };
  const renderButton = (btn) => {
    if (!btn.show) return null;
    const styles = btn.style || {};
    const sizeMap = { small: { padding: '8px 20px', fontSize: '13px' }, medium: { padding: '12px 32px', fontSize: '15px' }, large: { padding: '16px 48px', fontSize: '18px' } };
    const currentSize = sizeMap[styles.size] || sizeMap.medium;
    return <Link key={btn.id} to={btn.link || "/"} style={{ ...currentSize, backgroundColor: styles.bgColor || 'var(--primary)', color: styles.textColor || '#ffffff', border: `2px solid ${styles.borderColor || styles.bgColor || 'var(--primary)'}`, borderRadius: '100px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', transition: '0.3s', boxShadow: '0 4px 14px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>{btn.text} {btn.id === (buttons?.[0]?.id) && <ArrowRight size={18} />}</Link>;
  };
  return (
    <div style={{ position: 'relative', zIndex: 10, textAlign: hero.textPosition === 'center' ? 'center' : (hero.textPosition === 'right' ? 'right' : 'left') }}>
       {aboveTitle && renderTextEffect(aboveTitle, 'above')}
       <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} style={{ ...getTextStyle(typography, 'title'), fontWeight: '900', marginBottom: '32px' }}><MultiLineText text={title}/></motion.h1>
       {subtitle && <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} style={{ ...getTextStyle(typography, 'subtitle'), marginBottom: '32px' }}><MultiLineText text={subtitle}/></motion.p>}
       {belowTitle && renderTextEffect(belowTitle, 'below')}
       <div style={{ display: 'flex', gap: '12px', marginTop: '48px', flexWrap: 'wrap', justifyContent: hero.textPosition === 'center' ? 'center' : (hero.textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
          {buttons ? buttons.map(btn => renderButton(btn)) : (<><button className="luxury-btn">지금 시작하기 <ArrowRight size={18} /></button><button className="luxury-btn outline">패키지 보기</button></>)}
       </div>
    </div>
  );
};

const ImageSlider = ({ images = [], singleImage, duration = 3 }) => {
  const [current, setCurrent] = useState(0);
  const allImages = (images && images.length > 0) ? images : (singleImage ? [singleImage] : []);

  useEffect(() => {
    if (allImages.length <= 1 || duration <= 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % allImages.length);
    }, duration * 1000);
    return () => clearInterval(timer);
  }, [allImages.length, duration]);

  if (allImages.length === 0) return null;
  if (allImages.length === 1) return <SafeMedia src={allImages[0]} style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', display: 'block' }} />;
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
      <AnimatePresence mode="wait"><motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%' }}><SafeMedia src={allImages[current]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></motion.div></AnimatePresence>
      <button onClick={() => setCurrent((current - 1 + allImages.length) % allImages.length)} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex' }}><ChevronLeft size={20} /></button>
      <button onClick={() => setCurrent((current + 1) % allImages.length)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex' }}><ChevronRight size={20} /></button>
    </div>
  );
};

const Home = () => {
  const { config } = useConfig();
  const { hero, sections, products, theme } = config;
  useEffect(() => { document.body.className = `theme-${theme || 'white'}`; }, [theme]);

  const CustomButton = ({ section, isSmall = false }) => {
    if (!section.showButton) return null;
    const styles = section.buttonStyles || {};
    const sizeMap = { small: { padding: '8px 20px', fontSize: '12px' }, medium: { padding: '10px 28px', fontSize: '13px' }, large: { padding: '14px 40px', fontSize: '15px' } };
    const isMobile = window.innerWidth < 768;
    const currentSize = sizeMap[isSmall || isMobile ? 'small' : (styles.size || 'medium')];
    return <Link to={section.buttonLink || "/"} style={{ ...currentSize, backgroundColor: styles.bgColor || 'var(--primary)', color: styles.textColor || '#ffffff', border: `2px solid ${styles.borderColor || styles.bgColor || 'var(--primary)'}`, borderRadius: '100px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', transition: '0.3s', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>{section.buttonText || "자세히 보기"} <ArrowRight size={16} /></Link>;
  };

  const MediaGallery = ({ images = [], singleImage, style, duration }) => {
    const allImages = (images && images.length > 0) ? images : (singleImage ? [singleImage] : []);
    if (allImages.length === 0) return null;
    if (style === 'gallery') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {allImages.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <SafeMedia src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          ))}
        </div>
      );
    }
    return <ImageSlider images={allImages} singleImage={singleImage} duration={duration} />;
  };

  const renderSection = (section) => {
    const { style, typography, items, layout, bgColor, bgType, bgUrl, image, images, bgOpacity, paddingTop, paddingBottom, cardStyles } = section;
    const isMobile = window.innerWidth < 768;
    const hasMedia = image || (images && images.length > 0);
    
    const wrapperStyle = { 
      position: 'relative', 
      paddingTop: `${isMobile ? Math.min(40, paddingTop ?? 40) : (paddingTop ?? 80)}px`, 
      paddingBottom: `${isMobile ? Math.min(40, paddingBottom ?? 40) : (paddingBottom ?? 80)}px`, 
      background: bgType === 'color' ? (bgColor || 'transparent') : 'transparent', 
      overflow: 'hidden' 
    };

    const header = (
      <div style={{ marginBottom: isMobile ? '32px' : '48px', maxWidth: (style === 'minimal-centered' || style === 'luxury-row') ? '800px' : 'none', margin: (style === 'minimal-centered' || style === 'luxury-row') ? '0 auto' : '0', textAlign: style === 'minimal-centered' ? 'center' : 'inherit' }}>
         {section.aboveTitle && <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em', display: 'block', marginBottom: '12px', textTransform: 'uppercase' }}>{section.aboveTitle}</span>}
         <h2 style={{ ...getTextStyle(typography, 'title'), marginBottom: '20px' }}><MultiLineText text={section.title}/></h2>
         <p style={{ ...getTextStyle(typography, 'content'), opacity: 0.8 }}><MultiLineText text={section.content}/></p>
         <div style={{marginTop: '24px'}}><CustomButton section={section} /></div>
      </div>
    );

    const getCardStyle = (customStyles = {}) => {
       const cs = { ...cardStyles, ...customStyles };
       return {
          background: cs.bgColor || (theme === 'midnight' ? 'rgba(255,255,255,0.05)' : '#fff'),
          padding: isMobile ? '24px' : '32px',
          borderRadius: `${cs.borderRadius ?? 24}px`,
          border: `${cs.borderWidth ?? 1}px solid ${cs.borderColor || (theme === 'midnight' ? 'rgba(255,255,255,0.1)' : 'var(--border-light)')}`,
          boxShadow: `0 15px 45px rgba(0,0,0,${cs.shadow ?? 0.08})`,
          overflow: 'hidden'
       };
    };

    const getItemTextStyle = (item, type, defaultSize) => {
        const itemTypo = item.typography?.[type] || {};
        const sectionTypo = typography?.[type === 'above' ? 'title' : type] || {};
        return {
            color: itemTypo.color || sectionTypo.color || (type === 'content' ? 'var(--text-muted)' : 'var(--text-main)'),
            fontSize: `${itemTypo.fontSize || defaultSize}px`,
            fontWeight: type === 'content' ? '500' : '900'
        };
    };

    return (
      <section key={section.id} id={`section-${section.id}`} style={wrapperStyle}>
        {bgType !== 'color' && bgUrl && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
            <SafeMedia src={bgUrl} type={bgType} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${section.shading || 0})`, zIndex: 1 }}></div>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: bgType === 'color' ? 'transparent' : `rgba(255,255,255,${1 - (bgOpacity ?? 1)})`, zIndex: 0 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          
          {style === 'luxury-row' && (
             <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: layout === 'right' ? '1.2fr 1fr' : '1fr 1.2fr', gap: isMobile ? '40px' : '80px', alignItems: 'start' }}>
                <div style={{ order: layout === 'right' ? 2 : 1 }}>
                   <div style={{ marginBottom: '48px' }}>
                      {header}
                      <div style={{ marginTop: '32px' }}>
                         <MediaGallery images={images} singleImage={image} duration={section.slideDuration} />
                      </div>
                   </div>
                </div>
                <div style={{ 
                   order: layout === 'right' ? 1 : 2, 
                   display: isMobile && section.mobileLayout === 'slider' ? 'flex' : (isMobile && section.mobileLayout === '2col' ? 'grid' : 'flex'), 
                   flexDirection: isMobile && (section.mobileLayout === '2col' || section.mobileLayout === 'slider') ? 'row' : 'column',
                   gridTemplateColumns: isMobile && section.mobileLayout === '2col' ? 'repeat(2, 1fr)' : 'none',
                   gap: isMobile ? '16px' : '24px',
                   overflowX: isMobile && section.mobileLayout === 'slider' ? 'auto' : 'visible',
                   paddingBottom: isMobile && section.mobileLayout === 'slider' ? '20px' : '0',
                   scrollSnapType: isMobile && section.mobileLayout === 'slider' ? 'x mandatory' : 'none'
                }} className="hide-scrollbar">
                   {(items || []).map((item, i) => (
                     <motion.div key={i} initial={{ opacity:0, x: 20 }} whileInView={{ opacity:1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={{ ...getCardStyle(), display: 'flex', flexDirection: isMobile && section.mobileLayout === '2col' ? 'column' : 'row', gap: isMobile ? '16px' : '24px', alignItems: 'start', minWidth: isMobile && section.mobileLayout === 'slider' ? '280px' : 'auto', scrollSnapAlign: 'start' }}>
                        <div style={{ width: isMobile ? '40px' : '56px', height: isMobile ? '40px' : '56px', flexShrink: 0, border: '2px solid var(--primary)', color: 'var(--primary)', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '13px' : '16px', fontWeight: '900', borderRadius: '12px' }}>{item.number}</div>
                        <div style={{ flex: 1 }}>
                           {item.aboveTitle && <div style={{ marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', ...getItemTextStyle(item, 'above', 12) }}>{item.aboveTitle}</div>}
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <h4 style={{ ...getItemTextStyle(item, 'title', isMobile ? 18 : 22) }}>{item.title}</h4>
                              {item.tag && <span style={{ fontSize: '11px', background: 'var(--primary)', color: '#fff', padding: '4px 14px', borderRadius: '100px', fontWeight: '800', boxShadow: '0 4px 10px var(--primary)30' }}>{item.tag}</span>}
                           </div>
                           <p style={{ lineHeight: '1.7', ...getItemTextStyle(item, 'content', isMobile ? 14 : 16) }}>{item.content}</p>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </div>
          )}

          {style === 'split-card' && (
             <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '32px' : '48px' }}>
                <div style={{ ...getCardStyle(), padding: isMobile ? '32px 20px' : '80px', flexDirection: 'column', order: layout === 'right' ? 2 : 1 }}>{header}</div>
                <div style={{ order: layout === 'right' ? 1 : 2 }}><MediaGallery images={images} singleImage={image} duration={section.slideDuration} /></div>
             </div>
          )}

          {style === 'minimal-centered' && (
             <div style={{ textAlign: 'center' }}>
                {header}
                {hasMedia && <div style={{ marginTop: '48px', maxWidth: '1000px', margin: '48px auto 0' }}><MediaGallery images={images} singleImage={image} duration={section.slideDuration} /></div>}
             </div>
          )}

          {style === 'gallery' && (
             <div>
                {header}
                <div style={{ 
                  display: isMobile && section.mobileLayout === 'slider' ? 'flex' : 'grid', 
                  gridTemplateColumns: isMobile ? (section.mobileLayout === '2col' ? 'repeat(2, 1fr)' : '1fr') : 'repeat(3, 1fr)', 
                  gap: isMobile ? '16px' : '24px', 
                  marginTop: '48px',
                  overflowX: isMobile && section.mobileLayout === 'slider' ? 'auto' : 'visible',
                  paddingBottom: isMobile && section.mobileLayout === 'slider' ? '20px' : '0',
                  scrollSnapType: isMobile && section.mobileLayout === 'slider' ? 'x mandatory' : 'none'
                }} className="hide-scrollbar">
                   {items && items.length > 0 ? (
                      items.map((item, i) => (
                         <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={{ ...getCardStyle({ padding: 0 }), display: 'flex', flexDirection: 'column', minWidth: isMobile && section.mobileLayout === 'slider' ? '280px' : 'auto', scrollSnapAlign: 'start' }}>
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                               {item.image ? <SafeMedia src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>이미지 없음</div>}
                               {item.number && (
                                 <div style={{ 
                                   position: 'absolute', top: '16px', left: '16px', 
                                   background: 'var(--primary)', color: '#fff', 
                                   padding: '6px 14px', borderRadius: '6px', 
                                   fontSize: '12px', fontWeight: '900', 
                                   boxShadow: '0 4px 12px var(--primary)40' 
                                 }}>
                                   {item.number}차
                                 </div>
                               )}
                            </div>
                            <div style={{ padding: '24px' }}>
                               {item.aboveTitle && <div style={{ ...getItemTextStyle(item, 'above', 12), marginBottom: '8px' }}>{item.aboveTitle}</div>}
                               {item.aboveTitle2 && <div style={{ ...getItemTextStyle(item, 'above', 11), marginBottom: '4px', opacity: 0.8 }}>{item.aboveTitle2}</div>}
                               <h4 style={{ ...getItemTextStyle(item, 'title', 20), marginBottom: '16px' }}>{item.title}</h4>
                               <p style={{ ...getItemTextStyle(item, 'content', 14), lineHeight: '1.6', marginBottom: '20px' }}>{item.content}</p>
                               
                               {item.highlights && item.highlights.length > 0 && (
                                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                                     <div style={{ fontSize: '11px', fontWeight: '900', color: item.typography?.highlights?.labelColor || 'var(--primary)', marginBottom: '10px', textTransform: 'uppercase' }}>주요 하이라이트</div>
                                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {item.highlights.map((h, j) => (
                                           <li key={j} style={{ fontSize: '13px', color: item.typography?.highlights?.color || 'var(--text-main)', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: '600' }}>
                                              <span style={{ color: item.typography?.highlights?.labelColor || 'var(--primary)', flexShrink: 0 }}>
                                                 {item.highlightStyle === 'star' ? '★' : (item.highlightStyle === 'dash' ? '—' : '●')}
                                              </span>
                                              {h}
                                           </li>
                                        ))}
                                     </ul>
                                  </div>
                               )}
                               {item.showButton && (
                                  <div style={{ marginTop: '24px' }}>
                                    <Link 
                                      to={item.buttonLink || "/"} 
                                      style={{ 
                                        display: 'block',
                                        textAlign: 'center',
                                        padding: '12px 24px',
                                        borderRadius: '100px',
                                        background: item.buttonStyles?.bgColor || 'var(--primary)',
                                        color: item.buttonStyles?.textColor || '#ffffff',
                                        border: `2px solid ${item.buttonStyles?.borderColor || item.buttonStyles?.bgColor || 'var(--primary)'}`,
                                        textDecoration: 'none',
                                        fontWeight: '800',
                                        fontSize: '14px',
                                        transition: '0.3s',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                      }}
                                    >
                                      {item.buttonText || "자세히 보기"}
                                    </Link>
                                  </div>
                                )}
                            </div>
                         </motion.div>
                      ))
                   ) : (
                      <div style={{ gridColumn: 'span 3' }}><MediaGallery images={images} singleImage={image} style="gallery" duration={section.slideDuration} /></div>
                   )}
                </div>
             </div>
          )}

          {style === 'feature-cards' && (
              <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: hasMedia && !isMobile ? '1fr 1fr' : '1fr', gap: isMobile ? '32px' : '80px' }}>
                 <div style={{ marginBottom: isMobile ? '32px' : 0 }}>{header}<div style={{marginTop:'32px'}}><MediaGallery images={images} singleImage={image} duration={section.slideDuration} /></div></div>
                 <div style={{ 
                    display: isMobile && section.mobileLayout === 'slider' ? 'flex' : 'grid', 
                    gridTemplateColumns: isMobile ? (section.mobileLayout === '2col' ? 'repeat(2, 1fr)' : '1fr') : ((items || []).length > 2 ? '1fr 1fr' : '1fr'),
                    gap: isMobile ? '16px' : '20px' ,
                    overflowX: isMobile && section.mobileLayout === 'slider' ? 'auto' : 'visible',
                    paddingBottom: isMobile && section.mobileLayout === 'slider' ? '20px' : '0',
                    scrollSnapType: isMobile && section.mobileLayout === 'slider' ? 'x mandatory' : 'none'
                 }} className="hide-scrollbar">
                    {(items || []).map((item, i) => (
                       <motion.div key={i} whileHover={{ y: -5 }} style={{ ...getCardStyle(), display: 'flex', flexDirection: isMobile && section.mobileLayout === '2col' ? 'column' : 'row', gap: isMobile ? '16px' : '24px', alignItems: 'start', minWidth: isMobile && section.mobileLayout === 'slider' ? '280px' : 'auto', scrollSnapAlign: 'start' }}>
                          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', flexShrink: 0 }}>{item.number || i + 1}</div>
                          <div>
                            <h4 style={{ ...getItemTextStyle(item, 'title', 18), marginBottom: '8px' }}>{item.title}</h4>
                            <p style={{ ...getItemTextStyle(item, 'content', 14), lineHeight: '1.6' }}>{item.content}</p>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </div>
          )}

          {style === 'process' && (
            <div style={{ textAlign: 'center' }}>
               {header}
               <div style={{ 
                 display: isMobile && section.mobileLayout === 'slider' ? 'flex' : 'grid', 
                 gridTemplateColumns: isMobile ? (section.mobileLayout === '2col' ? 'repeat(2, 1fr)' : '1fr') : `repeat(${(items || []).length || 1}, 1fr)`, 
                 gap: isMobile ? '24px' : '40px', 
                 marginTop: '64px',
                 overflowX: isMobile && section.mobileLayout === 'slider' ? 'auto' : 'visible',
                 paddingBottom: isMobile && section.mobileLayout === 'slider' ? '20px' : '0',
                 scrollSnapType: isMobile && section.mobileLayout === 'slider' ? 'x mandatory' : 'none'
               }} className="hide-scrollbar">
                  {(items || []).map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={{ position: 'relative', minWidth: isMobile && section.mobileLayout === 'slider' ? '240px' : 'auto', scrollSnapAlign: 'start' }}>
                       <div style={{ width: '64px', height: '64px', background: 'var(--primary)', color: '#fff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '20px', fontWeight: '900', boxShadow: '0 10px 20px var(--primary)30' }}>{item.number || i + 1}</div>
                       <h4 style={{ ...getItemTextStyle(item, 'title', 18), marginBottom: '12px' }}>{item.title}</h4>
                       <p style={{ ...getItemTextStyle(item, 'content', 14), lineHeight: '1.6' }}>{item.content}</p>
                       {!isMobile && i < (items.length - 1) && <ArrowRight style={{ position: 'absolute', top: '32px', right: '-40px', transform: 'translateX(50%)', opacity: 0.2 }} size={24} />}
                    </motion.div>
                  ))}
               </div>
            </div>
          )}

          {(style === 'classic' || !style) && (
             <div style={{ display: !hasMedia ? 'block' : (isMobile ? 'block' : 'flex'), textAlign: !hasMedia || isMobile ? 'center' : 'left', flexDirection: layout === 'right' ? 'row-reverse' : 'row', alignItems: 'center', gap: isMobile ? '32px' : '80px' }}>
               <div style={{ flex: 1, marginBottom: isMobile && hasMedia ? '32px' : 0 }}>{header}</div>
               {hasMedia && <div style={{ flex: 1 }}><MediaGallery images={images} singleImage={image} /></div>}
             </div>
          )}

        </div>
      </section>
    );
  };

  const renderHero = () => {
    if (!hero) return null;
    const { style, bgType, bgUrl, bgOpacity, textPosition, verticalAlign, shading, gradientShading, gradientRange } = hero;
    const isMobile = window.innerWidth <= 768;
    
    const wrapperStyle = { 
      position: 'relative', 
      height: isMobile ? 'auto' : '100vh', 
      minHeight: isMobile ? '600px' : '800px', 
      overflow: 'hidden', 
      display: 'flex', 
      alignItems: verticalAlign === 'top' ? 'flex-start' : (verticalAlign === 'bottom' ? 'flex-end' : 'center'), 
      padding: isMobile ? '120px 0 80px' : '120px 0' 
    };
    
    const containerStyle = { 
      position: 'relative', 
      zIndex: 10, 
      width: '100%', 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: `0 var(--container-padding, 80px)` 
    };

    const BgMedia = () => (
      <SafeMedia 
        src={bgUrl} 
        type={bgType} 
        brightness={bgOpacity ?? 1}
        shading={shading ?? 0}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          filter: `brightness(${bgOpacity ?? 1})`, 
          transition: '0.6s ease' 
        }} 
      />
    );

    // Overlays logic
    const Overlays = () => {
      const gOpacity = gradientShading ?? 0;
      const gRange = gradientRange ?? 50;
      let gradientStyle = '';
      
      const gStart = `rgba(0,0,0,${gOpacity})`;
      const gEnd = 'rgba(0,0,0,0)';
      
      if (textPosition === 'right') {
        gradientStyle = `linear-gradient(to left, ${gStart} 0%, ${gEnd} ${gRange}%)`;
      } else if (textPosition === 'center') {
        gradientStyle = `radial-gradient(circle at center, ${gStart} 0%, ${gEnd} ${gRange}%)`;
      } else {
        // Default: left
        gradientStyle = `linear-gradient(to right, ${gStart} 0%, ${gEnd} ${gRange}%)`;
      }
      
      const bOpacity = bgOpacity ?? 1;
      
      return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
          {/* 1. Global Brightness Overlay (when brightness is < 1) */}
          {bOpacity < 1 && (
            <div style={{ position: 'absolute', inset: 0, background: 'black', opacity: 1 - bOpacity, zIndex: 1 }}></div>
          )}
          
          {/* 2. Base darkening (shading) overlay */}
          {(shading ?? 0) > 0 && (
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${shading})`, zIndex: 2 }}></div>
          )}
          
          {/* 3. Gradient overlay for text readability */}
          {gOpacity > 0 && (
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: gradientStyle, 
              zIndex: 3 
            }}></div>
          )}
        </div>
      );
    };

    if (style === 'classic') return (
      <section style={wrapperStyle}>
        <div style={{ position: 'absolute', right: 0, top: 0, width: isMobile ? '100%' : '50%', height: '100%', zIndex: 0 }}>
          <BgMedia />
          {isMobile ? <Overlays /> : (
            <>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg-main) 0%, rgba(255,255,255,0.8) 20%, transparent 100%)', zIndex: 1 }}></div>
              <Overlays />
            </>
          )}
        </div>
        <div style={containerStyle}><div style={{ maxWidth: '650px' }}><HeroText hero={hero} /></div></div>
      </section>
    );

    if (style === 'split') return (
      <section style={{ ...wrapperStyle, display: isMobile ? 'block' : 'grid', gridTemplateColumns: '1fr 1fr', padding: isMobile ? '100px 0 0' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 var(--container-padding, 80px)`, marginBottom: isMobile ? '40px' : 0 }}>
          <HeroText hero={hero} />
        </div>
        <div style={{ position: 'relative', height: isMobile ? '400px' : 'auto' }}>
          <BgMedia />
          <Overlays />
        </div>
      </section>
    );

    if (style === 'card') return (
      <section style={wrapperStyle}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <BgMedia />
          <Overlays />
        </div>
        <div style={{ ...containerStyle, display: 'flex', justifyContent: (isMobile || textPosition === 'center') ? 'center' : (textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'var(--glass-white)', backdropFilter: 'blur(24px)', padding: isMobile ? '40px 24px' : '80px', borderRadius: isMobile ? '24px' : '48px', maxWidth: '750px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}><HeroText hero={hero} /></motion.div>
        </div>
      </section>
    );

    return (
      <section style={wrapperStyle}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <BgMedia />
          <Overlays />
        </div>
        <div style={{ ...containerStyle, display: 'flex', justifyContent: (isMobile || textPosition === 'center') ? 'center' : (textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
          <div style={{ maxWidth: '900px', textAlign: isMobile ? 'center' : 'inherit' }}><HeroText hero={hero} /></div>
        </div>
      </section>
    );
  };

  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewIdx, setReviewIdx] = useState(0);

   const renderReviews = () => {
    const rb = config.reviewSectionBranding;
    if (!rb?.show || !config.reviews?.length) return null;
    const isMobile = window.innerWidth < 768;
    return (
      <section id="home-reviews" style={{ padding: isMobile ? '40px 0' : '80px 0', background: rb.bgColor || 'var(--bg-sub)' }}>
         <div className="container" style={{ padding: isMobile ? '0 20px' : 'inherit' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '80px' }}>
               {rb.subTitleTop && (
                  <span style={{ 
                     fontSize: `${rb.subTitleTopStyle?.fontSize || 13}px`,
                     color: rb.subTitleTopStyle?.color || 'var(--primary)',
                     fontWeight: '800',
                     letterSpacing: '0.1em',
                     display: 'block',
                     marginBottom: '12px'
                  }}>
                     {rb.subTitleTop}
                  </span>
               )}
               <h2 style={{ fontSize: isMobile ? '28px' : '48px', fontWeight: '800', color: rb.titleColor || 'var(--text-main)' }}>{rb.title || "여행 후기"}</h2>
               {rb.subTitleBottom && (
                  <p style={{ 
                     fontSize: `${rb.subTitleBottomStyle?.fontSize || 16}px`,
                     color: rb.subTitleBottomStyle?.color || '#64748b',
                     marginTop: '16px',
                     fontWeight: '500'
                  }}>
                     {rb.subTitleBottom}
                  </p>
               )}
            </div>
            {((rb.layout === 'grid' && !isMobile) || (!isMobile && rb.layout !== 'slider') || (isMobile && rb.mobileLayout === 'grid') || (isMobile && rb.mobileLayout === '2col')) ? (
               <div style={{ 
                 display: 'grid', 
                 gridTemplateColumns: isMobile && rb.mobileLayout === '2col' ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(360px, 1fr))', 
                 gap: isMobile ? '16px' : '32px' 
               }}>
                  {config.reviews.map((rev, i) => (
                    <div key={i} onClick={() => { setReviewIdx(0); setSelectedReview(rev); }} className="admin-card review-card-hover" style={{ padding: '0', background: '#fff', borderRadius: isMobile ? '16px' : '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                        {rev.images && rev.images.length > 0 && (
                           <div style={{ position: 'relative' }}>
                              <div style={{ display: 'flex', gap: '2px', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="hide-scrollbar">
                                 {rev.images.map((img, idx) => (
                                    <div key={idx} style={{ minWidth: '100%', height: isMobile ? '180px' : '360px', scrollSnapAlign: 'start' }}>
                                       <SafeMedia src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                 ))}
                              </div>
                              {rev.images.length > 1 && (
                                <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', borderRadius: '100px', zIndex: 10 }}>
                                   {rev.images.map((_, idx) => (
                                      <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', opacity: 0.5 }}></div>
                                   ))}
                                </div>
                              )}
                           </div>
                        )}
                        <div style={{ padding: isMobile ? '20px' : '32px' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: isMobile ? '12px' : '24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '14px' }}>
                                 <div style={{ width: isMobile ? '32px' : '48px', height: isMobile ? '32px' : '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #60a5fa)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: isMobile ? '12px' : '16px', boxShadow: '0 4px 12px var(--primary)30' }}>{(rev.author || rev.user)?.[0]}</div>
                                 <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: '800', fontSize: isMobile ? '13px' : '16px', color: '#0F172A' }}>{rev.author || rev.user}</div>
                                    {!isMobile && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{rev.productTitle || "프리미엄 회원"}</div>}
                                 </div>
                              </div>
                              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                                 {[...Array(5)].map((_, j) => <Star key={j} size={isMobile ? 10 : 14} fill={j < (rev.rating || 5) ? "#fbbf24" : "none"} />)}
                              </div>
                           </div>
                           <p style={{ fontSize: isMobile ? '13px' : '16px', lineHeight: '1.8', color: '#334155', fontWeight: '500', fontStyle: 'italic', margin: 0, textAlign: 'left', display: '-webkit-box', WebkitLineClamp: isMobile ? 2 : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{rev.content}"</p>
                           {!isMobile && <div style={{ marginTop: '20px', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>자세히 보기 <ArrowUpRight size={14} /></div>}
                        </div>
                    </div>
                  ))}
               </div>
            ) : (
               <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '24px' }} className="hide-scrollbar">
                  {config.reviews.map((rev, i) => (
                    <div key={i} onClick={() => { setReviewIdx(0); setSelectedReview(rev); }} style={{ minWidth: '300px', scrollSnapAlign: 'start', background: '#fff', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                        {rev.images && rev.images.length > 0 && (
                           <div style={{ height: '180px', width: '100%' }}>
                              <SafeMedia src={rev.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           </div>
                        )}
                        <div style={{ padding: '20px' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #60a5fa)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>{(rev.author || rev.user)?.[0]}</div>
                                 <div style={{ fontWeight: '800', fontSize: '14px' }}>{rev.author || rev.user}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                                 {[...Array(5)].map((_, j) => <Star key={j} size={10} fill={j < (rev.rating || 5) ? "#fbbf24" : "none"} />)}
                              </div>
                           </div>
                           <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', margin: 0, textAlign: 'left', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{rev.content}"</p>
                        </div>
                    </div>
                  ))}
               </div>
            )}
         </div>

         <AnimatePresence>
            {selectedReview && (
               <div 
                 style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0' : '40px' }}
                 onClick={() => setSelectedReview(null)}
               >
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                     style={{ background: '#fff', width: '95%', maxWidth: '1100px', borderRadius: isMobile ? '0' : '40px', overflow: 'hidden', display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxHeight: isMobile ? '100%' : '85vh', position: 'relative', boxShadow: '0 50px 100px rgba(0,0,0,0.5)' }}
                     onClick={e => e.stopPropagation()}
                   >
                      <button onClick={() => setSelectedReview(null)} style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100, background: 'rgba(255,255,255,0.9)', color: '#000', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}><X size={24} /></button>
                      
                      <div style={{ flex: 1.4, background: '#000', position: 'relative', minHeight: isMobile ? '400px' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                         <AnimatePresence mode="wait">
                            <motion.div 
                              key={reviewIdx}
                              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3 }}
                              style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                               {selectedReview.images?.[reviewIdx] ? (
                                  <SafeMedia src={selectedReview.images[reviewIdx]} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                               ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                                     <User size={100} opacity={0.1} />
                                  </div>
                               )}
                            </motion.div>
                         </AnimatePresence>

                         {selectedReview.images?.length > 1 && (
                            <>
                               <button 
                                 onClick={() => setReviewIdx((reviewIdx - 1 + selectedReview.images.length) % selectedReview.images.length)}
                                 style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', color: '#fff', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                               >
                                  <ChevronLeft size={24} />
                               </button>
                               <button 
                                 onClick={() => setReviewIdx((reviewIdx + 1) % selectedReview.images.length)}
                                 style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', color: '#fff', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                               >
                                  <ChevronRight size={24} />
                               </button>
                               <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                                  {selectedReview.images.map((_, idx) => (
                                     <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', opacity: idx === reviewIdx ? 1 : 0.4, transition: '0.3s' }}></div>
                                  ))}
                               </div>
                            </>
                         )}
                      </div>

                      <div style={{ flex: 1, padding: isMobile ? '32px' : '60px', overflowY: 'auto', textAlign: 'left', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #60a5fa)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '24px', boxShadow: '0 8px 16px var(--primary)40' }}>{(selectedReview.author || selectedReview.user)?.[0]}</div>
                            <div>
                               <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A', marginBottom: '6px' }}>{selectedReview.author || selectedReview.user}</h3>
                               <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '6px' }}>
                                  {[...Array(5)].map((_, j) => <Star key={j} size={18} fill={j < (selectedReview.rating || 5) ? "#fbbf24" : "none"} />)}
                               </div>
                               <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedReview.productTitle}</div>
                            </div>
                         </div>
                         <p style={{ fontSize: '20px', lineHeight: '1.8', color: '#334155', fontWeight: '500', whiteSpace: 'pre-wrap', flex: 1 }}>"{selectedReview.content}"</p>
                         <div style={{ marginTop: 'auto', paddingTop: '40px', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>
                            “올리고크루즈와 함께한 소중한 여행 기록입니다.”
                         </div>
                      </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </section>
    );
  };


  const isMobile = window.innerWidth < 768;

  return (
    <div className="home-clean">
      {renderHero()}
      {sections.map(section => renderSection(section))}
      <section id="products" style={{ padding: isMobile ? '60px 0' : '100px 0', background: config.productListBranding?.bgColor || 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '64px' }}>
             {config.productListBranding?.subTitleTop ? (
                <span style={{ 
                  fontSize: `${config.productListBranding.subTitleTopStyle?.fontSize || 13}px`,
                  color: config.productListBranding.subTitleTopStyle?.color || 'var(--primary)',
                  fontWeight: '800', 
                  letterSpacing: '0.1em', 
                  display: 'block', 
                  marginBottom: '12px' 
                }}>
                  {config.productListBranding.subTitleTop}
                </span>
             ) : (
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>CURATED SELECTION</span>
             )}
             <h2 style={{ fontSize: isMobile ? '32px' : '48px', fontWeight: '900', color: config.productListBranding?.titleColor || 'var(--text-main)', letterSpacing: '-0.03em' }}>{config.productListBranding?.title || "추천 패키지"}</h2>
             {config.productListBranding?.subTitleBottom && (
                <p style={{ 
                  fontSize: `${config.productListBranding.subTitleBottomStyle?.fontSize || 16}px`,
                  color: config.productListBranding.subTitleBottomStyle?.color || '#64748b',
                  marginTop: '14px',
                  fontWeight: '500'
                }}>
                  {config.productListBranding.subTitleBottom}
                </p>
             )}
          </div>
          <div style={{ 
            display: isMobile && config.productListBranding?.mobileLayout === 'slider' ? 'flex' : 'grid', 
            gridTemplateColumns: isMobile ? (config.productListBranding?.mobileLayout === '2col' ? 'repeat(2, 1fr)' : '1fr') : 'repeat(auto-fill, minmax(340px, 1fr))', 
            gap: isMobile ? '16px' : '32px' ,
            overflowX: isMobile && config.productListBranding?.mobileLayout === 'slider' ? 'auto' : 'visible',
            paddingBottom: isMobile && config.productListBranding?.mobileLayout === 'slider' ? '24px' : '0',
            scrollSnapType: isMobile && config.productListBranding?.mobileLayout === 'slider' ? 'x mandatory' : 'none'
          }} className="hide-scrollbar">
            {products.map((product, idx) => {
              const typo = product.typography || {};
              const getStyle = (t) => { const base = typo[t]?.fontSize || (t === 'title' ? 22 : 15); const min = Math.max(12, Math.floor(base * 0.6)); return { fontSize: `clamp(${min}px, 3.8vw, ${base}px)`, color: typo[t]?.color, fontWeight: t === 'title' || t === 'price' ? '900' : '400' }; };
              return (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} style={{ minWidth: isMobile && config.productListBranding?.mobileLayout === 'slider' ? '280px' : 'auto', scrollSnapAlign: 'start' }}>
                   <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="product-card-luxury" style={{ borderRadius: isMobile ? '20px' : '32px' }}>
                        <div className="product-card-image-wrap" style={{ height: isMobile ? '200px' : '280px' }}>
                           <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s' }} />
                           <div className="product-card-overlay"></div>
                           <div style={{ position: 'absolute', top: isMobile ? '12px' : '20px', left: isMobile ? '12px' : '20px', background: 'rgba(15, 23, 42, 0.8)', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: '800', backdropFilter: 'blur(4px)' }}>PREMIUM</div>
                           <div className="product-card-badge" style={{ bottom: isMobile ? '12px' : '20px', right: isMobile ? '12px' : '20px', padding: '4px 10px', fontSize: '10px' }}><MapPin size={10} /> {product.schedule?.length ? `${product.schedule.length}일 코스` : '프리미엄 여정'}</div>
                        </div>
                        <div style={{ padding: isMobile ? '20px' : '30px', background: '#fff' }}>
                           <h3 style={{ ...getStyle('title'), marginBottom: isMobile ? '8px' : '10px', lineHeight: '1.3', fontSize: isMobile ? '16px' : undefined }}>{product.title}</h3>
                           {!isMobile && <p style={{ ...getStyle('description'), marginBottom: '24px', opacity: 0.7, height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.description}</p>}
                           
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: isMobile ? '12px' : '20px' }}>
                              <div style={{ flex: 1 }}>
                                 {product.paymentType === 'split' ? (
                                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minHeight: isMobile ? '60px' : '84px', justifyContent: 'center' }}>
                                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                         <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#94a3b8', fontWeight: '600' }}>총 {product.originalPrice?.toLocaleString() || product.price?.toLocaleString()}원</span>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                         {isMobile ? null : <span style={{ fontSize: '13px', fontWeight: '800', color: typo.price?.color || 'var(--primary)' }}>예약금</span>}
                                         <span style={{ ...getStyle('price'), fontSize: isMobile ? '18px' : '24px', letterSpacing: '-1px', color: typo.price?.color || 'var(--primary)' }}>{(product.downPayment || 0).toLocaleString()}</span>
                                         <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '800', color: typo.price?.color || 'var(--primary)' }}>원</span>
                                      </div>
                                      {!isMobile && <p style={{ fontSize: '11px', color: typo.price?.color || '#3b82f6', fontWeight: '700', margin: '4px 0 0 0' }}>* 잔금은 여행을 다녀오신 후 납부</p>}
                                   </div>
                                 ) : (
                                   <div style={{ display: 'flex', flexDirection: 'column', minHeight: isMobile ? '60px' : '84px', justifyContent: 'center' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '20px' }}>
                                         {product.originalPrice > 0 && (
                                           <span style={{ fontSize: isMobile ? '11px' : '14px', color: '#94a3b8', textDecoration: 'line-through', fontWeight: '500' }}>{product.originalPrice.toLocaleString()}원</span>
                                         )}
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginTop: '2px' }}>
                                         <span style={{ ...getStyle('price'), fontSize: isMobile ? '20px' : '28px', letterSpacing: '-1px', color: typo.price?.color || '#0F172A' }}>{product.price?.toLocaleString()}</span>
                                         <span style={{ fontSize: isMobile ? '13px' : '16px', fontWeight: '800', color: typo.price?.color || '#0F172A' }}>원</span>
                                      </div>
                                      {!isMobile && (
                                        product.originalPrice > product.price ? (
                                          <p style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700', margin: '4px 0 0 0' }}>* 총 {(product.originalPrice - product.price).toLocaleString()}원 즉시 할인됨</p>
                                        ) : (
                                          <p style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', margin: '4px 0 0 0' }}>* 프리미엄 특별가 적용</p>
                                        )
                                      )}
                                   </div>
                                 )}
                              </div>
                              <div style={{ width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px', borderRadius: '50%', background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', transition: '0.3s' }} className="product-go-icon">
                                 <ArrowRight size={isMobile ? 16 : 20} />
                              </div>
                           </div>
                        </div>
                      </div>
                   </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {renderReviews()}

    </div>
  );
};

export default Home;
