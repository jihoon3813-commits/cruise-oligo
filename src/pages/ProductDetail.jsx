import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { Calendar, CreditCard, Ship, MapPin, ArrowLeft, ChevronRight, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';
import BookingModal from '../components/BookingModal';

const ProductDetail = () => {
  const { id } = useParams();
  const { config } = useConfig();
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const product = config.products.find(p => p.id === id);
  const branding = config.productDetailBranding || {};

  if (!product) return <div className="container" style={{ paddingTop: '160px' }}>상품을 찾을 수 없습니다.</div>;

  const typo = product.typography || {};
  const getStyle = (t, baseSize, scale = 1) => {
    let color = typo[t]?.color;
    if (t === 'title' && branding.titleColor) color = branding.titleColor;
    if (t === 'price' && branding.priceColor) color = branding.priceColor;
    if (t === 'description' && branding.descriptionColor) color = branding.descriptionColor;

    let fontSize = typo[t]?.fontSize ? typo[t].fontSize * scale : parseInt(baseSize);
    if (isMobile) {
        if (t === 'title') fontSize = Math.min(fontSize, 36);
        else if (t === 'description') fontSize = Math.min(fontSize, 16);
        else if (t === 'price') fontSize = Math.min(fontSize, 28);
        else fontSize = fontSize * 0.8;
    }

    return {
      fontSize: `${fontSize}px`,
      color: color,
      fontWeight: t === 'title' || t === 'price' ? '900' : '400'
    };
  };

  const isDark = branding.theme === 'dark';
  const isGlass = branding.theme === 'glass';
  
  const pageBg = isDark ? '#0F172A' : (isGlass ? '#F1F5F9' : '#ffffff');
  const textColor = isDark ? '#F8FAFC' : 'var(--text-main)';
  const mutedColor = isDark ? '#94A3B8' : (branding.descriptionColor || 'var(--text-muted)');
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : (isGlass ? 'rgba(255,255,255,0.7)' : '#ffffff');
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'var(--border-light)';

  const renderSchedule = () => {
    if (product.scheduleImage) {
        return <SafeMedia src={product.scheduleImage} style={{ width: '100%', borderRadius: isMobile ? '24px' : '40px', boxShadow: 'var(--shadow-md)' }} />;
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '40px' }}>
            {(product.schedule || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: isMobile ? '20px' : '40px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: branding.accentColor || 'var(--primary)', minWidth: isMobile ? '50px' : '60px', paddingTop: '4px' }}>DAY 0{item.day}</div>
                    <div>
                        <h4 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', marginBottom: '8px', color: textColor }}>{item.title}</h4>
                        <p style={{ color: mutedColor, fontSize: isMobile ? '14px' : '16px', lineHeight: '1.7' }}>{item.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className="product-detail" style={{ 
      paddingTop: isMobile ? '80px' : '100px', 
      paddingBottom: isMobile ? '40px' : '100px', 
      background: pageBg,
      color: textColor,
      minHeight: '100vh',
      transition: '0.3s'
    }}>
      <div className="container" style={{ padding: isMobile ? '0 20px' : '0' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: isMobile ? '20px' : '32px', fontSize: '13px', color: mutedColor }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
          <ChevronRight size={14} />
          <span style={{ color: textColor, fontWeight: '700' }}>{product.title}</span>
        </div>

        {/* Dynamic Layouts */}
        {branding.layout === 'split' ? (
           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '64px', marginBottom: isMobile ? '40px' : '80px', alignItems: 'center' }}>
              <div style={{ height: isMobile ? '300px' : '600px', borderRadius: isMobile ? '24px' : '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}>
                 <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                 <h1 style={{ ...getStyle('title', '48px', 1.2), lineHeight: '1.2', marginBottom: '16px' }}>{product.title}</h1>
                 <p style={{ ...getStyle('description', '20px', 1.1), lineHeight: '1.7', color: mutedColor }}>{product.description}</p>
              </div>
           </div>
        ) : (
           /* Default/Luxury Layout Header */
           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: isMobile ? '12px' : '24px', height: isMobile ? '400px' : '600px', marginBottom: isMobile ? '40px' : '64px' }}>
             <div style={{ overflow: 'hidden', borderRadius: isMobile ? '20px' : '32px', boxShadow: 'var(--shadow-lg)' }}>
               <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             {!isMobile && (
               <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '24px' }}>
                 <div style={{ overflow: 'hidden', borderRadius: '32px' }}>
                    <SafeMedia src={product.thumbnails[1] || product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }} />
                 </div>
                 <div style={{ background: cardBg, backdropFilter: isGlass ? 'blur(20px)' : 'none', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px solid ${cardBorder}` }}>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: branding.accentColor || 'var(--primary)' }}>+{product.thumbnails.length}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: mutedColor, marginTop: '4px' }}>Photos</span>
                 </div>
               </div>
             )}
           </div>
        )}

        <div style={{ display: (branding.layout === 'modern' || isMobile) ? 'block' : 'grid', gridTemplateColumns: branding.layout === 'modern' ? '1fr' : '1fr 420px', gap: '80px', alignItems: 'start' }}>
          {/* Main Content */}
          <div style={{ maxWidth: branding.layout === 'modern' ? '800px' : 'none', margin: branding.layout === 'modern' ? '0 auto' : '0' }}>
            {branding.layout !== 'split' && <h1 style={{ ...getStyle('title', '56px', 1.2), lineHeight: '1.2', marginBottom: '20px' }}>{product.title}</h1>}
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: isMobile ? '32px' : '48px', flexWrap: 'wrap' }}>
              <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: branding.badgeColor || cardBg, 
                  color: branding.badgeTextColor || textColor,
                  border: branding.badgeColor ? 'none' : `1px solid ${cardBorder}`, 
                  padding: '8px 18px', 
                  borderRadius: '100px', 
                  fontSize: '13px', 
                  fontWeight: '700' 
              }}>
                 <Clock size={14} color={branding.badgeColor ? branding.badgeTextColor : (branding.accentColor || "var(--primary)")} /> 14일 여정
              </div>
              <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: branding.badgeColor || cardBg, 
                  color: branding.badgeTextColor || textColor,
                  border: branding.badgeColor ? 'none' : `1px solid ${cardBorder}`, 
                  padding: '8px 18px', 
                  borderRadius: '100px', 
                  fontSize: '13px', 
                  fontWeight: '700' 
              }}>
                 <Ship size={14} color={branding.badgeColor ? branding.badgeTextColor : (branding.accentColor || "var(--primary)")} /> 럭셔리 크루즈
              </div>
            </div>

            {branding.layout !== 'split' && <p style={{ ...getStyle('description', '20px', 1.1), lineHeight: '1.7', marginBottom: isMobile ? '40px' : '80px', color: mutedColor }}>{product.description}</p>}

            <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: isMobile ? '40px' : '80px', marginBottom: isMobile ? '40px' : '0' }}>
              <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '900', marginBottom: isMobile ? '32px' : '48px', color: branding.sectionTitleColor || textColor }}>상세 여행 데일리 루틴</h2>
              {renderSchedule()}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside style={{ position: (branding.layout === 'modern' || isMobile) ? 'static' : 'sticky', top: '120px', marginTop: (branding.layout === 'modern' || isMobile) ? '40px' : '0' }}>
            <div style={{ 
              padding: isMobile ? '32px' : '48px', 
              borderRadius: isMobile ? '32px' : '40px', 
              background: cardBg,
              backdropFilter: isGlass ? 'blur(30px)' : 'none',
              border: `1px solid ${cardBorder}`,
              boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.5)' : '0 30px 60px rgba(0,0,0,0.08)' 
            }}>
               <div style={{ marginBottom: isMobile ? '32px' : '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: mutedColor }}>총 패키지 금액</span>
                     {product.originalPrice && product.originalPrice > product.price && (
                       <span style={{ fontSize: '13px', fontWeight: '900', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                         {Math.round((1 - product.price / product.originalPrice) * 100)}% 할인 적용
                       </span>
                     )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                     {product.originalPrice && product.originalPrice > product.price && (
                       <span style={{ fontSize: '16px', color: mutedColor, textDecoration: 'line-through', marginBottom: '2px' }}>{product.originalPrice.toLocaleString()}원</span>
                     )}
                     <div style={{ ...getStyle('price', '36px', 1.2) }}>
                        {product.price.toLocaleString()}원
                     </div>
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: isMobile ? '32px' : '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: isDark ? 'rgba(255,255,255,0.03)' : 'var(--bg-sub)', borderRadius: '16px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CreditCard size={18} color={branding.accentColor || "var(--primary)"} />
                        <span style={{ fontWeight: '700', fontSize: '13px' }}>결제 방식</span>
                     </div>
                     <span style={{ fontWeight: '800', fontSize: '13px' }}>{product.paymentType === 'full' ? '일시불 할인가' : '분할 납부형'}</span>
                  </div>
                  {product.paymentType === 'split' && (
                    <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ color: mutedColor }}>착수금</span>
                          <span style={{ fontWeight: '700' }}>{product.downPayment?.toLocaleString()}원</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ color: mutedColor }}>월 분납금</span>
                          <span style={{ fontWeight: '700' }}>{Math.round((product.price - (product.downPayment || 0)) / (product.installments || 1)).toLocaleString()}원 x {product.installments}개월</span>
                       </div>
                    </div>
                  )}
               </div>

               <button 
                  className="luxury-btn" 
                  onClick={() => setIsBookingOpen(true)}
                  style={{ 
                    width: '100%', 
                    padding: '18px', 
                    borderRadius: '16px', 
                    fontSize: '15px', 
                    justifyContent: 'center',
                    background: branding.buttonColor || 'var(--primary)',
                    color: branding.buttonTextColor || '#ffffff'
                  }}
               >
                  전문 상담 신청하기
               </button>
               <p style={{ textAlign: 'center', fontSize: '11px', color: mutedColor, marginTop: '16px' }}>* 전문가 상담 후 최종 예약이 확정됩니다.</p>
            </div>
          </aside>
        </div>
      </div>
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        productTitle={product.title}
        accentColor={branding.buttonColor || 'var(--primary)'}
      />
    </div>
  );
};

export default ProductDetail;
