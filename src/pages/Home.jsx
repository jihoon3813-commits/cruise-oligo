import React, { useState } from 'react';
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
  const { typography, aboveTitle, title, subtitle, belowTitle } = hero;
  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
       {aboveTitle && <motion.span initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} style={{ ...getTextStyle(typography, 'above'), marginBottom: '16px' }}>{aboveTitle}</motion.span>}
       <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} style={{ ...getTextStyle(typography, 'title'), fontWeight: '900', marginBottom: '32px' }}>
          {title?.split('\n').map((l,i) => <React.Fragment key={i}>{l}<br/></React.Fragment>)}
       </motion.h1>
       {subtitle && <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} style={{ ...getTextStyle(typography, 'subtitle'), marginBottom: '32px' }}>{subtitle}</motion.p>}
       {belowTitle && <motion.span initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.6}} style={{ ...getTextStyle(typography, 'below'), fontSize: '16px', opacity: 0.8 }}>{belowTitle}</motion.span>}
       
       <div style={{ display: 'flex', gap: '20px', marginTop: '48px', justifyContent: hero.textPosition === 'center' ? 'center' : (hero.textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
          <button className="luxury-btn">지금 시작하기 <ArrowRight size={18} /></button>
          <button className="luxury-btn outline">패키지 보기</button>
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
  const { hero, sections, products } = config;

  const renderHero = () => {
    if (!hero) return null;
    const { style, bgType, bgUrl, bgOpacity, textPosition, verticalAlign } = hero;
    
    const wrapperStyle = {
      position: 'relative',
      height: '100vh',
      minHeight: '800px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: verticalAlign === 'top' ? 'flex-start' : (verticalAlign === 'bottom' ? 'flex-end' : 'center'),
      padding: '120px 0'
    };

    const bgOverlayStyle = {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      opacity: bgOpacity ?? 1
    };

    if (style === 'classic') {
       return (
         <section style={wrapperStyle}>
            <div style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', zIndex: 0, opacity: bgOpacity ?? 1 }}>
               <SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff 0%, rgba(255,255,255,0.8) 20%, transparent 100%)' }}></div>
            </div>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
               <div style={{ maxWidth: '650px' }}><HeroText hero={hero} /></div>
            </div>
         </section>
       );
    }

    if (style === 'split') {
       return (
         <section style={{ ...wrapperStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 80px' }}><HeroText hero={hero} /></div>
            <div style={{ position: 'relative', opacity: bgOpacity ?? 1 }}><SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
         </section>
       );
    }

    if (style === 'card') {
       return (
         <section style={wrapperStyle}>
            <div style={bgOverlayStyle}><SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            <div className="container" style={{ display: 'flex', justifyContent: textPosition === 'center' ? 'center' : (textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', padding: '80px', borderRadius: '40px', maxWidth: '750px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                  <HeroText hero={hero} />
               </motion.div>
            </div>
         </section>
       );
    }

    if (style === 'minimal') {
       return (
         <section style={{ ...wrapperStyle, height: 'auto', padding: '240px 0', background: '#fff' }}>
            <div className="container" style={{ textAlign: 'center' }}><HeroText hero={hero} /></div>
         </section>
       );
    }

    return (
      <section style={wrapperStyle}>
        <div style={bgOverlayStyle}>
           <SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }}></div>
        </div>
        <div className="container" style={{ display: 'flex', justifyContent: textPosition === 'center' ? 'center' : (textPosition === 'right' ? 'flex-end' : 'flex-start') }}>
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

  return (
    <div className="home-clean">
      <nav className="nav scrolled">
         <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
            <Link to="/" style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)', textDecoration: 'none' }}>OLIGO CRUISE</Link>
            <div style={{ display: 'flex', gap: '30px' }}><Link to="/" className="nav-link">홈</Link><a href="#products" className="nav-link">상품</a><Link to="/admin" className="nav-link" style={{ color: 'var(--primary)' }}>어드민</Link></div>
         </div>
      </nav>
      {renderHero()}
      {sections.map(section => renderSection(section))}
      <section id="products" style={{ padding: '120px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}><h2 style={{ fontSize: '48px', fontWeight: '800' }}>추천 패키지</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {products.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                <div className="product-card-modern"><div style={{ height: '240px', overflow: 'hidden' }}><SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div><div style={{ padding: '30px' }}><h3 style={{ fontSize: '24px', marginBottom: '12px' }}>{product.title}</h3><p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{product.description}</p></div></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
