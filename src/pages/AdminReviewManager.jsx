import React, { useState, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Star, Trash2, Plus, X, MessageSquare, User, Smile, Upload, Loader2, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MultiMediaInput = ({ label, values = [], onChange, uploadFile }) => {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const storageId = await uploadFile(file);
    const url = `https://rich-fox-61.convex.cloud/api/storage/${storageId}`;
    onChange([...values, url]);
    setLoading(false);
  };

  const removeImage = (idx) => {
    const newValues = values.filter((_, i) => i !== idx);
    onChange(newValues);
  };

  return (
    <div className="form-group" style={{ marginBottom: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>{label} ({values.length})</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginTop: '8px' }}>
        {values.map((url, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
            <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%', padding: '2px', cursor: 'pointer', display: 'flex' }}><X size={10}/></button>
          </div>
        ))}
        <div 
          onClick={() => fileRef.current.click()}
          style={{ aspectRatio: '1', borderRadius: '8px', border: '2px dashed var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--bg-sub)' }}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <PlusCircle size={16} color="var(--text-muted)" />}
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>추가</span>
        </div>
        <input type="file" ref={fileRef} hidden onChange={onFileChange} />
      </div>
    </div>
  );
};

const AdminReviewManager = () => {
  const { config, addReview, deleteReview, uploadFile } = useConfig();
  const [isAdding, setIsAdding] = useState(false);
  const [newReview, setNewReview] = useState({
    author: "",
    rating: 5,
    content: "",
    images: [],
    productTitle: ""
  });

  const handleSave = async () => {
    if (!newReview.author || !newReview.content) {
      alert("작성자명과 내용을 입력해주세요.");
      return;
    }
    try {
      await addReview(newReview);
      setIsAdding(false);
      setNewReview({ author: "", rating: 5, content: "", images: [], productTitle: "" });
    } catch (e) {
      alert("리뷰 등록 실패: " + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h2 style={{ fontSize: '20px', fontWeight: '800' }}>고객 여행 후기 관리</h2>
         <button className="luxury-btn" onClick={() => setIsAdding(true)}>
            <Plus size={16} /> 신규 리뷰 등록
         </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
        {config.reviews.map(review => (
          <motion.div 
            key={review.id} 
            className="admin-card" 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '15px' }}>{review.author || review.user}</h4>
                  <div style={{ display: 'flex', color: 'var(--accent)', marginTop: '2px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < review.rating ? "var(--accent)" : "none"} />)}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteReview(review.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
            </div>
            
            {review.productTitle && <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase' }}>{review.productTitle}</div>}
            
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', background: 'var(--bg-sub)', padding: '16px', borderRadius: '12px' }}>
               "{review.content}"
            </p>

            {review.images && review.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                {review.images.map((img, idx) => (
                  <img key={idx} src={img} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', 
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' 
          }}>
            <motion.div 
              className="admin-card" 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Smile className="text-primary" size={20} />
                  <h2 style={{ fontSize: '20px', fontWeight: '800' }}>새 여행 후기 등록</h2>
                </div>
                <button onClick={() => setIsAdding(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div className="form-group">
                     <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>회원 이름</label>
                     <input 
                       className="form-control" 
                       value={newReview.author}
                       onChange={e => setNewReview({...newReview, author: e.target.value})}
                       placeholder="성함을 입력하세요"
                     />
                   </div>
                   <div className="form-group">
                     <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>만족도 (1-5)</label>
                     <div style={{ display: 'flex', gap: '4px', height: '42px', alignItems: 'center' }}>
                        {[1,2,3,4,5].map(s => (
                           <Star key={s} size={24} onClick={() => setNewReview({...newReview, rating: s})} fill={s <= newReview.rating ? "var(--accent)" : "none"} color="var(--accent)" style={{ cursor: 'pointer' }} />
                        ))}
                     </div>
                   </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>관련 상품명 (선택)</label>
                  <input 
                    className="form-control" 
                    value={newReview.productTitle}
                    onChange={e => setNewReview({...newReview, productTitle: e.target.value})}
                    placeholder="예: 싱가포르 3박 4일 프리미엄"
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>후기 내용</label>
                  <textarea 
                    className="form-control" rows={5}
                    value={newReview.content}
                    onChange={e => setNewReview({...newReview, content: e.target.value})}
                    placeholder="소중한 여행 경험을 공유해주세요."
                  />
                </div>

                <MultiMediaInput 
                  label="여행 사진 업로드 (여러장 가능)" 
                  values={newReview.images} 
                  onChange={v => setNewReview({...newReview, images: v})} 
                  uploadFile={uploadFile} 
                />

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button className="luxury-btn outline" style={{ flex: 1, borderRadius: '10px' }} onClick={() => setIsAdding(false)}>취소</button>
                  <button className="luxury-btn" style={{ flex: 1, borderRadius: '10px' }} onClick={handleSave}>후기 저장하기</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviewManager;
