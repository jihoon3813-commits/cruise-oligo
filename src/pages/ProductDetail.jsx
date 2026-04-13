import React from 'react';
import { useParams } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { Calendar, CreditCard, Ship, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const { config } = useConfig();
  const product = config.products.find(p => p.id === id);

  if (!product) return <div className="container padding-y">상품을 찾을 수 없습니다.</div>;

  return (
    <div className="product-detail" style={{ paddingTop: '120px' }}>
      <div className="container">
        {/* Header Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', height: '500px', marginBottom: '60px' }}>
          <div style={{ overflow: 'hidden', borderRadius: '4px' }}>
            <img src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '15px' }}>
            <div style={{ overflow: 'hidden', borderRadius: '4px' }}>
              <img src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }} alt="" />
            </div>
            <div style={{ overflow: 'hidden', borderRadius: '4px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="serif" style={{ fontSize: '20px' }}>+{product.thumbnails.length - 1}개 이미지</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '60px' }}>
          {/* Left: Info & Schedule */}
          <div>
            <h1 className="serif" style={{ fontSize: '48px', marginBottom: '20px' }}>{product.title}</h1>
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', color: 'var(--text-light)' }}>
              <div className="flex items-center gap-2"><MapPin size={18} /> 지중해</div>
              <div className="flex items-center gap-2"><Ship size={18} /> 최고급 크루즈</div>
              <div className="flex items-center gap-2"><Calendar size={18} /> 14일 여정</div>
            </div>

            <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-light)', marginBottom: '60px' }}>
              {product.description}
            </p>

            <h2 className="serif" style={{ fontSize: '32px', marginBottom: '30px' }}>여행 일정</h2>
            {product.scheduleImage ? (
              <img src={product.scheduleImage} alt="Schedule" style={{ width: '100%', border: '1px solid #eee' }} />
            ) : (
              <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {product.schedule.map((item, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', left: '-40px', top: '0', width: '20px', height: '20px', 
                      background: 'var(--accent)', borderRadius: '50%', border: '4px solid #fff' 
                    }} />
                    <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Day {item.day}: {item.title}</h3>
                    <p style={{ color: 'var(--text-light)' }}>{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Pricing Sticky */}
          <aside>
            <div style={{ position: 'sticky', top: '120px', background: '#fff', padding: '40px', boxShadow: 'var(--shadow)', borderTop: '4px solid var(--primary)' }}>
              <h3 className="serif" style={{ fontSize: '24px', marginBottom: '30px' }}>예약 상세</h3>
              
              <div style={{ marginBottom: '30px' }}>
                <span style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-light)' }}>총 상품 금액</span>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>
                  {product.price.toLocaleString()} KRW
                </div>
              </div>

              <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '4px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontWeight: '600' }}>
                  <CreditCard size={18} className="gold-text" /> 
                  결제 방식
                </div>
                {product.paymentType === 'full' ? (
                  <p style={{ fontSize: '14px' }}>일시불 결제 시 특별 할인 혜택이 제공됩니다.</p>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px' }}>선금(착수금)</span>
                      <span style={{ fontWeight: '600' }}>{product.downPayment.toLocaleString()} KRW</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px' }}>분할 납부</span>
                      <span style={{ fontWeight: '600' }}>{product.installments}개월</span>
                    </div>
                  </div>
                )}
              </div>

              <button className="luxury-button" style={{ width: '100%' }}>지금 예약하기</button>
              <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '15px', color: '#999' }}>* 취소 규정이 적용됩니다</p>
            </div>
          </aside>
        </div>
      </div>

      <section style={{ background: 'var(--primary)', color: '#fff', padding: '100px 0', marginTop: '100px' }}>
        <div className="container text-center">
            <h2 className="serif" style={{ fontSize: '42px', marginBottom: '20px' }}>여행을 떠날 준비가 되셨나요?</h2>
            <p style={{ opacity: 0.7, marginBottom: '40px' }}>독점적인 혜택과 프라이빗 이벤트를 위해 멤버십에 가입하세요.</p>
            <button className="luxury-button" style={{ background: 'var(--accent)', border: 'none' }}>멤버십 가입하기</button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
