import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Package, FileText, CheckCircle2, Loader2, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const BookingModal = ({ isOpen, onClose, productTitle, accentColor }) => {
  const { addReservation, config } = useConfig();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPrivacyDetail, setShowPrivacyDetail] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    notes: '',
    agreed: false
  });

  const formatPhone = (val) => {
    const numbers = val.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setForm({ ...form, phone: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.phone.length < 10) {
      alert('이름과 정확한 연락처를 입력해 주세요.');
      return;
    }
    if (!form.agreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }
    setLoading(true);
    try {
      await addReservation({
        name: form.name,
        phone: form.phone,
        notes: form.notes,
        productTitle
      });
      setSuccess(true);
    } catch (err) {
      alert('신청 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  const inputStyle = {
    background: '#f1f5f9', // Lighter background
    border: '1px solid #e2e8f0',
    color: '#0F172A', // Dark text
    padding: '16px',
    borderRadius: '16px',
    fontSize: '15px',
    width: '100%',
    transition: '0.2s',
    outline: 'none'
  };

  const labelStyle = {
    fontSize: '13px', 
    fontWeight: '800', 
    marginBottom: '8px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px',
    color: '#334155' // Darker label for better contrast
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }}
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ position: 'relative', width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.15)' }}
          >
            {success ? (
              <div style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div style={{ padding: '20px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '50%' }}>
                  <CheckCircle2 size={48} />
                </div>
                <div>
                   <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '12px' }}>상담 신청 완료</h2>
                   <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                     럭셔리 크루즈 전문가가 곧 연락드리겠습니다.<br />잠시만 기다려 주세요!
                   </p>
                </div>
                <button className="luxury-btn" onClick={onClose} style={{ width: '100%', marginTop: '12px' }}>확인</button>
              </div>
            ) : (
              <>
                <div style={{ padding: '24px 40px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '900' }}>전문 상담 신청</h2>
                  <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={24} /></button>
                </div>
                
                <form onSubmit={handleSubmit} style={{ padding: '32px 40px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div>
                      <label style={labelStyle}><Package size={14} color={accentColor} /> 신청 상품</label>
                      <input style={{ ...inputStyle, background: '#f8fafc', color: '#64748b', fontWeight: '700' }} value={productTitle} readOnly />
                    </div>

                    <div>
                      <label style={labelStyle}><User size={14} color={accentColor} /> 성함</label>
                      <input 
                        style={inputStyle}
                        placeholder="이름을 입력하세요" 
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={labelStyle}><Phone size={14} color={accentColor} /> 연락처</label>
                      <input 
                        style={inputStyle}
                        type="tel"
                        inputMode="numeric"
                        placeholder="010-0000-0000" 
                        value={form.phone}
                        onChange={handlePhoneChange}
                        required
                      />
                    </div>

                    <div>
                      <label style={labelStyle}><FileText size={14} color={accentColor} /> 비고 (문의사항)</label>
                      <textarea 
                        style={{ ...inputStyle, resize: 'none' }}
                        placeholder="궁금하신 내용을 입력해 주세요" 
                        rows={2} 
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>

                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                           <input type="checkbox" checked={form.agreed} onChange={e => setForm({...form, agreed: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: accentColor }} />
                           개인정보 수집 및 이용 동의
                        </label>
                        <button type="button" onClick={() => setShowPrivacyDetail(true)} style={{ border: 'none', background: 'none', fontSize: '11px', color: '#64748b', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            자세히 보기 <ChevronRight size={12} />
                        </button>
                    </div>

                    <button 
                      type="submit" 
                      className="luxury-btn" 
                      disabled={loading}
                      style={{ 
                        width: '100%', 
                        padding: '18px', 
                        borderRadius: '100px', 
                        justifyContent: 'center', 
                        marginTop: '10px',
                        background: accentColor || 'var(--primary)'
                      }}
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>전문 상담 신청하기 <ArrowRight size={18} style={{ marginLeft: '8px' }} /></>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            <AnimatePresence>
                {showPrivacyDetail && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#fff', zIndex: 10, padding: '40px', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '900' }}>개인정보 수집 및 이용</h3>
                            <button onClick={() => setShowPrivacyDetail(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', fontSize: '13px', lineHeight: '1.7', color: '#475569', background: '#f8fafc', padding: '24px', borderRadius: '20px' }}>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{config.privacyPolicy}</div>
                        </div>
                        <button className="luxury-btn outline" onClick={() => setShowPrivacyDetail(false)} style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}>확인</button>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
