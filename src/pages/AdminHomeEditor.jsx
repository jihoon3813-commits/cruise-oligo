import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, MoveUp, MoveDown, Save } from 'lucide-react';

const AdminHomeEditor = () => {
  const { config, updateHero, updateSection, addSection, deleteSection } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);

  const handleHeroSave = () => {
    updateHero(heroForm);
    alert('Hero settings saved!');
  };

  const handleSectionUpdate = (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    updateSection(id, { ...section, [field]: value });
  };

  const handleAddNewSection = () => {
    const newId = `section-${Date.now()}`;
    addSection({
      id: newId,
      title: "New Section Title",
      content: "Enter your content here...",
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      layout: "text-left"
    });
  };

  return (
    <div className="admin-content">
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>Home Page Customization</h1>

      {/* Hero Editor */}
      <section className="admin-card">
        <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Hero Section
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Main Title (use \n for newline)</label>
            <textarea 
              className="form-control" 
              value={heroForm.title} 
              onChange={e => setHeroForm({...heroForm, title: e.target.value})}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Sub Title</label>
            <input 
              className="form-control" 
              value={heroForm.subtitle} 
              onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Background Type</label>
            <select 
              className="form-control" 
              value={heroForm.bgType}
              onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}
            >
              <option value="image">Image</option>
              <option value="video">Video (MP4 URL)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Background URL</label>
            <input 
              className="form-control" 
              value={heroForm.bgUrl} 
              onChange={e => setHeroForm({...heroForm, bgUrl: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Text Position</label>
            <select 
              className="form-control" 
              value={heroForm.textPosition}
              onChange={e => setHeroForm({...heroForm, textPosition: e.target.value})}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        <button className="luxury-button" style={{ marginTop: '20px' }} onClick={handleHeroSave}>
          Save Hero Settings
        </button>
      </section>

      {/* Sections Manager */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px' }}>Page Sections</h2>
        <button className="luxury-button" style={{ padding: '8px 20px', fontSize: '13px' }} onClick={handleAddNewSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Add New Section
          </div>
        </button>
      </div>

      {config.sections.map((section, index) => (
        <div key={section.id} className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px' }}>Section #{index + 1}</h3>
            <button 
              onClick={() => deleteSection(section.id)}
              style={{ color: '#ff4444', padding: '5px' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Title</label>
              <input 
                className="form-control" 
                value={section.title} 
                onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Layout</label>
              <select 
                className="form-control" 
                value={section.layout}
                onChange={e => handleSectionUpdate(section.id, 'layout', e.target.value)}
              >
                <option value="text-left">Text Left | Image Right</option>
                <option value="text-right">Text Right | Image Left</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Content</label>
              <textarea 
                className="form-control" 
                value={section.content} 
                onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)}
                rows={3}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Image URL</label>
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
