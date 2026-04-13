import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ship, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo flex items-center gap-2">
        <Ship size={32} className="gold-text" />
        <span>OLIGO CRUISE</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">홈</Link>
        <Link to="/#membership" className="nav-link">멤버십</Link>
        <Link to="/#products" className="nav-link">크루즈</Link>
        <Link to="/reviews" className="nav-link">여행후기</Link>
        <Link to="/admin" className="luxury-button outline" style={{ padding: '8px 20px', fontSize: '12px' }}>관리자</Link>
      </div>

      {/* Mobile menu logic would go here */}
    </nav>
  );
};

export default Navbar;
