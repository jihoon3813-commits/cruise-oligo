import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { ArrowRight, Star, ExternalLink, Play } from 'lucide-react';
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

  const renderSection = (section, index) => {
    const isStyleClassic = section.style === 'classic' || !section.style;
    const isStyleSplit = section.style === 'split-card';
    const isStyleMinimal = section.style === 'minimal-centered';

    const bgStyles = {
      position: 'relative',
      padding: '120px 0',
      overflow: 'hidden',
      background: section.bgType === 'color' ? (section.bgColor || '#ffffff') : 'transparent'
    };

    return (
      <section key={section.id} style={bgStyles}>
        {/* Background Media */}
        {section.bgType !== 'color' && section.bgUrl && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
             <SafeMedia 
               src={section.bgUrl} 
               type={section.bgType} 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
             />
             <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)' }}></div>
          </div>
        )}

        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
          
          {/* Classic Style */}
          {isStyleClassic && (
            <div style={{ 
              display: 'flex', 
              flexDirection: section.layout === 'right' ? 'row-reverse' : 'row', 
              alignItems: 'center', 
              gap: '80px' 
            }}>
              <div style={{ flex: 1 }}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SafeMedia 
                    src={section.image} 
                    style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }} 
                  />
                </motion.div>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '42px', marginBottom: '24px', fontWeight: '800' }}>{section.title}</h2>
                <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '32px' }}>{section.content}</p>
                {section.showButton && (
                  <Link to={section.buttonLink || "/"} className="luxury-btn outline" style={{ borderRadius: '12px', textDecoration: 'none' }}>
                    자세히 보기
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Split Card Style */}
          {isStyleSplit && (
            <motion.div 
              className="admin-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ display: 'flex', overflow: 'hidden', padding: '0', borderRadius: '32px', minHeight: '500px' }}
            >
               <div style={{ flex: 1, position: 'relative' }}>
                 <SafeMedia src={section.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div style={{ flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff' }}>
                 <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px' }}>{section.title}</h2>
                 <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '40px' }}>{section.content}</p>
                 {section.showButton && (
                   <Link to={section.buttonLink || "/"} className="luxury-btn" style={{ alignSelf: 'flex-start', textDecoration: 'none' }}>
                     지금 탐험하기 <ArrowRight size={18} />
                   </Link>
                 )}
               </div>
            </motion.div>
          )}

          {/* Minimal Centered Style */}
          {isStyleMinimal && (
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                 <h2 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '32px' }}>{section.title}</h2>
                 <div style={{ width: '100px', height: '4px', background: 'var(--primary)', margin: '0 auto 40px' }}></div>
                 <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: '60px' }}>{section.content}</p>
                 <SafeMedia src={section.image} style={{ width: '100%', borderRadius: '40px', marginBottom: '60px', boxShadow: 'var(--shadow-lg)' }} />
                 {section.showButton && (
                   <Link to={section.buttonLink || "/"} className="luxury-btn outline" style={{ borderRadius: '100px', padding: '16px 48px', textDecoration: 'none' }}>
                     자세히 보기
                   </Link>
                 )}
               </motion.div>
            </div>
          )}

        </div>
      </section>
    );
  };

  return (
    <div className="home-clean">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" style={{ position: 'absolute', right: 0, top: 0, width: '60%', height: '100%', zIndex: 0 }}>
          <SafeMedia src={hero.bgUrl} type={hero.bgType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="hero-overlay"></div>
        </div>

        <div className={`container flex ${getPositionClass(hero.textPosition)}`} style={{ position: 'relative', zIndex: 2, padding: '0 40px', width: '100%' }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '650px' }}
          >
            <span className="hero-subtitle">{hero.subtitle}</span>
            <h1 className="hero-title">{hero.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}</h1>
            <div style={{ display: 'flex', gap: '16px', justifyContent: hero.textPosition === 'center' ? 'center' : 'flex-start' }}>
              <button className="luxury-btn">지금 시작하기 <ArrowRight size={18} /></button>
              <button className="luxury-btn outline">멤버십 혜택</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Sections */}
      {sections.map((section, index) => renderSection(section, index))}

      {/* Products Section */}
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
                  <div style={{ height: '240px', overflow: 'hidden' }}>
                    <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '12px' }}>5성급 크루즈</span>
                      <div style={{ display: 'flex', color: 'var(--accent)' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                    </div>
                    <h3 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--text-main)' }}>{product.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', height: '45px', overflow: 'hidden' }}>{product.description}</p>
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>{product.price.toLocaleString()}원</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <ExternalLink size={16} color="var(--primary)" />
                        </div>
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
