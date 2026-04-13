import React from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { ArrowRight, Star, ExternalLink, Play, Ship, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeMedia from '../components/SafeMedia';

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

  const ImageGallery = ({ images = [], singleImage, style = "grid" }) => {
    const allImages = (images && images.length > 0) ? images : (singleImage ? [singleImage] : []);
    if (allImages.length === 0) return null;

    if (style === 'masonry') {
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

    return (
      <div style={{ display: 'grid', gridTemplateColumns: allImages.length > 1 ? 'repeat(2, 1fr)' : '1fr', gap: '20px' }}>
        {allImages.map((img, idx) => (
          <div key={idx} style={{ 
            gridColumn: idx === 0 && allImages.length === 3 ? 'span 2' : 'span 1',
            borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)',
            height: allImages.length > 1 ? '300px' : 'auto'
          }}>
            <SafeMedia src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    );
  };

  const renderSection = (section) => {
    const { style, typography, items, layout, bgColor, bgType, bgUrl } = section;
    const titleStyle = getTextStyle(typography, 'title');
    const contentStyle = getTextStyle(typography, 'content');

    const wrapperStyle = {
      position: 'relative',
      padding: '120px 0',
      background: bgType === 'color' ? (bgColor || '#ffffff') : 'transparent'
    };

    return (
      <section key={section.id} style={wrapperStyle}>
        {bgType !== 'color' && bgUrl && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
             <SafeMedia src={bgUrl} type={bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)' }}></div>
          </div>
        )}

        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
          
          {/* Feature Cards Style (User Request: Image + Cards) */}
          {style === 'feature-cards' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'flex-start' }}>
               <div>
                  <h2 style={titleStyle}>{section.title}</h2>
                  <p style={contentStyle}>{section.content}</p>
                  {section.image && <SafeMedia src={section.image} style={{ width: '100%', borderRadius: '40px', boxShadow: 'var(--shadow-lg)' }} />}
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {(items || []).map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="admin-card" 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', gap: '24px', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', background: '#fff' }}
                    >
                       <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)', opacity: 0.3, padding: '4px 12px', border: '1px solid var(--border-light)', borderRadius: '8px', height: 'fit-content' }}>
                          {item.number || `0${i+1}`}
                       </div>
                       <div>
                          <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>{item.title}</h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>{item.content}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          )}

          {/* Process Style */}
          {style === 'process' && (
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ ...titleStyle, textAlign: 'center' }}>{section.title}</h2>
               <p style={{ ...contentStyle, textAlign: 'center', margin: '0 auto 80px', maxWidth: '800px' }}>{section.content}</p>
               <div style={{ display: 'grid', gridTemplateColumns: `repeat(${(items || []).length || 1}, 1fr)`, gap: '40px' }}>
                  {(items || []).map((item, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                       <div style={{ width: '60px', height: '60px', background: 'var(--primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '20px', fontWeight: '800' }}>
                          {item.number || i + 1}
                       </div>
                       <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{item.title}</h4>
                       <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{item.content}</p>
                       {i < (items || []).length - 1 && (
                         <div style={{ position: 'absolute', top: '30px', left: 'calc(50% + 40px)', width: 'calc(100% - 80px)', height: '2px', background: 'var(--border-light)', zIndex: -1 }}></div>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Gallery Style */}
          {style === 'gallery' && (
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ ...titleStyle, textAlign: 'center' }}>{section.title}</h2>
               <p style={{ ...contentStyle, textAlign: 'center', margin: '0 auto 60px', maxWidth: '800px' }}>{section.content}</p>
               <ImageGallery images={section.images} singleImage={section.image} style="masonry" />
            </div>
          )}

          {/* Classic Style Fallback */}
          {(style === 'classic' || !style || style === 'split-card' || style === 'minimal-centered') && (
            <div style={{ 
              display: (style === 'minimal-centered') ? 'block' : 'flex',
              textAlign: (style === 'minimal-centered') ? 'center' : 'left',
              flexDirection: layout === 'right' ? 'row-reverse' : 'row', 
              alignItems: 'center', 
              gap: '80px' 
            }}>
              <div style={{ flex: 1 }}>
                 <h2 style={titleStyle}>{section.title}</h2>
                 <p style={contentStyle}>{section.content}</p>
                 {section.showButton && (
                   <Link to={section.buttonLink || "/"} className="luxury-btn outline" style={{ textDecoration: 'none' }}>자세히 보기</Link>
                 )}
              </div>
              <div style={{ flex: 1, marginTop: (style === 'minimal-centered') ? '60px' : '0' }}>
                 <ImageGallery images={section.images} singleImage={section.image} />
              </div>
            </div>
          )}

        </div>
      </section>
    );
  };

  return (
    <div className="home-clean">
      <section className="hero">
        <div className="hero-bg" style={{ position: 'absolute', right: 0, top: 0, width: '60%', height: '100%', zIndex: 0 }}>
          <SafeMedia src={hero.bgUrl} type={hero.bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="hero-overlay"></div>
        </div>
        <div className={`container flex ${getPositionClass(hero.textPosition)}`} style={{ position: 'relative', zIndex: 2, padding: '0 40px', width: '100%' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ maxWidth: '650px' }}>
            <span className="hero-subtitle">{hero.subtitle}</span>
            <h1 className="hero-title">{hero.title.split('\n').map((line, i) => (<React.Fragment key={i}>{line}<br /></React.Fragment>))}</h1>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '12px' }}>5성급 크루즈</span>
                      <div style={{ display: 'flex', color: 'var(--accent)' }}>{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                    </div>
                    <h3 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--text-main)' }}>{product.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', height: '45px', overflow: 'hidden' }}>{product.description}</p>
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>{product.price.toLocaleString()}원</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ExternalLink size={16} color="var(--primary)" /></div>
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
