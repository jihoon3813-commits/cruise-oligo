import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { ArrowRight, Star, ExternalLink, ChevronLeft, ChevronRight, User } from 'lucide-react';
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
    return <motion.span initial={{ opacity: 0, y: type === 'above' ? -10 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: type === 'above' ? 0 : 0.6 }} style={{ ...textStyle, marginBottom: type === 'above' ? '16px' : 0, marginTop: type === 'below' ? '24px' : 0, fontWeight: type === 'above' ? '800' : '400', opacity: type === 'below' ? 0.9 : 1 }}>{text}</motion.span>;
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
       <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} style={{ ...getTextStyle(typography, 'title'), fontWeight: '900', marginBottom: '32px' }}>{title?.split('\n').map((l,i) => <React.Fragment key={i}>{l}<br/></React.Fragment>)}</motion.h1>
       {subtitle && <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} style={{ ...getTextStyle(typography, 'subtitle'), marginBottom: '32px' }}>{subtitle?.split('\n').map((l,i) => <React.Fragment key={i}>{l}<br/></React.Fragment>)}</motion.p>}
       {belowTitle && renderTextEffect(belowTitle, 'below')}
       <div style={{ display: 'flex', gap: '12px', marginTop: '48px', flexWrap: 'wrap', justifyContent: hero.textPosition === 'center' ? 'center' : (hero.textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
          {buttons ? buttons.map(btn => renderButton(btn)) : (<><button className="luxury-btn">지금 시작하기 <ArrowRight size={18} /></button><button className="luxury-btn outline">패키지 보기</button></>)}
       </div>
    </div>
  );
};

const ImageSlider = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;
  if (images.length === 1) return <SafeMedia src={images[0]} style={{ width: '100%', borderRadius: '16px', overflow: 'hidden' }} />;
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
      <AnimatePresence mode="wait"><motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%' }}><SafeMedia src={images[current]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></motion.div></AnimatePresence>
      <button onClick={() => setCurrent((current - 1 + images.length) % images.length)} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex' }}><ChevronLeft size={20} /></button>
      <button onClick={() => setCurrent((current + 1) % images.length)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex' }}><ChevronRight size={20} /></button>
    </div>
  );
};

const Home = () => {
  const { config } = useConfig();
  const { hero, sections, products, theme } = config;
  useEffect(() => { document.body.className = `theme-${theme || 'white'}`; }, [theme]);

  const CustomButton = ({ section }) => {
    if (!section.showButton) return null;
    const styles = section.buttonStyles || {};
    const sizeMap = { small: { padding: '8px 20px', fontSize: '12px' }, medium: { padding: '10px 28px', fontSize: '13px' }, large: { padding: '14px 40px', fontSize: '15px' } };
    const isMobile = window.innerWidth < 768;
    const currentSize = sizeMap[isMobile ? 'small' : (styles.size || 'medium')];
    return <Link to={section.buttonLink || "/"} style={{ ...currentSize, backgroundColor: styles.bgColor || 'var(--primary)', color: styles.textColor || '#ffffff', border: `2px solid ${styles.borderColor || styles.bgColor || 'var(--primary)'}`, borderRadius: '100px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', transition: '0.3s', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>{section.buttonText || "자세히 보기"} <ArrowRight size={16} /></Link>;
  };

  const MediaGallery = ({ images = [], singleImage, style }) => {
    const allImages = (images && images.length > 0) ? images : (singleImage ? [singleImage] : []);
    if (allImages.length === 0) return null;
    if (style === 'gallery') return <div style={{ columns: window.innerWidth < 768 ? '1' : '2', columnGap: '20px' }}>{allImages.map((img, i) => (<div key={i} style={{ marginBottom: '20px', borderRadius: '24px', overflow: 'hidden', breakInside: 'avoid' }}><SafeMedia src={img} style={{ width: '100%', display: 'block' }} /></div>))}</div>;
    return <ImageSlider images={allImages} />;
  };

  const renderSection = (section) => {
    const { style, typography, items, layout, bgColor, bgType, bgUrl, image, images, bgOpacity, paddingTop, paddingBottom } = section;
    const isMobile = window.innerWidth < 768;
    const hasMedia = image || (images && images.length > 0);
    const wrapperStyle = { position: 'relative', paddingTop: `${isMobile ? Math.min(50, paddingTop ?? 60) : (paddingTop ?? 120)}px`, paddingBottom: `${isMobile ? Math.min(50, paddingBottom ?? 60) : (paddingBottom ?? 120)}px`, background: bgType === 'color' ? (bgColor || '#ffffff') : 'transparent', overflow: 'hidden' };

    return (
      <section key={section.id} style={wrapperStyle}>
        {bgType !== 'color' && bgUrl && <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: bgOpacity ?? 1 }}><SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
        <div style={{ position: 'absolute', inset: 0, background: bgType === 'color' ? 'transparent' : `rgba(255,255,255,${1 - (bgOpacity ?? 1)})`, zIndex: 0 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          
          {style === 'luxury-row' ? (
             <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: layout === 'right' ? '1.2fr 1fr' : '1fr 1.2fr', gap: isMobile ? '40px' : '80px', alignItems: 'start' }}>
                <div style={{ order: layout === 'right' ? 2 : 1 }}>
                   <div style={{ marginBottom: '48px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em', display: 'block', marginBottom: '12px', textTransform: 'uppercase' }}>{section.aboveTitle || "Promotion"}</span>
                      <h2 style={{ ...getTextStyle(typography, 'title'), fontWeight: '900', marginBottom: '24px' }}>{section.title}</h2>
                      <p style={{ ...getTextStyle(typography, 'content'), opacity: 0.8, marginBottom: '32px' }}>{section.content}</p>
                      {image && <SafeMedia src={image} style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }} />}
                   </div>
                </div>
                <div style={{ order: layout === 'right' ? 1 : 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {(items || []).map((item, i) => (
                     <motion.div key={i} initial={{ opacity:0, x: 20 }} whileInView={{ opacity:1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={{ background: theme === 'midnight' ? 'rgba(255,255,255,0.05)' : '#fff', padding: isMobile ? '24px' : '32px', borderRadius: '24px', border: theme === 'midnight' ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border-light)', display: 'flex', gap: isMobile ? '16px' : '24px', alignItems: 'start',boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <div style={{ width: isMobile ? '40px' : '56px', height: isMobile ? '40px' : '56px', flexShrink: 0, border: '1px solid currentColor', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '12px' : '16px', fontWeight: '900', borderRadius: '4px' }}>{item.number}</div>
                        <div style={{ flex: 1 }}>
                           {item.aboveTitle && <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px', textTransform: 'uppercase' }}>{item.aboveTitle}</div>}
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <h4 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '900' }}>{item.title}</h4>
                              {item.tag && <span style={{ fontSize: '10px', background: 'var(--primary)10', color: 'var(--primary)', padding: '4px 10px', borderRadius: '100px', fontWeight: '800', border: '1px solid var(--primary)30' }}>{item.tag}</span>}
                           </div>
                           <p style={{ fontSize: isMobile ? '13px' : '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.content}</p>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </div>
          ) : (
             <>
               {(style === 'classic' || !style) && (
                 <div style={{ display: !hasMedia ? 'block' : (isMobile ? 'block' : 'flex'), textAlign: !hasMedia || isMobile ? 'center' : 'left', flexDirection: layout === 'right' ? 'row-reverse' : 'row', alignItems: 'center', gap: isMobile ? '32px' : '80px' }}>
                   <div style={{ flex: 1, marginBottom: isMobile && hasMedia ? '32px' : 0 }}><h2 style={getTextStyle(typography, 'title')}>{section.title}</h2><p style={{ ...getTextStyle(typography, 'content'), marginBottom: '24px' }}>{section.content}</p><CustomButton section={section} /></div>
                   {hasMedia && <div style={{ flex: 1 }}><MediaGallery images={images} singleImage={image} style={style} /></div>}
                 </div>
               )}
               {style === 'feature-cards' && (
                  <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: hasMedia ? '1fr 1fr' : '1fr', gap: isMobile ? '32px' : '80px' }}>
                     <div style={{ marginBottom: isMobile ? '32px' : 0 }}><h2 style={getTextStyle(typography, 'title')}>{section.title}</h2><p style={{ ...getTextStyle(typography, 'content'), marginBottom: '24px' }}>{section.content}</p><CustomButton section={section} /><div style={{marginTop:'32px'}}><MediaGallery images={images} singleImage={image} /></div></div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{(items || []).map((item, i) => (<div key={i} className="admin-card" style={{ display: 'flex', gap: '16px', padding: isMobile ? '20px' : '40px', borderRadius: '20px', background: '#fff' }}><div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--primary)', opacity: 0.3 }}>{item.number || `0${i+1}`}</div><div><h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '6px' }}>{item.title}</h4><p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{item.content}</p></div></div>))}</div>
                  </div>
               )}
               {style === 'process' && (
                 <div style={{ textAlign: 'center' }}>
                    <h2 style={{ ...getTextStyle(typography, 'title'), textAlign: 'center' }}>{section.title}</h2>
                    <p style={{ ...getTextStyle(typography, 'content'), textAlign: 'center', margin: '0 auto 32px', maxWidth: '800px' }}>{section.content}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${(items || []).length || 1}, 1fr)`, gap: '24px' }}>
                       {(items || []).map((item, i) => (<div key={i}><div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '16px', fontWeight: '800' }}>{item.number || i + 1}</div><h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>{item.title}</h4><p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{item.content}</p></div>))}
                    </div>
                    <div style={{ marginTop: '40px' }}><CustomButton section={section} /></div>
                 </div>
               )}
             </>
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
      <section style={{ padding: isMobile ? '60px 0' : '120px 0', background: rb.bgColor || 'var(--bg-sub)' }}>
         <div className="container" style={{ padding: isMobile ? '0 20px' : 'inherit' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '80px' }}><h2 style={{ fontSize: isMobile ? '28px' : '48px', fontWeight: '800', color: rb.titleColor || 'var(--text-main)' }}>{rb.title || "여행 후기"}</h2></div>
            {(rb.layout === 'grid' || isMobile) ? (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>{config.reviews.map((rev, i) => (<div key={i} className="admin-card" style={{ padding: '20px', background: '#fff', borderRadius: '20px' }}><div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '10px' }}>{[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < (rev.rating || 5) ? "#fbbf24" : "none"} />)}</div><p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--text-main)', marginBottom: '16px', fontWeight: '500' }}>"{rev.content}"</p><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px' }}>{rev.author?.[0]}</div><div><div style={{ fontWeight: '800', fontSize: '12px' }}>{rev.author}</div><div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{rev.productTitle}</div></div></div></div>))}</div>) : (<div style={{ position: 'relative', overflow: 'hidden', padding: '16px 0' }}><div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollSnapType: 'x mandatory' }}>{config.reviews.map((rev, i) => (<div key={i} style={{ minWidth: '320px', background: '#fff', padding: '32px', borderRadius: '24px', scrollSnapAlign: 'start', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}><div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '16px' }}>{[...Array(5)].map((_, j) => <Star key={j} size={16} fill={j < (rev.rating || 5) ? "#fbbf24" : "none"} />)}</div><p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '24px', fontStyle: 'italic' }}>"{rev.content}"</p><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{rev.author?.[0]}</div><div><div style={{ fontWeight: '800' }}>{rev.author}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rev.productTitle}</div></div></div></div>))}</div></div>)}
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
      <section id="products" style={{ padding: isMobile ? '60px 0' : '120px 0', background: config.productListBranding?.bgColor || 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '80px' }}><h2 style={{ fontSize: isMobile ? '28px' : '48px', fontWeight: '800', color: config.productListBranding?.titleColor || 'var(--text-main)' }}>{config.productListBranding?.title || "추천 패키지"}</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {products.map(product => {
              const typo = product.typography || {};
              const getStyle = (t) => { const base = typo[t]?.fontSize || (t === 'title' ? 22 : 15); const min = Math.max(12, Math.floor(base * 0.6)); return { fontSize: `clamp(${min}px, 3.8vw, ${base}px)`, color: typo[t]?.color, fontWeight: t === 'title' || t === 'price' ? '800' : '400' }; };
              return (<Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: 'none' }}><div className="product-card-modern"><div style={{ height: isMobile ? '180px' : '240px', overflow: 'hidden' }}><SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div><div style={{ padding: isMobile ? '16px' : '30px' }}><h3 style={{ ...getStyle('title'), marginBottom: '6px' }}>{product.title}</h3><p style={{ ...getStyle('description'), marginBottom: '12px' }}>{product.description}</p><div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={getStyle('price')}>{product.price?.toLocaleString()}원</span><span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>자세히 보기 &gt;</span></div></div></div></Link>);
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
