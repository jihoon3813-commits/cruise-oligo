import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Ship, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import SafeMedia from './SafeMedia';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useConfig();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  if (isAdmin) return null;

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  // Build dynamic menu items
  const menuItems = [
    ...config.sections
      .filter(s => s.menuName)
      .map(s => ({ name: s.menuName, id: `section-${s.id}`, type: 'scroll' })),
    { name: '상품', id: 'products', type: 'scroll' },
    { name: '여행후기', id: 'home-reviews', type: 'scroll' },
  ];

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          {config.logo ? (
             <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                <SafeMedia src={config.logo} style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
             </div>
          ) : (
            <>
              <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '10px', display: 'flex' }}>
                <Ship size={24} color="#fff" />
              </div>
              <span style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>OLIGO</span>
            </>
          )}
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }} className="nav-links">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollTo(item.id)}
              className="nav-link"
              style={{ 
                display: window.innerWidth < 1024 ? 'none' : 'block',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {item.name}
            </button>
          ))}
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: window.innerWidth < 1024 ? 'flex' : 'none', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: '70px', left: 0, width: '100%', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', padding: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          >
            {menuItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => scrollTo(item.id)}
                className="nav-link"
                style={{ 
                  padding: '12px 16px', 
                  fontSize: '18px', 
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  borderRadius: '12px'
                }}
              >
                {item.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
