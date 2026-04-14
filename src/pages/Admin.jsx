import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image, Package, MessageSquare, Home as HomeIcon, LogOut, ChevronRight, Settings, Bell, Search, PhoneCall, ShieldCheck } from 'lucide-react';
import AdminHomeEditor from './AdminHomeEditor';
import AdminProductManager from './AdminProductManager';
import AdminReviewManager from './AdminReviewManager';
import AdminProductDetailEditor from './AdminProductDetailEditor';
import AdminReservationManager from './AdminReservationManager';
import AdminSettings from './AdminSettings';

const Admin = () => {
  const location = useLocation();

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
