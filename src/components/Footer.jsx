import { useConfig } from '../context/ConfigContext';
import SafeMedia from './SafeMedia';
import { Ship } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const context = useConfig();
  const config = context?.config || {};
  const hasLogo = !!config.logo;

  return (
    <footer style={{ 
      background: hasLogo ? '#ffffff' : '#050c18', 
      color: hasLogo ? 'var(--text-main)' : '#fff', 
      padding: '100px 0 50px',
      borderTop: hasLogo ? '1px solid var(--border-light)' : 'none'
    }}>
      <div className="container" style={{ padding: window.innerWidth < 768 ? '0 20px' : '0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1.2fr 1fr 1fr 1.2fr', gap: '50px', marginBottom: '80px' }}>
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>
              {config.logo ? (
                <SafeMedia src={config.logo} style={{ height: '36px', objectFit: 'contain' }} />
              ) : (
                <><Ship className="gold-text" /> <span>OLIGO</span></>
              )}
            </div>
            <p style={{ color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '14px', lineHeight: '1.8' }}>
              프리미엄 럭셔리 크루즈 멤버십 서비스. 품격 있는 해상 여행의 정수를 올리고크루즈와 함께 경험해 보세요.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px', color: hasLogo ? 'var(--text-main)' : '#fff' }}>빠른 링크</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '14px' }}>
              <li>회사 소개</li>
              <li>멤버십 혜택</li>
              <li>크루즈 여행지</li>
              <li>여행 후기</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px', color: hasLogo ? 'var(--text-main)' : '#fff' }}>고객 지원</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '14px' }}>
              <li>문의하기</li>
              <li>자주 묻는 질문</li>
              <li>개인정보 처리방침</li>
              <li>이용 약관</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '30px', color: hasLogo ? 'var(--text-main)' : '#fff', fontWeight:'700' }}>CS CENTER</h3>
            <div style={{ color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '14px', lineHeight: '1.8' }}>
               <p style={{ fontSize: '24px', fontWeight: '800', color: hasLogo ? 'var(--primary)' : '#fff', marginBottom: '10px' }}>1600-0000</p>
               <p>운영시간: 평일 09:00 ~ 18:00</p>
               <p style={{ fontSize: '12px', marginTop: '4px' }}>점심시간: 12:00 ~ 13:00 (토/일/공휴일 휴무)</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${hasLogo ? 'var(--border-light)' : 'rgba(255,255,255,0.05)'}`, paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: hasLogo ? '#94a3b8' : '#555', fontSize: '12px' }}>
          <p>© 2026 올리고크루즈 멤버십. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.5, fontSize: '11px' }}>Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
