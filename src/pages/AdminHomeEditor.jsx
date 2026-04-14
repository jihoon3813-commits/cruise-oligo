import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon, Palette, Type, Link as LinkIcon, Upload, Loader2, Play, ChevronUp, ChevronDown, Check, X, Settings2, Grid, List, Activity, MoveVertical, MousePointerClick, Sun, Moon, Coffee, Cloud, Target, Droplets, Package, Layout, Sparkles, PlusCircle, XCircle, CreditCard, ListChecks, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
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
    
    // Size check: limit to 50MB for reasonable UX
    if (file.size > 50 * 1024 * 1024) {
      alert("파일 용량이 너무 큽니다. 50MB 이하의 파일을 업로드해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const storageId = await uploadFile(file);
      onChange(`storage:${storageId}`);
    } catch (err) {
      alert("업로드 중 오류가 발생했습니다. 네트워크 상태를 확인하시거나 용량을 줄여서 다시 시도해 주세요.");
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
      {(accept?.includes('video') || (value && (value.includes('video') || value.includes('mp4')))) && (
        <p style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px', fontWeight: '600' }}>
          * 동영상은 MP4/WebM 형식을 권장하며, 용량이 크면 로딩에 시간이 걸릴 수 있습니다.
        </p>
      )}
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
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>크기</label><DebouncedInput type="number" className="form-control" value={typo.fontSize || 16} onChange={val => update('fontSize', val)} onClick={e => e.stopPropagation()} /></div>
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

  const handleSectionUpdate = async (id, payload) => {
    try {
      await updateSection(id, payload);
    } catch (e) {
      console.error("Section update failed:", e);
    }
  };

  const handleTypographyUpdate = async (section, target, field, value) => {
    const typo = section.typography || {};
    const targetTypo = typo[target] || {};
    const updatedTypo = { ...typo, [target]: { ...targetTypo, [field]: value } };
    await handleSectionUpdate(section.id, { ...section, typography: updatedTypo });
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
      cardStyles: { shadow: 0.1, borderRadius: 24, borderWidth: 1, borderColor: "#e2e8f0", bgColor: "#ffffff" },
      showButton: true,
      buttonText: "자세히 보기",
      buttonLink: "",
      buttonStyles: { size: "medium", bgColor: "#2563EB", textColor: "#ffffff", borderColor: "#2563EB" },
      bgColor: "#ffffff",
      bgType: "color",
      bgOpacity: 1,
      paddingTop: 80,
      paddingBottom: 80
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '16px', display: 'block' }}>히어로 레이아웃 스타일</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                          {['classic', 'full-bg', 'split', 'card', 'minimal', 'video-focus'].map(s => (
                            <div key={s} onClick={() => setHeroForm({...heroForm, style: s})} style={{ padding: '20px', borderRadius: '16px', background: '#fff', border: heroForm?.style === s ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}><p style={{ fontSize: '12px', fontWeight: '700' }}>{s.toUpperCase()}</p></div>
                          ))}
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '16px', display: 'block' }}>텍스트 정렬 (가로)</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {[
                            { id: 'left', label: '왼쪽', icon: <AlignLeft size={16}/> },
                            { id: 'center', label: '가운데', icon: <AlignCenter size={16}/> },
                            { id: 'right', label: '오른쪽', icon: <AlignRight size={16}/> }
                          ].map(opt => (
                            <button 
                              key={opt.id} 
                              onClick={() => setHeroForm({ ...heroForm, textPosition: opt.id })}
                              className={`luxury-btn ${heroForm?.textPosition === opt.id ? '' : 'outline'}`}
                              style={{ flex: 1, gap: '8px', padding: '12px', borderRadius: '12px' }}
                            >
                              {opt.icon} {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '16px', display: 'block' }}>수직 정렬 (세로)</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {[
                            { id: 'top', label: '상단' },
                            { id: 'center', label: '중앙' },
                            { id: 'bottom', label: '하단' }
                          ].map(v => (
                            <button 
                              key={v.id} 
                              onClick={() => setHeroForm({ ...heroForm, verticalAlign: v.id })}
                              className={`luxury-btn ${heroForm?.verticalAlign === v.id ? '' : 'outline'}`}
                              style={{ flex: 1, padding: '12px', borderRadius: '12px' }}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                 )}

                 {heroTab === 'content' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                       <div className="form-group"><label>상단 강조 문구</label><DebouncedInput className="form-control" value={heroForm?.aboveTitle || ""} onChange={val => setHeroForm({...heroForm, aboveTitle: val})} /></div>
                       <div className="form-group"><label>메인 타이틀</label><DebouncedTextarea className="form-control" value={heroForm?.title} onChange={val => setHeroForm({...heroForm, title: val})} rows={3} /></div>
                       <div className="form-group"><label>서브 타이틀</label><DebouncedTextarea className="form-control" value={heroForm?.subtitle} onChange={val => setHeroForm({...heroForm, subtitle: val})} rows={2} /></div>
                       <div className="form-group"><label>하단 상세 문구</label><DebouncedInput className="form-control" value={heroForm?.belowTitle || ""} onChange={val => setHeroForm({...heroForm, belowTitle: val})} /></div>
                    </div>
                 )}

                 {heroTab === 'visual' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                       <MediaInput 
                          label="배경 미디어" 
                          value={heroForm?.bgUrl} 
                          onChange={v => setHeroForm({...heroForm, bgUrl: v})} 
                          uploadFile={uploadFile} 
                          accept={heroForm?.bgType === 'video' ? "video/*" : "image/*,video/*"}
                       />
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
                              <div className="form-group" style={{ marginBottom: '12px' }}><label style={{fontSize:'11px'}}>버튼 문구</label><DebouncedInput className="form-control" value={btn.text} onChange={val => { const b=[...heroForm.buttons]; b[idx]={...b[idx], text:val}; setHeroForm({...heroForm, buttons:b})}} /></div>
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
                          <span style={{ fontSize: '11px', background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>{(section.style || 'classic').toUpperCase()}</span>
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
                            {['style', 'content', 'visual', 'card', 'typography', 'button'].map(t => (
                              <button key={t} onClick={() => setEditTab(t)} className={`luxury-btn ${editTab === t ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '11px' }}>{t.toUpperCase() === 'CARD' ? <CreditCard size={14}/> : t.toUpperCase()}</button>
                            ))}
                          </div>
                          
                          {editTab === 'style' && (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="form-group">
                                   <label>상단 메뉴명 (입력 시 내비게이션 바에 표시)</label>
                                   <DebouncedInput 
                                      className="form-control" 
                                      placeholder="예: 멤버십 혜택, 서비스 소개 등" 
                                      value={section.menuName || ""} 
                                      onChange={val => handleSectionUpdate(section.id, { ...section, menuName: val })} 
                                   />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                   {['classic', 'split-card', 'minimal-centered', 'gallery', 'feature-cards', 'process', 'luxury-row'].map(s => (
                                     <div key={s} onClick={() => handleSectionUpdate(section.id, { ...section, style: s })} style={{ padding: '20px', borderRadius: '16px', border: section.style === s ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}><p style={{ fontSize: '11px', fontWeight: '700' }}>{s.toUpperCase()}</p></div>
                                   ))}
                                </div>
                             </div>
                          )}

                          {editTab === 'content' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                               <div className="form-group"><label>상단 보조 타이틀 (모든 스타일 적용)</label><DebouncedInput className="form-control" value={section.aboveTitle || ""} onChange={val => handleSectionUpdate(section.id, { ...section, aboveTitle: val })} /></div>
                               <div className="form-group"><label>섹션 타이틀 (줄바꿈 가능)</label><DebouncedTextarea className="form-control" value={section.title} onChange={val => handleSectionUpdate(section.id, { ...section, title: val })} rows={2} /></div>
                               <div className="form-group"><label>서브 설명 (줄바꿈 가능)</label><DebouncedTextarea className="form-control" value={section.content} onChange={val => handleSectionUpdate(section.id, { ...section, content: val })} rows={4} /></div>
                               
                               <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                     <label style={{ fontWeight: 800 }}>상세 아이템/투어 카드 리스트</label>
                                     <button className="luxury-btn outline" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => {
                                        const items = section.items || [];
                                        const newItem = { 
                                           id: Date.now().toString(), 
                                           title: "새로운 항목", 
                                           content: "설명", 
                                           aboveTitle: "", 
                                           aboveTitle2: "", 
                                           tag: "", 
                                           number: (items.length + 1).toString().padStart(2, '0'), 
                                           highlights: [], 
                                           highlightStyle: "dot",
                                           showButton: false,
                                           buttonText: "자세히 보기",
                                           buttonLink: "/",
                                           buttonStyles: { bgColor: "#2563EB", textColor: "#ffffff", borderColor: "#2563EB" }
                                        };
                                        handleSectionUpdate(section.id, { ...section, items: [...items, newItem] });
                                     }}><Plus size={14} /> 추가</button>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                     {(section.items || []).map((item, i) => (
                                       <div key={i} style={{ background: 'var(--bg-sub)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                             <div style={{ display: 'flex', gap: '12px' }}>
                                                <div className="form-group" style={{ width: '60px' }}><label style={{fontSize:'10px'}}>번호</label><DebouncedInput className="form-control" value={item.number} onChange={val => { const ni=[...section.items]; ni[i]={...ni[i], number:val}; handleSectionUpdate(section.id, { ...section, items: ni }); }} /></div>
                                                <MediaInput label="아이템 개별 이미지" value={item.image} onChange={v => { const ni=[...section.items]; ni[i]={...ni[i], image: v}; handleSectionUpdate(section.id, { ...section, items: ni }); }} uploadFile={uploadFile} />
                                             </div>
                                             <button style={{ color: '#ef4444', border: 'none', background: 'none' }} onClick={() => { const ni=section.items.filter((_, idx)=>idx!==i); handleSectionUpdate(section.id, { ...section, items: ni }); }}><Trash2 size={16}/></button>
                                          </div>
                                          
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                             <div className="form-group"><label style={{fontSize:'10px'}}>최상단 소제목 (예: 1일차)</label><DebouncedInput className="form-control" value={item.aboveTitle} onChange={val => { const ni=[...section.items]; ni[i]={...ni[i], aboveTitle:val}; handleSectionUpdate(section.id, { ...section, items: ni }); }} /></div>
                                             <div className="form-group"><label style={{fontSize:'10px'}}>타이틀 바로 위 (예: 싱가포르)</label><DebouncedInput className="form-control" value={item.aboveTitle2} onChange={val => { const ni=[...section.items]; ni[i]={...ni[i], aboveTitle2:val}; handleSectionUpdate(section.id, { ...section, items: ni }); }} /></div>
                                             <div className="form-group" style={{ gridColumn: 'span 2' }}><label style={{fontSize:'10px'}}>메인 타이틀</label><DebouncedInput className="form-control" value={item.title} onChange={val => { const ni=[...section.items]; ni[i]={...ni[i], title:val}; handleSectionUpdate(section.id, { ...section, items: ni }); }} /></div>
                                             <div className="form-group" style={{ gridColumn: 'span 2' }}><label style={{fontSize:'10px'}}>하단 설명</label><DebouncedTextarea className="form-control" value={item.content} onChange={val => { const ni=[...section.items]; ni[i]={...ni[i], content:val}; handleSectionUpdate(section.id, { ...section, items: ni }); }} rows={3} /></div>
                                             <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                   <label style={{fontSize:'10px', fontWeight: '800'}}><ListChecks size={12}/> 주요 하이라이트 (불렛 리스트)</label>
                                                   <select className="form-control" style={{ width: '100px', fontSize: '10px', height: '24px', padding: '0 4px' }} value={item.highlightStyle || 'dot'} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], highlightStyle: e.target.value}; handleSectionUpdate(section.id, { ...section, items: ni }); }}>
                                                      <option value="dot">기본 점 (●)</option>
                                                      <option value="dash">대시 (—)</option>
                                                      <option value="star">별 (★)</option>
                                                   </select>
                                                </div>
                                                <DebouncedTextarea 
                                                   className="form-control" 
                                                   style={{ fontSize: '12px' }}
                                                   placeholder="행을 나누어 입력하세요 (엔터로 구분)" 
                                                   value={(item.highlights || []).join('\n')} 
                                                   onChange={val => { 
                                                      const ni=[...section.items]; 
                                                      ni[i]={...ni[i], highlights: val.split('\n').filter(s => s.trim() !== "")}; 
                                                      handleSectionUpdate(section.id, { ...section, items: ni }); 
                                                   }} 
                                                   rows={3} 
                                                />
                                             </div>
                                             
                                             <div style={{ gridColumn: 'span 2', background: '#fff', padding: '16px', borderRadius: '12px', marginTop: '12px' }}>
                                                <label style={{ fontSize: '11px', fontWeight: '800', marginBottom: '10px', display: 'block' }}>글자 색상 개별 설정</label>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                                   <div className="form-group">
                                                      <label style={{fontSize:'9px'}}>소제목 색상</label>
                                                      <input type="color" className="form-control" value={item.typography?.above?.color || "#2563EB"} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], typography: { ...ni[i].typography, above: { ...ni[i].typography?.above, color: e.target.value } } }; handleSectionUpdate(section.id, { ...section, items: ni }); }} />
                                                   </div>
                                                   <div className="form-group">
                                                      <label style={{fontSize:'9px'}}>타이틀 색상</label>
                                                      <input type="color" className="form-control" value={item.typography?.title?.color || "#0F172A"} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], typography: { ...ni[i].typography, title: { ...ni[i].typography?.title, color: e.target.value } } }; handleSectionUpdate(section.id, { ...section, items: ni }); }} />
                                                   </div>
                                                   <div className="form-group">
                                                      <label style={{fontSize:'9px'}}>본문 색상</label>
                                                      <input type="color" className="form-control" value={item.typography?.content?.color || "#64748B"} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], typography: { ...ni[i].typography, content: { ...ni[i].typography?.content, color: e.target.value } } }; handleSectionUpdate(section.id, { ...section, items: ni }); }} />
                                                   </div>
                                                   <div className="form-group">
                                                       <label style={{fontSize:'9px'}}>하이라이트 제목 색상</label>
                                                       <input type="color" className="form-control" value={item.typography?.highlights?.labelColor || "var(--primary)"} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], typography: { ...ni[i].typography, highlights: { ...ni[i].typography?.highlights, labelColor: e.target.value } } }; handleSectionUpdate(section.id, { ...section, items: ni }); }} />
                                                   </div>
                                                   <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                       <label style={{fontSize:'9px'}}>리스트 텍스트 색상</label>
                                                       <input type="color" className="form-control" value={item.typography?.highlights?.color || "var(--text-main)"} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], typography: { ...ni[i].typography, highlights: { ...ni[i].typography?.highlights, color: e.target.value } } }; handleSectionUpdate(section.id, { ...section, items: ni }); }} />
                                                   </div>
                                                </div>
                                             </div>

                                             <div style={{ gridColumn: 'span 2', background: 'rgba(37, 99, 235, 0.03)', padding: '20px', borderRadius: '16px', marginTop: '12px', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                   <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}><MousePointerClick size={14}/> 아이템 개별 버튼 설정</label>
                                                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                       <button 
                                                         onClick={() => { const ni=[...section.items]; ni[i]={...ni[i], showButton: !item.showButton}; handleSectionUpdate(section.id, { ...section, items: ni }); }}
                                                         style={{ 
                                                           width: '40px', height: '20px', borderRadius: '10px', 
                                                           background: item.showButton ? 'var(--primary)' : '#cbd5e1',
                                                           position: 'relative', border: 'none', cursor: 'pointer', transition: '0.3s'
                                                         }}
                                                       >
                                                          <div style={{ 
                                                            width: '16px', height: '16px', background: '#fff', borderRadius: '50%',
                                                            position: 'absolute', top: '2px', left: item.showButton ? '22px' : '2px',
                                                            transition: '0.2s'
                                                          }} />
                                                       </button>
                                                       <span style={{ fontSize: '10px', fontWeight: '700', color: item.showButton ? 'var(--primary)' : 'var(--text-muted)' }}>{item.showButton ? "활성화됨" : "비활성화"}</span>
                                                    </div>
                                                </div>
                                                
                                                {item.showButton && (
                                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px' }}>
                                                        <div className="form-group"><label style={{fontSize:'10px'}}>버튼 문구</label><DebouncedInput className="form-control" style={{fontSize:'12px'}} value={item.buttonText || "자세히 보기"} onChange={val => { const ni=[...section.items]; ni[i]={...ni[i], buttonText:val}; handleSectionUpdate(section.id, { ...section, items: ni }); }} /></div>
                                                        <div className="form-group"><label style={{fontSize:'10px'}}>이동 링크</label><DebouncedInput className="form-control" style={{fontSize:'12px'}} value={item.buttonLink || "/"} onChange={val => { const ni=[...section.items]; ni[i]={...ni[i], buttonLink:val}; handleSectionUpdate(section.id, { ...section, items: ni }); }} /></div>
                                                     </div>
                                                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                                        <div className="form-group"><label style={{fontSize:'9px'}}>배경색</label><input type="color" className="form-control" style={{height:'32px', padding:'2px'}} value={item.buttonStyles?.bgColor || "#2563EB"} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], buttonStyles: { ...ni[i].buttonStyles, bgColor: e.target.value } }; handleSectionUpdate(section.id, { ...section, items: ni }); }} /></div>
                                                        <div className="form-group"><label style={{fontSize:'9px'}}>글자색</label><input type="color" className="form-control" style={{height:'32px', padding:'2px'}} value={item.buttonStyles?.textColor || "#ffffff"} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], buttonStyles: { ...ni[i].buttonStyles, textColor: e.target.value } }; handleSectionUpdate(section.id, { ...section, items: ni }); }} /></div>
                                                        <div className="form-group"><label style={{fontSize:'9px'}}>테두리색</label><input type="color" className="form-control" style={{height:'32px', padding:'2px'}} value={item.buttonStyles?.borderColor || "#2563EB"} onChange={e => { const ni=[...section.items]; ni[i]={...ni[i], buttonStyles: { ...ni[i].buttonStyles, borderColor: e.target.value } }; handleSectionUpdate(section.id, { ...section, items: ni }); }} /></div>
                                                     </div>
                                                  </div>
                                                )}
                                             </div>
                                          </div>
                                       </div>
                                     ))}
                                  </div>
                               </div>

                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                                  <div className="form-group"><label>상단 여백</label><DebouncedInput type="number" className="form-control" value={section.paddingTop} onChange={val => handleSectionUpdate(section.id, { ...section, paddingTop: val })} /></div>
                                  <div className="form-group"><label>하단 여백</label><DebouncedInput type="number" className="form-control" value={section.paddingBottom} onChange={val => handleSectionUpdate(section.id, { ...section, paddingBottom: val })} /></div>
                               </div>
                            </div>
                          )}

                          {editTab === 'visual' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                               <MediaInput label="대표 메인 이미지" value={section.image} onChange={v => handleSectionUpdate(section.id, { ...section, image: v })} uploadFile={uploadFile} />
                               <div className="form-group"><label>배경 타입</label><select className="form-control" value={section.bgType} onChange={e => handleSectionUpdate(section.id, { ...section, bgType: e.target.value })}><option value="color">단색</option><option value="image">이미지</option><option value="video">동영상</option></select></div>
                               {section.bgType === 'color' ? (
                                  <div className="form-group"><label>배경 색상</label><input type="color" className="form-control" style={{ height: 42, padding: 4 }} value={section.bgColor} onChange={e => handleSectionUpdate(section.id, { ...section, bgColor: e.target.value })} onClick={e => e.stopPropagation()} /></div>
                               ) : (<MediaInput label="배경 URL" value={section.bgUrl} onChange={v => handleSectionUpdate(section.id, { ...section, bgUrl: v })} uploadFile={uploadFile} accept={section.bgType === 'video' ? "video/*" : "image/*,video/*"} />)}
                               <div className="form-group">
                                  <label>배경 투명도/밝기 ({section.bgOpacity})</label>
                                  <input type="range" min="0" max="1" step="0.1" className="form-control" value={section.bgOpacity} onChange={e => handleSectionUpdate(section.id, { ...section, bgOpacity: parseFloat(e.target.value) })} onClick={e => e.stopPropagation()} />
                                </div>
                               <MultiMediaInput label="갤러리/이미지 리스트" values={section.images || []} onChange={v => handleSectionUpdate(section.id, { ...section, images: v })} uploadFile={uploadFile} />
                               {section.images && section.images.length > 1 && (
                                 <div className="form-group" style={{ gridColumn: 'span 2', background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '800', marginBottom: '12px', display: 'block' }}>자동 슬라이드 간격 (초)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                       <input 
                                          type="range" min="1" max="10" step="0.5" 
                                          className="form-control" style={{ flex: 1 }}
                                          value={section.slideDuration || 3} 
                                          onChange={e => handleSectionUpdate(section.id, { ...section, slideDuration: parseFloat(e.target.value) })} 
                                       />
                                       <div style={{ width: '60px', textAlign: 'center', fontWeight: '800', fontSize: '15px', color: 'var(--primary)' }}>
                                          {section.slideDuration || 3}s
                                       </div>
                                    </div>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>* 0으로 설정하면 자동 재생이 꺼집니다.</p>
                                 </div>
                               )}
                               <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                  <label>레이아웃 방향</label>
                                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                     <button className={`luxury-btn ${section.layout === 'left' ? '' : 'outline'}`} onClick={() => handleSectionUpdate(section.id, { ...section, layout: 'left' })} style={{ flex: 1 }}>기본 (L)</button>
                                     <button className={`luxury-btn ${section.layout === 'right' ? '' : 'outline'}`} onClick={() => handleSectionUpdate(section.id, { ...section, layout: 'right' })} style={{ flex: 1 }}>반전 (R)</button>
                                  </div>
                               </div>
                            </div>
                          )}

                          {editTab === 'card' && (
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                  <label>그림자 농도 ({section.cardStyles?.shadow ?? 0.1})</label>
                                  <input type="range" min="0" max="0.5" step="0.01" className="form-control" value={section.cardStyles?.shadow ?? 0.1} onChange={e => handleSectionUpdate(section.id, { ...section, cardStyles: { ...section.cardStyles, shadow: parseFloat(e.target.value) } })} />
                                </div>
                                <div className="form-group"><label>모서리 둥글기 (px)</label><DebouncedInput type="number" className="form-control" value={section.cardStyles?.borderRadius ?? 24} onChange={val => handleSectionUpdate(section.id, { ...section, cardStyles: { ...section.cardStyles, borderRadius: val } })} /></div>
                                <div className="form-group"><label>테두리 두께 (px)</label><DebouncedInput type="number" className="form-control" value={section.cardStyles?.borderWidth ?? 1} onChange={val => handleSectionUpdate(section.id, { ...section, cardStyles: { ...section.cardStyles, borderWidth: val } })} /></div>
                                <div className="form-group"><label>카드 배경색</label><input type="color" className="form-control" style={{ height: 42, padding: 4 }} value={section.cardStyles?.bgColor || "#ffffff"} onChange={e => handleSectionUpdate(section.id, { ...section, cardStyles: { ...section.cardStyles, bgColor: e.target.value } })} /></div>
                                <div className="form-group"><label>테두리 색상</label><input type="color" className="form-control" style={{ height: 42, padding: 4 }} value={section.cardStyles?.borderColor || "#e2e8f0"} onChange={e => handleSectionUpdate(section.id, { ...section, cardStyles: { ...section.cardStyles, borderColor: e.target.value } })} /></div>
                             </div>
                          )}

                          {editTab === 'typography' && (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div><label style={{ fontWeight: 800 }}>타이틀 폰트</label><TypographyTool data={section} target="title" onUpdate={(t,f,v) => handleTypographyUpdate(section, t,f,v)} /></div>
                                <div><label style={{ fontWeight: 800 }}>본문 폰트</label><TypographyTool data={section} target="content" onUpdate={(t,f,v) => handleTypographyUpdate(section, t,f,v)} /></div>
                             </div>
                          )}

                          {editTab === 'button' && (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="form-group">
                                   <label>버튼 표시 여부</label>
                                   <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                      <button className={`luxury-btn ${section.showButton ? '' : 'outline'}`} onClick={() => handleSectionUpdate(section.id, { ...section, showButton: true })} style={{ flex: 1 }}>표시 (ON)</button>
                                      <button className={`luxury-btn ${!section.showButton ? '' : 'outline'}`} onClick={() => handleSectionUpdate(section.id, { ...section, showButton: false })} style={{ flex: 1 }}>숨김 (OFF)</button>
                                   </div>
                                </div>
                                
                                {section.showButton && (
                                   <>
                                      <div className="form-group"><label>버튼 문구</label><DebouncedInput className="form-control" value={section.buttonText || ""} onChange={val => handleSectionUpdate(section.id, { ...section, buttonText: val })} /></div>
                                      <div className="form-group"><label>버튼 연결 링크</label><DebouncedInput className="form-control" value={section.buttonLink || ""} onChange={val => handleSectionUpdate(section.id, { ...section, buttonLink: val })} /></div>
                                      
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
                                         <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>배경색</label><input type="color" className="form-control" value={section.buttonStyles?.bgColor || "#2563EB"} onChange={e => handleSectionUpdate(section.id, { ...section, buttonStyles: { ...section.buttonStyles, bgColor: e.target.value } })} /></div>
                                         <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>글자색</label><input type="color" className="form-control" value={section.buttonStyles?.textColor || "#ffffff"} onChange={e => handleSectionUpdate(section.id, { ...section, buttonStyles: { ...section.buttonStyles, textColor: e.target.value } })} /></div>
                                         <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>테두리색</label><input type="color" className="form-control" value={section.buttonStyles?.borderColor || section.buttonStyles?.bgColor || "#2563EB"} onChange={e => handleSectionUpdate(section.id, { ...section, buttonStyles: { ...section.buttonStyles, borderColor: e.target.value } })} /></div>
                                         <div className="form-group">
                                            <label style={{ fontSize: '11px', fontWeight: 700 }}>크기</label>
                                            <select className="form-control" value={section.buttonStyles?.size || 'medium'} onChange={e => handleSectionUpdate(section.id, { ...section, buttonStyles: { ...section.buttonStyles, size: e.target.value } })}>
                                               <option value="small">Small</option>
                                               <option value="medium">Medium</option>
                                               <option value="large">Large</option>
                                            </select>
                                         </div>
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
                    <DebouncedInput className="form-control" value={productBrandingForm?.title || "추천 패키지"} onChange={val => setProductBrandingForm({...productBrandingForm, title: val})} />
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                       <label>타이틀 글씨 색상</label>
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                          <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={productBrandingForm?.titleColor?.startsWith('#') ? productBrandingForm.titleColor : "#000000"} onChange={e => setProductBrandingForm({...productBrandingForm, titleColor: e.target.value})} onClick={e => e.stopPropagation()} />
                          <DebouncedInput className="form-control" value={productBrandingForm?.titleColor || "#000000"} onChange={val => setProductBrandingForm({...productBrandingForm, titleColor: val})} onClick={e => e.stopPropagation()} />
                       </div>
                    </div>
                    <div className="form-group">
                       <label>섹션 전체 배경색</label>
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                          <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={productBrandingForm?.bgColor?.startsWith('#') ? productBrandingForm.bgColor : "#ffffff"} onChange={e => setProductBrandingForm({...productBrandingForm, bgColor: e.target.value})} onClick={e => e.stopPropagation()} />
                          <DebouncedInput className="form-control" value={productBrandingForm?.bgColor || "#ffffff"} onChange={val => setProductBrandingForm({...productBrandingForm, bgColor: val})} onClick={e => e.stopPropagation()} />
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
                        <DebouncedInput className="form-control" value={reviewBrandingForm?.title || "여행 후기"} onChange={val => setReviewBrandingForm({...reviewBrandingForm, title: val})} />
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
