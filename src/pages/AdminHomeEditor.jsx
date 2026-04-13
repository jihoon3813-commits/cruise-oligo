import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, MoveUp, MoveDown, Save } from 'lucide-react';

const AdminHomeEditor = () => {
  const { config, updateHero, updateSection, addSection, deleteSection } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);

  const handleHeroSave = () => {
    updateHero(heroForm);
    alert('히어로 설정이 저장되었습니다!');
  };

  const handleSectionUpdate = (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    updateSection(id, { ...section, [field]: value });
  };

  const handleAddNewSection = () => {
    const newId = `section-${Date.now()}`;
    addSection({
      id: newId,
      title: "새 섹션 제목",
      content: "여기에 내용을 입력하세요...",
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      layout: "text-left"
    });
  };

  return (
    <div className="admin-content">
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>홈페이지 커스터마이징</h1>

      {/* Hero Editor */}
      <section className="admin-card">
        <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          히어로 섹션 설정
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>메인 제목 (줄바꿈은 \n 입력)</label>
            <textarea 
              className="form-control" 
              value={heroForm.title} 
              onChange={e => setHeroForm({...heroForm, title: e.target.value})}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>서브 문구 (Subtitle)</label>
            <input 
              className="form-control" 
              value={heroForm.subtitle} 
              onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>배경 타입</label>
            <select 
              className="form-control" 
              value={heroForm.bgType}
              onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}
            >
              <option value="image">이미지(Image)</option>
              <option value="video">동영상(Video URL)</option>
            </select>
          </div>
          <div className="form-group">
            <label>배경 이미지/동영상 URL</label>
            <input 
              className="form-control" 
              value={heroForm.bgUrl} 
              onChange={e => setHeroForm({...heroForm, bgUrl: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>텍스트 위치</label>
            <select 
              className="form-control" 
              value={heroForm.textPosition}
              onChange={e => setHeroForm({...heroForm, textPosition: e.target.value})}
            >
              <option value="left">왼쪽(Left)</option>
              <option value="center">중앙(Center)</option>
              <option value="right">오른쪽(Right)</option>
            </select>
          </div>
        </div>
        <button className="luxury-button" style={{ marginTop: '20px' }} onClick={handleHeroSave}>
          히어로 설정 저장
        </button>
      </section>

      {/* Sections Manager */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px' }}>페이지 구성 섹션</h2>
        <button className="luxury-button" style={{ padding: '8px 20px', fontSize: '13px' }} onClick={handleAddNewSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> 새 섹션 추가
          </div>
        </button>
      </div>

      {config.sections.map((section, index) => (
        <div key={section.id} className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px' }}>섹션 #{index + 1}</h3>
            <button 
              onClick={() => deleteSection(section.id)}
              style={{ color: '#ff4444', padding: '5px' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>제목</label>
              <input 
                className="form-control" 
                value={section.title} 
                onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>레이아웃 배정</label>
              <select 
                className="form-control" 
                value={section.layout}
                onChange={e => handleSectionUpdate(section.id, 'layout', e.target.value)}
              >
                <option value="text-left">텍스트 왼쪽 | 이미지 오른쪽</option>
                <option value="text-right">텍스트 오른쪽 | 이미지 왼쪽</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>본문 내용</label>
              <textarea 
                className="form-control" 
                value={section.content} 
                onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)}
                rows={3}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>이미지 URL</label>
              <input 
                className="form-control" 
                value={section.image} 
                onChange={e => handleSectionUpdate(section.id, 'image', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminHomeEditor;
