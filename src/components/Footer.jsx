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
              프리미엄 럭셔리 크루즈 멤버십 서비스. 품격 있는 해상 여행의 정수를 올리고크루즈와 함께 경험해 보세요.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px' }}>빠른 링크</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#8c95a1', fontSize: '14px' }}>
              <li>회사 소개</li>
              <li>멤버십 혜택</li>
              <li>크루즈 여행지</li>
              <li>여행 후기</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px' }}>고객 지원</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#8c95a1', fontSize: '14px' }}>
              <li>문의하기</li>
              <li>자주 묻는 질문</li>
              <li>개인정보 처리방침</li>
              <li>이용 약관</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px' }}>뉴스레터</h4>
            <p style={{ color: '#8c95a1', fontSize: '14px', marginBottom: '20px' }}>뉴스레터를 구독하고 최신 소식과 독점 혜택을 받아보세요.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                placeholder="이메일 주소" 
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: '#fff', width: '100%' }} 
              />
              <button className="luxury-button" style={{ padding: '0 20px', fontSize: '12px' }}>구독</button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', fontSize: '12px' }}>
          <p>© 2026 올리고크루즈 멤버십. All rights reserved.</p>
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
