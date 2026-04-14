import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { ArrowRight, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeMedia from '../components/SafeMedia';

const getTextStyle = (typo, type) => {
  if (!typo?.[type]) return {};
  const t = typo[type];
  return {
    color: t.color,
    fontSize: t.fontSize ? `${t.fontSize}px` : undefined,
    fontFamily: t.fontFamily,
    textAlign: t.textAlign || 'inherit',
    letterSpacing: t.letterSpacing ? `${t.letterSpacing}em` : undefined,
    lineHeight: t.lineHeight,
    display: 'block'
  };
};

const HeroText = ({ hero }) => {
  const { typography, aboveTitle, title, subtitle, belowTitle, buttons } = hero;
  
  const renderButton = (btn) => {
    if (!btn.show) return null;
    const styles = btn.style || {};
    const sizeMap = { 
      small: { padding: '8px 20px', fontSize: '13px' }, 
      medium: { padding: '12px 32px', fontSize: '15px' }, 
      large: { padding: '16px 48px', fontSize: '18px' } 
    };
    const currentSize = sizeMap[styles.size] || sizeMap.medium;

    return (
      <Link 
        key={btn.id}
        to={btn.link || "/"} 
        style={{ 
          ...currentSize, 
          backgroundColor: styles.bgColor || 'var(--primary)', 
          color: styles.textColor || '#ffffff', 
          border: `2px solid ${styles.borderColor || styles.bgColor || 'var(--primary)'}`, 
          borderRadius: '100px', 
          fontWeight: '700', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          textDecoration: 'none', 
          transition: '0.3s', 
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)' 
        }}
      >
        {btn.text} {btn.id === (buttons?.[0]?.id) && <ArrowRight size={18} />}
      </Link>
    );
  };

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
       {aboveTitle && <motion.span initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} style={{ ...getTextStyle(typography, 'above'), marginBottom: '16px' }}>{aboveTitle}</motion.span>}
       <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} style={{ ...getTextStyle(typography, 'title'), fontWeight: '900', marginBottom: '32px' }}>
          {title?.split('\n').map((l,i) => <React.Fragment key={i}>{l}<br/></React.Fragment>)}
       </motion.h1>
       {subtitle && <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} style={{ ...getTextStyle(typography, 'subtitle'), marginBottom: '32px' }}>{subtitle}</motion.p>}
       {belowTitle && <motion.span initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.6}} style={{ ...getTextStyle(typography, 'below'), fontSize: '16px', opacity: 0.8 }}>{belowTitle}</motion.span>}
       
       <div style={{ display: 'flex', gap: '20px', marginTop: '48px', justifyContent: hero.textPosition === 'center' ? 'center' : (hero.textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
          {(buttons && buttons.length > 0) ? (
            buttons.map(btn => renderButton(btn))
          ) : (
            <>
              <button className="luxury-btn">지금 시작하기 <ArrowRight size={18} /></button>
              <button className="luxury-btn outline">패키지 보기</button>
            </>
          )}
       </div>
    </div>
  );
};

const ImageSlider = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;
  if (images.length === 1) return <SafeMedia src={images[0]} style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }} />;
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%' }}>
          <SafeMedia src={images[current]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>
      </AnimatePresence>
      <button onClick={() => setCurrent((current - 1 + images.length) % images.length)} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex' }}><ChevronLeft size={20} /></button>
      <button onClick={() => setCurrent((current + 1) % images.length)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex' }}><ChevronRight size={20} /></button>
    </div>
  );
};

const Home = () => {
  const { config } = useConfig();
  const { hero, sections, products, theme } = config;

  useEffect(() => {
    document.body.className = `theme-${theme || 'white'}`;
  }, [theme]);

  const renderHero = () => {
    if (!hero) return null;
    const { style, bgType, bgUrl, bgOpacity, textPosition, verticalAlign, paddingX } = hero;
    
    const wrapperStyle = {
      position: 'relative', height: '100vh', minHeight: '800px', overflow: 'hidden', display: 'flex',
      alignItems: verticalAlign === 'top' ? 'flex-start' : (verticalAlign === 'bottom' ? 'flex-end' : 'center'),
      padding: '120px 0'
    };

    const containerStyle = {
      position: 'relative', zIndex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto',
      padding: `0 ${paddingX ?? 80}px`
    };

    const BgMedia = () => (
      <SafeMedia 
        src={bgUrl} 
        type={bgType} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          filter: `brightness(${bgOpacity ?? 1})`,
          transition: '0.3s'
        }} 
      />
    );

    if (style === 'classic') {
       return (
         <section style={wrapperStyle}>
            <div style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', zIndex: 0 }}>
               <BgMedia />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg-main) 0%, rgba(255,255,255,0.8) 20%, transparent 100%)' }}></div>
            </div>
            <div style={containerStyle}><div style={{ maxWidth: '650px' }}><HeroText hero={hero} /></div></div>
         </section>
       );
    }

    if (style === 'split') {
       return (
         <section style={{ ...wrapperStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${paddingX ?? 80}px` }}><HeroText hero={hero} /></div>
            <div style={{ position: 'relative' }}><BgMedia /></div>
         </section>
       );
    }

    if (style === 'card') {
       return (
         <section style={wrapperStyle}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><BgMedia /></div>
            <div style={{ ...containerStyle, display: 'flex', justifyContent: textPosition === 'center' ? 'center' : (textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'var(--glass-white)', backdropFilter: 'blur(20px)', padding: '80px', borderRadius: '40px', maxWidth: '750px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                  <HeroText hero={hero} />
               </motion.div>
            </div>
         </section>
       );
    }

    return (
      <section style={wrapperStyle}>
         <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><BgMedia /></div>
         <div style={{ ...containerStyle, display: 'flex', justifyContent: textPosition === 'center' ? 'center' : (textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
            <div style={{ maxWidth: '900px' }}><HeroText hero={hero} /></div>
         </div>
      </section>
    );
  };

  const CustomButton = ({ section }) => {
    if (!section.showButton) return null;
    const styles = section.buttonStyles || {};
    const sizeMap = { small: { padding: '8px 20px', fontSize: '13px' }, medium: { padding: '12px 32px', fontSize: '15px' }, large: { padding: '16px 48px', fontSize: '18px' } };
    const currentSize = sizeMap[styles.size] || sizeMap.medium;

    return (
      <Link to={section.buttonLink || "/"} style={{ ...currentSize, backgroundColor: styles.bgColor || 'var(--primary)', color: styles.textColor || '#ffffff', border: `2px solid ${styles.borderColor || styles.bgColor || 'var(--primary)'}`, borderRadius: '100px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', transition: '0.3s', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
        {section.buttonText || "자세히 보기"} <ArrowRight size={18} />
      </Link>
    );
  };

  const MediaGallery = ({ images = [], singleImage, style }) => {
    const allImages = (images && images.length > 0) ? images : (singleImage ? [singleImage] : []);
    if (allImages.length === 0) return null;
    if (style === 'gallery') return <div style={{ columns: '2', columnGap: '24px' }}>{allImages.map((img, i) => (<div key={i} style={{ marginBottom: '24px', borderRadius: '32px', overflow: 'hidden', breakInside: 'avoid' }}><SafeMedia src={img} style={{ width: '100%', display: 'block' }} /></div>))}</div>;
    return <ImageSlider images={allImages} />;
  };

  const renderSection = (section) => {
    const { style, typography, items, layout, bgColor, bgType, bgUrl, image, images, bgOpacity, paddingTop, paddingBottom } = section;
    const hasMedia = image || (images && images.length > 0);
    const wrapperStyle = { position: 'relative', paddingTop: `${paddingTop ?? 120}px`, paddingBottom: `${paddingBottom ?? 120}px`, background: bgType === 'color' ? (bgColor || '#ffffff') : 'transparent', overflow: 'hidden' };

    return (
      <section key={section.id} style={wrapperStyle}>
        {bgType !== 'color' && bgUrl && <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: bgOpacity ?? 1 }}><SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
        <div style={{ position: 'absolute', inset: 0, background: bgType === 'color' ? 'transparent' : `rgba(255,255,255,${1 - (bgOpacity ?? 1)})`, zIndex: 0 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {(style === 'classic' || !style) && (
            <div style={{ display: !hasMedia ? 'block' : 'flex', textAlign: !hasMedia ? 'center' : 'left', flexDirection: layout === 'right' ? 'row-reverse' : 'row', alignItems: 'center', gap: '80px' }}>
              <div style={{ flex: 1 }}><h2 style={getTextStyle(typography, 'title')}>{section.title}</h2><p style={getTextStyle(typography, 'content')}>{section.content}</p><CustomButton section={section} /></div>
              {hasMedia && <div style={{ flex: 1 }}><MediaGallery images={images} singleImage={image} /></div>}
            </div>
          )}
          {style === 'feature-cards' && (
             <div style={{ display: 'grid', gridTemplateColumns: hasMedia ? '1fr 1fr' : '1fr', gap: '80px' }}>
                <div><h2 style={getTextStyle(typography, 'title')}>{section.title}</h2><p style={getTextStyle(typography, 'content')}>{section.content}</p><CustomButton section={section} /><div style={{marginTop:'40px'}}><MediaGallery images={images} singleImage={image} /></div></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>{(items || []).map((item, i) => (<div key={i} className="admin-card" style={{ display: 'flex', gap: '24px', padding: '40px', borderRadius: '24px', background: '#fff' }}><div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)', opacity: 0.3 }}>{item.number || `0${i+1}`}</div><div><h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>{item.title}</h4><p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{item.content}</p></div></div>))}</div>
             </div>
          )}
          {style === 'process' && (
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ ...getTextStyle(typography, 'title'), textAlign: 'center' }}>{section.title}</h2>
               <p style={{ ...getTextStyle(typography, 'content'), textAlign: 'center', margin: '0 auto 80px', maxWidth: '800px' }}>{section.content}</p>
               <div style={{ display: 'grid', gridTemplateColumns: `repeat(${(items || []).length || 1}, 1fr)`, gap: '40px' }}>
                  {(items || []).map((item, i) => (
                    <div key={i}><div style={{ width: '60px', height: '60px', background: 'var(--primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '20px', fontWeight: '800' }}>{item.number || i + 1}</div><h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{item.title}</h4><p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{item.content}</p></div>
                  ))}
               </div>
               <div style={{ marginTop: '60px' }}><CustomButton section={section} /></div>
            </div>
          )}
          {style === 'gallery' && (
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ ...getTextStyle(typography, 'title'), textAlign: 'center' }}>{section.title}</h2>
               <p style={{ ...getTextStyle(typography, 'content'), textAlign: 'center', margin: '0 auto 60px', maxWidth: '800px' }}>{section.content}</p>
               <MediaGallery images={images} singleImage={image} style="gallery" />
               <div style={{ marginTop: '60px' }}><CustomButton section={section} /></div>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderReviews = () => {
    const rb = config.reviewSectionBranding;
    if (!rb?.show || !config.reviews?.length) return null;

    return (
      <section style={{ padding: '120px 0', background: rb.bgColor || 'var(--bg-sub)' }}>
         <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
               <h2 style={{ fontSize: '48px', fontWeight: '800', color: rb.titleColor || 'var(--text-main)' }}>
                  {rb.title || "여행 후기"}
               </h2>
            </div>
            
            {rb.layout === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                 {config.reviews.map((rev, i) => (
                   <div key={i} className="admin-card" style={{ padding: '32px', background: '#fff', borderRadius: '24px' }}>
                      <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '16px' }}>
                         {[...Array(5)].map((_, j) => <Star key={j} size={16} fill={j < (rev.rating || 5) ? "#fbbf24" : "none"} />)}
                      </div>
                      <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-main)', marginBottom: '24px', fontWeight: '500' }}>"{rev.content}"</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' }}>{rev.author?.[0]}</div>
                         <div><div style={{ fontWeight: '800', fontSize: '14px' }}>{rev.author}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rev.productTitle}</div></div>
                      </div>
                   </div>
                 ))}
              </div>
            ) : (
              <div style={{ position: 'relative', overflow: 'hidden', padding: '20px 0' }}>
                 <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px', scrollSnapType: 'x mandatory' }}>
                    {config.reviews.map((rev, i) => (
                      <div key={i} style={{ minWidth: '350px', background: '#fff', padding: '40px', borderRadius: '32px', scrollSnapAlign: 'start', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                         <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '20px' }}>
                            {[...Array(5)].map((_, j) => <Star key={j} size={18} fill={j < (rev.rating || 5) ? "#fbbf24" : "none"} />)}
                         </div>
                         <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-main)', marginBottom: '32px', fontStyle: 'italic' }}>"{rev.content}"</p>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{rev.author?.[0]}</div>
                            <div><div style={{ fontWeight: '800' }}>{rev.author}</div><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{rev.productTitle}</div></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
         </div>
      </section>
    );
  };

  return (
    <div className="home-clean">
      {renderHero()}
      {sections.map(section => renderSection(section))}
      {renderReviews()}
      <section id="products" style={{ padding: '120px 0', background: config.productListBranding?.bgColor || 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
             <h2 style={{ fontSize: '48px', fontWeight: '800', color: config.productListBranding?.titleColor || 'var(--text-main)' }}>
                {config.productListBranding?.title || "추천 패키지"}
             </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {products.map(product => {
              const typo = product.typography || {};
              const getStyle = (t) => ({
                fontSize: typo[t]?.fontSize ? `${typo[t].fontSize}px` : undefined,
                color: typo[t]?.color,
                fontWeight: t === 'title' || t === 'price' ? '800' : '400'
              });

              return (
                <Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-card-modern">
                    <div style={{ height: '240px', overflow: 'hidden' }}>
                      <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '30px' }}>
                      <h3 style={{ ...getStyle('title'), marginBottom: '12px' }}>{product.title}</h3>
                      <p style={{ ...getStyle('description'), marginBottom: '20px' }}>{product.description}</p>
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={getStyle('price')}>{product.price?.toLocaleString()}원</span>
                         <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>자세히 보기 &gt;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
