import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { ArrowRight, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeMedia from '../components/SafeMedia';

const ImageSlider = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return <SafeMedia src={images[0]} style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }} />;
  }
  const next = () => setCurrent((current + 1) % images.length);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%' }}>
          <SafeMedia src={images[current]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>
      </AnimatePresence>
      <button onClick={prev} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex' }}><ChevronLeft size={20} /></button>
      <button onClick={next} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex' }}><ChevronRight size={20} /></button>
    </div>
  );
};

const Home = () => {
  const { config } = useConfig();
  const { hero, sections, products } = config;

  const getPositionClass = (pos) => {
    if (pos === 'left') return 'justify-start text-left';
    if (pos === 'right') return 'justify-end text-right';
    return 'justify-center text-center';
  };

  const getTextStyle = (typo, type) => {
    if (!typo?.[type]) return {};
    const t = typo[type];
    return {
      color: t.color,
      fontSize: t.fontSize ? `${t.fontSize}px` : undefined,
      fontFamily: t.fontFamily,
      textAlign: t.textAlign,
      letterSpacing: t.letterSpacing ? `${t.letterSpacing}em` : undefined,
      lineHeight: t.lineHeight,
      marginBottom: type === 'title' ? '24px' : '32px'
    };
  };

  const CustomButton = ({ section }) => {
    if (!section.showButton) return null;
    const styles = section.buttonStyles || {};
    const sizeMap = {
      small: { padding: '8px 20px', fontSize: '13px' },
      medium: { padding: '12px 32px', fontSize: '15px' },
      large: { padding: '16px 48px', fontSize: '18px' }
    };
    const currentSize = sizeMap[styles.size] || sizeMap.medium;

    const btnStyle = {
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
      transition: 'var(--transition-smooth)',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
    };

    return (
      <Link to={section.buttonLink || "/"} style={btnStyle} className="dynamic-button">
        {section.buttonText || "자세히 보기"} <ArrowRight size={18} />
      </Link>
    );
  };

  const MediaGallery = ({ images = [], singleImage, style }) => {
    const allImages = (images && images.length > 0) ? images : (singleImage ? [singleImage] : []);
    if (allImages.length === 0) return null;
    if (style === 'gallery') {
       return (
         <div style={{ columns: '2', columnGap: '20px' }}>
            {allImages.map((img, i) => (
              <div key={i} style={{ marginBottom: '20px', borderRadius: '24px', overflow: 'hidden', breakInside: 'avoid' }}>
                <SafeMedia src={img} style={{ width: '100%', display: 'block' }} />
              </div>
            ))}
         </div>
       );
    }
    return <ImageSlider images={allImages} />;
  };

  const renderSection = (section) => {
    const { style, typography, items, layout, bgColor, bgType, bgUrl, image, images, bgOpacity, paddingTop, paddingBottom } = section;
    const titleStyle = getTextStyle(typography, 'title');
    const contentStyle = getTextStyle(typography, 'content');
    const hasMedia = image || (images && images.length > 0);

    const wrapperStyle = {
      position: 'relative',
      paddingTop: `${paddingTop ?? 120}px`,
      paddingBottom: `${paddingBottom ?? 120}px`,
      background: bgType === 'color' ? (bgColor || '#ffffff') : 'transparent',
      overflow: 'hidden'
    };

    return (
      <section key={section.id} style={wrapperStyle}>
        {bgType !== 'color' && bgUrl && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: bgOpacity ?? 1 }}>
             <SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: bgType === 'color' ? 'transparent' : `rgba(255,255,255,${1 - (bgOpacity ?? 1)})`, zIndex: 0 }}></div>

        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
          {style === 'feature-cards' && (
            <div style={{ display: 'grid', gridTemplateColumns: hasMedia ? '1fr 1fr' : '1fr', gap: '80px' }}>
               <div>
                  <h2 style={titleStyle}>{section.title}</h2>
                  <p style={contentStyle}>{section.content}</p>
                  <CustomButton section={section} />
                  <div style={{ marginTop: '40px' }}><MediaGallery images={images} singleImage={image} /></div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {(items || []).map((item, i) => (
                    <motion.div key={i} className="admin-card" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: '24px', padding: '40px', borderRadius: '24px', background: '#fff' }}>
                       <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)', opacity: 0.3 }}>{item.number || `0${i+1}`}</div>
                       <div><h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>{item.title}</h4><p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{item.content}</p></div>
                    </motion.div>
                  ))}
               </div>
            </div>
          )}

          {style === 'process' && (
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ ...titleStyle, textAlign: 'center' }}>{section.title}</h2>
               <p style={{ ...contentStyle, textAlign: 'center', margin: '0 auto 80px', maxWidth: '800px' }}>{section.content}</p>
               <div style={{ display: 'grid', gridTemplateColumns: `repeat(${(items || []).length || 1}, 1fr)`, gap: '40px' }}>
                  {(items || []).map((item, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                       <div style={{ width: '60px', height: '60px', background: 'var(--primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '20px', fontWeight: '800' }}>{item.number || i + 1}</div>
                       <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{item.title}</h4>
                       <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{item.content}</p>
                    </div>
                  ))}
               </div>
               <div style={{ marginTop: '60px' }}><CustomButton section={section} /></div>
            </div>
          )}

          {style === 'gallery' && (
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ ...titleStyle, textAlign: 'center' }}>{section.title}</h2>
               <p style={{ ...contentStyle, textAlign: 'center', margin: '0 auto 60px', maxWidth: '800px' }}>{section.content}</p>
               <MediaGallery images={images} singleImage={image} style="gallery" />
               <div style={{ marginTop: '60px' }}><CustomButton section={section} /></div>
            </div>
          )}

          {(style === 'classic' || !style || style === 'split-card' || style === 'minimal-centered') && (
            <div style={{ 
              display: (style === 'minimal-centered' || !hasMedia) ? 'block' : 'flex',
              textAlign: (style === 'minimal-centered' || !hasMedia) ? (titleStyle.textAlign || 'center') : 'left',
              flexDirection: layout === 'right' ? 'row-reverse' : 'row', 
              alignItems: 'center', gap: '80px' 
            }}>
              <div style={{ flex: 1, maxWidth: !hasMedia ? '800px' : 'none', margin: !hasMedia ? '0 auto' : '0' }}>
                 <h2 style={titleStyle}>{section.title}</h2>
                 <p style={contentStyle}>{section.content}</p>
                 <CustomButton section={section} />
              </div>
              {hasMedia && (
                <div style={{ flex: 1, marginTop: (style === 'minimal-centered') ? '60px' : '0' }}>
                   <MediaGallery images={images} singleImage={image} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="home-clean">
      <nav className="nav scrolled">
         <Link to="/" style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)', textDecoration: 'none' }}>OLIGO CRUISE</Link>
         <div style={{ display: 'flex', gap: '30px' }}>
            <Link to="/" className="nav-link">홈</Link>
            <a href="#products" className="nav-link">상품</a>
            <Link to="/admin" className="nav-link" style={{ color: 'var(--primary)' }}>어드민</Link>
         </div>
      </nav>

      <section className="hero">
        <div className="hero-bg" style={{ position: 'absolute', right: 0, top: 0, width: '60%', height: '100%', zIndex: 0 }}>
          <SafeMedia src={hero.bgUrl} type={hero.bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="hero-overlay"></div>
        </div>
        <div className={`container flex ${getPositionClass(hero.textPosition)}`} style={{ position: 'relative', zIndex: 2, padding: '0 40px', width: '100%' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ maxWidth: '650px' }}>
            <span className="hero-subtitle">{hero.subtitle}</span>
            <h1 className="hero-title">{hero.title?.split('\n').map((line, i) => (<React.Fragment key={i}>{line}<br /></React.Fragment>))}</h1>
            <div style={{ display: 'flex', gap: '16px', justifyContent: hero.textPosition === 'center' ? 'center' : 'flex-start' }}>
              <button className="luxury-btn">지금 시작하기 <ArrowRight size={18} /></button>
              <button className="luxury-btn outline">멤버십 혜택</button>
            </div>
          </motion.div>
        </div>
      </section>
      {sections.map(section => renderSection(section))}
      <section id="products" style={{ padding: '120px 0', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', letterSpacing: '0.1em' }}>PACKAGE</span>
            <h2 style={{ fontSize: '48px', fontWeight: '800', marginTop: '10px' }}>인기 크루즈 상품</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
            {products.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                <motion.div className="product-card-modern">
                  <div style={{ height: '240px', overflow: 'hidden' }}><SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                  <div style={{ padding: '30px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--text-main)' }}>{product.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', height: '45px', overflow: 'hidden' }}>{product.description}</p>
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>{product.price.toLocaleString()}원</span>
                        <ExternalLink size={16} color="var(--primary)" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
