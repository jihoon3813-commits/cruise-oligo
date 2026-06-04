import React from 'react';
import { motion } from 'framer-motion';
import { Ship } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#050c18', // Deep luxury navy
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Background glowing effect */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div style={{ 
            width: '100px', 
            height: '100px', 
            background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6AD 100%)', 
            borderRadius: '30px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transform: 'rotate(-5deg)'
          }}>
            <Ship size={50} color="#050c18" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.05em' }}
          animate={{ opacity: 1, letterSpacing: '0.1em' }}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{
            fontSize: '34px',
            fontWeight: '900',
            color: '#fff',
            margin: 0
          }}
        >
          수호천사 X 올리고멤버십
        </motion.h1>
        
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
            style={{
                height: '2px',
                background: 'rgba(212,175,55,0.5)',
                margin: '20px auto',
                borderRadius: '2px'
            }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            color: '#fff',
            fontSize: '12px',
            fontWeight: '400',
            letterSpacing: '0.1em'
          }}
        >
          EXPERIENCE THE ULTIMATE LUXURY
        </motion.p>
      </div>

      {/* Luxury Loading Bar */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        width: '200px',
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '1px',
        overflow: 'hidden'
      }}>
        <motion.div 
           animate={{ 
             left: ['-100%', '100%']
           }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           style={{
             position: 'absolute',
             width: '50%',
             height: '100%',
             background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
           }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
