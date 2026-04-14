import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon, Palette, Type, Link as LinkIcon, Upload, Loader2, Play, ChevronUp, ChevronDown, Check, X, Settings2, Grid, List, Activity, MoveVertical, MousePointerClick, Sun, Moon, Coffee, Cloud, Target, Droplets, Package, Layout, Sparkles, PlusCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components moved outside to prevent remounting on every state update ---

const MediaInput = ({ label, value, onChange, uploadFile }) => {
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
    <div className="form-group" style={{ marginBottom: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <input className="form-control" value={value || ""} onChange={e => onChange(e.target.value)} placeholder="URL 또는 업로드" />
        <button className="luxury-btn outline" style={{ padding: '0 12px' }} onClick={() => fileRef.current.click()} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
        </button>
        <input type="file" ref={fileRef} hidden onChange={onFileChange} />
      </div>
    </div>
  );
};

const MultiMediaInput = ({ label, values = [], onChange, uploadFile }) => {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const storageId = await uploadFile(file);
    onChange([...values, `storage:${storageId}`]);
    setLoading(false);
  };

  const removeImage = (idx) => {
    const newValues = values.filter((_, i) => i !== idx);
    onChange(newValues);
  };

  return (
    <div className="form-group" style={{ marginBottom: '16px', gridColumn: 'span 2' }}>
      <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>{label} ({values.length})</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px', marginTop: '12px' }}>
        {values.map((url, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
            <img src={url.startsWith('storage:') ? `https://rich-fox-61.convex.cloud/api/storage/${url.split(':')[1]}` : url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex' }}><X size={12}/></button>
          </div>
        ))}
        <div 
          onClick={() => fileRef.current.click()}
          style={{ aspectRatio: '1', borderRadius: '8px', border: '2px dashed var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--bg-sub)' }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} color="var(--text-muted)" />}
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>추가</span>
        </div>
        <input type="file" ref={fileRef} hidden onChange={onFileChange} />
      </div>
    </div>
  );
};

const TypographyTool = ({ data, target, onUpdate, showStyle = false }) => {
  const typo = data.typography?.[target] || {};
  const update = (field, val) => onUpdate(target, field, val);
  
  const aboveStyles = [
    { id: 'none', label: '기본 (None)' },
    { id: 'box', label: '둥근 박스 (Box)' },
    { id: 'wavy', label: '움직이는 텍스트 (Wavy)' },
  ];
  
  const belowStyles = [
    { id: 'none', label: '기본 (None)' },
    { id: 'box', label: '둥근 박스 (Box)' },
    { id: 'italic', label: '기울이기 (Italic)' },
  ];

  const currentStyles = target === 'above' ? aboveStyles : belowStyles;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: 700 }}>색상</label>
          <input 
            type="color" 
            className="form-control" 
            style={{ height: '38px', padding: 4, cursor: 'pointer' }} 
            value={typo.color || '#0F172A'} 
            onChange={e => update('color', e.target.value)}
            onClick={e => e.stopPropagation()}
          />
        </div>
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>크기</label><input type="number" className="form-control" value={typo.fontSize || 16} onChange={e => update('fontSize', parseInt(e.target.value))} onClick={e => e.stopPropagation()} /></div>
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>정렬</label><select className="form-control" value={typo.textAlign || 'left'} onChange={e => update('textAlign', e.target.value)} onClick={e => e.stopPropagation()}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
      </div>
      {showStyle && (
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px', display: 'block' }}>텍스트 스타일 효과</label>
          <div style={{ display: 'flex', gap: '8px' }}>
             {currentStyles.map(s => (
               <button 
                 key={s.id} 
                 onClick={() => update('style', s.id)}
                 style={{ 
                   flex: 1, padding: '8px', fontSize: '11px', borderRadius: '8px', 
                   border: typo.style === s.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                   background: typo.style === s.id ? '#fff' : 'transparent',
                   fontWeight: typo.style === s.id ? '800' : '400',
                   cursor: 'pointer'
                 }}
               >
                 {s.label}
               </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CATEGORIES = [
  { id: 'theme', name: '전체 디자인 테마', icon: <Palette size={20} /> },
  { id: 'hero', name: '히어로 섹션 편집', icon: <Layout size={20} /> },
  { id: 'sections', name: '홍보 섹션 상세 관리', icon: <Layers size={20} /> },
  { id: 'productList', name: '상품 리스트 브랜딩', icon: <Package size={20} /> },
  { id: 'reviews', name: '여행후기 섹션 브랜딩', icon: <Activity size={20} /> },
];

const THEMES = [
  { id: 'white', label: 'Pure White', icon: <Sun size={14}/>, color: '#2563EB' },
  { id: 'midnight', label: 'Midnight', icon: <Moon size={14}/>, color: '#D4AF37' },
  { id: 'cream', label: 'Creamy Sand', icon: <Coffee size={14}/>, color: '#8B4513' },
  { id: 'grey', label: 'Cool Grey', icon: <Cloud size={14}/>, color: '#0D9488' },
  { id: 'lavender', label: 'Lavender', icon: <Target size={14}/>, color: '#7C3AED' },
  { id: 'ocean', label: 'Ocean Breeze', icon: <Droplets size={14}/>, color: '#0284C7' }
];

const AdminHomeEditor = () => {
  const { config, updateHero, updateTheme, updateSection, addSection, deleteSection, uploadFile, updateProductBranding, updateReviewBranding } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);
  const [productBrandingForm, setProductBrandingForm] = useState(config.productListBranding);
  const [reviewBrandingForm, setReviewBrandingForm] = useState(config.reviewSectionBranding);
  const [activeCategory, setActiveCategory] = useState('theme'); 
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [heroTab, setHeroTab] = useState('style');
  const [editTab, setEditTab] = useState('style'); 

  useEffect(() => {
    if (config.hero) setHeroForm(config.hero);
    if (config.productListBranding) setProductBrandingForm(config.productListBranding);
    if (config.reviewSectionBranding) setReviewBrandingForm(config.reviewSectionBranding);
  }, [config]);

  const handleHeroSave = async () => {
    try {
      const { productListBranding, reviewSectionBranding, ...cleanHero } = heroForm;
      await updateHero(cleanHero);
      alert('홈페이지 히어로 설정이 저장되었습니다.');
    } catch (e) {
      alert('저장 실패: ' + e.message);
    }
  };

  const handleProductBrandingSave = async () => {
    try {
      if (!productBrandingForm) throw new Error("브랜딩 데이터가 없습니다.");
      await updateProductBranding(productBrandingForm);
      alert('상품 리스트 브랜딩 설정이 저장되었습니다.');
    } catch (e) {
      alert('저장 실패: ' + e.message);
    }
  };

  const handleReviewBrandingSave = async () => {
    try {
      if (!reviewBrandingForm) throw new Error("리뷰 브랜딩 데이터가 없습니다.");
      await updateReviewBranding(reviewBrandingForm);
      alert('여행후기 섹션 브랜딩 설정이 저장되었습니다.');
    } catch (e) {
      alert('저장 실패: ' + e.message);
    }
  };

  const handleThemeChange = async (theme) => {
    await updateTheme(theme);
  };

  const handleHeroTypoUpdate = (target, field, value) => {
    const typo = heroForm.typography || {};
    const targetTypo = typo[target] || {};
    const updatedTypo = { ...typo, [target]: { ...targetTypo, [field]: value } };
    setHeroForm({ ...heroForm, typography: updatedTypo });
  };

  const handleSectionUpdate = async (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    if (!section) return;
    await updateSection(id, { ...section, [field]: value });
  };

  const handleTypographyUpdate = async (id, target, field, value) => {
    const section = config.sections.find(s => s.id === id);
    if (!section) return;
    const typo = section.typography || {};
    const targetTypo = typo[target] || {};
    const updatedTypo = { ...typo, [target]: { ...targetTypo, [field]: value } };
    await updateSection(id, { ...section, typography: updatedTypo });
  };

  const handleMoveSection = async (id, direction) => {
    const idx = config.sections.findIndex(s => s.id === id);
    if (direction === 'up' && idx > 0) {
      const current = config.sections[idx];
      const prev = config.sections[idx - 1];
      await updateSection(current.id, { ...current, order: idx - 1 });
      await updateSection(prev.id, { ...prev, order: idx });
    } else if (direction === 'down' && idx < config.sections.length - 1) {
      const current = config.sections[idx];
      const next = config.sections[idx + 1];
      await updateSection(current.id, { ...current, order: idx + 1 });
      await updateSection(next.id, { ...next, order: idx });
    }
  };

  const handleRemoveSection = async (id) => {
    if (window.confirm('이 섹션을 삭제하시겠습니까?')) {
      await deleteSection(id);
    }
  };

  const handleAddNewSection = async () => {
    await addSection({
      title: "새로운 섹션",
      content: "섹션 설명을 입력하세요.",
      image: "",
      images: [],
      layout: "left",
      style: "classic",
      items: [],
      typography: {
        title: { fontSize: 42, color: "#0F172A", textAlign: "left" },
        content: { fontSize: 18, color: "#64748B", textAlign: "left" }
      },
      showButton: true,
      buttonText: "자세히 보기",
      buttonLink: "",
      buttonStyles: { size: "medium", bgColor: "#2563EB", textColor: "#ffffff", borderColor: "#2563EB" },
      bgColor: "#ffffff",
      bgType: "color",
      bgOpacity: 1,
      paddingTop: 120,
      paddingBottom: 120
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '8px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveCategory(cat.id)}
            className={`luxury-btn ${activeCategory === cat.id ? '' : 'outline'}`}
            style={{ padding: '10px 24px', whiteSpace: 'nowrap', borderRadius: '12px', gap: '8px' }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeCategory === 'theme' && (
            <section className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                 <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Palette size={24} /></div>
                 <h2 style={{ fontSize: '20px', fontWeight: '800' }}>홈페이지 전체 디자인 테마</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                 {THEMES.map(t => (
                   <button key={t.id} onClick={() => handleThemeChange(t.id)} style={{ padding: '24px', borderRadius: '20px', border: config.theme === t.id ? '2px solid var(--primary)' : '1px solid var(--border-light)', background: config.theme === t.id ? 'var(--bg-sub)' : '#fff', cursor: 'pointer', textAlign: 'center', transition: '0.3s' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: t.color, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{t.icon}</div>
                      <span style={{ fontWeight: '800', fontSize: '15px', display: 'block' }}>{t.label}</span>
                      {config.theme === t.id && <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', marginTop: '4px', display: 'block' }}>현재 적용됨</span>}
                   </button>
                 ))}
              </div>
            </section>
          )}

          {activeCategory === 'hero' && (
            <section className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Layout size={24} /></div>
                    <h2 style={{ fontSize: '20px', fontWeight: '800' }}>히어로 섹션 (대문) 설정</h2>
                 </div>
                 <button className="luxury-btn" onClick={handleHeroSave}><Save size={18} /> 설정 저장</button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto' }}>
                 {['style', 'content', 'visual', 'typography', 'buttons'].map(t => (
                   <button key={t} onClick={() => setHeroTab(t)} className={`luxury-btn ${heroTab === t ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '11px' }}>{t.toUpperCase()}</button>
                 ))}
              </div>

              <div style={{ background: 'var(--bg-sub)', padding: '32px', borderRadius: '24px' }}>
                 {heroTab === 'style' && (
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {['classic', 'full-bg', 'split', 'card', 'minimal', 'video-focus'].map(s => (
                        <div key={s} onClick={() => setHeroForm({...heroForm, style: s})} style={{ padding: '20px', borderRadius: '16px', background: '#fff', border: heroForm?.style === s ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}><p style={{ fontSize: '12px', fontWeight: '700' }}>{s.toUpperCase()}</p></div>
                      ))}
                   </div>
                 )}

                 {heroTab === 'content' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                       <div className="form-group"><label>상단 강조 문구</label><input className="form-control" value={heroForm?.aboveTitle || ""} onChange={e => setHeroForm({...heroForm, aboveTitle: e.target.value})} /></div>
                       <div className="form-group"><label>메인 타이틀</label><textarea className="form-control" value={heroForm?.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} rows={3} /></div>
                       <div className="form-group"><label>서브 타이틀</label><textarea className="form-control" value={heroForm?.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} rows={2} /></div>
                       <div className="form-group"><label>하단 상세 문구</label><input className="form-control" value={heroForm?.belowTitle || ""} onChange={e => setHeroForm({...heroForm, belowTitle: e.target.value})} /></div>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div className="form-group"><label>가로 정렬</label><select className="form-control" value={heroForm?.textPosition} onChange={e => setHeroForm({...heroForm, textPosition: e.target.value})}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                          <div className="form-group"><label>세로 정렬</label><select className="form-control" value={heroForm?.verticalAlign || "middle"} onChange={e => setHeroForm({...heroForm, verticalAlign: e.target.value})}><option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option></select></div>
                       </div>
                       <div className="form-group" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                          <label>좌우 여백 (px) - {heroForm?.paddingX ?? 80}px</label>
                          <input type="range" min="0" max="250" step="10" className="form-control" value={heroForm?.paddingX ?? 80} onChange={e => setHeroForm({...heroForm, paddingX: parseInt(e.target.value)})} />
                       </div>
                    </div>
                 )}

                 {heroTab === 'visual' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                       <MediaInput label="배경 미디어" value={heroForm?.bgUrl} onChange={v => setHeroForm({...heroForm, bgUrl: v})} uploadFile={uploadFile} />
                       <div className="form-group"><label>배경 타입</label><select className="form-control" value={heroForm?.bgType} onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}><option value="image">Image</option><option value="video">Video</option></select></div>
                       <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label>배경 밝기 ({heroForm?.bgOpacity ?? 1}) (0:어둡게, 1:보통, 2:밝게)</label>
                          <input type="range" min="0" max="2" step="0.1" className="form-control" value={heroForm?.bgOpacity ?? 1} onChange={e => setHeroForm({...heroForm, bgOpacity: parseFloat(e.target.value)})} />
                       </div>
                    </div>
                 )}

                 {heroTab === 'typography' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                       <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={16} color="var(--primary)" /> 상단 강조 문구 스타일 (Above)</label><TypographyTool data={heroForm} target="above" onUpdate={handleHeroTypoUpdate} showStyle={true} /></div>
                       <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>메인 타이틀 폰트 (Title)</label><TypographyTool data={heroForm} target="title" onUpdate={handleHeroTypoUpdate} /></div>
                       <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>서브 타이틀 폰트 (Subtitle)</label><TypographyTool data={heroForm} target="subtitle" onUpdate={handleHeroTypoUpdate} /></div>
                       <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={16} color="var(--primary)" /> 하단 상세 문구 스타일 (Below)</label><TypographyTool data={heroForm} target="below" onUpdate={handleHeroTypoUpdate} showStyle={true} /></div>
                    </div>
                 )}

                 {heroTab === 'buttons' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontWeight: 800 }}>히어로 버튼 구성 (최대 2개)</label>
                          <button className="luxury-btn outline" onClick={() => {
                            const btns = heroForm.buttons || [];
                            if (btns.length >= 2) return;
                            const newBtn = { id: Date.now().toString(), text: "지금 시작하기", link: "/", show: true, style: { size: "medium", bgColor: "#2563EB", textColor: "#ffffff", borderColor: "#2563EB" } };
                            setHeroForm({ ...heroForm, buttons: [...btns, newBtn] });
                          }}><Plus size={14} /> 버튼 추가</button>
                       </div>
                       
                       <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px dashed var(--border-light)', textAlign: 'center' }}>
                          <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', display: 'block' }}>실시간 버튼 디자인 미리보기</label>
                          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                             {(heroForm.buttons && heroForm.buttons.length > 0) ? (
                               heroForm.buttons.map(btn => (
                                 <div 
                                   key={btn.id}
                                   style={{ 
                                     padding: btn.style?.size === 'large' ? '16px 40px' : (btn.style?.size === 'small' ? '8px 20px' : '12px 32px'),
                                     background: btn.style?.bgColor || 'var(--primary)',
                                     color: btn.style?.textColor || '#fff',
                                     border: `2px solid ${btn.style?.borderColor || btn.style?.bgColor || 'var(--primary)'}`,
                                     borderRadius: '100px',
                                     fontWeight: '800',
                                     fontSize: btn.style?.size === 'large' ? '16px' : (btn.style?.size === 'small' ? '12px' : '14px'),
                                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                   }}
                                 >
                                    {btn.text}
                                 </div>
                               ))
                             ) : (
                               <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>버튼이 없습니다. (홈페이지에서도 숨겨집니다)</p>
                             )}
                          </div>
                       </div>

                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                         {(heroForm.buttons || []).map((btn, idx) => (
                           <div key={btn.id} style={{ background: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                 <span style={{ fontWeight: 800, fontSize: '13px' }}>버튼 #{idx+1} 편집</span>
                                 <button style={{ color: '#ef4444', border: 'none', background: 'none' }} onClick={() => setHeroForm({...heroForm, buttons: heroForm.buttons.filter((_,i) => i !== idx)})}><Trash2 size={16}/></button>
                              </div>
                              <div className="form-group" style={{ marginBottom: '12px' }}><label style={{fontSize:'11px'}}>버튼 문구</label><input className="form-control" value={btn.text} onChange={e => { const b=[...heroForm.buttons]; b[idx]={...b[idx], text:e.target.value}; setHeroForm({...heroForm, buttons:b})}} /></div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                 <div className="form-group"><label style={{fontSize:'11px'}}>배경색</label><input type="color" className="form-control" value={btn.style?.bgColor} onChange={e => { const b=[...heroForm.buttons]; b[idx]={...b[idx], style:{...b[idx].style, bgColor:e.target.value}}; setHeroForm({...heroForm, buttons:b})}} onClick={e => e.stopPropagation()} /></div>
                                 <div className="form-group"><label style={{fontSize:'11px'}}>글자색</label><input type="color" className="form-control" value={btn.style?.textColor} onChange={e => { const b=[...heroForm.buttons]; b[idx]={...b[idx], style:{...b[idx].style, textColor:e.target.value}}; setHeroForm({...heroForm, buttons:b})}} onClick={e => e.stopPropagation()} /></div>
                                 <div className="form-group" style={{ gridColumn: 'span 2' }}><label style={{fontSize:'11px'}}>테두리색</label><input type="color" className="form-control" value={btn.style?.borderColor || btn.style?.bgColor} onChange={e => { const b=[...heroForm.buttons]; b[idx]={...b[idx], style:{...b[idx].style, borderColor:e.target.value}}; setHeroForm({...heroForm, buttons:b})}} onClick={e => e.stopPropagation()} /></div>
                                 <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{fontSize:'11px'}}>크기</label>
                                    <select className="form-control" value={btn.style?.size || 'medium'} onChange={e => { const b=[...heroForm.buttons]; b[idx]={...b[idx], style:{...b[idx].style, size:e.target.value}}; setHeroForm({...heroForm, buttons:b})}} onClick={e => e.stopPropagation()}>
                                       <option value="small">Small</option>
                                       <option value="medium">Medium</option>
                                       <option value="large">Large</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                         ))}
                       </div>
                    </div>
                 )}
              </div>
            </section>
          )}

          {activeCategory === 'sections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800' }}>홍보 섹션 관리</h2>
                  <button className="luxury-btn" onClick={handleAddNewSection}><Plus size={16} /> 신규 섹션 추가</button>
               </div>
               {config.sections.map((section, idx) => (
                 <div key={section.id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div 
                      onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)}
                      style={{ padding: '20px 32px', background: 'var(--bg-sub)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontWeight: '900', color: 'var(--primary)', opacity: 0.3 }}>{idx + 1}</span>
                          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{section.title}</h3>
                          <span style={{ fontSize: '11px', background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>{section.style?.toUpperCase()}</span>
                       </div>
                       <div style={{ display: 'flex', gap: '12px' }}>
                          <button onClick={e => { e.stopPropagation(); handleMoveSection(section.id, 'up'); }} style={{ border: 'none', background: 'none' }}><ChevronUp size={18} /></button>
                          <button onClick={e => { e.stopPropagation(); handleMoveSection(section.id, 'down'); }} style={{ border: 'none', background: 'none' }}><ChevronDown size={18} /></button>
                          <button onClick={e => { e.stopPropagation(); handleRemoveSection(section.id); }} style={{ color: '#ef4444', border: 'none', background: 'none' }}><Trash2 size={18} /></button>
                       </div>
                    </div>

                    {activeSectionId === section.id && (
                       <div style={{ padding: '32px' }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
                            {['style', 'content', 'visual', 'typography', 'button'].map(t => (
                              <button key={t} onClick={() => setEditTab(t)} className={`luxury-btn ${editTab === t ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '11px' }}>{t.toUpperCase()}</button>
                            ))}
                          </div>
                          
                          {editTab === 'style' && (
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                {['classic', 'split-card', 'minimal-centered', 'gallery', 'feature-cards', 'process', 'luxury-row'].map(s => (
                                  <div key={s} onClick={() => handleSectionUpdate(section.id, 'style', s)} style={{ padding: '20px', borderRadius: '16px', border: section.style === s ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}><p style={{ fontSize: '11px', fontWeight: '700' }}>{s.toUpperCase()}</p></div>
                                ))}
                             </div>
                          )}

                          {editTab === 'content' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                               <div className="form-group"><label>섹션 타이틀</label><input className="form-control" value={section.title} onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)} /></div>
                               <div className="form-group"><label>서브 설명</label><textarea className="form-control" value={section.content} onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)} rows={4} /></div>
                               
                               <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                     <label style={{ fontWeight: 800 }}>상세 아이템/텍스트 박스 리스트</label>
                                     <button className="luxury-btn outline" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => {
                                        const items = section.items || [];
                                        handleSectionUpdate(section.id, 'items', [...items, { id: Date.now().toString(), title: "새로운 항목", content: "설명", aboveTitle: "", tag: "", number: (items.length + 1).toString().padStart(2, '0') }]);
                                     }}><Plus size={14} /> 추가</button>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                     {(section.items || []).map((item, i) => (
                                       <div key={i} style={{ background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                             <div className="form-group" style={{ width: '60px' }}><label style={{fontSize:'10px'}}>번호</label><input className="form-control" value={item.number} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], number:e.target.value}; handleSectionUpdate(section.id, 'items', ni); }} /></div>
                                             <button style={{ color: '#ef4444', border: 'none', background: 'none' }} onClick={() => { const ni=section.items.filter((_, idx)=>idx!==i); handleSectionUpdate(section.id, 'items', ni); }}><Trash2 size={16}/></button>
                                          </div>
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                             <div className="form-group"><label style={{fontSize:'10px'}}>상단 소제목 (예: 국가)</label><input className="form-control" value={item.aboveTitle} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], aboveTitle:e.target.value}; handleSectionUpdate(section.id, 'items', ni); }} /></div>
                                             <div className="form-group"><label style={{fontSize:'10px'}}>우측 태그 (예: 도심 출발)</label><input className="form-control" value={item.tag} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], tag:e.target.value}; handleSectionUpdate(section.id, 'items', ni); }} /></div>
                                             <div className="form-group" style={{ gridColumn: 'span 2' }}><label style={{fontSize:'10px'}}>항목 타이틀</label><input className="form-control" value={item.title} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], title:e.target.value}; handleSectionUpdate(section.id, 'items', ni); }} /></div>
                                             <div className="form-group" style={{ gridColumn: 'span 2' }}><label style={{fontSize:'10px'}}>항목 설명</label><textarea className="form-control" value={item.content} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], content:e.target.value}; handleSectionUpdate(section.id, 'items', ni); }} rows={2} /></div>
                                          </div>
                                       </div>
                                     ))}
                                  </div>
                               </div>

                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                                  <div className="form-group"><label>상단 여백</label><input type="number" className="form-control" value={section.paddingTop} onChange={e => handleSectionUpdate(section.id, 'paddingTop', parseInt(e.target.value))} /></div>
                                  <div className="form-group"><label>하단 여백</label><input type="number" className="form-control" value={section.paddingBottom} onChange={e => handleSectionUpdate(section.id, 'paddingBottom', parseInt(e.target.value))} /></div>
                               </div>
                            </div>
                          )}

                          {editTab === 'visual' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                               <MediaInput label="대표 메인 이미지 (상단/좌측)" value={section.image} onChange={v => handleSectionUpdate(section.id, 'image', v)} uploadFile={uploadFile} />
                               <div className="form-group"><label>배경 타입</label><select className="form-control" value={section.bgType} onChange={e => handleSectionUpdate(section.id, 'bgType', e.target.value)}><option value="color">단색</option><option value="image">배경 이미지</option><option value="video">배경 동영상</option></select></div>
                               
                               {section.bgType === 'color' ? (
                                  <div className="form-group"><label>배경 색상</label><input type="color" className="form-control" style={{ height: 42, padding: 4 }} value={section.bgColor} onChange={e => handleSectionUpdate(section.id, 'bgColor', e.target.value)} onClick={e => e.stopPropagation()} /></div>
                               ) : (<MediaInput label="배경 미디어 URL" value={section.bgUrl} onChange={v => handleSectionUpdate(section.id, 'bgUrl', v)} uploadFile={uploadFile} />)}
                               
                               <div className="form-group">
                                  <label>배경 투명도/밝기 ({section.bgOpacity})</label>
                                  <input type="range" min="0" max="1" step="0.1" className="form-control" value={section.bgOpacity} onChange={e => handleSectionUpdate(section.id, 'bgOpacity', parseFloat(e.target.value))} onClick={e => e.stopPropagation()} />
                               </div>

                               <MultiMediaInput label="갤러리/추가 이미지 리스트" values={section.images || []} onChange={v => handleSectionUpdate(section.id, 'images', v)} uploadFile={uploadFile} />
                               
                               <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                  <label>레이아웃 방향</label>
                                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                     <button className={`luxury-btn ${section.layout === 'left' ? '' : 'outline'}`} onClick={() => handleSectionUpdate(section.id, 'layout', 'left')} style={{ flex: 1 }}>기본 (이미지 좌/우)</button>
                                     <button className={`luxury-btn ${section.layout === 'right' ? '' : 'outline'}`} onClick={() => handleSectionUpdate(section.id, 'layout', 'right')} style={{ flex: 1 }}>반전 (방향 바꾸기)</button>
                                  </div>
                               </div>
                            </div>
                          )}

                          {editTab === 'typography' && (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div><label style={{ fontWeight: 800 }}>대제목(Title) 폰트</label><TypographyTool data={section} target="title" onUpdate={(t,f,v) => handleTypographyUpdate(section.id, t,f,v)} /></div>
                                <div><label style={{ fontWeight: 800 }}>상세내용(Content) 폰트</label><TypographyTool data={section} target="content" onUpdate={(t,f,v) => handleTypographyUpdate(section.id, t,f,v)} /></div>
                             </div>
                          )}
                       </div>
                    )}
                 </div>
               ))}
            </div>
          )}

          {activeCategory === 'productList' && (
            <section className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Package size={24} /></div>
                    <h2 style={{ fontSize: '20px', fontWeight: '800' }}>상품 리스트 구역 브랜딩</h2>
                 </div>
                 <button className="luxury-btn" onClick={handleProductBrandingSave}><Save size={18} /> 설정 저장</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 <div className="form-group">
                    <label>섹션 메인 타이틀</label>
                    <input className="form-control" value={productBrandingForm?.title || "추천 패키지"} onChange={e => setProductBrandingForm({...productBrandingForm, title: e.target.value})} />
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                       <label>타이틀 글씨 색상</label>
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                          <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={productBrandingForm?.titleColor?.startsWith('#') ? productBrandingForm.titleColor : "#000000"} onChange={e => setProductBrandingForm({...productBrandingForm, titleColor: e.target.value})} onClick={e => e.stopPropagation()} />
                          <input className="form-control" value={productBrandingForm?.titleColor || "#000000"} onChange={e => setProductBrandingForm({...productBrandingForm, titleColor: e.target.value})} onClick={e => e.stopPropagation()} />
                       </div>
                    </div>
                    <div className="form-group">
                       <label>섹션 전체 배경색</label>
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                          <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={productBrandingForm?.bgColor?.startsWith('#') ? productBrandingForm.bgColor : "#ffffff"} onChange={e => setProductBrandingForm({...productBrandingForm, bgColor: e.target.value})} onClick={e => e.stopPropagation()} />
                          <input className="form-control" value={productBrandingForm?.bgColor || "#ffffff"} onChange={e => setProductBrandingForm({...productBrandingForm, bgColor: e.target.value})} onClick={e => e.stopPropagation()} />
                       </div>
                    </div>
                 </div>
              </div>
            </section>
          )}

          {activeCategory === 'reviews' && (
            <section className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Activity size={24} /></div>
                    <h2 style={{ fontSize: '20px', fontWeight: '800' }}>메인 여행후기 섹션 브랜딩</h2>
                 </div>
                 <button className="luxury-btn" onClick={handleReviewBrandingSave}><Save size={18} /> 설정 저장</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 <div className="form-group">
                    <label>메인페이지 노출 여부</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                       <button className={`luxury-btn ${reviewBrandingForm?.show ? '' : 'outline'}`} onClick={() => setReviewBrandingForm({...reviewBrandingForm, show: true})} style={{ flex: 1 }}>표시함 (ON)</button>
                       <button className={`luxury-btn ${!reviewBrandingForm?.show ? '' : 'outline'}`} onClick={() => setReviewBrandingForm({...reviewBrandingForm, show: false})} style={{ flex: 1 }}>숨김 (OFF)</button>
                    </div>
                 </div>

                 {reviewBrandingForm?.show && (
                   <>
                     <div className="form-group">
                        <label>섹션 메인 타이틀</label>
                        <input className="form-control" value={reviewBrandingForm?.title || "여행 후기"} onChange={e => setReviewBrandingForm({...reviewBrandingForm, title: e.target.value})} />
                     </div>
                     
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                           <label>타이틀 글씨 색상</label>
                           <input type="color" className="form-control" style={{ height: 42, padding: 4 }} value={reviewBrandingForm?.titleColor?.startsWith('#') ? reviewBrandingForm.titleColor : "#000000"} onChange={e => setReviewBrandingForm({...reviewBrandingForm, titleColor: e.target.value})} onClick={e => e.stopPropagation()} />
                        </div>
                        <div className="form-group">
                           <label>섹션 전체 배경색</label>
                           <input type="color" className="form-control" style={{ height: 42, padding: 4 }} value={reviewBrandingForm?.bgColor?.startsWith('#') ? reviewBrandingForm.bgColor : "#f8fafc"} onChange={e => setReviewBrandingForm({...reviewBrandingForm, bgColor: e.target.value})} onClick={e => e.stopPropagation()} />
                        </div>
                     </div>

                     <div className="form-group">
                        <label>레이아웃 스타일</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
                           <button className={`luxury-btn ${reviewBrandingForm?.layout === 'slider' ? '' : 'outline'}`} onClick={() => setReviewBrandingForm({...reviewBrandingForm, layout: 'slider'})} style={{ fontSize: '12px' }}>슬라이드 (Slider)</button>
                           <button className={`luxury-btn ${reviewBrandingForm?.layout === 'grid' ? '' : 'outline'}`} onClick={() => setReviewBrandingForm({...reviewBrandingForm, layout: 'grid'})} style={{ fontSize: '12px' }}>그리드 (Grid)</button>
                        </div>
                     </div>
                   </>
                 )}
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminHomeEditor;
