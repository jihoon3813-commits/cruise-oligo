import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Image, Package, MessageSquare, Home as HomeIcon, LogOut, ChevronRight, Settings, Bell, Search, PhoneCall, ShieldCheck } from 'lucide-react';
import AdminHomeEditor from './AdminHomeEditor';
import AdminProductManager from './AdminProductManager';
import AdminReviewManager from './AdminReviewManager';
import AdminProductDetailEditor from './AdminProductDetailEditor';
import AdminReservationManager from './AdminReservationManager';
import AdminSettings from './AdminSettings';
import { useConfig } from '../context/ConfigContext';

const Admin = () => {
  const { config } = useConfig();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = config?.adminPassword || "1111";
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("비밀번호가 올바르지 않습니다.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        background: '#050c18', position: 'relative', overflow: 'hidden' 
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', top: '-100px', right: '-100px' }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)', bottom: '-200px', left: '-200px' }} />

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            backdropFilter: 'blur(20px)',
            padding: '60px 40px', 
            borderRadius: '40px', 
            border: '1px solid rgba(255,255,255,0.1)',
            width: '100%', 
            maxWidth: '440px', 
            textAlign: 'center',
            zIndex: 10
          }}
        >
          <div style={{ 
            width: '80px', height: '80px', 
            background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6AD 100%)', 
            borderRadius: '24px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            transform: 'rotate(-5deg)'
          }}>
            <ShieldCheck size={40} color="#050c18" strokeWidth={1.5} />
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginBottom: '12px', letterSpacing: '0.1em' }}>ADMIN KEY</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '40px', letterSpacing: '0.05em' }}>접속을 위해 관리자 인증번호를 입력하세요.</p>
          
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ 
                height: '64px',
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                color: '#fff',
                fontSize: '24px',
                letterSpacing: '0.5em',
                textAlign: 'center',
                transition: '0.3s'
              }}
              autoFocus
            />
          </div>
          
          <button 
            type="submit" 
            className="luxury-btn" 
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              height: '56px',
              fontSize: '16px',
              fontWeight: '800',
              borderRadius: '16px',
              background: 'linear-gradient(90deg, #D4AF37, #F5E6AD)',
              color: '#050c18',
              border: 'none',
              boxShadow: '0 10px 20px rgba(212,175,55,0.2)'
            }}
          >
            AUTHORIZE
          </button>
          
          <div style={{ marginTop: '32px' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textDecoration: 'none', fontWeight: '600', transition: '0.3s' }}>
              HOME SITE
            </Link>
          </div>
        </motion.form>
      </div>
    );
  }

  const navItems = [
    { path: '/admin', name: '홈페이지 편집', icon: <HomeIcon size={20} /> },
    { path: '/admin/products', name: '상품 리스트', icon: <Package size={20} /> },
    { path: '/admin/product-detail', name: '상품 상세 브랜딩', icon: <Settings size={20} /> },
    { path: '/admin/reviews', name: '리뷰 관리', icon: <MessageSquare size={20} /> },
    { path: '/admin/reservations', name: '상담 신청 내역', icon: <PhoneCall size={20} /> },
    { path: '/admin/settings', name: '웹사이트 설정', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-nav" style={{ boxShadow: 'inset -1px 0 0 var(--border-light)' }}>
        <div style={{ padding: '0 10px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Package size={18} color="#fff" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>OLIGO</h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Admin Console</p>
        </div>
        
        <nav style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', paddingLeft: '16px' }}>Main Menu</div>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span style={{ fontSize: '15px', fontWeight: '600' }}>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
          <Link to="/" className="flex items-center gap-3 text-sm font-semibold color-text-muted hover:color-primary transition-all">
            <LogOut size={18} />
            <span>프론트 사이트</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{ 
          height: '80px', background: '#fff', borderBottom: '1px solid var(--border-light)', 
          padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
             <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search data..." style={{ width: '100%', padding: '10px 12px 10px 42px', borderRadius: '100px', border: '1px solid var(--border-light)', background: 'var(--bg-sub)' }} />
             </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
               <Bell size={20} color="var(--text-muted)" />
               <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'red', borderRadius: '50%', border: '2px solid #fff' }}></div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <img src="https://ui-avatars.com/api/?name=Admin&background=2563EB&color=fff" alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
               <div style={{ fontSize: '14px' }}>
                 <p style={{ fontWeight: '700' }}>관리자</p>
                 <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Admin User</p>
               </div>
            </div>
          </div>
        </header>

        <div style={{ padding: '40px' }}>
          <Routes>
            <Route path="/" element={<AdminHomeEditor />} />
            <Route path="/products" element={<AdminProductManager />} />
            <Route path="/product-detail" element={<AdminProductDetailEditor />} />
            <Route path="/reviews" element={<AdminReviewManager />} />
            <Route path="/reservations" element={<AdminReservationManager />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Admin;
