import React from 'react';
import { useParams } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { Calendar, CreditCard, Ship, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';

const ProductDetail = () => {
  const { id } = useParams();
  const { config } = useConfig();
  const product = config.products.find(p => p.id === id);

  if (!product) return <div className="container padding-y" style={{ paddingTop: '160px' }}>상품을 찾을 수 없습니다.</div>;

  return (
    <div className="product-detail" style={{ paddingTop: '120px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        {/* Header Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', height: '550px', marginBottom: '60px' }}>
          <div style={{ overflow: 'hidden', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
            <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '20px' }}>
            <div style={{ overflow: 'hidden', borderRadius: '24px' }}>
              <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} alt="" />
            </div>
            <div style={{ overflow: 'hidden', borderRadius: '24px', background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>+{product.thumbnails.length} Photos</span>
            </div>
          </d          {/* Left: Info & Schedule */}
          <div>
            <h1 style={{ 
                fontSize: product.typography?.title?.fontSize ? `${product.typography.title.fontSize * 1.5}px` : '56px', 
                color: product.typography?.title?.color, 
                fontWeight: '800', marginBottom: '24px' 
            }}>{product.title}</h1>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '48px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '600' }}>
              <div className="flex items-center gap-2" style={{ background: 'var(--bg-sub)', padding: '8px 16px', borderRadius: '100px' }}><MapPin size={18} /> 지중해</div>
              <div className="flex items-center gap-2" style={{ background: 'var(--bg-sub)', padding: '8px 16px', borderRadius: '100px' }}><Ship size={18} /> 최고급 크루즈</div>
              <div className="flex items-center gap-2" style={{ background: 'var(--bg-sub)', padding: '8px 16px', borderRadius: '100px' }}><Calendar size={18} /> 14일 여정</div>
            </div>

            <p style={{ 
                fontSize: product.typography?.description?.fontSize ? `${product.typography.description.fontSize * 1.2}px` : '20px', 
                color: product.typography?.description?.color || 'var(--text-muted)', 
                lineHeight: '1.8', marginBottom: '80px' 
            }}>
              {product.description}
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '40px' }}>럭셔리 여행 일정</h2>
            {product.scheduleImage ? (
              <SafeMedia src={product.scheduleImage} style={{ width: '100%', borderRadius: '32px', border: '1px solid var(--border-light)' }} />
            ) : (
              <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {(product.schedule || []).map((item, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', left: '-53px', top: '4px', width: '24px', height: '24px', 
                      background: 'var(--primary)', borderRadius: '50%', border: '5px solid #fff', boxShadow: '0 0 0 2px var(--primary)'
                    }} />
                    <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Day {item.day}: {item.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6' }}>{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Pricing Sticky */}
          <aside>
            <div style={{ position: 'sticky', top: '120px', background: '#fff', padding: '48px', borderRadius: '32px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '32px' }}>예약 요약</h3>
              
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>총 상품 금액</span>
                <div style={{ 
                    fontSize: product.typography?.price?.fontSize ? `${product.typography.price.fontSize * 1.5}px` : '36px', 
                    color: product.typography?.price?.color || 'var(--primary)', 
                    fontWeight: '900', marginTop: '8px' 
                }}>
                  {product.price.toLocaleString()}원
                </div>
              </div>
roduct.price.toLocaleString()}원
                </div>
              </div>

              <div style={{ padding: '24px', background: 'var(--bg-sub)', borderRadius: '20px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontWeight: '800', fontSize: '15px' }}>
                  <CreditCard size={18} className="text-primary" /> 
                  결제 정책 상세
                </div>
                {product.paymentType === 'full' ? (
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>일시불 결제 시 즉시 예약 확정 및 프리미엄 라운지 이용권이 제공됩니다.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>선불 계약금</span>
                      <span style={{ fontWeight: '800', fontSize: '16px' }}>{product.downPayment.toLocaleString()}원</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>납부 기간</span>
                      <span style={{ fontWeight: '800', fontSize: '16px' }}>최대 {product.installments}개월</span>
                    </div>
                  </div>
                )}
              </div>

              <button className="luxury-btn" style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px' }}>지금 예약 신청하기</button>
              <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '20px', color: 'var(--text-muted)' }}>* 상담원 확인 후 최종 예약이 확정됩니다.</p>
            </div>
          </aside>
        </div>
      </div>

      <section style={{ background: 'var(--bg-sub)', padding: '120px 0', marginTop: '120px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px' }}>특별한 여행을 시작할 준비가 되셨나요?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '48px' }}>올리고 크루즈 멤버십만을 위한 독점적인 서비스가 기다리고 있습니다.</p>
            <button className="luxury-btn" style={{ padding: '16px 48px' }}>멤버십 가입 문의</button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
