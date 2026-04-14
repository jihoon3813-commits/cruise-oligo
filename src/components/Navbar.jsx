import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ship, Menu, X, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['홈', '상품', '여행후기'].map((text) => (
            <Link 
              key={text} 
              to={text === '홈' ? '/' : text === '여행후기' ? '/reviews' : text === '상품' ? '#products' : `#${text}`} 
              className="nav-link"
            >
              {text}
            </Link>
          ))}
          <div style={{ width: '1px', height: '20px', background: 'var(--border-light)' }}></div>
          <Link to="/admin" className="luxury-btn" style={{ padding: '10px 24px', fontSize: '13px' }}>
            관리자 <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
