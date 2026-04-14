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
import { Ship } from 'lucide-react';

const SplashScreen = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      background: '#ffffff', zIndex: 9999, display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', gap: '20px' 
    }}
  >
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.5, 1, 0.5] 
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ color: '#2563EB' }}
    >
      <Ship size={64} />
    </motion.div>
    <motion.h1 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '0.2em', color: '#0F172A' }}
    >
      OLIGO CRUISE
    </motion.h1>
  </motion.div>
);

function App() {
  const { loading } = useConfig();

  return (
    <>
      <AnimatePresence>
        {loading && <SplashScreen />}
      </AnimatePresence>
      
      {!loading && (
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
      )}
    </>
  );
}

export default App;
