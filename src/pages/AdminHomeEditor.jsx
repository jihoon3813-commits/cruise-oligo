import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon, Palette, Type, Link as LinkIcon, Upload, Loader2, Play, ChevronUp, ChevronDown, Check, X, Settings2, Grid, List, Activity, MoveVertical, MousePointerClick, Sun, Moon, Coffee, Cloud, Target, Droplets, Package, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminHomeEditor = () => {
  const { config, updateHero, updateTheme, updateSection, addSection, deleteSection, uploadFile, updateProductBranding } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);
  const [productBrandingForm, setProductBrandingForm] = useState(config.productListBranding);
  const [activeCategory, setActiveCategory] = useState('theme'); // 'theme', 'hero', 'sections', 'productList'
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [heroTab, setHeroTab] = useState('style');
  const [editTab, setEditTab] = useState('style'); 

  useEffect(() => {
    if (config.hero) setHeroForm(config.hero);
    if (config.productListBranding) setProductBrandingForm(config.productListBranding);
  }, [config]);

  const handleHeroSave = async () => {
    await updateHero(heroForm);
    alert('홈페이지 히어로 설정이 저장되었습니다.');
  };

  const handleThemeChange = async (theme) => {
    await updateTheme(theme);
  };

  const categories = [
    { id: 'theme', name: '전체 디자인 테마', icon: <Palette size={20} /> },
    { id: 'hero', name: '히어로 섹션 편집', icon: <Layout size={20} /> },
    { id: 'sections', name: '홍보 섹션 상세 관리', icon: <Layers size={20} /> },
    { id: 'productList', name: '상품 리스트 브랜딩', icon: <Package size={20} /> },
  ];

  const handleHeroTypoUpdate = (target, field, value) => {
    const typo = heroForm.typography || {};
    const targetTypo = typo[target] || {};
    const updatedTypo = { ...typo, [target]: { ...targetTypo, [field]: value } };
    setHeroForm({ ...heroForm, typography: updatedTypo });
  };

  const themes = [
    { id: 'white', label: 'Pure White', icon: <Sun size={14}/>, color: '#2563EB' },
    { id: 'midnight', label: 'Midnight', icon: <Moon size={14}/>, color: '#D4AF37' },
    { id: 'cream', label: 'Creamy Sand', icon: <Coffee size={14}/>, color: '#8B4513' },
    { id: 'grey', label: 'Cool Grey', icon: <Cloud size={14}/>, color: '#0D9488' },
    { id: 'lavender', label: 'Lavender', icon: <Target size={14}/>, color: '#7C3AED' },
    { id: 'ocean', label: 'Ocean Breeze', icon: <Droplets size={14}/>, color: '#0284C7' }
  ];

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

  const handleButtonUpdate = async (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    if (!section) return;
    const btnStyle = section.buttonStyles || {};
    const updatedBtn = { ...btnStyle, [field]: value };
    await handleSectionUpdate(id, 'buttonStyles', updatedBtn);
  };

  const handleAddItem = async (id) => {
    const section = config.sections.find(s => s.id === id);
    const items = section.items || [];
    const newItems = [...items, { title: "새로운 항목", content: "내용을 입력하세요.", number: `0${items.length + 1}` }];
    await handleSectionUpdate(id, 'items', newItems);
  };

  const handleUpdateItem = async (sectionId, itemIdx, field, value) => {
    const section = config.sections.find(s => s.id === sectionId);
    const items = [...(section.items || [])];
    items[itemIdx] = { ...items[itemIdx], [field]: value };
    await handleSectionUpdate(sectionId, 'items', items);
  };

  const handleRemoveItem = async (sectionId, itemIdx) => {
    const section = config.sections.find(s => s.id === sectionId);
    const items = (section.items || []).filter((_, i) => i !== itemIdx);
    await handleSectionUpdate(sectionId, 'items', items);
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

  const MultiMediaInput = ({ label, values = [], onChange }) => {
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();
    const onFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setLoading(true);
      const storageId = await uploadFile(file);
      onChange([...(values || []), `storage:${storageId}`]);
      setLoading(false);
    };
    return (
      <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>{label}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
          {values?.map((src, idx) => (
            <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img src={src.startsWith('storage:') ? 'https://via.placeholder.com/100?text=File' : src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => onChange(values.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
            </div>
          ))}
          <button className="luxury-btn outline" style={{ height: '80px', borderRadius: '12px', borderStyle: 'dashed', flexDirection: 'column' }} onClick={() => fileRef.current.click()} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
          </button>
          <input type="file" ref={fileRef} hidden onChange={onFileChange} />
        </div>
      </div>
    );
  };

  const TypographyTool = ({ data, target, onUpdate }) => {
    const typo = data.typography?.[target] || {};
    const update = (field, val) => onUpdate(target, field, val);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>색상</label><input type="color" className="form-control" style={{ height: '38px', padding: 4 }} value={typo.color || '#0F172A'} onChange={e => update('color', e.target.value)} /></div>
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>크기</label><input type="number" className="form-control" value={typo.fontSize || 16} onChange={e => update('fontSize', parseInt(e.target.value))} /></div>
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>정렬</label><select className="form-control" value={typo.textAlign || 'left'} onChange={e => update('textAlign', e.target.value)}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Category Navigation */}
      <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '8px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        {categories.map(cat => (
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
                 {themes.map(t => (
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
                       <div className="form-group"><label>서브 타이틀</label><input className="form-control" value={heroForm?.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} /></div>
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
                       <MediaInput label="배경 미디어" value={heroForm?.bgUrl} onChange={v => setHeroForm({...heroForm, bgUrl: v})} />
                       <div className="form-group"><label>배경 타입</label><select className="form-control" value={heroForm?.bgType} onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}><option value="image">Image</option><option value="video">Video</option></select></div>
                       <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label>배경 밝기 ({heroForm?.bgOpacity ?? 1}) (0:어둡게, 1:보통, 2:밝게)</label>
                          <input type="range" min="0" max="2" step="0.1" className="form-control" value={heroForm?.bgOpacity ?? 1} onChange={e => setHeroForm({...heroForm, bgOpacity: parseFloat(e.target.value)})} />
                       </div>
                    </div>
                 )}

                 {heroTab === 'typography' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                       <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>메인 타이틀 폰트</label><TypographyTool data={heroForm} target="title" onUpdate={handleHeroTypoUpdate} /></div>
                       <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>서브 타이틀 폰트</label><TypographyTool data={heroForm} target="subtitle" onUpdate={handleHeroTypoUpdate} /></div>
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
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                         {(heroForm.buttons || []).map((btn, idx) => (
                           <div key={btn.id} style={{ background: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                 <span style={{ fontWeight: 800, fontSize: '13px' }}>버튼 #{idx+1}</span>
                                 <button style={{ color: '#ef4444', border: 'none', background: 'none' }} onClick={() => setHeroForm({...heroForm, buttons: heroForm.buttons.filter((_,i) => i !== idx)})}><Trash2 size={16}/></button>
                              </div>
                              <div className="form-group"><label style={{fontSize:'11px'}}>문구</label><input className="form-control" value={btn.text} onChange={e => { const b=[...heroForm.buttons]; b[idx]={...b[idx], text:e.target.value}; setHeroForm({...heroForm, buttons:b})}} /></div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                                 <div className="form-group"><label style={{fontSize:'11px'}}>배경색</label><input type="color" className="form-control" value={btn.style?.bgColor} onChange={e => { const b=[...heroForm.buttons]; b[idx]={...b[idx], style:{...b[idx].style, bgColor:e.target.value}}; setHeroForm({...heroForm, buttons:b})}} /></div>
                                 <div className="form-group"><label style={{fontSize:'11px'}}>글자색</label><input type="color" className="form-control" value={btn.style?.textColor} onChange={e => { const b=[...heroForm.buttons]; b[idx]={...b[idx], style:{...b[idx].style, textColor:e.target.value}}; setHeroForm({...heroForm, buttons:b})}} /></div>
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
                                {['classic', 'split-card', 'minimal-centered', 'gallery', 'feature-cards', 'process'].map(s => (
                                  <div key={s} onClick={() => handleSectionUpdate(section.id, 'style', s)} style={{ padding: '20px', borderRadius: '16px', border: section.style === s ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}><p style={{ fontSize: '11px', fontWeight: '700' }}>{s.toUpperCase()}</p></div>
                                ))}
                             </div>
                          )}

                          {editTab === 'content' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                               <div className="form-group"><label>타이틀</label><input className="form-control" value={section.title} onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)} /></div>
                               <div className="form-group"><label>본문 내용</label><textarea className="form-control" value={section.content} onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)} rows={4} /></div>
                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                  <div className="form-group"><label>상단 여백</label><input type="number" className="form-control" value={section.paddingTop} onChange={e => handleSectionUpdate(section.id, 'paddingTop', parseInt(e.target.value))} /></div>
                                  <div className="form-group"><label>하단 여백</label><input type="number" className="form-control" value={section.paddingBottom} onChange={e => handleSectionUpdate(section.id, 'paddingBottom', parseInt(e.target.value))} /></div>
                               </div>
                            </div>
                          )}

                          {editTab === 'visual' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                               <MediaInput label="메인 이미지" value={section.image} onChange={v => handleSectionUpdate(section.id, 'image', v)} />
                               <div className="form-group"><label>배경 타입</label><select className="form-control" value={section.bgType} onChange={e => handleSectionUpdate(section.id, 'bgType', e.target.value)}><option value="color">단색</option><option value="image">이미지</option><option value="video">동영상</option></select></div>
                               {section.bgType === 'color' ? (
                                  <div className="form-group"><label>배경 색상</label><input type="color" className="form-control" value={section.bgColor} onChange={e => handleSectionUpdate(section.id, 'bgColor', e.target.value)} /></div>
                               ) : (<MediaInput label="배경 URL" value={section.bgUrl} onChange={v => handleSectionUpdate(section.id, 'bgUrl', v)} />)}
                               <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                  <label>배경 투명도/밝기 ({section.bgOpacity})</label>
                                  <input type="range" min="0" max="1" step="0.1" className="form-control" value={section.bgOpacity} onChange={e => handleSectionUpdate(section.id, 'bgOpacity', parseFloat(e.target.value))} />
                               </div>
                            </div>
                          )}

                          {editTab === 'typography' && (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div><label style={{ fontWeight: 800 }}>타이틀 폰트</label><TypographyTool data={section} target="title" onUpdate={(t,f,v) => handleTypographyUpdate(section.id, t,f,v)} /></div>
                                <div><label style={{ fontWeight: 800 }}>본문 폰트</label><TypographyTool data={section} target="content" onUpdate={(t,f,v) => handleTypographyUpdate(section.id, t,f,v)} /></div>
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
                 <button className="luxury-btn" onClick={() => updateProductBranding(productBrandingForm)}><Save size={18} /> 설정 저장</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 <div className="form-group">
                    <label>섹션 메인 타이틀</label>
                    <input className="form-control" value={productBrandingForm?.title || "추천 패키지"} onChange={e => setProductBrandingForm({...productBrandingForm, title: e.target.value})} />
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                       <label>타이틀 글씨 색상 (하얀 배경이면 어두운 색 권장)</label>
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                          <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={productBrandingForm?.titleColor || "#000000"} onChange={e => setProductBrandingForm({...productBrandingForm, titleColor: e.target.value})} />
                          <input className="form-control" value={productBrandingForm?.titleColor || "#000000"} onChange={e => setProductBrandingForm({...productBrandingForm, titleColor: e.target.value})} />
                       </div>
                    </div>
                    <div className="form-group">
                       <label>섹션 전체 배경색</label>
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                          <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={productBrandingForm?.bgColor || "#ffffff"} onChange={e => setProductBrandingForm({...productBrandingForm, bgColor: e.target.value})} />
                          <input className="form-control" value={productBrandingForm?.bgColor || "#ffffff"} onChange={e => setProductBrandingForm({...productBrandingForm, bgColor: e.target.value})} />
                       </div>
                    </div>
                 </div>

                 <div style={{ padding: '24px', background: 'var(--bg-sub)', borderRadius: '20px', border: '1px solid var(--border-light)', display: 'flex', gap: '16px' }}>
                    <Activity size={20} color="var(--primary)" />
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                       <strong>디자인 팁:</strong> 다크 테마(Midnight 등)를 사용 중인데 추천 패키지 글씨가 안 보인다면, 
                       여기서 <strong>타이틀 글씨 색상</strong>을 수동으로 검정색(#000000) 또는 테마에 맞는 색상으로 지정해 주세요.
                    </p>
                 </div>
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminHomeEditor;
