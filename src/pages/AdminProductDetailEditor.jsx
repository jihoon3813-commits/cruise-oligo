import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Settings, Image, Type, Palette, Layout, Save, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const THEME_DEFAULTS = {
  light: {
    titleColor: "#0F172A",
    priceColor: "#2563EB",
    descriptionColor: "#64748B",
    accentColor: "#2563EB",
    badgeColor: "#F1F5F9",
    badgeTextColor: "#0F172A",
    sectionTitleColor: "#0F172A",
    buttonColor: "#2563EB",
    buttonTextColor: "#ffffff"
  },
  dark: {
    titleColor: "#f8fafc",
    priceColor: "#60a5fa",
    descriptionColor: "#94a3b8",
    accentColor: "#60a5fa",
    badgeColor: "rgba(255,255,255,0.1)",
    badgeTextColor: "#f8fafc",
    sectionTitleColor: "#f8fafc",
    buttonColor: "#3b82f6",
    buttonTextColor: "#ffffff"
  },
  glass: {
    titleColor: "#1e293b",
    priceColor: "#0891b2",
    descriptionColor: "#475569",
    accentColor: "#0891b2",
    badgeColor: "rgba(255,255,255,0.5)",
    badgeTextColor: "#1e293b",
    sectionTitleColor: "#1e293b",
    buttonColor: "#0e7490",
    buttonTextColor: "#ffffff"
  }
};

const ColorInput = ({ label, value, onChange, placeholder = "#000000" }) => (
  <div className="form-group">
    <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>{label}</label>
    <div style={{ display: 'flex', gap: '10px' }}>
      <input type="color" className="form-control" style={{ width: '50px', height: '42px', padding: '4px', cursor: 'pointer' }} value={value || placeholder} onInput={e => onChange(e.target.value)} />
      <input type="text" className="form-control" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  </div>
);

const AdminProductDetailEditor = () => {
  const { config, updateProductDetailBranding } = useConfig();
  const [form, setForm] = useState(config.productDetailBranding);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (config.productDetailBranding) {
      setForm(config.productDetailBranding);
    }
  }, [config.productDetailBranding]);

  const handleSave = async () => {
    await updateProductDetailBranding(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = (theme) => {
    const targetTheme = theme || form.theme || 'light';
    const defaults = THEME_DEFAULTS[targetTheme];
    if (window.confirm(`${targetTheme === 'light' ? '라이트' : targetTheme === 'dark' ? '다크' : '글래스'} 테마의 기본 색상으로 초기화하시겠습니까?`)) {
      setForm({
        ...form,
        theme: targetTheme,
        ...defaults
      });
    }
  };

  return (
    <div className="admin-editor-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Settings size={24} /></div>
            <div>
               <h2 style={{ fontSize: '20px', fontWeight: '800' }}>상품 상세 페이지 브랜딩</h2>
               <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>개별 상품 페이지의 디자인 테마와 레이아웃을 설정합니다.</p>
            </div>
         </div>
         <div style={{ display: 'flex', gap: '12px' }}>
            <button className="luxury-btn outline" onClick={() => handleReset()} style={{ gap: '8px' }}>
               <RotateCcw size={18} /> 테마 초기화
            </button>
            <button className="luxury-btn" onClick={handleSave} style={{ gap: '8px' }}>
               {saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
               {saveSuccess ? '저장 완료' : '설정 저장'}
            </button>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
         {/* Left: Settings */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <section className="admin-card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Layout size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>레이아웃 & 테마 설정</h3>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  <div className="form-group">
                     <label>페이지 레이아웃</label>
                     <select className="form-control" value={form.layout} onChange={e => setForm({...form, layout: e.target.value})}>
                        <option value="luxury">Luxury (Wide Gallery)</option>
                        <option value="split">Split (Half & Half)</option>
                        <option value="modern">Modern (Centered)</option>
                     </select>
                  </div>
                  <div className="form-group">
                     <label>컬러 테마</label>
                     <select className="form-control" value={form.theme} onChange={e => setForm({...form, theme: e.target.value})}>
                        <option value="light">Light (깔끔한 화이트)</option>
                        <option value="dark">Dark (고급스러운 블랙)</option>
                        <option value="glass">Glass (투명한 유리질감)</option>
                     </select>
                  </div>
               </div>
            </section>

            <section className="admin-card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Palette size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>제목 및 텍스트 컬러</h3>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <ColorInput label="메인 상품명 색상" value={form.titleColor} onChange={val => setForm({...form, titleColor: val})} placeholder="#0F172A" />
                  <ColorInput label="가격 강조 색상" value={form.priceColor} onChange={val => setForm({...form, priceColor: val})} placeholder="#2563EB" />
                  <ColorInput label="본문 설명 색상" value={form.descriptionColor} onChange={val => setForm({...form, descriptionColor: val})} placeholder="#64748B" />
                  <ColorInput label="섹션 제목 색상 (스케줄 등)" value={form.sectionTitleColor} onChange={val => setForm({...form, sectionTitleColor: val})} placeholder="#0F172A" />
                  <ColorInput label="포인트 액센트 컬러" value={form.accentColor} onChange={val => setForm({...form, accentColor: val})} placeholder="#2563EB" />
               </div>
            </section>

            <section className="admin-card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Settings size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>배지 및 버튼 스타일</h3>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <ColorInput label="상단 배지 배경색" value={form.badgeColor} onChange={val => setForm({...form, badgeColor: val})} placeholder="#F1F5F9" />
                  <ColorInput label="상단 배지 글자색" value={form.badgeTextColor} onChange={val => setForm({...form, badgeTextColor: val})} placeholder="#0F172A" />
                  <ColorInput label="주요 버튼 배경색" value={form.buttonColor} onChange={val => setForm({...form, buttonColor: val})} placeholder="#2563EB" />
                  <ColorInput label="주요 버튼 글자색" value={form.buttonTextColor} onChange={val => setForm({...form, buttonTextColor: val})} placeholder="#ffffff" />
               </div>
            </section>

         </div>

         {/* Right: Preview Preview (Simplified) */}
         <div>
            <div style={{ position: 'sticky', top: '120px' }}>
               <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-muted)' }}>미리보기 가이드</h3>
               <div style={{ 
                  background: form.theme === 'dark' ? '#0F172A' : (form.theme === 'glass' ? '#f0f4f8' : '#ffffff'), 
                  padding: '40px', 
                  borderRadius: '32px', 
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                  minHeight: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  transition: '0.3s'
               }}>
                  <div style={{ width: '100%', height: '180px', background: '#e2e8f0', borderRadius: '16px' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <div style={{ fontSize: '24px', fontWeight: '900', color: form.titleColor || "#0F172A" }}>프리미엄 크루즈 상품명</div>
                     <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ padding: '6px 12px', borderRadius: '20px', background: form.badgeColor || '#f1f5f9', color: form.badgeTextColor || '#0F172A', fontSize: '11px', fontWeight: '700' }}>14일 여정</div>
                        <div style={{ padding: '6px 12px', borderRadius: '20px', background: form.badgeColor || '#f1f5f9', color: form.badgeTextColor || '#0F172A', fontSize: '11px', fontWeight: '700' }}>럭셔리 크루즈</div>
                     </div>
                     <div style={{ fontSize: '20px', fontWeight: '800', color: form.priceColor || "#2563EB" }}>₩ 2,500,000</div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ width: '100%', height: '8px', background: form.descriptionColor || '#f1f5f9', opacity: 0.3, borderRadius: '4px' }}></div>
                        <div style={{ width: '80%', height: '8px', background: form.descriptionColor || '#f1f5f9', opacity: 0.3, borderRadius: '4px' }}></div>
                     </div>
                  </div>

                  <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
                     <div style={{ fontSize: '14px', fontWeight: '800', color: form.sectionTitleColor || '#000', marginBottom: '10px' }}>데일리 스케줄 루틴</div>
                     <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                         <div style={{ width: '20px', height: '20px', border: `2px solid ${form.accentColor || '#3b82f6'}`, borderRadius: '50%' }}></div>
                         <div style={{ width: '60px', height: '6px', background: '#eee', borderRadius: '4px' }}></div>
                     </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                     <div style={{ flex: 1, padding: '14px', borderRadius: '100px', background: form.buttonColor || '#2563EB', color: form.buttonTextColor || '#ffffff', fontWeight: '800', textAlign: 'center', fontSize: '14px' }}>예약하기</div>
                     <div style={{ flex: 1, padding: '14px', borderRadius: '100px', border: `1px solid ${form.accentColor || '#2563EB'}`, color: form.accentColor || '#2563EB', fontWeight: '800', textAlign: 'center', fontSize: '14px' }}>장바구니</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminProductDetailEditor;
