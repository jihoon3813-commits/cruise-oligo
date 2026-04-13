import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

const AdminProductManager = () => {
  const { config, addProduct, updateProduct } = useConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({
      id: `product-${Date.now()}`,
      title: "",
      description: "",
      price: 0,
      thumbnails: [""],
      paymentType: "full",
      downPayment: 0,
      installments: 12,
      schedule: [{ day: 1, title: "", content: "" }],
      scheduleImage: ""
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    const exists = config.products.find(p => p.id === currentProduct.id);
    if (exists) {
      updateProduct(currentProduct.id, currentProduct);
    } else {
      addProduct(currentProduct);
    }
    setIsEditing(false);
    setCurrentProduct(null);
  };

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px' }}>상품 관리</h1>
        <button className="luxury-button" onClick={handleAddNew}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> 상품 등록
          </div>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {config.products.map(product => (
          <div key={product.id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '150px', position: 'relative' }}>
              <img src={product.thumbnails[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                <button 
                  onClick={() => handleEdit(product)}
                  style={{ background: 'white', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                  <Edit size={16} color="var(--primary)" />
                </button>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{product.title}</h3>
              <p className="gold-text" style={{ fontWeight: '700' }}>{product.price.toLocaleString()} KRW</p>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center', padding: '40px' 
        }}>
          <div className="admin-card" style={{ 
            width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '24px' }}>{currentProduct.id.includes('Date') ? '상품 등록' : '상품 수정'}</h2>
              <button onClick={() => setIsEditing(false)}><X size={24} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>상품명</label>
                <input 
                  className="form-control" 
                  value={currentProduct.title} 
                  onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})} 
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>상품 설명</label>
                <textarea 
                  className="form-control" 
                  value={currentProduct.description} 
                  onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>기본 금액 (KRW)</label>
                <input 
                  type="number" className="form-control" 
                  value={currentProduct.price} 
                  onChange={e => setCurrentProduct({...currentProduct, price: parseInt(e.target.value)})} 
                />
              </div>
              <div className="form-group">
                <label>결제 방식 설정</label>
                <select 
                  className="form-control" 
                  value={currentProduct.paymentType}
                  onChange={e => setCurrentProduct({...currentProduct, paymentType: e.target.value})}
                >
                  <option value="full">일시불 할인 방식</option>
                  <option value="split">선금 + 잔금 분할납부 방식</option>
                </select>
              </div>

              {currentProduct.paymentType === 'split' && (
                <>
                  <div className="form-group">
                    <label>선금 (KRW)</label>
                    <input 
                      type="number" className="form-control" 
                      value={currentProduct.downPayment} 
                      onChange={e => setCurrentProduct({...currentProduct, downPayment: parseInt(e.target.value)})} 
                    />
                  </div>
                  <div className="form-group">
                    <label>분할 납부 기간 (개월)</label>
                    <input 
                      type="number" className="form-control" 
                      value={currentProduct.installments} 
                      onChange={e => setCurrentProduct({...currentProduct, installments: parseInt(e.target.value)})} 
                    />
                  </div>
                </>
              )}

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>메인 썸네일 이미지 URL</label>
                <input 
                  className="form-control" 
                  value={currentProduct.thumbnails[0]} 
                  onChange={e => setCurrentProduct({...currentProduct, thumbnails: [e.target.value]})} 
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>일정 요약 이미지 URL (텍스트 일정 대신 사용 시)</label>
                <input 
                  className="form-control" 
                  value={currentProduct.scheduleImage} 
                  onChange={e => setCurrentProduct({...currentProduct, scheduleImage: e.target.value})} 
                  placeholder="이미지 형식의 일정표가 있을 경우 URL을 입력하세요"
                />
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button 
                className="luxury-button outline" 
                onClick={() => setIsEditing(false)}
                style={{ padding: '10px 25px' }}
              >
                취소
              </button>
              <button 
                className="luxury-button" 
                onClick={handleSave}
                style={{ padding: '10px 25px' }}
              >
                상품 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManager;
