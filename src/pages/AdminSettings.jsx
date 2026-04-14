import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Shield, Save, CheckCircle2 } from 'lucide-react';

const AdminSettings = () => {
  const { config, updatePrivacyPolicy } = useConfig();
  const [privacyContent, setPrivacyContent] = useState(config.privacyPolicy);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    await updatePrivacyPolicy(privacyContent);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
         <h2 style={{ fontSize: '20px', fontWeight: '800' }}>기본 설정 관리</h2>
         <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>웹사이트 전반에 적용되는 기초 설정을 관리합니다.</p>
      </div>

      <div className="admin-card">
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '10px' }}><Shield size={20} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>개인정보 수집 및 이용 동의 내용</h3>
         </div>

         <div className="form-group">
            <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>
               상담 신청 모달의 '자세히 보기' 클릭 시 고객에게 보여지는 내용입니다.
            </label>
            <textarea 
               className="form-control" 
               rows={15} 
               value={privacyContent}
               onChange={e => setPrivacyContent(e.target.value)}
               placeholder="개인정보 처리방침 내용을 입력하세요..."
               style={{ lineHeight: '1.6', fontSize: '14px' }}
            />
         </div>

         <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="luxury-btn" onClick={handleSave} style={{ gap: '8px' }}>
               {success ? <CheckCircle2 size={18} /> : <Save size={18} />}
               {success ? '저장 완료' : '설정 저장'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminSettings;
