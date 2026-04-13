import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon, Palette, Type, Link as LinkIcon, Upload, Loader2, Play, ChevronUp, ChevronDown, Check, X, Settings2, Grid, List, Activity } from 'lucide-react';

const AdminHomeEditor = () => {
  const { config, updateHero, updateSection, addSection, deleteSection, uploadFile } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [editTab, setEditTab] = useState('style'); // 'style', 'content', 'visual', 'typography'

  useEffect(() => {
    if (config.hero) setHeroForm(config.hero);
  }, [config.hero]);

  const handleHeroSave = async () => {
    await updateHero(heroForm);
    alert('홈페이지 대문 설정이 저장되었습니다.');
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
      buttonLink: "",
      bgColor: "#ffffff",
      bgType: "color"
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
      <div className="form-group">
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
      onChange([...values, `storage:${storageId}`]);
      setLoading(false);
    };
    return (
      <div className="form-group" style={{ gridColumn: 'span 2' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>{label}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
          {values.map((src, idx) => (
            <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img src={src.startsWith('storage:') ? 'https://via.placeholder.com/100?text=File' : src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => onChange(values.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer' }}><X size={10} /></button>
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

  const TypographyTool = ({ section, target }) => {
    const typo = section.typography?.[target] || {};
    const update = (field, val) => handleTypographyUpdate(section.id, target, field, val);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>색상</label>
          <input type="color" className="form-control" style={{ height: '38px', padding: '4px' }} value={typo.color || (target === 'title' ? '#0F172A' : '#64748B')} onChange={e => update('color', e.target.value)} />
        </div>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>크기(px)</label>
          <input type="number" className="form-control" value={typo.fontSize || (target === 'title' ? 42 : 18)} onChange={e => update('fontSize', parseInt(e.target.value))} />
        </div>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>정렬</label>
          <select className="form-control" value={typo.textAlign || "left"} onChange={e => update('textAlign', e.target.value)}>
            <option value="left">왼쪽</option>
            <option value="center">가운데</option>
            <option value="right">오른쪽</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>자간(em)</label>
          <input type="number" step="0.01" className="form-control" value={typo.letterSpacing || 0} onChange={e => update('letterSpacing', parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>행간</label>
          <input type="number" step="0.1" className="form-control" value={typo.lineHeight || 1.4} onChange={e => update('lineHeight', parseFloat(e.target.value))} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Hero Editor */}
      <section className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
           <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Monitor size={24} /></div>
           <h2 style={{ fontSize: '20px', fontWeight: '800' }}>히어로 브랜딩 주관제어</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
           <div style={{ gridColumn: 'span 2' }}><label>메인 타이틀 (줄바꿈 \n 사용)</label><textarea className="form-control" value={heroForm?.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} rows={3} /></div>
           <MediaInput label="배경 URL / 파일" value={heroForm?.bgUrl} onChange={v => setHeroForm({...heroForm, bgUrl: v})} />
           <div className="form-group"><label>정렬</label><select className="form-control" value={heroForm?.textPosition} onChange={e => setHeroForm({...heroForm, textPosition: e.target.value})}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}><button className="luxury-btn" onClick={handleHeroSave}><Save size={18} /> 저장</button></div>
      </section>

      {/* Sections Config */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>섹션 디테일 레이아웃</h2>
          <button className="luxury-btn outline" onClick={handleAddNewSection}><Plus size={16} /> 섹션 추가</button>
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
                   <span style={{ fontSize: '10px', background: 'var(--primary)', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{section.style}</span>
                </div>
                <button onClick={e => { e.stopPropagation(); handleRemoveSection(section.id); }} style={{ color: '#ef4444', border: 'none', background: 'none' }}><Trash2 size={18} /></button>
              </div>

              {activeSectionId === section.id && (
                <div style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                     {['style', 'content', 'visual', 'typography'].map(t => (
                       <button key={t} onClick={() => setEditTab(t)} className={`luxury-btn ${editTab === t ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px' }}>
                         {t === 'style' && <Grid size={14} />} {t === 'content' && <List size={14} />} {t === 'visual' && <Palette size={14} />} {t === 'typography' && <Type size={14} />}
                         {t.toUpperCase()}
                       </button>
                     ))}
                  </div>

                  {editTab === 'style' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {[
                        { id: 'classic', label: 'Classic', icon: <Layers /> },
                        { id: 'split-card', label: 'Split Card', icon: <Palette /> },
                        { id: 'minimal-centered', label: 'Minimal', icon: <Type /> },
                        { id: 'gallery', label: 'Gallery', icon: <ImageIcon /> },
                        { id: 'feature-cards', label: 'Feature Cards', icon: <Grid /> },
                        { id: 'process', label: 'Process Step', icon: <Activity /> }
                      ].map(s => (
                        <div key={s.id} onClick={() => handleSectionUpdate(section.id, 'style', s.id)} style={{ padding: '20px', borderRadius: '16px', border: section.style === s.id ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}>
                          <div style={{ marginBottom: '8px', color: section.style === s.id ? 'var(--primary)' : 'var(--text-muted)' }}>{s.icon}</div>
                          <p style={{ fontSize: '12px', fontWeight: '700' }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {editTab === 'content' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                       <div className="form-group"><label>타이틀</label><input className="form-control" value={section.title} onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)} /></div>
                       <div className="form-group"><label>본문 내용</label><textarea className="form-control" value={section.content} onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)} rows={4} /></div>
                       {(section.style === 'feature-cards' || section.style === 'process') && (
                         <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><h4>하위 아이템 카드 ({section.items?.length || 0})</h4><button className="luxury-btn outline" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => handleAddItem(section.id)}><Plus size={14} /> 추가</button></div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {(section.items || []).map((item, i) => (
                                <div key={i} style={{ padding: '16px', background: 'var(--bg-sub)', borderRadius: '12px', display: 'grid', gridTemplateColumns: '80px 1fr 40px', gap: '12px', alignItems: 'center' }}>
                                   <input className="form-control" value={item.number || ""} onChange={e => handleUpdateItem(section.id, i, 'number', e.target.value)} placeholder="01" />
                                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <input className="form-control" style={{ fontWeight: 700 }} value={item.title} onChange={e => handleUpdateItem(section.id, i, 'title', e.target.value)} placeholder="제목" />
                                      <textarea className="form-control" value={item.content} onChange={e => handleUpdateItem(section.id, i, 'content', e.target.value)} placeholder="상세 설명" rows={2} />
                                   </div>
                                   <button onClick={() => handleRemoveItem(section.id, i)} style={{ color: '#ef4444', border: 'none', background: 'none' }}><Trash2 size={16} /></button>
                                </div>
                              ))}
                            </div>
                         </div>
                       )}
                    </div>
                  )}

                  {editTab === 'visual' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                       <MediaInput label="메인 이미지" value={section.image} onChange={v => handleSectionUpdate(section.id, 'image', v)} />
                       <MultiMediaInput label="멀티 이미지 갤러리" values={section.images} onChange={v => handleSectionUpdate(section.id, 'images', v)} />
                       <div className="form-group"><label>배경 타입</label><select className="form-control" value={section.bgType} onChange={e => handleSectionUpdate(section.id, 'bgType', e.target.value)}><option value="color">Color</option><option value="image">Image</option><option value="video">Video</option></select></div>
                       {section.bgType === 'color' ? <div className="form-group"><label>배경색</label><input type="color" className="form-control" style={{ height: '42px' }} value={section.bgColor} onChange={e => handleSectionUpdate(section.id, 'bgColor', e.target.value)} /></div> : <MediaInput label="배경 파일" value={section.bgUrl} onChange={v => handleSectionUpdate(section.id, 'bgUrl', v)} />}
                    </div>
                  )}

                  {editTab === 'typography' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                       <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>타이틀 폰트 설정</label><TypographyTool section={section} target="title" /></div>
                       <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>본문 폰트 설정</label><TypographyTool section={section} target="content" /></div>
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
