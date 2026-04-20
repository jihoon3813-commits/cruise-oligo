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
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1.5fr 1.5fr 1fr 1fr', gap: '80px', marginBottom: '80px' }}>
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>
              {config.logo ? (
                <SafeMedia src={config.logo} style={{ height: '36px', objectFit: 'contain' }} />
              ) : (
                <><Ship className="gold-text" /> <span>OLIGO</span></>
              )}
            </div>
            <p style={{ color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '14px', lineHeight: '1.8', marginBottom: '24px' }}>
              프리미엄 럭셔리 크루즈 멤버십 서비스. 품격 있는 해상 여행의 정수를 올리고크루즈와 함께 경험해 보세요.
            </p>
            {config.footer?.links && config.footer.links.length > 0 && (
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {config.footer.links.map(link => (
                     <a 
                        key={link.id} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: hasLogo ? 'var(--primary)' : '#fff', textDecoration: 'none', border: `1px solid ${hasLogo ? 'var(--primary)' : '#fff'}`, padding: '4px 10px', borderRadius: '4px', opacity: 0.8 }}
                     >
                        {link.label}
                     </a>
                  ))}
               </div>
            )}
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px', color: hasLogo ? 'var(--text-main)' : '#fff' }}>회사 정보</h4>
            <div style={{ color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '13px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {config.footer?.businessInfo || '회사명: 올리고 크루즈\n대표자: 홍길동\n주소: 서울특별시 강남구 테헤란로 123'}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px', color: hasLogo ? 'var(--text-main)' : '#fff' }}>메뉴</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '13px', listStyle: 'none', padding: 0 }}>
              {(config.footer?.menus || []).length > 0 ? (
                config.footer.menus.map(menu => (
                  <li key={menu.id}>
                    <Link to={menu.url} style={{ color: 'inherit', textDecoration: 'none' }}>{menu.label}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>개인정보 처리방침</Link></li>
                  <li><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>이용약관</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '30px', color: hasLogo ? 'var(--text-main)' : '#fff', fontWeight:'700' }}>{config.footer?.csCenter?.title || 'CS CENTER'}</h3>
            <div style={{ color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '14px', lineHeight: '1.8' }}>
               <p style={{ fontSize: '24px', fontWeight: '800', color: hasLogo ? 'var(--primary)' : '#fff', marginBottom: '10px' }}>{config.footer?.csCenter?.phone || '1600-0000'}</p>
               <p>{config.footer?.csCenter?.hours || '운영시간: 평일 09:00 ~ 18:00'}</p>
               <p style={{ fontSize: '12px', marginTop: '4px' }}>{config.footer?.csCenter?.extra || '점심시간: 12:00 ~ 13:00 (토/일/공휴일 휴무)'}</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${hasLogo ? 'var(--border-light)' : 'rgba(255,255,255,0.05)'}`, paddingTop: '40px', display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', color: hasLogo ? '#94a3b8' : '#555', fontSize: '12px', gap: '20px' }}>
          <p>{config.footer?.copyright || '© 2026 올리고크루즈 멤버십. All rights reserved.'}</p>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/admin" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.5, fontSize: '11px' }}>Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
