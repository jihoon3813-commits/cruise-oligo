import React, { useState, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Edit, Save, X, Package, CreditCard, Clock, MapPin, Upload, Loader2, Image as ImageIcon, Type, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProductManager = () => {
  const { config, addProduct, updateProduct, deleteProduct, uploadFile } = useConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editTab, setEditTab] = useState('info'); // 'info', 'style'

  const handleEdit = (product) => {
    setCurrentProduct({
      ...product,
      typography: product.typography || {
        title: { fontSize: 24, color: '#0F172A' },
        price: { fontSize: 18, color: '#2563EB' },
        description: { fontSize: 15, color: '#64748B' }
      }
    });
    setEditTab('info');
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({
      title: "",
      description: "",
      price: 0,
      thumbnails: [""],
      paymentType: "full",
      downPayment: 0,
      installments: 12,
      scheduleImage: "",
      typography: {
        title: { fontSize: 24, color: '#0F172A' },
        price: { fontSize: 18, color: '#2563EB' },
        description: { fontSize: 15, color: '#64748B' }
      }
    });
    setEditTab('info');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (currentProduct.id) {
      const { id, _id, _creationTime, ...data } = currentProduct;
      await updateProduct(id, data);
    } else {
      await addProduct(currentProduct);
    }
    setIsEditing(false);
    setCurrentProduct(null);
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

  const MediaInput = ({ label, value, onChange }) => {
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
        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>{label}</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input className="form-control" value={value || ""} onChange={e => onChange(e.target.value)} placeholder="URL 입력 또는 업로드" />
          <button className="luxury-btn outline" style={{ padding: '0 12px' }} onClick={() => fileRef.current.click()} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          </button>
          <input type="file" hidden ref={fileRef} onChange={onFileChange} />
        </div>
      </div>
    );
  };

  const TypographyTool = ({ target, label }) => {
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
               {product.thumbnails?.[0] && <img src={product.thumbnails[0].startsWith('storage:') ? 'https://via.placeholder.com/400x180?text=Uploaded+Media' : product.thumbnails[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
               <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(product)} style={{ background: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}><Edit size={16} color="var(--primary)" /></button>
                  <button onClick={() => handleDelete(product.id)} style={{ background: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}><Trash2 size={16} color="#ef4444" /></button>
               </div>
            </div>
            <div style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>{product.title}</h3>
               <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}><div className="flex items-center gap-1"><MapPin size={14} /> 지중해</div><div className="flex items-center gap-1"><Clock size={14} /> 14일</div></div>
               <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>{product.price?.toLocaleString()}원</span><span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', background: 'var(--bg-sub)', color: 'var(--text-muted)', borderRadius: '6px' }}>{product.paymentType === 'full' ? '일시불' : '분할납부'}</span></div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isEditing && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div className="admin-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800' }}>패키지 정보 편집</h2>
                <button onClick={() => setIsEditing(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                 <button onClick={() => setEditTab('info')} className={`luxury-btn ${editTab === 'info' ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px' }}><Package size={14} style={{marginRight:6}}/> 기본 정보</button>
                 <button onClick={() => setEditTab('style')} className={`luxury-btn ${editTab === 'style' ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px' }}><Type size={14} style={{marginRight:6}}/> 텍스트 스타일</button>
              </div>

              {editTab === 'info' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <div style={{ gridColumn: 'span 2' }}><label className="admin-label">상품명</label><input className="form-control" value={currentProduct.title} onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})} /></div>
                  <div style={{ gridColumn: 'span 2' }}><label className="admin-label">설명</label><textarea className="form-control" value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} rows={3} /></div>
                  <div><label className="admin-label">기준 판매가 (원)</label><input type="number" className="form-control" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: parseInt(e.target.value)})} /></div>
                  <div><label className="admin-label">결제 타입</label><select className="form-control" value={currentProduct.paymentType} onChange={e => setCurrentProduct({...currentProduct, paymentType: e.target.value})}><option value="full">일시불</option><option value="split">분할납부</option></select></div>
                  <div style={{ gridColumn: 'span 2' }}><MediaInput label="대표 썸네일" value={currentProduct.thumbnails[0]} onChange={val => setCurrentProduct({...currentProduct, thumbnails: [val]})} /></div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                   <TypographyTool target="title" label="상품 제목" />
                   <TypographyTool target="price" label="상품 가격" />
                   <TypographyTool target="description" label="상품 설명" />
                </div>
              )}

              <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button className="luxury-btn outline" onClick={() => setIsEditing(false)}>취소</button>
                <button className="luxury-btn" onClick={handleSave}>데이터 반영</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductManager;
