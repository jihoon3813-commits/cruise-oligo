import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { ArrowRight, Star, ExternalLink, ChevronLeft, ChevronRight, User, CheckCircle2, MapPin, Calendar, CreditCard } from 'lucide-react';
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
        {bgType !== 'color' && bgUrl && <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: bgOpacity ?? 1 }}><SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
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
                <div style={{ order: layout === 'right' ? 1 : 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {(items || []).map((item, i) => (
                     <motion.div key={i} initial={{ opacity:0, x: 20 }} whileInView={{ opacity:1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={{ ...getCardStyle(), display: 'flex', gap: isMobile ? '16px' : '24px', alignItems: 'start' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px', marginTop: '48px' }}>
                   {items && items.length > 0 ? (
                      items.map((item, i) => (
                         <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={{ ...getCardStyle({ padding: 0 }), display: 'flex', flexDirection: 'column' }}>
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
                               {item.aboveTitle && <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px' }}>{item.aboveTitle}</div>}
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
                               {item.showButton ? (
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
                                ) : (
                                  <div style={{ marginTop: '24px' }}><CustomButton section={{ ...section, buttonText: "상세 정보 보기 >", showButton: true }} isSmall={true} /></div>
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
              <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: hasMedia ? '1fr 1fr' : '1fr', gap: isMobile ? '32px' : '80px' }}>
                 <div style={{ marginBottom: isMobile ? '32px' : 0 }}>{header}<div style={{marginTop:'32px'}}><MediaGallery images={images} singleImage={image} duration={section.slideDuration} /></div></div>
                 <div style={{ display: 'grid', gridTemplateColumns: (items || []).length > 2 && !isMobile ? '1fr 1fr' : '1fr', gap: '20px' }}>
                    {(items || []).map((item, i) => (
                       <motion.div key={i} whileHover={{ y: -5 }} style={{ ...getCardStyle(), display: 'flex', gap: isMobile ? '16px' : '24px', alignItems: 'start' }}>
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
               <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${(items || []).length || 1}, 1fr)`, gap: '40px', marginTop: '64px' }}>
                  {(items || []).map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={{ position: 'relative' }}>
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
    const { style, bgType, bgUrl, bgOpacity, textPosition, verticalAlign, paddingX } = hero;
    const isMobile = window.innerWidth <= 768;
    const wrapperStyle = { position: 'relative', height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '550px' : '800px', overflow: 'hidden', display: 'flex', alignItems: verticalAlign === 'top' ? 'flex-start' : (verticalAlign === 'bottom' ? 'flex-end' : 'center'), padding: isMobile ? '100px 0 60px' : '120px 0' };
    const containerStyle = { position: 'relative', zIndex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: `0 var(--container-padding, 80px)` };
    const BgMedia = () => (<SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${bgOpacity ?? 1})`, transition: '0.3s' }} />);

    if (style === 'classic') return (<section style={wrapperStyle}><div style={{ position: 'absolute', right: 0, top: 0, width: isMobile ? '100%' : '50%', height: '100%', zIndex: 0, opacity: isMobile ? 0.3 : 1 }}><BgMedia /><div style={{ position: 'absolute', inset: 0, background: isMobile ? 'var(--bg-main)' : 'linear-gradient(to right, var(--bg-main) 0%, rgba(255,255,255,0.8) 20%, transparent 100%)', opacity: isMobile ? 0.7 : 1 }}></div></div><div style={containerStyle}><div style={{ maxWidth: '650px' }}><HeroText hero={hero} /></div></div></section>);
    if (style === 'split') return (<section style={{ ...wrapperStyle, display: isMobile ? 'block' : 'grid', gridTemplateColumns: '1fr 1fr', padding: isMobile ? '100px 0 0' : 0 }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 var(--container-padding, 80px)`, marginBottom: isMobile ? '40px' : 0 }}><HeroText hero={hero} /></div><div style={{ position: 'relative', height: isMobile ? '350px' : 'auto' }}><BgMedia /></div></section>);
    if (style === 'card') return (<section style={wrapperStyle}><div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><BgMedia /></div><div style={{ ...containerStyle, display: 'flex', justifyContent: (isMobile || textPosition === 'center') ? 'center' : (textPosition === 'right' ? 'flex-end' : 'flex-start') }}><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'var(--glass-white)', backdropFilter: 'blur(20px)', padding: isMobile ? '32px 20px' : '80px', borderRadius: isMobile ? '20px' : '40px', maxWidth: '750px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}><HeroText hero={hero} /></motion.div></div></section>);
    return (<section style={wrapperStyle}><div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><BgMedia /></div><div style={{ ...containerStyle, display: 'flex', justifyContent: (isMobile || textPosition === 'center') ? 'center' : (textPosition === 'right' ? 'flex-end' : 'flex-start') }}><div style={{ maxWidth: '900px', textAlign: isMobile ? 'center' : 'inherit' }}><HeroText hero={hero} /></div></div></section>);
  };

  const renderReviews = () => {
    const rb = config.reviewSectionBranding;
    if (!rb?.show || !config.reviews?.length) return null;
    const isMobile = window.innerWidth < 768;
    return (
      <section id="home-reviews" style={{ padding: isMobile ? '40px 0' : '80px 0', background: rb.bgColor || 'var(--bg-sub)' }}>
         <div className="container" style={{ padding: isMobile ? '0 20px' : 'inherit' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '80px' }}><h2 style={{ fontSize: isMobile ? '28px' : '48px', fontWeight: '800', color: rb.titleColor || 'var(--text-main)' }}>{rb.title || "여행 후기"}</h2></div>
            {(rb.layout === 'grid' || isMobile) ? (
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {config.reviews.map((rev, i) => (
                    <div key={i} className="admin-card" style={{ padding: '24px', background: '#fff', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #60a5fa)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px', boxShadow: '0 4px 10px var(--primary)40' }}>{(rev.author || rev.user)?.[0]}</div>
                              <div>
                                 <div style={{ fontWeight: '800', fontSize: '15px' }}>{rev.author || rev.user}</div>
                                 <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rev.productTitle || "프리미엄 회원"}</div>
                              </div>
                           </div>
                           <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                              {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={j < (rev.rating || 5) ? "#fbbf24" : "none"} />)}
                           </div>
                        </div>
                        <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '20px', fontWeight: '500', fontStyle: 'italic', flex: 1 }}>"{rev.content}"</p>
                        {rev.images && rev.images.length > 0 && (
                           <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, rev.images.length)}, 1fr)`, gap: '8px', marginBottom: '16px' }}>
                              {rev.images.slice(0, 3).map((img, idx) => (
                                 <div key={idx} style={{ aspectRatio: '1', borderRadius: '12px', overflow: 'hidden' }}>
                                    <SafeMedia src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                 </div>
                              ))}
                           </div>
                        )}
                    </div>
                  ))}
               </div>
            ) : (<div style={{ position: 'relative', overflow: 'hidden', padding: '16px 0' }}><div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollSnapType: 'x mandatory' }}>{config.reviews.map((rev, i) => (<div key={i} style={{ minWidth: '340px', background: '#fff', padding: '32px', borderRadius: '24px', scrollSnapAlign: 'start', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}><div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '16px' }}>{[...Array(5)].map((_, j) => <Star key={j} size={16} fill={j < (rev.rating || 5) ? "#fbbf24" : "none"} />)}</div><p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '24px', fontStyle: 'italic' }}>"{rev.content}"</p><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{(rev.author || rev.user)?.[0]}</div><div><div style={{ fontWeight: '800' }}>{rev.author || rev.user}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rev.productTitle}</div></div></div></div>))}</div></div>)}
         </div>
      </section>
    );
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="home-clean">
      {renderHero()}
      {sections.map(section => renderSection(section))}
      {renderReviews()}
      <section id="products" style={{ padding: isMobile ? '60px 0' : '100px 0', background: config.productListBranding?.bgColor || 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '64px' }}>
             <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>CURATED SELECTION</span>
             <h2 style={{ fontSize: isMobile ? '32px' : '48px', fontWeight: '900', color: config.productListBranding?.titleColor || 'var(--text-main)', letterSpacing: '-0.03em' }}>{config.productListBranding?.title || "추천 패키지"}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
            {products.map((product, idx) => {
              const typo = product.typography || {};
              const getStyle = (t) => { const base = typo[t]?.fontSize || (t === 'title' ? 22 : 15); const min = Math.max(12, Math.floor(base * 0.6)); return { fontSize: `clamp(${min}px, 3.8vw, ${base}px)`, color: typo[t]?.color, fontWeight: t === 'title' || t === 'price' ? '900' : '400' }; };
              return (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}>
                   <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="product-card-luxury">
                        <div className="product-card-image-wrap">
                           <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s' }} />
                           <div className="product-card-overlay"></div>
                           <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(15, 23, 42, 0.8)', color: '#fff', padding: '6px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: '800', backdropFilter: 'blur(4px)' }}>PREMIUM</div>
                           <div className="product-card-badge"><MapPin size={12} /> {product.schedule?.length ? `${product.schedule.length}일 코스` : '프리미엄 여정'}</div>
                        </div>
                        <div style={{ padding: '30px', background: '#fff' }}>
                           <h3 style={{ ...getStyle('title'), marginBottom: '10px', lineHeight: '1.3' }}>{product.title}</h3>
                           <p style={{ ...getStyle('description'), marginBottom: '24px', opacity: 0.7, height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.description}</p>
                           
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                              <div>
                                 <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Starting From</span>
                                 <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-1px' }}>{product.price?.toLocaleString()}<small style={{fontSize:'14px', fontWeight:'700', marginLeft:'2px'}}>원</small></span>
                              </div>
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', transition: '0.3s' }} className="product-go-icon">
                                 <ArrowRight size={20} />
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
    </div>
  );
};

export default Home;
