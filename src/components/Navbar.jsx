import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ship, Menu, X, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
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

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '10px', display: 'flex' }}>
            <Ship size={24} color="#fff" />
          </div>
          <span style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>OLIGO</span>
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="nav-links">
          {['홈', '상품', '여행후기'].map((text) => (
            <Link 
              key={text} 
              to={text === '홈' ? '/' : text === '여행후기' ? '/reviews' : text === '상품' ? '/#products' : `/#${text}`} 
              className="nav-link"
              style={{ display: window.innerWidth < 768 ? 'none' : 'block' }}
            >
              {text}
            </Link>
          ))}
          <div style={{ width: '1px', height: '20px', background: 'var(--border-light)', display: window.innerWidth < 768 ? 'none' : 'block' }}></div>
          <Link to="/admin" className="luxury-btn" style={{ padding: '10px 24px', fontSize: '13px' }}>
            {window.innerWidth < 768 ? '관리' : '관리자'} <ArrowUpRight size={14} />
          </Link>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: window.innerWidth < 768 ? 'flex' : 'none', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: '70px', left: 0, width: '100%', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', padding: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
          {['홈', '상품', '여행후기'].map((text) => (
            <Link 
              key={text} 
              to={text === '홈' ? '/' : text === '여행후기' ? '/reviews' : text === '상품' ? '/#products' : `/#${text}`} 
              className="nav-link"
              style={{ padding: '10px 0', fontSize: '18px', borderBottom: '1px solid var(--bg-sub)' }}
            >
              {text}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
