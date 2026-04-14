import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon, Palette, Type, Link as LinkIcon, Upload, Loader2, Play, ChevronUp, ChevronDown, Check, X, Settings2, Grid, List, Activity, MoveVertical, MousePointerClick, Sun, Moon, Coffee, Cloud, Target, Droplets, Package, Layout, Sparkles, PlusCircle, XCircle, CreditCard, ListChecks, AlignLeft, AlignCenter, AlignRight, ShoppingBag, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Improved Input Components with Local State to prevent cursor jumps ---

const DebouncedInput = ({ value, onChange, className, type = "text", ...props }) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => { setLocalValue(value); }, [value]);
  const timerRef = useRef();

  const handleLocalChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(type === 'number' ? parseInt(val) : val);
    }, 500);
  };

  return <input {...props} type={type} className={className} value={localValue || ""} onChange={handleLocalChange} />;
};

const DebouncedTextarea = ({ value, onChange, className, ...props }) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => { setLocalValue(value); }, [value]);
  const timerRef = useRef();

  const handleLocalChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, 500);
  };

  return <textarea {...props} className={className} value={localValue || ""} onChange={handleLocalChange} />;
};

const MediaInput = ({ label, value, onChange, uploadFile, accept }) => {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("파일 용량이 너무 큽니다. 50MB 이하의 파일을 업로드해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const storageId = await uploadFile(file);
      onChange(`storage:${storageId}`);
    } catch (err) {
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  const renderPreview = () => {
    if (!value) return null;
    const isStorageId = value.startsWith('storage:');
    const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL || import.meta.env.VITE_CONVEX_URL.replace('.cloud', '.site');
    const finalUrl = isStorageId ? `${convexSiteUrl}/api/storage?id=${value.split(':')[1]}` : value;
    const isYouTube = finalUrl?.includes('youtube.com') || finalUrl?.includes('youtu.be');
    const getYouTubeId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };
    const isVideo = value.includes('video') || value.includes('mp4') || value.includes('webm') || accept?.includes('video') || isYouTube;
    return (
      <div style={{ marginTop: '12px', width: '100%', maxWidth: '280px', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)', background: '#000', position: 'relative' }}>
        {isYouTube ? (
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(finalUrl)}?controls=1&mute=1&autoplay=0`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
        ) : isVideo ? (
          <video src={finalUrl} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} controls muted />
        ) : (
          <img src={finalUrl} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} alt="Preview" />
        )}
      </div>
    );
  };

  return (
    <div className="form-group" style={{ marginBottom: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <DebouncedInput className="form-control" value={value || ""} onChange={onChange} placeholder="URL 또는 업로드" />
        <button className="luxury-btn outline" style={{ padding: '0 12px' }} onClick={() => fileRef.current.click()} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
        </button>
        <input type="file" ref={fileRef} hidden onChange={onFileChange} accept={accept || "image/*,video/*"} />
      </div>
      {renderPreview()}
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
        {values.map((url, i) => {
          const isStorageId = url.startsWith('storage:');
          const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL || import.meta.env.VITE_CONVEX_URL.replace('.cloud', '.site');
          const finalUrl = isStorageId ? `${convexSiteUrl}/api/storage?id=${url.split(':')[1]}` : url;
          return (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img src={finalUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex' }}><X size={12}/></button>
            </div>
          );
        })}
        <div onClick={() => fileRef.current.click()} style={{ aspectRatio: '1', borderRadius: '8px', border: '2px dashed var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--bg-sub)' }}>
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
  const currentStyles = target === 'above' ? [ { id: 'none', label: '기본' }, { id: 'box', label: '박스' }, { id: 'wavy', label: '워비' } ] : [ { id: 'none', label: '기본' }, { id: 'box', label: '박스' }, { id: 'italic', label: '이탤릭' } ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>색상</label><input type="color" className="form-control" style={{ height: '38px', padding: 4 }} value={typo.color || '#0F172A'} onChange={e => update('color', e.target.value)} /></div>
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>크기</label><DebouncedInput type="number" className="form-control" value={typo.fontSize || 16} onChange={val => update('fontSize', val)} /></div>
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>정렬</label><select className="form-control" value={typo.textAlign || 'left'} onChange={e => update('textAlign', e.target.value)}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
      </div>
      {showStyle && (
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px', display: 'block' }}>텍스트 스타일 효과</label>
          <div style={{ display: 'flex', gap: '8px' }}>
             {currentStyles.map(s => (
               <button key={s.id} onClick={() => update('style', s.id)} style={{ flex: 1, padding: '8px', fontSize: '11px', borderRadius: '8px', border: typo.style === s.id ? '2px solid var(--primary)' : '1px solid var(--border-light)', background: typo.style === s.id ? '#fff' : 'transparent', fontWeight: typo.style === s.id ? '800' : '400', cursor: 'pointer' }}>{s.label}</button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CATEGORIES = [
  { id: 'theme', name: '디자인 테마', icon: <Palette size={20} /> },
  { id: 'hero', name: '히어로 관리', icon: <Layout size={20} /> },
  { id: 'sections', name: '섹션 구성 & 순서', icon: <Layers size={20} /> },
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
  const [activeCategory, setActiveCategory] = useState('theme'); 
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [editTab, setEditTab] = useState('style');

  useEffect(() => {
    if (config.hero) setHeroForm(config.hero);
  }, [config.hero]);

  // Use config.sections directly as it is already sorted in the context
  const sections = config.sections || [];

  const handleHeroSave = async () => {
    await updateHero(heroForm);
    alert('어드민 히어로 설정이 저장되었습니다.');
  };

  const handleSectionMove = async (id, direction) => {
    const idx = sections.findIndex(s => s.id === id);
    if (idx === -1) return;

    let targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const item = newSections.splice(idx, 1)[0];
    newSections.splice(targetIdx, 0, item);

    const orders = newSections.map((s, i) => ({
      id: s.id,
      order: i
    }));

    await updateSectionOrders(orders);
  };

  const handleCreateSection = async (type = "custom") => {
    const defaultData = {
      order: sections.length,
      type: type,
      title: type === "products" ? "추천 패키지" : (type === "reviews" ? "여행 후기" : "새로운 섹션"),
      content: type === "custom" ? "섹션 설명을 입력하세요." : "",
      style: type === "products" ? "grid" : (type === "reviews" ? "slider" : "classic"),
      layout: "left",
      items: [],
      typography: { title: { fontSize: 40, color: "#0F172A" }, content: { fontSize: 16, color: "#64748B" } },
      cardStyles: { shadow: 0.1, borderRadius: 24, borderWidth: 1, borderColor: "#e2e8f0", bgColor: "#ffffff" },
      showButton: type === "custom",
      bgColor: "#ffffff",
      bgType: "color",
      bgOpacity: 1,
      paddingTop: 80,
      paddingBottom: 80
    };
    await addSection(defaultData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '8px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`luxury-btn ${activeCategory === cat.id ? '' : 'outline'}`} style={{ padding: '10px 24px', whiteSpace: 'nowrap', borderRadius: '12px', gap: '8px' }}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {activeCategory === 'theme' && (
            <section className="admin-card">
              <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>홈페이지 테마 설정</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                 {THEMES.map(t => (
                   <button key={t.id} onClick={() => updateTheme(t.id)} style={{ padding: '24px', borderRadius: '20px', border: config.theme === t.id ? '2px solid var(--primary)' : '1px solid var(--border-light)', background: config.theme === t.id ? 'var(--bg-sub)' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: t.color, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{t.icon}</div>
                      <span style={{ fontWeight: '800', fontSize: '14px' }}>{t.label}</span>
                   </button>
                 ))}
              </div>
            </section>
          )}

          {activeCategory === 'hero' && (
             <section className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                   <h2 style={{ fontSize: '18px', fontWeight: '800' }}>히어로 메인 비주얼</h2>
                   <button className="luxury-btn" onClick={handleHeroSave}><Save size={16}/> 설정 저장</button>
                </div>
                <div style={{ background: 'var(--bg-sub)', padding: '24px', borderRadius: '20px' }}>
                   <div className="form-group" style={{ marginBottom: '20px' }}><label>메인 타이틀</label><DebouncedInput className="form-control" value={heroForm?.title} onChange={v => setHeroForm({...heroForm, title: v})} /></div>
                   <div className="form-group" style={{ marginBottom: '20px' }}><label>서브 설명</label><DebouncedTextarea className="form-control" value={heroForm?.subtitle} onChange={v => setHeroForm({...heroForm, subtitle: v})} /></div>
                   <MediaInput label="배경 미디어" value={heroForm?.bgUrl} onChange={v => setHeroForm({...heroForm, bgUrl: v})} uploadFile={uploadFile} accept={heroForm?.bgType === 'video' ? "video/*" : "image/*,video/*"} />
                </div>
             </section>
          )}

          {activeCategory === 'sections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800' }}>레이아웃 섹션 구성</h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="luxury-btn outline" onClick={() => handleCreateSection("custom")}><Layers size={14} /> 일반 섹션</button>
                    <button className="luxury-btn outline" onClick={() => handleCreateSection("products")}><ShoppingBag size={14} /> 상품 리스트</button>
                    <button className="luxury-btn outline" onClick={() => handleCreateSection("reviews")}><MessageSquare size={14} /> 여행 후기</button>
                  </div>
               </div>
               {sections.map((section, idx) => (
                 <div key={section.id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)} style={{ padding: '16px 24px', background: 'var(--bg-sub)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontWeight: '900', color: 'var(--primary)', opacity: 0.2 }}>{idx + 1}</span>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            {section.type === 'products' ? <ShoppingBag size={16}/> : (section.type === 'reviews' ? <MessageSquare size={16}/> : <Layers size={16}/>)}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '800' }}>{section.title}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{section.type || "custom"}</span>
                       </div>
                       <div style={{ display: 'flex', gap: '12px' }}>
                          <button onClick={e => { e.stopPropagation(); handleSectionMove(section.id, 'up'); }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><ChevronUp size={16} /></button>
                          <button onClick={e => { e.stopPropagation(); handleSectionMove(section.id, 'down'); }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><ChevronDown size={16} /></button>
                          <button onClick={e => { e.stopPropagation(); if(confirm('삭제하시겠습니까?')) deleteSection(section.id); }} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                       </div>
                    </div>

                    {activeSectionId === section.id && (
                       <div style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                             {['style', 'content', 'visual', 'typography'].map(t => (
                               <button key={t} onClick={() => setEditTab(t)} className={`luxury-btn ${editTab === t ? '' : 'outline'}`} style={{ padding: '6px 12px', fontSize: '11px' }}>{t.toUpperCase()}</button>
                             ))}
                          </div>
                          
                          {editTab === 'content' && (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="form-group"><label>섹션 타이틀</label><DebouncedInput className="form-control" value={section.title} onChange={v => updateSection(section.id, {...section, title: v})} /></div>
                                {section.type === 'custom' && (
                                   <div className="form-group"><label>섹션 설명</label><DebouncedTextarea className="form-control" value={section.content} onChange={v => updateSection(section.id, {...section, content: v})} rows={3} /></div>
                                )}
                             </div>
                          )}

                          {editTab === 'style' && (
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group"><label>배경 색상</label><input type="color" className="form-control" style={{ height: 40 }} value={section.bgColor || "#ffffff"} onChange={e => updateSection(section.id, {...section, bgColor: e.target.value})} /></div>
                                {section.type === 'custom' && (
                                   <div className="form-group"><label>레이아웃</label><select className="form-control" value={section.layout} onChange={e => updateSection(section.id, {...section, layout: e.target.value})}><option value="left">이미지 오른쪽</option><option value="right">이미지 왼쪽</option></select></div>
                                )}
                                {section.type === 'reviews' && (
                                   <div className="form-group"><label>레이아웃 스타일</label><select className="form-control" value={section.style || 'slider'} onChange={e => updateSection(section.id, {...section, style: e.target.value})}><option value="slider">슬라이더</option><option value="grid">그리드</option></select></div>
                                )}
                             </div>
                          )}

                          {editTab === 'visual' && section.type === 'custom' && (
                             <MediaInput label="대표 이미지" value={section.image} onChange={v => updateSection(section.id, {...section, image: v})} uploadFile={uploadFile} />
                          )}
                          
                          {editTab === 'typography' && (
                             <TypographyTool data={section} target="title" onUpdate={(t,f,v) => updateSection(section.id, {...section, typography: {...section.typography, [t]: {...section.typography?.[t], [f]: v}}})} />
                          )}
                       </div>
                    )}
                 </div>
               ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminHomeEditor;
