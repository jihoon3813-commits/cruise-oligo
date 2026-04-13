import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Star, Save, X } from 'lucide-react';

const AdminReviewManager = () => {
  const { config, addReview } = useConfig();
  const [isAdding, setIsAdding] = useState(false);
  const [newReview, setNewReview] = useState({
    user: "",
    rating: 5,
    content: "",
    images: [""]
  });

  const handleSave = () => {
    addReview({
      ...newReview,
      id: `review-${Date.now()}`
    });
    setIsAdding(false);
    setNewReview({ user: "", rating: 5, content: "", images: [""] });
  };

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px' }}>Review Management</h1>
        <button className="luxury-button" onClick={() => setIsAdding(true)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Write Review
          </div>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {config.reviews.map(review => (
          <div key={review.id} className="admin-card">
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <img src={review.images[0]} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
              <div>
                <h4 style={{ fontWeight: '700' }}>{review.user}</h4>
                <div style={{ display: 'flex', color: 'var(--accent)', marginTop: '5px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "var(--accent)" : "none"} />)}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>{review.content}</p>
          </div>
        ))}
      </div>

      {isAdding && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center' 
        }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '20px' }}>New Review</h2>
              <button onClick={() => setIsAdding(false)}><X size={20} /></button>
            </div>
            
            <div className="form-group">
              <label>Reviewer Name</label>
              <input 
                className="form-control" 
                value={newReview.user}
                onChange={e => setNewReview({...newReview, user: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input 
                type="number" className="form-control" min={1} max={5}
                value={newReview.rating}
                onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea 
                className="form-control" rows={4}
                value={newReview.content}
                onChange={e => setNewReview({...newReview, content: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input 
                className="form-control" 
                value={newReview.images[0]}
                onChange={e => setNewReview({...newReview, images: [e.target.value]})}
              />
            </div>

            <button className="luxury-button" style={{ width: '100%', marginTop: '10px' }} onClick={handleSave}>
              Save Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewManager;
