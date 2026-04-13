import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon, Palette, Type, Link as LinkIcon, Upload, Loader2, Play } from 'lucide-react';

const AdminHomeEditor = () => {
  const { config, updateHero, updateSection, addSection, deleteSection, uploadFile } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);
  const [activeSectionId, setActiveSectionId] = useState(null);

  useEffect(() => {
    if (config.hero) setHeroForm(config.hero);
  }, [config.hero]);

  const handleHeroSave = async () => {
    await updateHero(heroForm);
    alert('홈페이지 대문 설정이 저장되었습니다.');
  };

  const handleSectionUpdate = async (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    await updateSection(id, { ...section, [field]: value });
  };

  const handleAddNewSection = async () => {
    await addSection({
      title: "새로운 패키지 소개",
      content: "이 여정의 특별한 점을 설명해 주세요...",
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      layout: "left",
      style: "classic",
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
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>{label}</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input className="form-control" value={value || ""} onChange={e => onChange(e.target.value)} placeholder="URL 입력 또는 업로드" />
          <button className="luxury-btn outline" style={{ padding: '0 12px' }} onClick={() => fileRef.current.click()} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          </button>
          <input type="file" ref={fileRef} hidden onChange={onFileChange} />
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
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>히어로 브랜딩 설정</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>메인 헤드라인</label>
            <textarea 
              className="form-control" 
              value={heroForm?.title || ""} 
              onChange={e => setHeroForm({...heroForm, title: e.target.value})}
              rows={3}
            />
          </div>
          <MediaInput label="배경 미디어 (이미지/영상)" value={heroForm?.bgUrl} onChange={val => setHeroForm({...heroForm, bgUrl: val})} />
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>미디어 타입</label>
            <select className="form-control" value={heroForm?.bgType} onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}>
              <option value="image">이미지</option>
              <option value="video">영상</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
           <button className="luxury-btn" onClick={handleHeroSave}>
             <Save size={18} /> 설정 저장하기
           </button>
        </div>
      </section>

      {/* Sections Config */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Layers size={21} /></div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>홍보 섹션 관리</h2>
          </div>
          <button className="luxury-btn outline" style={{ borderRadius: '12px', padding: '10px 20px', fontSize: '13px' }} onClick={handleAddNewSection}>
            <Plus size={16} /> 신규 섹션
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {config.sections.map((section, index) => (
            <div key={section.id} className="admin-card" style={{ 
              padding: '0', overflow: 'hidden', 
              border: activeSectionId === section.id ? '2px solid var(--primary)' : '1px solid var(--border-light)' 
            }}>
              <div 
                style={{ padding: '20px 32px', background: 'var(--bg-sub)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ width: '28px', height: '28px', background: 'var(--primary)', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>{index + 1}</div>
                   <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{section.title || '제목 없음'}</h3>
                   <span style={{ fontSize: '11px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{section.style}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveSection(section.id); }} style={{ color: '#ef4444', border: 'none', background: 'none' }}><Trash2 size={18} /></button>
                </div>
              </div>
              
              {activeSectionId === section.id && (
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Style Settings */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <div 
                      onClick={() => handleSectionUpdate(section.id, 'style', 'classic')}
                      style={{ padding: '16px', borderRadius: '12px', border: section.style === 'classic' ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}
                    >
                      <Layers size={20} style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '12px', fontWeight: '700' }}>Classic Side</p>
                    </div>
                    <div 
                      onClick={() => handleSectionUpdate(section.id, 'style', 'split-card')}
                      style={{ padding: '16px', borderRadius: '12px', border: section.style === 'split-card' ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}
                    >
                      <Palette size={20} style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '12px', fontWeight: '700' }}>Split Card</p>
                    </div>
                    <div 
                      onClick={() => handleSectionUpdate(section.id, 'style', 'minimal-centered')}
                      style={{ padding: '16px', borderRadius: '12px', border: section.style === 'minimal-centered' ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}
                    >
                      <Type size={20} style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '12px', fontWeight: '700' }}>Minimal Center</p>
                    </div>
                  </div>

                  {/* Content Settings */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>제목</label>
                      <input className="form-control" value={section.title} onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>상세 내용</label>
                      <textarea className="form-control" rows={4} value={section.content} onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)} />
                    </div>
                    <MediaInput label="메인 이미지" value={section.image} onChange={val => handleSectionUpdate(section.id, 'image', val)} />
                    <div className="form-group">
                       <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>이미지 위치</label>
                       <select className="form-control" value={section.layout} onChange={e => handleSectionUpdate(section.id, 'layout', e.target.value)}>
                         <option value="left">왼쪽</option>
                         <option value="right">오른쪽</option>
                       </select>
                    </div>
                  </div>

                  {/* Background & Button Settings */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div className="form-group">
                       <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>배경 타입</label>
                       <select className="form-control" value={section.bgType} onChange={e => handleSectionUpdate(section.id, 'bgType', e.target.value)}>
                         <option value="color">단색 배경</option>
                         <option value="image">배경 이미지</option>
                         <option value="video">배경 영상</option>
                       </select>
                    </div>
                    {section.bgType === 'color' ? (
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>배경색 선택</label>
                        <input type="color" className="form-control" style={{ height: '45px', padding: '4px' }} value={section.bgColor || '#ffffff'} onChange={e => handleSectionUpdate(section.id, 'bgColor', e.target.value)} />
                      </div>
                    ) : (
                      <MediaInput label="배경 경로" value={section.bgUrl} onChange={val => handleSectionUpdate(section.id, 'bgUrl', val)} />
                    )}

                    <div className="form-group">
                       <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>자세히보기 버튼</label>
                       <div style={{ display: 'flex', gap: '12px' }}>
                         <button 
                           className={`luxury-btn ${section.showButton ? '' : 'outline'}`} 
                           style={{ flex: 1, padding: '10px' }}
                           onClick={() => handleSectionUpdate(section.id, 'showButton', true)}
                         >표시</button>
                         <button 
                           className={`luxury-btn ${section.showButton ? 'outline' : ''}`} 
                           style={{ flex: 1, padding: '10px' }}
                           onClick={() => handleSectionUpdate(section.id, 'showButton', false)}
                         >숨김</button>
                       </div>
                    </div>
                    {section.showButton && (
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>버튼 링크</label>
                        <input className="form-control" value={section.buttonLink || ""} onChange={e => handleSectionUpdate(section.id, 'buttonLink', e.target.value)} placeholder="/reviews 등 상성 주소" />
                      </div>
                    )}
                  </div>
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
