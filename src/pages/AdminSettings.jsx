import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Shield, Save, CheckCircle2, Image as ImageIcon, Globe, Share2, Upload, X, Info, Plus, Trash2 } from 'lucide-react';
import SafeMedia from '../components/SafeMedia';

const AdminSettings = () => {
  const { config, updatePrivacyPolicy, updateGlobalSettings, updateFooter, uploadFile } = useConfig();
  const [privacyContent, setPrivacyContent] = useState(config.privacyPolicy || '');
  const [footerInfo, setFooterInfo] = useState(config.footer || {
    businessInfo: '',
    copyright: '',
    menus: [],
    links: [],
    csCenter: {
      title: 'CS CENTER',
      phone: '1600-0000',
      hours: '운영시간: 평일 09:00 ~ 18:00',
      extra: '점심시간: 12:00 ~ 13:00 (토/일/공휴일 휴무)'
    }
  });
  const [settings, setSettings] = useState({
    logo: config.logo || '',
    favicon: config.favicon || '',
    ogImage: config.ogImage || '',
    metaDescription: config.metaDescription || '',
    adminPassword: config.adminPassword || '1111'
  });
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    if (config) {
      setPrivacyContent(config.privacyPolicy || '');
      setSettings({
        logo: config.logo || '',
        favicon: config.favicon || '',
        ogImage: config.ogImage || '',
        metaDescription: config.metaDescription || '',
        adminPassword: config.adminPassword || '1111'
      });
      if (config.footer) {
        setFooterInfo(config.footer);
      }
    }
  }, [config]);

  const recommendedTags = [
    "당신의 인생에서 가장 빛나는 순간, 올리고 크루즈와 함께하세요.",
    "세상의 끝까지 만끽하는 진정한 럭셔리, 올리고 크루즈 멤버십.",
    "압도적인 스케일과 최상급 서비스, 올리고 프리미엄 크루즈 여행."
  ];

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(field);
    try {
      const storageId = await uploadFile(file);
      setSettings(prev => ({ ...prev, [field]: `storage:${storageId}` }));
    } catch (err) {
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
    setUploading(null);
  };

  const handleSave = async () => {
    try {
      await updatePrivacyPolicy(privacyContent);
      await updateGlobalSettings(settings);
      await updateFooter(footerInfo);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('설정 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
         <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>웹사이트 통합 설정</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>브랜딩, 파비콘, SNS 미리보기 등 웹사이트 기초 정보를 관리합니다.</p>
         </div>
         <button className="luxury-btn" onClick={handleSave} style={{ gap: '8px', position: 'sticky', top: '100px', zIndex: 10 }}>
            {success ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {success ? '모든 설정 저장됨' : '전체 설정 저장'}
         </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Logo & Branding */}
        <div className="admin-card">
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '10px' }}><ImageIcon size={20} /></div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>브랜드 로고</h3>
           </div>
           
           <div style={{ border: '2px dashed var(--border-light)', borderRadius: '20px', padding: '32px', textAlign: 'center', background: 'var(--bg-sub)' }}>
              {settings.logo ? (
                 <div style={{ position: 'relative', display: 'inline-block' }}>
                    <SafeMedia src={settings.logo} style={{ maxHeight: '60px', borderRadius: '8px' }} />
                    <button onClick={() => setSettings({ ...settings, logo: '' })} style={{ position: 'absolute', top: '-10px', right: '-10px', width: '24px', height: '24px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
                 </div>
              ) : (
                 <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <Upload size={32} color="var(--text-muted)" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>로고 이미지 업로드</span>
                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                 </label>
              )}
           </div>
           <ul style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>권장 사이즈: 높이 40~60px, 배경이 투명한 PNG 권장</li>
              <li>로고 등록 시 사이트 하단 푸터 배경이 자동으로 화이트로 변경됩니다.</li>
           </ul>
        </div>

        {/* Favicon */}
        <div className="admin-card">
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '10px' }}><Globe size={20} /></div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>파비콘 (Favicon)</h3>
           </div>
           
           <div style={{ border: '2px dashed var(--border-light)', borderRadius: '20px', padding: '32px', textAlign: 'center', background: 'var(--bg-sub)' }}>
              {settings.favicon ? (
                 <div style={{ position: 'relative', display: 'inline-block' }}>
                    <SafeMedia src={settings.favicon} style={{ width: '48px', height: '48px', borderRadius: '4px' }} />
                    <button onClick={() => setSettings({ ...settings, favicon: '' })} style={{ position: 'absolute', top: '-10px', right: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                 </div>
              ) : (
                 <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={24} color="var(--text-muted)" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>파비콘 파일 업로드</span>
                    <input type="file" hidden accept=".ico,.png" onChange={(e) => handleFileChange(e, 'favicon')} />
                 </label>
              )}
           </div>
           <ul style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>작업 사이즈: **32x32px 또는 48x48px**</li>
              <li>확장자: **.ico** 또는 **.png**</li>
           </ul>
        </div>
      </div>

      {/* SNS Preview (OG) */}
      <div className="admin-card">
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '10px' }}><Share2 size={20} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>SNS 링크 미리보기 설정 (Open Graph)</h3>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
            <div>
               <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>사이트 대표 이미지 (OG Image)</label>
                  <div style={{ border: '2px dashed var(--border-light)', borderRadius: '20px', padding: '24px', textAlign: 'center', background: 'var(--bg-sub)', marginBottom: '12px' }}>
                     {settings.ogImage ? (
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '1.91/1', overflow: 'hidden', borderRadius: '12px' }}>
                           <SafeMedia src={settings.ogImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           <button onClick={() => setSettings({ ...settings, ogImage: '' })} style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                        </div>
                     ) : (
                        <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                           <Upload size={24} color="var(--text-muted)" />
                           <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>대표 이미지 업로드</span>
                           <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'ogImage')} />
                        </label>
                     )}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>권장 사이즈: **1200x630px** (카톡/페이스북 최적화)</p>
               </div>

               <div className="form-group" style={{ marginTop: '32px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>사이트 설명 문구 (Meta Description)</label>
                  <textarea 
                     className="form-control" 
                     rows={3} 
                     value={settings.metaDescription}
                     onChange={e => setSettings({ ...settings, metaDescription: e.target.value })}
                     placeholder="SNS 링크 공유 시 제목 아래에 노출되는 설명입니다."
                  />
                  <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                     {recommendedTags.map((tag, i) => (
                        <button 
                           key={i} 
                           onClick={() => setSettings({ ...settings, metaDescription: tag })}
                           style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#fff', fontSize: '11px', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                           {i + 1}. 추천문구 적용
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Preview Mockup */}
            <div>
               <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '16px', display: 'block' }}>링크 공유 시 미리보기 예시</label>
               <div style={{ background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', maxWidth: '300px' }}>
                  <div style={{ height: '150px', background: '#e2e8f0', overflow: 'hidden' }}>
                     {settings.ogImage ? <SafeMedia src={settings.ogImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}><ImageIcon size={32} /></div>}
                  </div>
                  <div style={{ padding: '16px' }}>
                     <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '6px' }}>올리고 크루즈</div>
                     <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4', height: '3.4em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {settings.metaDescription || "올리고 크루즈 - 프리미엄 크루즈 멤버십 서비스"}
                     </div>
                     <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '12px' }}>oligo-cruise.com</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="admin-card">
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '10px' }}><Shield size={20} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>개인정보 수집 및 이용 동의 내용</h3>
         </div>
         <textarea 
            className="form-control" 
            rows={8} 
            value={privacyContent}
            onChange={e => setPrivacyContent(e.target.value)}
            style={{ lineHeight: '1.6', fontSize: '14px' }}
         />
      </div>

      <div className="admin-card" style={{ border: '1px solid #fee2e2' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '10px' }}><Shield size={20} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>관리자 보안 설정</h3>
         </div>
         <div style={{ maxWidth: '400px' }}>
            <div className="form-group">
               <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>관리자 접속 비밀번호</label>
               <input 
                  type="text" 
                  className="form-control" 
                  value={settings.adminPassword || "1111"}
                  onChange={e => setSettings({ ...settings, adminPassword: e.target.value })}
                  placeholder="비밀번호 설정"
               />
               <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  어드민 접속 시 사용할 비밀번호입니다. (초기값: 1111)
               </p>
            </div>
         </div>
      </div>

      {/* Footer Info & External Links */}
      <div className="admin-card">
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '10px' }}><Globe size={20} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>푸터 정보 및 메뉴 관리</h3>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Footer Menus */}
            <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>푸터 메뉴 (이용약관, 개인정보처리방침 등)</h4>
                  <button 
                     onClick={() => setFooterInfo({ ...footerInfo, menus: [...(footerInfo.menus || []), { id: Date.now().toString(), label: '', url: '' }] })}
                     style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                     <Plus size={14} /> 메뉴 추가
                  </button>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                  {(footerInfo.menus || []).map((menu, index) => (
                     <div key={menu.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', background: 'var(--bg-sub)', padding: '12px', borderRadius: '12px' }}>
                        <div style={{ flex: 1 }}>
                           <label style={{ fontSize: '11px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>메뉴명</label>
                           <input 
                              type="text" 
                              className="form-control" 
                              style={{ fontSize: '12px', height: '36px' }}
                              value={menu.label} 
                              onChange={e => {
                                 const newMenus = [...footerInfo.menus];
                                 newMenus[index].label = e.target.value;
                                 setFooterInfo({ ...footerInfo, menus: newMenus });
                              }}
                           />
                        </div>
                        <div style={{ flex: 2 }}>
                           <label style={{ fontSize: '11px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>URL</label>
                           <input 
                              type="text" 
                              className="form-control" 
                              style={{ fontSize: '12px', height: '36px' }}
                              value={menu.url} 
                              onChange={e => {
                                 const newMenus = [...footerInfo.menus];
                                 newMenus[index].url = e.target.value;
                                 setFooterInfo({ ...footerInfo, menus: newMenus });
                              }}
                           />
                        </div>
                        <button 
                           onClick={() => setFooterInfo({ ...footerInfo, menus: footerInfo.menus.filter(m => m.id !== menu.id) })}
                           style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
               {/* Business Info */}
               <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>회사 정보 (줄바꿈 포함)</h4>
                  <div className="form-group">
                     <textarea 
                        className="form-control" 
                        rows={6} 
                        value={footerInfo.businessInfo} 
                        onChange={e => setFooterInfo({...footerInfo, businessInfo: e.target.value})}
                        placeholder="회사명, 대표자명, 주소 등을 자유롭게 입력하세요. 줄바꿈이 반영됩니다."
                        style={{ fontSize: '13px', lineHeight: '1.6' }}
                     />
                  </div>
                  <div className="form-group" style={{ marginTop: '16px' }}>
                     <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>카피라이트</label>
                     <input type="text" className="form-control" value={footerInfo.copyright} onChange={e => setFooterInfo({...footerInfo, copyright: e.target.value})} />
                  </div>
               </div>

               {/* CS Center Info */}
               <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>CS CENTER 설정</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
                     <div className="form-group">
                        <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>CS 제목</label>
                        <input 
                           type="text" 
                           className="form-control" 
                           value={footerInfo.csCenter?.title || ''} 
                           onChange={e => setFooterInfo({
                              ...footerInfo, 
                              csCenter: { ...footerInfo.csCenter, title: e.target.value }
                           })} 
                        />
                     </div>
                     <div className="form-group">
                        <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>대표 전화번호</label>
                        <input 
                           type="text" 
                           className="form-control" 
                           value={footerInfo.csCenter?.phone || ''} 
                           onChange={e => setFooterInfo({
                              ...footerInfo, 
                              csCenter: { ...footerInfo.csCenter, phone: e.target.value }
                           })} 
                        />
                     </div>
                     <div className="form-group">
                        <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>운영 시간</label>
                        <input 
                           type="text" 
                           className="form-control" 
                           value={footerInfo.csCenter?.hours || ''} 
                           onChange={e => setFooterInfo({
                              ...footerInfo, 
                              csCenter: { ...footerInfo.csCenter, hours: e.target.value }
                           })} 
                        />
                     </div>
                     <div className="form-group">
                        <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', display: 'block' }}>추가 정보 (점심시간 등)</label>
                        <input 
                           type="text" 
                           className="form-control" 
                           value={footerInfo.csCenter?.extra || ''} 
                           onChange={e => setFooterInfo({
                              ...footerInfo, 
                              csCenter: { ...footerInfo.csCenter, extra: e.target.value }
                           })} 
                        />
                     </div>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>외부 링크 (SNS/기타)</h4>
                        <button 
                           onClick={() => setFooterInfo({ ...footerInfo, links: [...(footerInfo.links || []), { id: Date.now().toString(), label: '', url: '' }] })}
                           style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                           <Plus size={14} /> 링크 추가
                        </button>
                     </div>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {(footerInfo.links || []).map((link, index) => (
                           <div key={link.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', background: 'var(--bg-sub)', padding: '12px', borderRadius: '12px' }}>
                              <div style={{ flex: 1 }}>
                                 <label style={{ fontSize: '11px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>라벨</label>
                                 <input 
                                    type="text" 
                                    className="form-control" 
                                    style={{ fontSize: '12px', height: '36px' }}
                                    value={link.label} 
                                    onChange={e => {
                                       const newLinks = [...footerInfo.links];
                                       newLinks[index].label = e.target.value;
                                       setFooterInfo({ ...footerInfo, links: newLinks });
                                    }}
                                 />
                              </div>
                              <div style={{ flex: 2 }}>
                                 <label style={{ fontSize: '11px', fontWeight: '700', marginBottom: '4px', display: 'block' }}>URL</label>
                                 <input 
                                    type="text" 
                                    className="form-control" 
                                    style={{ fontSize: '12px', height: '36px' }}
                                    value={link.url} 
                                    onChange={e => {
                                       const newLinks = [...footerInfo.links];
                                       newLinks[index].url = e.target.value;
                                       setFooterInfo({ ...footerInfo, links: newLinks });
                                    }}
                                 />
                              </div>
                              <button 
                                 onClick={() => setFooterInfo({ ...footerInfo, links: footerInfo.links.filter(l => l.id !== link.id) })}
                                 style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminSettings;
