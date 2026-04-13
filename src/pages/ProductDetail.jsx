import React from 'react';
import { useParams } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { Calendar, CreditCard, Ship, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const { config } = useConfig();
  const product = config.products.find(p => p.id === id);

  if (!product) return <div className="container padding-y">Product not found.</div>;

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
              <span className="serif" style={{ fontSize: '20px' }}>+{product.thumbnails.length - 1} Images</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '60px' }}>
          {/* Left: Info & Schedule */}
          <div>
            <h1 className="serif" style={{ fontSize: '48px', marginBottom: '20px' }}>{product.title}</h1>
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', color: 'var(--text-light)' }}>
              <div className="flex items-center gap-2"><MapPin size={18} /> Mediterranean</div>
              <div className="flex items-center gap-2"><Ship size={18} /> Ultra Luxury Ship</div>
              <div className="flex items-center gap-2"><Calendar size={18} /> 14 Days</div>
            </div>

            <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-light)', marginBottom: '60px' }}>
              {product.description}
            </p>

            <h2 className="serif" style={{ fontSize: '32px', marginBottom: '30px' }}>Travel Schedule</h2>
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
              <h3 className="serif" style={{ fontSize: '24px', marginBottom: '30px' }}>Booking Details</h3>
              
              <div style={{ marginBottom: '30px' }}>
                <span style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-light)' }}>Total Price</span>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>
                  {product.price.toLocaleString()} KRW
                </div>
              </div>

              <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '4px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontWeight: '600' }}>
                  <CreditCard size={18} className="gold-text" /> 
                  Payment Options
                </div>
                {product.paymentType === 'full' ? (
                  <p style={{ fontSize: '14px' }}>Enjoy a special discount for one-time full payments.</p>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px' }}>Down Payment</span>
                      <span style={{ fontWeight: '600' }}>{product.downPayment.toLocaleString()} KRW</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px' }}>Installments</span>
                      <span style={{ fontWeight: '600' }}>{product.installments} Months</span>
                    </div>
                  </div>
                )}
              </div>

              <button className="luxury-button" style={{ width: '100%' }}>Book Now</button>
              <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '15px', color: '#999' }}>* Cancellation policies apply</p>
            </div>
          </aside>
        </div>
      </div>

      <section style={{ background: 'var(--primary)', color: '#fff', padding: '100px 0', marginTop: '100px' }}>
        <div className="container text-center">
            <h2 className="serif" style={{ fontSize: '42px', marginBottom: '20px' }}>Ready for a journey?</h2>
            <p style={{ opacity: 0.7, marginBottom: '40px' }}>Join our membership for exclusive deals and private events.</p>
            <button className="luxury-button" style={{ background: 'var(--accent)', border: 'none' }}>Join Membership</button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
