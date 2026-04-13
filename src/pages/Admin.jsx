import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image, Package, MessageSquare, Home as HomeIcon, LogOut } from 'lucide-react';
import AdminHomeEditor from './AdminHomeEditor';
import AdminProductManager from './AdminProductManager';
import AdminReviewManager from './AdminReviewManager';

const Admin = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', name: '홈 레이아웃 설정', icon: <HomeIcon size={20} /> },
    { path: '/admin/products', name: '상품 관리', icon: <Package size={20} /> },
    { path: '/admin/reviews', name: '후기 관리', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar shadow-xl">
        <div style={{ padding: '0 30px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>관리자 패널</h2>
          <p style={{ fontSize: '12px', opacity: 0.5 }}>올리고 크루즈 멤버십</p>
        </div>
        
        <nav style={{ marginTop: '30px' }}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '30px' }}>
          <Link to="/" className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-all">
            <LogOut size={16} />
            <span>사이트 보기</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Routes>
          <Route path="/" element={<AdminHomeEditor />} />
          <Route path="/products" element={<AdminProductManager />} />
          <Route path="/reviews" element={<AdminReviewManager />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
