import React from 'react';
import { Ship, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#050c18', color: '#fff', padding: '100px 0 50px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '50px', marginBottom: '80px' }}>
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>
              <Ship className="gold-text" /> <span>OLIGO</span>
            </div>
            <p style={{ color: '#8c95a1', fontSize: '14px', lineHeight: '1.8' }}>
              Premier luxury cruise membership provider. Discover the world in style with our curated nautical experiences.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#8c95a1', fontSize: '14px' }}>
              <li>About Us</li>
              <li>Membership Benefits</li>
              <li>Cruise Destinations</li>
              <li>Travel Reviews</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px' }}>Support</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#8c95a1', fontSize: '14px' }}>
              <li>Contact Us</li>
              <li>FAQ</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px' }}>Newsletter</h4>
            <p style={{ color: '#8c95a1', fontSize: '14px', marginBottom: '20px' }}>Subscribe to get latest updates and exclusive offers.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                placeholder="Your Email" 
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: '#fff', width: '100%' }} 
              />
              <button className="luxury-button" style={{ padding: '0 20px', fontSize: '12px' }}>Join</button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', fontSize: '12px' }}>
          <p>© 2026 Oligo Cruise Membership. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Instagram size={18} />
            <Facebook size={18} />
            <Twitter size={18} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
