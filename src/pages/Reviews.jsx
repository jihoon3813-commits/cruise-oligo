import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Reviews = () => {
  const { config } = useConfig();

  return (
    <div className="reviews-page" style={{ paddingTop: '150px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="section-title">생생한 여행 후기</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '18px' }}>잊지 못할 여정을 경험한 회원님들의 생생한 이야기를 확인해 보세요.</p>
        </div>

        <div style={{ columns: '2 400px', columnGap: '30px' }}>
          {config.reviews.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{ 
                breakInside: 'avoid', marginBottom: '30px', background: '#fff', 
                padding: '40px', borderRadius: '4px', boxShadow: 'var(--shadow)',
                position: 'relative'
              }}
            >
              <Quote size={40} className="gold-text" style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.1 }} />
              
              <div style={{ display: 'flex', color: 'var(--accent)', marginBottom: '20px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < review.rating ? "var(--accent)" : "none"} />)}
              </div>

              <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '30px', fontStyle: 'italic' }}>"{review.content}"</p>

              {review.images && review.images[0] && (
                <div style={{ marginBottom: '30px', height: '200px', overflow: 'hidden', borderRadius: '4px' }}>
                    <img src={review.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700' }}>
                  {review.user.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontWeight: '700' }}>{review.user}</h4>
                  <span style={{ fontSize: '12px', color: '#999' }}>정식 회원</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
