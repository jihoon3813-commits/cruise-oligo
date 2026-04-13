import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { config } = useConfig();
  const { hero, sections, products } = config;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const getPositionClass = (pos) => {
    if (pos === 'left') return 'justify-start text-left';
    if (pos === 'right') return 'justify-end text-right';
    return 'justify-center text-center';
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          {hero.bgType === 'video' ? (
            <video autoPlay loop muted playsInline>
              <source src={hero.bgUrl} type="video/mp4" />
            </video>
          ) : (
            <img src={hero.bgUrl} alt="Hero Background" />
          )}
        </div>
        <div className={`container flex ${getPositionClass(hero.textPosition)}`}>
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="hero-subtitle gold-text">{hero.subtitle}</span>
            <h1 className="hero-title">{hero.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}</h1>
            <button className="luxury-button">멤버십 혜택 둘러보기</button>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Sections */}
      {sections.map((section, index) => (
        <section key={section.id} className="padding-y reveal" style={{ padding: '120px 0', borderBottom: '1px solid #eee' }}>
          <div className="container">
            <div className={`flex items-center gap-20 ${section.layout === 'text-right' ? 'flex-reverse' : ''}`} 
                 style={{ display: 'flex', flexDirection: section.layout === 'text-right' ? 'row-reverse' : 'row', alignItems: 'center', gap: '80px' }}>
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: section.layout === 'text-right' ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img src={section.image} alt={section.title} style={{ width: '100%', borderRadius: '4px', boxShadow: 'var(--shadow)' }} />
              </motion.div>
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: section.layout === 'text-right' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="section-title" style={{ textAlign: 'left', margin: '0 0 30px 0' }}>{section.title}</h2>
                <p style={{ fontSize: '18px', color: 'var(--text-light)', marginBottom: '40px' }}>{section.content}</p>
                <button className="luxury-button outline">더 알아보기</button>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Products Section */}
      <section id="products" style={{ padding: '120px 0', background: '#fff' }}>
        <div className="container">
          <h2 className="section-title">독점 크루즈 컬렉션</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
            {products.map(product => (
              <motion.div 
                key={product.id} 
                className="product-card"
                whileHover={{ y: -10 }}
                style={{ background: '#fff', boxShadow: 'var(--shadow)', borderRadius: '4px', overflow: 'hidden' }}
              >
                <div style={{ height: '250px', overflow: 'hidden' }}>
                  <img src={product.thumbnails[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '30px' }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>{product.title}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '15px', marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="gold-text" style={{ fontWeight: '700', fontSize: '20px' }}>
                        {product.price.toLocaleString()} KRW
                      </span>
                    </div>
                    <Link to={`/product/${product.id}`} className="luxury-button outline" style={{ padding: '8px 15px', fontSize: '12px' }}>
                      상세 보기
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
