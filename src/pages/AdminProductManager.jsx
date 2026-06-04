import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Edit, Save, X, Package, CreditCard, Clock, MapPin, Upload, Loader2, Image as ImageIcon, Type, Palette, Layout, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';

const MediaInput = ({ label, value, onChange, placeholder = "URL 입력 또는 업로드", uploadFile }) => {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const storageId = await uploadFile(file);
    onChange(`storage:${storageId}`);
    setLoading(false);
  };
  return (
    <div className="form-group">
      {label && <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>{label}</label>}
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
           <input className="form-control" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
           {value && value.startsWith('storage:') && <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: 'var(--primary)', fontWeight: '700' }}>UPLOADED</div>}
        </div>
        <button className="luxury-btn outline" style={{ padding: '0 12px' }} onClick={() => fileRef.current.click()} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
        </button>
        <input type="file" hidden ref={fileRef} onChange={onFileChange} />
      </div>
    </div>
  );
};

const PriceInput = ({ label, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value ? value.toString() : "");

  useEffect(() => {
    // Only update local value if it's different from the formatted current state
    const currentNum = parseInt(localValue.replace(/[^0-9]/g, "")) || 0;
    if (value !== currentNum) {
      setLocalValue(value ? value.toString() : "");
    }
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setLocalValue(raw);
    const num = parseInt(raw) || 0;
    onChange(num);
  };

  const displayValue = localValue ? parseInt(localValue).toLocaleString() : "";

  return (
    <div className="form-group">
      <label className="admin-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input 
          className="form-control" 
          value={displayValue} 
          onChange={handleChange} 
          placeholder="0" 
          style={{ textAlign: 'right', paddingRight: '40px' }} 
        />
        <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--text-muted)' }}>원</span>
      </div>
    </div>
  );
};

const TypographyTool = ({ target, label, currentProduct, handleTypographyUpdate }) => {
  const typo = currentProduct.typography?.[target] || {};
  const update = (f, v) => handleTypographyUpdate(target, f, v);
  return (
    <div style={{ background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px', marginBottom: '16px' }}>
      <label style={{ fontWeight: 800, fontSize: '13px', marginBottom: '12px', display: 'block' }}>{label} 스타일</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <div className="form-group"><label style={{ fontSize: '11px' }}>폰트 크기 (px)</label><input type="number" className="form-control" value={typo.fontSize || 16} onChange={e => update('fontSize', parseInt(e.target.value))} /></div>
        <div className="form-group"><label style={{ fontSize: '11px' }}>글자 색상</label><input type="color" className="form-control" style={{ height: '38px', padding: 4 }} value={typo.color || '#000000'} onChange={e => update('color', e.target.value)} /></div>
      </div>
    </div>
  );
};

const AdminProductManager = () => {
  const navigate = useNavigate();
  const { config, deleteProduct } = useConfig();

  const handleEdit = (product) => {
    navigate(`/admin/products/${product.id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/products/new');
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 이 상품을 삭제하시겠습니까?')) {
      await deleteProduct(id);
    }
  };

  const handleTypographyUpdate = (target, field, value) => {
    const typo = currentProduct.typography || {};
    const targetTypo = typo[target] || {};
    const updatedTypo = { ...typo, [target]: { ...targetTypo, [field]: value } };
    setCurrentProduct({ ...currentProduct, typography: updatedTypo });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h2 style={{ fontSize: '20px', fontWeight: '800' }}>크루즈 패키지 리스트</h2>
         <button className="luxury-btn" onClick={handleAddNew}><Plus size={16} /> 신규 패키지 등록</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {config.products.map(product => (
          <motion.div key={product.id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ height: '180px', position: 'relative', background: 'var(--bg-sub)' }}>
               {product.thumbnails?.[0] ? (
                 <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               ) : (
                 <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>기본 이미지 없음</div>
               )}
               <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(product)} style={{ background: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}><Edit size={16} color="var(--primary)" /></button>
                  <button onClick={() => handleDelete(product.id)} style={{ background: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}><Trash2 size={16} color="#ef4444" /></button>
               </div>
            </div>
            <div style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>{product.title}</h3>
               <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> 지중해</div><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> 14일</div></div>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   {product.paymentType === 'split' ? (
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>예약금</span>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>{product.downPayment?.toLocaleString()}원</span>
                        <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: '700', marginTop: '2px' }}>* 잔금 여행후 납부</span>
                     </div>
                   ) : (
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {product.originalPrice > 0 && (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '2px' }}>{product.originalPrice.toLocaleString()}원</span>
                        )}
                        <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{product.price?.toLocaleString()}원</span>
                        {product.originalPrice > product.price ? (
                          <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700', marginTop: '2px' }}>* {(product.originalPrice - product.price).toLocaleString()}원 할인됨</span>
                        ) : (
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', marginTop: '2px' }}>* 특별 정가 적용</span>
                        )}
                      </div>
                    )}
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', background: 'var(--bg-sub)', color: 'var(--text-muted)', borderRadius: '6px' }}>{product.paymentType === 'full' ? '일시불' : '분할납부'}</span>
                 </div>
             </div>
           </motion.div>
         ))}
       </div>
     </div>
   );
 };

 export default AdminProductManager;
