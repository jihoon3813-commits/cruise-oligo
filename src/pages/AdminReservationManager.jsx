import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Trash2, CheckCircle2, Clock, User, Phone, Package, Info, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminReservationManager = () => {
  const { reservations } = useConfig();
  const updateStatus = useMutation(api.reservations.updateStatus);
  const deleteReservation = useMutation(api.reservations.remove);
  const [filter, setFilter] = useState('all');

  const filtered = reservations.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return { bg: '#dcfce7', color: '#16a34a', text: '완료' };
      case 'contacted': return { bg: '#fef9c3', color: '#ca8a04', text: '진행중' };
      default: return { bg: '#fee2e2', color: '#dc2626', text: '대기' };
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateStatus({ id, status });
  };

  const handleDelete = async (id) => {
    if (window.confirm('상담 신청 내역을 삭제하시겠습니까?')) {
      await deleteReservation({ id });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>상담 신청 내역 관리</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>고객들의 프리미엄 상담 신청 내역을 관리합니다.</p>
         </div>
         <div style={{ display: 'flex', background: 'var(--bg-sub)', padding: '6px', borderRadius: '12px', gap: '4px' }}>
            {['all', 'pending', 'contacted', 'completed'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{ 
                    border: 'none', 
                    background: filter === f ? '#fff' : 'none', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    boxShadow: filter === f ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                    transition: '0.2s'
                  }}
                >
                  {f === 'all' ? '전체' : f === 'pending' ? '대기' : f === 'contacted' ? '진행중' : '완료'}
                </button>
            ))}
         </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-sub)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800' }}>고객 정보</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800' }}>신청 상품</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800' }}>비고</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800' }}>상태</th>
              <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '800', textAlign: 'right' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
                <tr>
                    <td colSpan={5} style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>내역이 없습니다.</td>
                </tr>
            ) : filtered.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '24px' }}>
                   <div style={{ fontWeight: '800', marginBottom: '4px' }}>{r.name}</div>
                   <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{r.phone}</div>
                </td>
                <td style={{ padding: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700' }}>
                      <Package size={14} color="var(--primary)" /> {r.productTitle}
                   </div>
                </td>
                <td style={{ padding: '24px', maxWidth: '300px' }}>
                   <div style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'pre-wrap' }}>{r.notes || '-'}</div>
                </td>
                <td style={{ padding: '24px' }}>
                   <select 
                     value={r.status}
                     onChange={(e) => handleStatusChange(r._id, e.target.value)}
                     style={{ 
                        padding: '8px 12px', 
                        borderRadius: '10px', 
                        fontSize: '12px', 
                        fontWeight: '700',
                        border: 'none',
                        background: getStatusStyle(r.status).bg,
                        color: getStatusStyle(r.status).color,
                        appearance: 'none',
                        cursor: 'pointer'
                     }}
                   >
                     <option value="pending">상담 대기</option>
                     <option value="contacted">연락 완료 (진행중)</option>
                     <option value="completed">상담 완료</option>
                   </select>
                </td>
                <td style={{ padding: '24px', textAlign: 'right' }}>
                   <button onClick={() => handleDelete(r._id)} style={{ padding: '10px', borderRadius: '10px', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservationManager;
