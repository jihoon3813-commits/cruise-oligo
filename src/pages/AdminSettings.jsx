import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Shield, Save, CheckCircle2, Image as ImageIcon, Globe, Type, Info, Check, MessageSquare } from 'lucide-react';

const AdminSettings = () => {
  const { config, updatePrivacyPolicy, updateGlobalSettings, uploadFile } = useConfig();
  const [privacyContent, setPrivacyContent] = useState(config.privacyPolicy || "");
  const [localConfig, setLocalConfig] = useState({
    logo: config.logo || null,
    favicon: config.favicon || null,
    ogImage: config.ogImage || null,
    description: config.description || ""
  });
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    setPrivacyContent(config.privacyPolicy || "");
    setLocalConfig({
        logo: config.logo || null,
        favicon: config.favicon || null,
        ogImage: config.ogImage || null,
        description: config.description || ""
    });
  }, [config]);

  const handleUpdate = (field, value) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    setUploading(field);
    try {
        const storageId = await uploadFile(file);
        handleUpdate(field, `storage:${storageId}`);
    } catch (err) {
        alert('업로드 실패');
    }
    setUploading(null);
  };

  const handleSave = async () => {
    await updatePrivacyPolicy(privacyContent);
    await updateGlobalSettings(localConfig);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const recommendations = [
    "지중해의 낭만과 명품 크루즈의 품격, 올리고 크루즈와 함께 인생 최고의 여행을 설계하세요.",
    "차원이 다른 럭셔리 크루즈 여행의 시작. 오직 당신만을 위한 프라이빗 패키지 구성을 지금 확인해보세요.",
    "전 세계 바다를 누비는 가장 우아한 방법, 올리고 크루즈 멤버십으로 고품격 여행과 특별한 혜택을 누리세요."
  ];

  return (
    <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
         <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>웹사이트 통합 설정</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>로고, 검색 최적화(SEO), 시스템 문구 등 전반적인 설정을 관리합니다.</p>
         </div>
         <button className="luxury-btn" onClick={handleSave} style={{ gap: '8px', position: 'sticky', top: '20px', zIndex: 10 }}>
            {success ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {success ? '저장 완료' : '전체 설정 저장'}
         </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Branding Section */}
        <div className="admin-card">
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <ImageIcon size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>브랜드 에셋</h3>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                 <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>공식 로고</label>
                 <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>추천 사이즈: 가로 200px 내외 (PNG 투명 배경 권장)</p>
                 <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '120px', height: '60px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                       {localConfig.logo ? <img src={localConfig.logo.startsWith('storage:') ? `https://whimsical-jackal-408.convex.cloud/api/storage/${localConfig.logo.split(':')[1]}` : localConfig.logo} style={{ maxWidth: '80%', maxHeight: '80%' }} /> : <ImageIcon size={20} color="#cbd5e1" />}
                    </div>
                    <input type="file" onChange={(e) => handleFileUpload('logo', e.target.files[0])} style={{ fontSize: '12px' }} disabled={uploading === 'logo'} />
                 </div>
              </div>

              <div>
                 <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>파비콘 (창 아이콘)</label>
                 <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>사이즈: 32x32px (PNG 또는 ICO 권장)</p>
                 <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {localConfig.favicon ? <img src={localConfig.favicon.startsWith('storage:') ? `https://whimsical-jackal-408.convex.cloud/api/storage/${localConfig.favicon.split(':')[1]}` : localConfig.favicon} style={{ width: '24px', height: '24px' }} /> : <Globe size={18} color="#cbd5e1" />}
                    </div>
                    <input type="file" onChange={(e) => handleFileUpload('favicon', e.target.files[0])} style={{ fontSize: '12px' }} disabled={uploading === 'favicon'} />
                 </div>
              </div>
           </div>
        </div>

        {/* SEO Section */}
        <div className="admin-card">
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Type size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>링크 공유 최적화 (SEO)</h3>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                 <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>대표 이미지 (OG Image)</label>
                 <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>추천 사이즈: 1200 x 630px (카톡/페이스북 미리보기용)</p>
                 <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: '100px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                       {localConfig.ogImage ? <img src={localConfig.ogImage.startsWith('storage:') ? `https://whimsical-jackal-408.convex.cloud/api/storage/${localConfig.ogImage.split(':')[1]}` : localConfig.ogImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={24} color="#cbd5e1" />}
                    </div>
                 </div>
                 <input type="file" onChange={(e) => handleFileUpload('ogImage', e.target.files[0])} style={{ fontSize: '12px', marginTop: '12px' }} disabled={uploading === 'ogImage'} />
              </div>

              <div>
                 <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>사이트 설명 문구</label>
                 <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>검색 결과나 링크 공유 시 노출되는 한 문장입니다.</p>
                 <textarea 
                    className="form-control" 
                    rows={3} 
                    value={localConfig.description}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="사이트 설명을 입력하세요..."
                    style={{ fontSize: '13px' }}
                 />
                 
                 <div style={{ marginTop: '16px', background: '#f1f5f9', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px', color: '#64748b' }}>
                       <MessageSquare size={12} /> 전문가 추천 문구 (클릭 시 자동 적용)
                    </div>
                    {recommendations.map((rec, i) => (
                       <button 
                         key={i} 
                         onClick={() => handleUpdate('description', rec)}
                         style={{ 
                            display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', 
                            background: localConfig.description === rec ? '#2563EB' : '#fff',
                            color: localConfig.description === rec ? '#fff' : 'var(--text-main)',
                            border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', 
                            marginBottom: '6px', cursor: 'pointer', transition: '0.2s', lineHeight: '1.4'
                         }}
                       >
                          {rec}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="admin-card">
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '100px' }}><Shield size={18} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>개인정보 수집 및 이용 동의 전문</h3>
         </div>

         <div className="form-group">
            <textarea 
               className="form-control" 
               rows={8} 
               value={privacyContent}
               onChange={e => setPrivacyContent(e.target.value)}
               placeholder="개인정보 처리방침 전문을 입력하세요..."
               style={{ lineHeight: '1.6', fontSize: '14px' }}
            />
         </div>
      </div>
    </div>
  );
};

export default AdminSettings;
