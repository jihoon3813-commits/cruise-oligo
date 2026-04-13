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

  const TypographyTool = ({ data, target, onUpdate }) => {
    const typo = data.typography?.[target] || {};
    const update = (field, val) => onUpdate(target, field, val);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
        <div className="form-group"><label style={{ fontSize: '11px', fontWeight: 700 }}>색상</label><input type="color" className="form-control" style={{ height: '38px', padding: 4 }} value={typo.color || '#000'} onChange={e => update('color', e.target.value)} /></div>
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
                 <label>히어로 섹션 좌우 여백 (px) - 현재: {heroForm?.paddingX ?? 80}px</label>
                 <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                    <input type="range" min="0" max="250" step="10" className="form-control" value={heroForm?.paddingX ?? 80} onChange={e => setHeroForm({...heroForm, paddingX: parseInt(e.target.value)})} />
                 </div>
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

      {/* Sections Config Omitted for Brevity as per usual... */}
    </div>
  );
};

export default AdminHomeEditor;
