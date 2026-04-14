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
            <h4 style={{ fontSize: '18px', marginBottom: '30px' }}>CS CENTER</h4>
            <div style={{ color: '#8c95a1', fontSize: '14px', lineHeight: '1.8' }}>
               <p style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>1600-0000</p>
               <p>운영시간: 평일 09:00 ~ 18:00</p>
               <p style={{ fontSize: '12px', marginTop: '4px' }}>점심시간: 12:00 ~ 13:00 (토/일/공휴일 휴무)</p>
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
