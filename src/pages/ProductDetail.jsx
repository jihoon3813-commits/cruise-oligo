import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { Calendar, CreditCard, Ship, MapPin, ArrowLeft, ChevronRight, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';

const ProductDetail = () => {
  const { id } = useParams();
  const { config } = useConfig();
  const product = config.products.find(p => p.id === id);

  if (!product) return <div className="container" style={{ paddingTop: '160px' }}>상품을 찾을 수 없습니다.</div>;

  const typo = product.typography || {};
  const getStyle = (t, baseSize, scale = 1) => ({
    fontSize: typo[t]?.fontSize ? `${typo[t].fontSize * scale}px` : baseSize,
    color: typo[t]?.color,
    fontWeight: t === 'title' || t === 'price' ? '900' : '400'
  });

  return (
    <div className="product-detail" style={{ paddingTop: '100px', paddingBottom: '100px', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '32px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{product.title}</span>
        </div>

        {/* Gallery Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', height: '600px', marginBottom: '64px' }}>
          <div style={{ overflow: 'hidden', borderRadius: '32px', boxShadow: 'var(--shadow-lg)' }}>
            <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '24px' }}>
            <div style={{ overflow: 'hidden', borderRadius: '32px' }}>
               <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
            </div>
            <div style={{ background: 'var(--bg-sub)', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
               <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>+{product.thumbnails.length}</span>
               <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginTop: '4px' }}>Photos</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '80px', alignItems: 'start' }}>
          {/* Main Content */}
          <div>
            <h1 style={{ ...getStyle('title', '64px', 1.2), lineHeight: '1.1', marginBottom: '24px' }}>{product.title}</h1>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sub)', padding: '10px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: '700' }}>
                 <Clock size={16} color="var(--primary)" /> 14일 여정
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sub)', padding: '10px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: '700' }}>
                 <Ship size={16} color="var(--primary)" /> 럭셔리 크루즈
              </div>
            </div>

            <p style={{ ...getStyle('description', '22px', 1.1), lineHeight: '1.8', marginBottom: '80px' }}>
              {product.description}
            </p>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '80px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '48px' }}>상세 여행 데일리 루틴</h2>
              {product.scheduleImage ? (
                <SafeMedia src={product.scheduleImage} style={{ width: '100%', borderRadius: '40px', boxShadow: 'var(--shadow-md)' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                   {(product.schedule || []).map((item, i) => (
                     <div key={i} style={{ display: 'flex', gap: '40px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary)', minWidth: '60px', paddingTop: '6px' }}>DAY 0{item.day}</div>
                        <div>
                           <h4 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>{item.title}</h4>
                           <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{item.content}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside style={{ position: 'sticky', top: '120px' }}>
            <div className="admin-card" style={{ padding: '48px', borderRadius: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.08)' }}>
               <div style={{ marginBottom: '40px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>총 패키지 금액</span>
                  <div style={{ ...getStyle('price', '42px', 1.2), marginTop: '8px' }}>
                     {product.price.toLocaleString()}원
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'var(--bg-sub)', borderRadius: '20px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CreditCard size={20} color="var(--primary)" />
                        <span style={{ fontWeight: '700', fontSize: '14px' }}>결제 방식</span>
                     </div>
                     <span style={{ fontWeight: '800', fontSize: '14px' }}>{product.paymentType === 'full' ? '일시불 할인가' : '분할 납부형'}</span>
                  </div>
                  {product.paymentType === 'split' && (
                    <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>착수금</span>
                          <span style={{ fontWeight: '700' }}>{product.downPayment?.toLocaleString()}원</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>월 분납금</span>
                          <span style={{ fontWeight: '700' }}>{Math.round((product.price - (product.downPayment || 0)) / (product.installments || 1)).toLocaleString()}원 x {product.installments}개월</span>
                       </div>
                    </div>
                  )}
               </div>

               <button className="luxury-btn" style={{ width: '100%', padding: '20px', borderRadius: '20px', fontSize: '16px', justifyContent: 'center' }}>
                  지금 바로 예약하기
               </button>
               <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px' }}>* 전문가 상담 후 최종 예약이 확정됩니다.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
