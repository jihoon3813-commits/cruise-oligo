import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import Reviews from './pages/Reviews';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import { useConfig } from './context/ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Ship } from 'lucide-react';

function App() {
  const { config, loading } = useConfig();

  React.useEffect(() => {
    if (loading || !config) return;

    try {
      if (config.faviconUrl) {
        const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = config.faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      if (config.metaDescription) {
        const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
        meta.name = "description";
        meta.content = config.metaDescription;
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    } catch (e) { console.error(e); }
  }, [config, loading]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
        서버 데이터를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
