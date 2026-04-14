import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon, Palette, Type, Link as LinkIcon, Upload, Loader2, Play, ChevronUp, ChevronDown, Check, X, Settings2, Grid, List, Activity, MoveVertical, MousePointerClick, Sun, Moon, Coffee, Cloud, Target, Droplets } from 'lucide-react';

const AdminHomeEditor = () => {
  const { config, updateHero, updateTheme, updateSection, addSection, deleteSection, uploadFile } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [heroTab, setHeroTab] = useState('style');
  const [editTab, setEditTab] = useState('style'); 

  useEffect(() => {
    if (config.hero) setHeroForm(config.hero);
  }, [config.hero]);

  const handleHeroSave = async () => {
    await updateHero(heroForm);
    alert('홈페이지 히어로 설정이 저장되었습니다.');
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

  const handleRemoveSection = async (id) => {
    if (window.confirm('이 섹션을 삭제하시겠습니까?')) {
      await deleteSection(id);
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Global Theme Config */}
      <section className="admin-card">
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Palette size={24} /></div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>홈페이지 전체 테마 (Color Tone)</h2>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {themes.map(t => (
              <button key={t.id} onClick={() => handleThemeChange(t.id)} style={{ padding: '20px', borderRadius: '16px', border: config.theme === t.id ? '2px solid var(--primary)' : '1px solid var(--border-light)', background: config.theme === t.id ? 'var(--bg-sub)' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: '0.3s' }}>
                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{t.icon}</div>
                 <span style={{ fontWeight: '700', fontSize: '14px' }}>{t.label}</span>
                 {config.theme === t.id && <Check size={16} color="var(--primary)" />}
              </button>
            ))}
         </div>
      </section>

      {/* Hero Editor */}
      <section className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Monitor size={24} /></div>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>히어로 브랜딩 (대문) 설정</h2>
           </div>
           <button className="luxury-btn" onClick={handleHeroSave}><Save size={18} /> 설정 저장</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
           {['style', 'content', 'visual', 'typography'].map(t => (
             <button key={t} onClick={() => setHeroTab(t)} className={`luxury-btn ${heroTab === t ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px' }}>{t.toUpperCase()}</button>
           ))}
        </div>

        {heroTab === 'style' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
             {['classic', 'full-bg', 'split', 'card', 'minimal', 'video-focus'].map(s => (
               <div key={s} onClick={() => setHeroForm({...heroForm, style: s})} style={{ padding: '20px', borderRadius: '16px', border: heroForm?.style === s ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}><p style={{ fontSize: '12px', fontWeight: '700' }}>{s.toUpperCase()}</p></div>
             ))}
          </div>
        )}

        {heroTab === 'content' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group"><label>상단 강조 문구</label><input className="form-control" value={heroForm?.aboveTitle || ""} onChange={e => setHeroForm({...heroForm, aboveTitle: e.target.value})} /></div>
              <div className="form-group"><label>메인 타이틀</label><textarea className="form-control" value={heroForm?.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} rows={3} /></div>
              <div className="form-group"><label>서브 타이틀</label><input className="form-control" value={heroForm?.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} /></div>
              <div className="form-group"><label>하단 상세 문구</label><input className="form-control" value={heroForm?.belowTitle || ""} onChange={e => setHeroForm({...heroForm, belowTitle: e.target.value})} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div className="form-group"><label>가로 정렬</label><select className="form-control" value={heroForm?.textPosition} onChange={e => setHeroForm({...heroForm, textPosition: e.target.value})}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                 <div className="form-group"><label>세로 정렬</label><select className="form-control" value={heroForm?.verticalAlign || "middle"} onChange={e => setHeroForm({...heroForm, verticalAlign: e.target.value})}><option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option></select></div>
              </div>
              <div className="form-group" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                 <label>히어로 섹션 좌우 여백 (px)</label>
                 <input type="range" min="0" max="250" step="10" className="form-control" value={heroForm?.paddingX ?? 80} onChange={e => setHeroForm({...heroForm, paddingX: parseInt(e.target.value)})} />
              </div>
           </div>
        )}

        {heroTab === 'visual' && (
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <MediaInput label="배경 URL / 파일" value={heroForm?.bgUrl} onChange={v => setHeroForm({...heroForm, bgUrl: v})} />
              <div className="form-group"><label>배경 타입</label><select className="form-control" value={heroForm?.bgType} onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}><option value="image">Image</option><option value="video">Video</option></select></div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}><label>배경 투명도 / 밝기 ({heroForm?.bgOpacity ?? 1})</label><input type="range" min="0" max="1" step="0.1" className="form-control" value={heroForm?.bgOpacity ?? 1} onChange={e => setHeroForm({...heroForm, bgOpacity: parseFloat(e.target.value)})} /></div>
           </div>
        )}

        {heroTab === 'typography' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>메인 타이틀 폰트</label><TypographyTool data={heroForm} target="title" onUpdate={handleHeroTypoUpdate} /></div>
              <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>서브 타이틀 폰트</label><TypographyTool data={heroForm} target="subtitle" onUpdate={handleHeroTypoUpdate} /></div>
           </div>
        )}
      </section>

      {/* Sections Config */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>홍보 섹션 상세 관리</h2>
          <button className="luxury-btn outline" onClick={handleAddNewSection}><Plus size={16} /> 신규 섹션 추가</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {config.sections.map((section, index) => (
            <div key={section.id} className="admin-card" style={{ padding: '0', overflow: 'hidden', border: activeSectionId === section.id ? '2px solid var(--primary)' : '1px solid var(--border-light)' }}>
              <div 
                style={{ padding: '20px 32px', background: 'var(--bg-sub)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <button onClick={e => { e.stopPropagation(); handleMoveSection(section.id, 'up'); }} style={{ border: 'none', background: 'none' }}><ChevronUp size={14} /></button>
                     <button onClick={e => { e.stopPropagation(); handleMoveSection(section.id, 'down'); }} style={{ border: 'none', background: 'none' }}><ChevronDown size={14} /></button>
                   </div>
                   <span style={{ fontWeight: '800' }}>{index + 1}</span>
                   <h3 style={{ fontSize: '16px' }}>{section.title}</h3>
                </div>
                <button onClick={e => { e.stopPropagation(); handleRemoveSection(section.id); }} style={{ color: '#ef4444', border: 'none', background: 'none' }}><Trash2 size={18} /></button>
              </div>

              {activeSectionId === section.id && (
                <div style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
                     {[
                       { id: 'style', icon: <Grid size={14} />, label: 'Style' },
                       { id: 'content', icon: <List size={14} />, label: 'Content' },
                       { id: 'visual', icon: <Palette size={14} />, label: 'Visual' },
                       { id: 'typography', icon: <Type size={14} />, label: 'Fonts' },
                       { id: 'button', icon: <MousePointerClick size={14} />, label: 'Button' }
                     ].map(t => (
                       <button key={t.id} onClick={() => setEditTab(t.id)} className={`luxury-btn ${editTab === t.id ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px' }}>
                         {t.icon} {t.label}
                       </button>
                     ))}
                  </div>

                  {editTab === 'style' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {[{ id: 'classic', label: 'Classic' }, { id: 'split-card', label: 'Split Card' }, { id: 'minimal-centered', label: 'Minimal' }, { id: 'gallery', label: 'Gallery' }, { id: 'feature-cards', label: 'Feature Cards' }, { id: 'process', label: 'Process' }].map(s => (
                        <div key={s.id} onClick={() => handleSectionUpdate(section.id, 'style', s.id)} style={{ padding: '20px', borderRadius: '16px', border: section.style === s.id ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}><p style={{ fontSize: '12px', fontWeight: '700' }}>{s.label.toUpperCase()}</p></div>
                      ))}
                    </div>
                  )}

                  {editTab === 'content' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                       <div className="form-group"><label>타이틀</label><input className="form-control" value={section.title} onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)} /></div>
                       <div className="form-group"><label>본문 내용</label><textarea className="form-control" value={section.content} onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)} rows={4} /></div>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                          <div className="form-group"><label>상단 여백 (px)</label><input type="number" className="form-control" value={section.paddingTop ?? 120} onChange={e => handleSectionUpdate(section.id, 'paddingTop', parseInt(e.target.value))} /></div>
                          <div className="form-group"><label>하단 여백 (px)</label><input type="number" className="form-control" value={section.paddingBottom ?? 120} onChange={e => handleSectionUpdate(section.id, 'paddingBottom', parseInt(e.target.value))} /></div>
                       </div>
                       {section.style === 'feature-cards' || section.style === 'process' ? (
                          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                               <label style={{ fontWeight: 800 }}>항목 리스트 (Cards/Steps)</label>
                               <button className="luxury-btn outline" onClick={() => handleAddItem(section.id)}><Plus size={14} /> 추가</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                               {(section.items || []).map((item, i) => (
                                 <div key={i} style={{ display: 'flex', gap: '12px', background: 'var(--bg-sub)', padding: '16px', borderRadius: '12px' }}>
                                    <input className="form-control" style={{ width: '120px' }} value={item.title} onChange={e => handleUpdateItem(section.id, i, 'title', e.target.value)} />
                                    <input className="form-control" value={item.content} onChange={e => handleUpdateItem(section.id, i, 'content', e.target.value)} />
                                    <button onClick={() => handleRemoveItem(section.id, i)} style={{ color: '#ef4444', border: 'none', background: 'none' }}><X size={18} /></button>
                                 </div>
                               ))}
                            </div>
                          </div>
                       ) : null}
                    </div>
                  )}

                  {editTab === 'visual' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                       <MediaInput label="메인 이미지" value={section.image} onChange={v => handleSectionUpdate(section.id, 'image', v)} />
                       <MultiMediaInput label="멀티 이미지/갤러리" values={section.images} onChange={v => handleSectionUpdate(section.id, 'images', v)} />
                       <div className="form-group"><label>배경 타입</label><select className="form-control" value={section.bgType} onChange={e => handleSectionUpdate(section.id, 'bgType', e.target.value)}><option value="color">Color</option><option value="image">Image</option></select></div>
                       <div className="form-group"><label>배경 투명도</label><input type="range" min="0" max="1" step="0.1" className="form-control" value={section.bgOpacity ?? 1} onChange={e => handleSectionUpdate(section.id, 'bgOpacity', parseFloat(e.target.value))} /></div>
                    </div>
                  )}

                  {editTab === 'typography' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                       <div><label style={{ fontWeight: 800 }}>타이틀 폰트</label><TypographyTool data={section} target="title" onUpdate={(t,f,v) => handleTypographyUpdate(section.id, t,f,v)} /></div>
                       <div><label style={{ fontWeight: 800 }}>본문 폰트</label><TypographyTool data={section} target="content" onUpdate={(t,f,v) => handleTypographyUpdate(section.id, t,f,v)} /></div>
                    </div>
                  )}

                  {editTab === 'button' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                       <div className="form-group">
                          <label>버튼 노출 여부</label>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                             <button className={`luxury-btn ${section.showButton ? '' : 'outline'}`} onClick={() => handleSectionUpdate(section.id, 'showButton', true)} style={{ flex:1 }}>ON</button>
                             <button className={`luxury-btn ${!section.showButton ? '' : 'outline'}`} onClick={() => handleSectionUpdate(section.id, 'showButton', false)} style={{ flex:1 }}>OFF</button>
                          </div>
                       </div>
                       {section.showButton && (
                         <>
                           <div className="form-group"><label>버튼 문구</label><input className="form-control" value={section.buttonText || "자세히 보기"} onChange={e => handleSectionUpdate(section.id, 'buttonText', e.target.value)} /></div>
                           <div className="form-group"><label>링크 URL</label><input className="form-control" value={section.buttonLink || ""} onChange={e => handleSectionUpdate(section.id, 'buttonLink', e.target.value)} /></div>
                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                              <div className="form-group"><label>배경색</label><input type="color" className="form-control" style={{height:38, padding:4}} value={section.buttonStyles?.bgColor || "#2563EB"} onChange={e => handleButtonUpdate(section.id, 'bgColor', e.target.value)} /></div>
                              <div className="form-group"><label>테두리색</label><input type="color" className="form-control" style={{height:38, padding:4}} value={section.buttonStyles?.borderColor || "#2563EB"} onChange={e => handleButtonUpdate(section.id, 'borderColor', e.target.value)} /></div>
                              <div className="form-group"><label>글자색</label><input type="color" className="form-control" style={{height:38, padding:4}} value={section.buttonStyles?.textColor || "#ffffff"} onChange={e => handleButtonUpdate(section.id, 'textColor', e.target.value)} /></div>
                           </div>
                         </>
                       )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomeEditor;
