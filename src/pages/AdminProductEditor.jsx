import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { 
  ArrowLeft, Plus, Trash2, Copy, Save, X, ChevronUp, ChevronDown, ChevronRight,
  Calendar, Clock, MapPin, Ship, Plane, Compass, Flag, AlertCircle, 
  Utensils, BedDouble, Check, Laptop, Smartphone, HelpCircle, Loader2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';

const DAY_TYPES = [
  { value: 'embarkation', label: '승선일 (Embarkation)', icon: <Ship size={14} /> },
  { value: 'port', label: '기항일 (Port of Call)', icon: <MapPin size={14} /> },
  { value: 'cruising', label: '전일해상 (At Sea)', icon: <Compass size={14} /> },
  { value: 'disembarkation', label: '하선일 (Disembarkation)', icon: <Flag size={14} /> },
  { value: 'flight', label: '항공이동 (Flight)', icon: <Plane size={14} /> }
];

const COMMON_PHRASES = {
  included: [
    "선내 전 일정 객실 숙박료 및 시설 이용",
    "대극장 정기 공연 및 뷔페, 정찬식사 포함",
    "전문 크루즈 가이드 인솔 서비스",
    "여행자보험 1억원 가입",
    "포트차지 및 항구 대기 수수료 포함"
  ],
  excluded: [
    "크루즈 선내 승조원 팁 (선내 자동 청구)",
    "기항지 선택 관광 비용 (자유 선택)",
    "유료 스페셜티 레스토랑 및 일부 음료/주류",
    "개인 경비 및 쇼핑 비용",
    "왕복 항공권 및 공항-항구 교통편"
  ],
  notices: [
    "여권 유효기간은 출발일 기준 반드시 6개월 이상 남아있어야 합니다.",
    "선사 사정 및 천재지변, 현지 기상 악화 시 기항지 일정이 변경될 수 있습니다.",
    "임산부는 승선일 기준 임신 24주 미만이어야 하며 의사 소견서가 필요합니다.",
    "크루즈 승선 카드는 결제용 신용카드와 연동이 필요합니다.",
    "출발 90일 전 취소 시 100% 환불 가능하나, 이후 취소 시 선사 취소 규정이 적용됩니다."
  ]
};

const PriceInput = ({ label, value, onChange, placeholder = "0" }) => {
  const [localValue, setLocalValue] = useState(value !== undefined && value !== null ? value.toString() : "");

  useEffect(() => {
    const currentNum = parseInt(localValue.replace(/[^0-9]/g, "")) || 0;
    if (value !== currentNum) {
      setLocalValue(value !== undefined && value !== null ? value.toString() : "");
    }
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setLocalValue(raw);
    const num = parseInt(raw) || 0;
    onChange(num);
  };

  const displayValue = localValue ? parseInt(localValue).toLocaleString('ko-KR') : "";

  return (
    <div className="form-group">
      <label className="admin-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input 
          type="text"
          className="form-control" 
          value={displayValue} 
          onChange={handleChange} 
          placeholder={placeholder} 
          style={{ textAlign: 'left', paddingRight: '40px' }} 
        />
        <span style={{ 
          position: 'absolute', 
          right: '16px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          fontSize: '13px', 
          color: 'var(--text-muted)', 
          pointerEvents: 'none' 
        }}>
          원
        </span>
      </div>
    </div>
  );
};

const AdminProductEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { config, updateProduct, addProduct, uploadFile } = useConfig();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState('mobile'); // 'pc' | 'mobile'

  const [product, setProduct] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState('basic'); // 'basic', 'departure', 'cruise', 'sections', ['day', index], 'seo'
  const [selectedCoordIndex, setSelectedCoordIndex] = useState(null);
  const [isPreviewFlightModalOpen, setIsPreviewFlightModalOpen] = useState(false);
  const [loadedId, setLoadedId] = useState(null);

  const getWeekday = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return isNaN(d.getTime()) ? "" : weekdays[d.getDay()];
  };

  // Fetch or initialize product
  useEffect(() => {
    if (config.products.length > 0) {
      if (id === 'new') {
        if (loadedId !== 'new') {
          setProduct({
            title: "",
            subtitle: "",
            description: "",
            price: 0,
            originalPrice: 0,
            thumbnails: [""],
            paymentType: "full",
            downPayment: 0,
            installments: 12,
            schedule: [],
            status: "draft",
            tags: ["추천"],
            heroImage: "",
            departure: {
              startDate: "",
              endDate: "",
              nights: 0,
              days: 0,
              price: 0,
              availability: "available"
            },
            cruiseInfo: {
              line: "",
              shipName: "",
              embarkPort: "",
              disembarkPort: ""
            },
            itineraryDays: [
              {
                dayNumber: 1,
                dayType: "embarkation",
                cityOrPort: "",
                title: "승선 및 출항",
                description: "크루즈 터미널 수속 후 승선합니다.",
                meals: { breakfast: "기내식", lunch: "선내식", dinner: "정찬식" },
                stayType: "선내박",
                items: [],
                highlights: []
              }
            ],
            sections: {
              included: [],
              excluded: [],
              notices: []
            },
            flights: {
              departure: {
                type: "ship",
                name: "",
                flightNo: "",
                duration: "",
                depPort: "",
                depTime: "",
                depDate: "",
                depWeekday: "",
                arrPort: "",
                arrTime: "",
                arrDate: "",
                arrWeekday: ""
              },
              return: {
                type: "ship",
                name: "",
                flightNo: "",
                duration: "",
                depPort: "",
                depTime: "",
                depDate: "",
                depWeekday: "",
                arrPort: "",
                arrTime: "",
                arrDate: "",
                arrWeekday: ""
              }
            },
            routeMapImage: "",
            routeCoordinates: [],
            scheduleImage: ""
          });
          setLoadedId('new');
        }
      } else {
        if (loadedId !== id) {
          const found = config.products.find(p => p.id === id);
          if (found) {
            // Upgrade older product documents with fallback fields
            const upgraded = {
              ...found,
              subtitle: found.subtitle || "",
              status: found.status || "draft",
              tags: found.tags || [],
              heroImage: found.heroImage || found.thumbnails?.[0] || "",
              departure: found.departure || {
                startDate: "",
                endDate: "",
                nights: found.schedule?.length ? found.schedule.length - 1 : 0,
                days: found.schedule?.length || 0,
                price: found.price || 0,
                availability: "available"
              },
              cruiseInfo: found.cruiseInfo || {
                line: "",
                shipName: "",
                embarkPort: "",
                disembarkPort: ""
              },
              itineraryDays: found.itineraryDays || found.schedule?.map(s => ({
                dayNumber: s.day,
                dayType: s.day === 1 ? 'embarkation' : (s.day === found.schedule.length ? 'disembarkation' : 'port'),
                cityOrPort: "",
                title: s.title,
                description: s.content,
                meals: { breakfast: "선내식", lunch: "선내식", dinner: "선내식" },
                stayType: "선내박",
                items: [],
                highlights: []
              })) || [],
              sections: found.sections || {
                included: [],
                excluded: [],
                notices: []
              },
              flights: found.flights || {
                departure: {
                  type: "ship",
                  name: "",
                  flightNo: "",
                  duration: "",
                  depPort: "",
                  depTime: "",
                  depDate: "",
                  depWeekday: "",
                  arrPort: "",
                  arrTime: "",
                  arrDate: "",
                  arrWeekday: ""
                },
                return: {
                  type: "ship",
                  name: "",
                  flightNo: "",
                  duration: "",
                  depPort: "",
                  depTime: "",
                  depDate: "",
                  depWeekday: "",
                  arrPort: "",
                  arrTime: "",
                  arrDate: "",
                  arrWeekday: ""
                }
              },
              routeMapImage: found.routeMapImage || "",
              routeCoordinates: found.routeCoordinates || [],
              scheduleImage: found.scheduleImage || ""
            };
            setProduct(upgraded);
            setLoadedId(id);
          } else {
            alert("상품을 찾을 수 없습니다.");
            navigate('/admin/products');
          }
        }
      }
    }
  }, [id, config.products, navigate, loadedId]);

  // Automatic Calculation for dates & weekdays
  useEffect(() => {
    if (!product || !product.departure?.startDate) return;

    const startDateStr = product.departure.startDate;
    const startDate = new Date(startDateStr);
    
    if (isNaN(startDate.getTime())) return;

    let updatedDays = [...(product.itineraryDays || [])];
    let changed = false;

    updatedDays = updatedDays.map((day, idx) => {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + idx);
      
      const year = dayDate.getFullYear();
      const month = String(dayDate.getMonth() + 1).padStart(2, '0');
      const dateVal = String(dayDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${dateVal}`;

      const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
      const formattedWeekday = weekdays[dayDate.getDay()];

      if (day.date !== formattedDate || day.weekday !== formattedWeekday) {
        changed = true;
        return {
          ...day,
          date: formattedDate,
          weekday: formattedWeekday
        };
      }
      return day;
    });

    if (changed) {
      setProduct(prev => ({
        ...prev,
        itineraryDays: updatedDays
      }));
    }
  }, [product?.departure?.startDate, product?.itineraryDays?.length]);

  // Handle Date Range changes and auto-calculate Days/Nights
  const handleDepartureDateChange = (field, value) => {
    const updatedDeparture = { ...product.departure, [field]: value };
    
    if (updatedDeparture.startDate && updatedDeparture.endDate) {
      const start = new Date(updatedDeparture.startDate);
      const end = new Date(updatedDeparture.endDate);
      
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        if (diffDays > 0) {
          updatedDeparture.days = diffDays;
          updatedDeparture.nights = diffDays - 1;

          // Adjust itinerary days array size to match the number of days
          let currentItinerary = [...(product.itineraryDays || [])];
          if (currentItinerary.length < diffDays) {
            for (let i = currentItinerary.length + 1; i <= diffDays; i++) {
              currentItinerary.push({
                dayNumber: i,
                dayType: i === diffDays ? 'disembarkation' : 'port',
                cityOrPort: "",
                title: `${i}일차 여정`,
                description: "일정 세부 정보를 입력하세요.",
                meals: { breakfast: "선내식", lunch: "선내식", dinner: "선내식" },
                stayType: "선내박",
                items: [],
                highlights: []
              });
            }
          } else if (currentItinerary.length > diffDays) {
            currentItinerary = currentItinerary.slice(0, diffDays);
          }
          
          setProduct(prev => ({
            ...prev,
            departure: updatedDeparture,
            itineraryDays: currentItinerary
          }));
          return;
        }
      }
    }

    setProduct(prev => ({
      ...prev,
      departure: updatedDeparture
    }));
  };

  const handleSave = async () => {
    if (!product.title.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }
    
    setLoading(true);
    try {
      // Sync legacy schedule field for backward compatibility
      const legacySchedule = (product.itineraryDays || []).map(day => ({
        day: day.dayNumber,
        title: day.title,
        content: day.description
      }));

      const finalProduct = {
        ...product,
        schedule: legacySchedule
      };

      if (id === 'new') {
        await addProduct(finalProduct);
        alert("성공적으로 상품을 등록했습니다.");
        navigate('/admin/products');
      } else {
        const { id: _, _id, _creationTime, ...data } = finalProduct;
        await updateProduct(id, data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Save product error:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Image Upload handler
  const handleImageUpload = async (file, callback) => {
    try {
      const storageId = await uploadFile(file);
      callback(`storage:${storageId}`);
    } catch (e) {
      console.error(e);
      alert("파일 업로드 실패");
    }
  };

  const getDirectUrl = (val) => {
    if (!val) return "";
    if (val.startsWith('storage:')) {
      const siteUrl = import.meta.env.VITE_CONVEX_SITE_URL || (import.meta.env.VITE_CONVEX_URL ? import.meta.env.VITE_CONVEX_URL.replace('.convex.cloud', '.convex.site') : "");
      return `${siteUrl}/api/storage?id=${val.split('storage:')[1]}`;
    }
    return val;
  };

  if (!product) {
    return (
      <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  const hasDeparture = !!(
    product.flights?.departure &&
    product.flights.departure.type === 'flight' &&
    (product.flights.departure.name || 
     product.flights.departure.flightNo || 
     product.flights.departure.depPort || 
     product.flights.departure.arrPort)
  );
  const hasReturn = !!(
    product.flights?.return &&
    product.flights.return.type === 'flight' &&
    (product.flights.return.name || 
     product.flights.return.flightNo || 
     product.flights.return.depPort || 
     product.flights.return.arrPort)
  );

  const previewBranding = config?.productDetailBranding || {};
  const previewIsDark = previewBranding.theme === 'dark';
  const previewIsGlass = previewBranding.theme === 'glass';
  
  const previewPageBg = previewIsDark ? '#0F172A' : (previewIsGlass ? '#F1F5F9' : '#ffffff');
  const previewTextColor = previewIsDark ? '#F8FAFC' : 'var(--text-main)';
  const previewMutedColor = previewIsDark ? '#94A3B8' : (previewBranding.descriptionColor || 'var(--text-muted)');
  const previewCardBg = previewIsDark ? 'rgba(255,255,255,0.05)' : (previewIsGlass ? 'rgba(255,255,255,0.7)' : '#ffffff');
  const previewCardBorder = previewIsDark ? 'rgba(255,255,255,0.1)' : 'var(--border-light)';

  const renderPreviewFlightModal = () => {
    if (!product.flights && !product.cruiseInfo) return null;
    const dep = product.flights?.departure;
    const ret = product.flights?.return;

    const formatDateString = (dateStr, weekday) => {
      if (!dateStr) return "";
      const [y, m, d] = dateStr.split('-');
      return `${y}년 ${m}월 ${d}일${weekday ? ` (${weekday})` : ""}`;
    };

    const textColor = '#0F172A';
    const mutedColor = '#64748B';
    const cardBorder = '#E2E8F0';

    return (
      <AnimatePresence>
        {isPreviewFlightModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewFlightModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(12px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '640px',
                background: '#ffffff',
                border: `1px solid ${cardBorder}`,
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '85vh'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '24px',
                borderBottom: `1px solid ${cardBorder}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#F8FAFC'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', color: textColor, margin: 0 }}>
                  항공 및 교통 상세 정보 (미리보기)
                </h3>
                <button
                  onClick={() => setIsPreviewFlightModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: mutedColor,
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: '0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Warning/Guide bar (orange) */}
              <div style={{
                background: '#FFF7ED',
                borderBottom: '1px solid #FED7AA',
                padding: '12px 24px',
                fontSize: '12px',
                color: '#C2410C',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Info size={14} color="#EA580C" />
                <span>선사 및 항공사 사정, 현지 기상 상황에 따라 실제 시간은 변동될 수 있습니다.</span>
              </div>

              {/* Content (Scrollable) */}
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* 출발 스케줄 */}
                {dep && (dep.name || dep.flightNo || dep.depPort || dep.arrPort) && (
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '900',
                      color: textColor,
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        background: '#3B82F6',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: '900',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>출발편</span>
                      {dep.name || "크루즈선"} {dep.flightNo ? `[편명: ${dep.flightNo}]` : ""}
                    </h4>

                    <div style={{
                      border: `1px solid ${cardBorder}`,
                      borderRadius: '16px',
                      padding: '20px',
                      background: '#F8FAFC',
                      position: 'relative'
                    }}>
                      {/* Time line between points */}
                      <div style={{
                        position: 'absolute',
                        left: '30px',
                        top: '40px',
                        bottom: '40px',
                        width: '2px',
                        background: 'rgba(59, 130, 246, 0.3)',
                        zIndex: 1
                      }} />

                      {/* Departure Point */}
                      <div style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 2, marginBottom: '24px' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#3B82F6',
                          border: '4px solid #EFF6FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '3px'
                        }} />
                        <div>
                          <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: '800', textTransform: 'uppercase' }}>DEPARTURE</div>
                          <div style={{ fontSize: '17px', fontWeight: '900', color: textColor, marginTop: '2px' }}>
                            {(dep.type === 'ship' ? (product.cruiseInfo?.embarkPort || dep.depPort) : (dep.depPort || product.cruiseInfo?.embarkPort)) || "-"}
                          </div>
                          {dep.depTime && (
                            <div style={{ fontSize: '15px', fontWeight: '700', color: textColor, marginTop: '4px' }}>
                              {dep.depTime}
                            </div>
                          )}
                          {dep.depDate && (
                            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
                              {formatDateString(dep.depDate, dep.depWeekday)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Duration Info Overlay */}
                      {dep.duration && (
                        <div style={{
                          paddingLeft: '50px',
                          marginBottom: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: mutedColor,
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          <Clock size={12} />
                          <span>총 비행/이동 시간: {dep.duration}</span>
                        </div>
                      )}

                      {/* Arrival Point */}
                      <div style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 2 }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#10B981',
                          border: '4px solid #ECFDF5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '3px'
                        }} />
                        <div>
                          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '800', textTransform: 'uppercase' }}>ARRIVAL</div>
                          <div style={{ fontSize: '17px', fontWeight: '900', color: textColor, marginTop: '2px' }}>
                            {(dep.type === 'ship' ? (product.cruiseInfo?.disembarkPort || dep.arrPort) : (dep.arrPort || product.cruiseInfo?.disembarkPort)) || "-"}
                          </div>
                          {dep.arrTime && (
                            <div style={{ fontSize: '15px', fontWeight: '700', color: textColor, marginTop: '4px' }}>
                              {dep.arrTime}
                            </div>
                          )}
                          {dep.arrDate && (
                            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
                              {formatDateString(dep.arrDate, dep.arrWeekday)}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 귀국 스케줄 */}
                {ret && (ret.name || ret.flightNo || ret.depPort || ret.arrPort) && (
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '900',
                      color: textColor,
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        background: '#10B981',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: '900',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>복귀편</span>
                      {ret.name || "크루즈선"} {ret.flightNo ? `[편명: ${ret.flightNo}]` : ""}
                    </h4>

                    <div style={{
                      border: `1px solid ${cardBorder}`,
                      borderRadius: '16px',
                      padding: '20px',
                      background: '#F8FAFC',
                      position: 'relative'
                    }}>
                      {/* Time line between points */}
                      <div style={{
                        position: 'absolute',
                        left: '30px',
                        top: '40px',
                        bottom: '40px',
                        width: '2px',
                        background: 'rgba(16, 185, 129, 0.3)',
                        zIndex: 1
                      }} />

                      {/* Departure Point */}
                      <div style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 2, marginBottom: '24px' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#3B82F6',
                          border: '4px solid #EFF6FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '3px'
                        }} />
                        <div>
                          <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: '800', textTransform: 'uppercase' }}>DEPARTURE</div>
                          <div style={{ fontSize: '17px', fontWeight: '900', color: textColor, marginTop: '2px' }}>
                            {(ret.type === 'ship' ? (product.cruiseInfo?.disembarkPort || ret.depPort) : (ret.depPort || product.cruiseInfo?.disembarkPort)) || "-"}
                          </div>
                          {ret.depTime && (
                            <div style={{ fontSize: '15px', fontWeight: '700', color: textColor, marginTop: '4px' }}>
                              {ret.depTime}
                            </div>
                          )}
                          {ret.depDate && (
                            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
                              {formatDateString(ret.depDate, ret.depWeekday)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Duration Info Overlay */}
                      {ret.duration && (
                        <div style={{
                          paddingLeft: '50px',
                          marginBottom: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: mutedColor,
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          <Clock size={12} />
                          <span>총 비행/이동 시간: {ret.duration}</span>
                        </div>
                      )}

                      {/* Arrival Point */}
                      <div style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 2 }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#10B981',
                          border: '4px solid #ECFDF5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '3px'
                        }} />
                        <div>
                          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '800', textTransform: 'uppercase' }}>ARRIVAL</div>
                          <div style={{ fontSize: '17px', fontWeight: '900', color: textColor, marginTop: '2px' }}>
                            {(ret.type === 'ship' ? (product.cruiseInfo?.embarkPort || ret.arrPort) : (ret.arrPort || product.cruiseInfo?.embarkPort)) || "-"}
                          </div>
                          {ret.arrTime && (
                            <div style={{ fontSize: '15px', fontWeight: '700', color: textColor, marginTop: '4px' }}>
                              {ret.arrTime}
                            </div>
                          )}
                          {ret.arrDate && (
                            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
                              {formatDateString(ret.arrDate, ret.arrWeekday)}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 크루즈 상세 정보 */}
                {product.cruiseInfo && (product.cruiseInfo.line || product.cruiseInfo.shipName || product.cruiseInfo.embarkPort || product.cruiseInfo.disembarkPort) && (
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '900',
                      color: textColor,
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: '900',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>크루즈선</span>
                      {product.cruiseInfo.shipName || "크루즈선"} {product.cruiseInfo.line ? `[선사: ${product.cruiseInfo.line}]` : ""}
                    </h4>

                    <div style={{
                      border: `1px solid ${cardBorder}`,
                      borderRadius: '16px',
                      padding: '20px',
                      background: '#F8FAFC',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', color: mutedColor, fontWeight: '700' }}>크루즈 선사</span>
                          <span style={{ fontSize: '14px', color: textColor, fontWeight: '800' }}>{product.cruiseInfo.line || "-"}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px dashed ${cardBorder}`, paddingTop: '12px' }}>
                          <span style={{ fontSize: '13px', color: mutedColor, fontWeight: '700' }}>선박 명칭</span>
                          <span style={{ fontSize: '14px', color: textColor, fontWeight: '800' }}>{product.cruiseInfo.shipName || "-"}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px dashed ${cardBorder}`, paddingTop: '12px' }}>
                          <span style={{ fontSize: '13px', color: mutedColor, fontWeight: '700' }}>출발 승선항</span>
                          <span style={{ fontSize: '14px', color: textColor, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} color="#ef4444" />
                            {product.cruiseInfo.embarkPort || "-"}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px dashed ${cardBorder}`, paddingTop: '12px' }}>
                          <span style={{ fontSize: '13px', color: mutedColor, fontWeight: '700' }}>도착 하선항</span>
                          <span style={{ fontSize: '14px', color: textColor, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} color="#ef4444" />
                            {product.cruiseInfo.disembarkPort || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Day Reordering Helpers
  const moveDay = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === product.itineraryDays.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const list = [...product.itineraryDays];
    
    // Swap items
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Correct dayNumbers
    const reindexedList = list.map((item, idx) => ({
      ...item,
      dayNumber: idx + 1
    }));

    setProduct({ ...product, itineraryDays: reindexedList });
    if (Array.isArray(selectedBlock) && selectedBlock[0] === 'day') {
      setSelectedBlock(['day', targetIdx]);
    }
  };

  const deleteDay = (index) => {
    if (product.itineraryDays.length <= 1) {
      alert("최소 1일 이상의 일정이 필요합니다.");
      return;
    }
    if (window.confirm(`Day ${index + 1} 일정을 삭제하시겠습니까?`)) {
      const list = product.itineraryDays.filter((_, idx) => idx !== index);
      const reindexedList = list.map((item, idx) => ({
        ...item,
        dayNumber: idx + 1
      }));
      setProduct({ ...product, itineraryDays: reindexedList });
      setSelectedBlock('basic');
    }
  };

  const duplicateDay = (index) => {
    const source = product.itineraryDays[index];
    const newDay = {
      ...source,
      dayNumber: index + 2,
      title: `${source.title} (복사본)`
    };
    
    const list = [...product.itineraryDays];
    list.splice(index + 1, 0, newDay);

    const reindexedList = list.map((item, idx) => ({
      ...item,
      dayNumber: idx + 1
    }));

    setProduct({ ...product, itineraryDays: reindexedList });
    setSelectedBlock(['day', index + 1]);
  };

  const addDay = () => {
    const newNum = product.itineraryDays.length + 1;
    const newDay = {
      dayNumber: newNum,
      dayType: "port",
      cityOrPort: "",
      title: `신규 일정 제목`,
      description: "세부 여정 내용을 적어주세요.",
      meals: { breakfast: "선내식", lunch: "선내식", dinner: "선내식" },
      stayType: "선내박",
      items: [],
      highlights: []
    };
    setProduct({
      ...product,
      itineraryDays: [...product.itineraryDays, newDay]
    });
    setSelectedBlock(['day', newNum - 1]);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 120px)',
      margin: '-40px',
      background: 'var(--bg-main)',
      overflow: 'hidden'
    }}>
      {/* Top action bar */}
      <div style={{ 
        height: '70px', 
        background: '#fff', 
        borderBottom: '1px solid var(--border-light)', 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/admin/products')} 
            style={{ 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-muted)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}
          >
            <ArrowLeft size={18} />
            <span style={{ fontSize: '14px', fontWeight: '700' }}>돌아가기</span>
          </button>
          <div style={{ width: '1px', height: '20px', background: 'var(--border-light)' }}></div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
            {id === 'new' ? '신규 크루즈 상품 제작' : `${product.title || '크루즈'}일정 편집기`}
          </h2>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '700', 
            background: product.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
            color: product.status === 'published' ? '#10b981' : '#f59e0b',
            padding: '4px 10px',
            borderRadius: '6px'
          }}>
            {product.status === 'published' ? '발행됨' : '초안/편집중'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="luxury-btn outline" onClick={() => navigate('/admin/products')}>취소</button>
          <button className="luxury-btn" onClick={handleSave} disabled={loading} style={{ gap: '8px' }}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : (saveSuccess ? <Check size={16} /> : <Save size={16} />)}
            {saveSuccess ? '반영 완료!' : '최종 저장'}
          </button>
        </div>
      </div>

      {/* Editor Main Content Panels */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* PANEL 1: Left Structure Navigation Tree */}
        <div style={{ 
          width: '280px', 
          background: '#fff', 
          borderRight: '1px solid var(--border-light)', 
          display: 'flex', 
          flexDirection: 'column', 
          flexShrink: 0,
          overflowY: 'auto'
        }}>
          {/* Main Nodes */}
          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 8px' }}>구조 구성도</div>
            
            <button 
              onClick={() => setSelectedBlock('basic')}
              style={{
                width: '100%', padding: '10px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700',
                background: selectedBlock === 'basic' ? 'var(--bg-sub)' : 'transparent',
                color: selectedBlock === 'basic' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <Info size={16} /> 상품 기본정보
            </button>

            <button 
              onClick={() => setSelectedBlock('departure')}
              style={{
                width: '100%', padding: '10px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700',
                background: selectedBlock === 'departure' ? 'var(--bg-sub)' : 'transparent',
                color: selectedBlock === 'departure' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <Calendar size={16} /> 출발 및 항차 정보
            </button>

            <button 
              onClick={() => setSelectedBlock('cruise')}
              style={{
                width: '100%', padding: '10px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700',
                background: selectedBlock === 'cruise' ? 'var(--bg-sub)' : 'transparent',
                color: selectedBlock === 'cruise' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <Ship size={16} /> 선사 & 선박 정보
            </button>

            <button 
              onClick={() => setSelectedBlock('sections')}
              style={{
                width: '100%', padding: '10px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700',
                background: selectedBlock === 'sections' ? 'var(--bg-sub)' : 'transparent',
                color: selectedBlock === 'sections' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <AlertCircle size={16} /> 포함/불포함 정책
            </button>

            <button 
              onClick={() => setSelectedBlock('flights')}
              style={{
                width: '100%', padding: '10px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700',
                background: selectedBlock === 'flights' ? 'var(--bg-sub)' : 'transparent',
                color: selectedBlock === 'flights' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <Plane size={16} /> 항공 및 교통 정보
            </button>

            <button 
              onClick={() => setSelectedBlock('routeMap')}
              style={{
                width: '100%', padding: '10px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700',
                background: selectedBlock === 'routeMap' ? 'var(--bg-sub)' : 'transparent',
                color: selectedBlock === 'routeMap' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <Compass size={16} /> 여행코스 지도
            </button>

            <button 
              onClick={() => setSelectedBlock('scheduleImage')}
              style={{
                width: '100%', padding: '10px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700',
                background: selectedBlock === 'scheduleImage' ? 'var(--bg-sub)' : 'transparent',
                color: selectedBlock === 'scheduleImage' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <BedDouble size={16} /> 세부 일정 통이미지
            </button>

            <button 
              onClick={() => setSelectedBlock('seo')}
              style={{
                width: '100%', padding: '10px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700',
                background: selectedBlock === 'seo' ? 'var(--bg-sub)' : 'transparent',
                color: selectedBlock === 'seo' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <Laptop size={16} /> 검색/SEO 설정
            </button>
          </div>

          {/* Day List tree */}
          <div style={{ padding: '0 16px 20px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>데이 루트 리스트</span>
              <button 
                onClick={addDay} 
                style={{ border: 'none', background: 'var(--bg-sub)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
              >
                + DAY 추가
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
              {(product.itineraryDays || []).map((day, idx) => {
                const isSelected = Array.isArray(selectedBlock) && selectedBlock[0] === 'day' && selectedBlock[1] === idx;
                const typeObj = DAY_TYPES.find(t => t.value === day.dayType) || DAY_TYPES[1];

                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedBlock(['day', idx])}
                    style={{
                      padding: '8px 12px', borderRadius: '10px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: isSelected ? 'var(--primary)' : 'var(--bg-sub)',
                      color: isSelected ? '#fff' : 'var(--text-main)',
                      transition: '0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <span style={{ fontSize: '11px', fontWeight: '900', opacity: 0.8 }}>D{day.dayNumber}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                        <span style={{ opacity: 0.7 }}>{typeObj.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                          {day.cityOrPort || day.title || `${day.dayNumber}일차`}
                        </span>
                      </div>
                    </div>
                    {/* Tiny actions */}
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => moveDay(idx, 'up')} style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: 'inherit', opacity: 0.6 }} disabled={idx === 0}><ChevronUp size={12} /></button>
                      <button onClick={() => moveDay(idx, 'down')} style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: 'inherit', opacity: 0.6 }} disabled={idx === product.itineraryDays.length - 1}><ChevronDown size={12} /></button>
                      <button onClick={() => duplicateDay(idx)} style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: 'inherit', opacity: 0.6 }}><Copy size={11} /></button>
                      <button onClick={() => deleteDay(idx)} style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: isSelected ? '#fff' : '#ef4444', opacity: 0.8 }}><Trash2 size={11} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PANEL 2: Center Editor Form */}
        <div style={{ 
          flex: 1, 
          background: 'var(--bg-sub)', 
          padding: '40px',
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* RENDER FORM: Basic Info */}
            {selectedBlock === 'basic' && (
              <section className="admin-card">
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>기본 메타 정보 관리</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>상품의 타이틀, 대표 설명 및 가격 구조를 정의합니다.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="admin-label">상품명 (필수)</label>
                    <input 
                      className="form-control" 
                      value={product.title} 
                      onChange={e => setProduct({ ...product, title: e.target.value })}
                      placeholder="예시: 지중해 아일랜드 그랜드 크루즈 14일" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="admin-label">서브 타이틀</label>
                    <input 
                      className="form-control" 
                      value={product.subtitle} 
                      onChange={e => setProduct({ ...product, subtitle: e.target.value })}
                      placeholder="예시: 가을 시즌 대표 럭셔리 항로" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="admin-label">상품 설명 요약문</label>
                    <textarea 
                      className="form-control" 
                      value={product.description} 
                      onChange={e => setProduct({ ...product, description: e.target.value })}
                      rows={3} 
                      placeholder="패키지 요약 소개를 입력하세요."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <PriceInput 
                      label="정가 (원화)"
                      value={product.originalPrice}
                      onChange={val => setProduct({ ...product, originalPrice: val })}
                      placeholder="0"
                    />
                    <PriceInput 
                      label="판매가 (할인가, 원화)"
                      value={product.price}
                      onChange={val => setProduct({ ...product, price: val })}
                      placeholder="0"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="admin-label">상품 전시 상태</label>
                      <select 
                        className="form-control"
                        value={product.status || 'draft'}
                        onChange={e => setProduct({ ...product, status: e.target.value })}
                      >
                        <option value="draft">임시저장 (Draft)</option>
                        <option value="review">검수 요청 (Review)</option>
                        <option value="published">발행됨 (Published)</option>
                        <option value="ended">판매 종료 (Ended)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="admin-label">결제 유형</label>
                      <select 
                        className="form-control"
                        value={product.paymentType}
                        onChange={e => setProduct({ ...product, paymentType: e.target.value })}
                      >
                        <option value="full">일시불 결제형</option>
                        <option value="split">분할납부형 (예약금 우선)</option>
                      </select>
                    </div>
                  </div>

                  {product.paymentType === 'split' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--bg-sub)', padding: '16px', borderRadius: '12px' }}>
                      <PriceInput 
                        label="착수 예약금 (원화)"
                        value={product.downPayment}
                        onChange={val => setProduct({ ...product, downPayment: val })}
                        placeholder="0"
                      />
                      <div className="form-group">
                        <label className="admin-label">할부 개월 수</label>
                        <input 
                          type="number"
                          className="form-control" 
                          value={product.installments || 12} 
                          onChange={e => setProduct({ ...product, installments: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="admin-label">대표 갤러리 이미지 URL (첫번째가 썸네일)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {product.thumbnails.map((url, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            className="form-control" 
                            value={url} 
                            onChange={e => {
                              const list = [...product.thumbnails];
                              list[idx] = e.target.value;
                              setProduct({ ...product, thumbnails: list });
                            }}
                            placeholder="이미지 주소를 입력하거나 오른쪽 버튼으로 업로드"
                          />
                          <button 
                            className="luxury-btn outline"
                            style={{ padding: '0 16px', flexShrink: 0, whiteSpace: 'nowrap' }}
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.onchange = (e) => {
                                const file = e.target.files[0];
                                if(file) {
                                  handleImageUpload(file, (uploadedUrl) => {
                                    setProduct(prev => {
                                      const list = [...prev.thumbnails];
                                      list[idx] = uploadedUrl;
                                      return { ...prev, thumbnails: list };
                                    });
                                  });
                                }
                              };
                              input.click();
                            }}
                          >
                            업로드
                          </button>
                          <button 
                            onClick={() => {
                              const list = product.thumbnails.filter((_, i) => i !== idx);
                              setProduct({ ...product, thumbnails: list.length ? list : [""] });
                            }} 
                            style={{ padding: '0 10px', border: 'none', background: '#ffebeb', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setProduct({ ...product, thumbnails: [...product.thumbnails, ""] })}
                        style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}
                      >
                        + 이미지 추가
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="admin-label">태그 (쉼표로 구분)</label>
                    <input 
                      className="form-control" 
                      value={product.tags?.join(', ') || ''} 
                      onChange={e => setProduct({ ...product, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      placeholder="예시: 추천, 특가, 완판임박" 
                    />
                  </div>
                </div>
              </section>
            )}

            {/* RENDER FORM: Departure & Pricing */}
            {selectedBlock === 'departure' && (
              <section className="admin-card">
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>출발 일정 & 항차 정보 관리</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>항차별 출발 날짜와 귀국일을 등록하여 데일리 일정을 자동 정렬시킵니다.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="admin-label">출발일</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={product.departure?.startDate || ""}
                        onChange={e => handleDepartureDateChange('startDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">귀국일</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={product.departure?.endDate || ""}
                        onChange={e => handleDepartureDateChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--bg-sub)', padding: '16px', borderRadius: '12px' }}>
                    <div className="form-group">
                      <label className="admin-label">총 여정 (일)</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={product.departure?.days || 0}
                        onChange={e => handleDepartureDateChange('days', parseInt(e.target.value) || 0)}
                        placeholder="자동 계산됨"
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">총 선내박 (박)</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={product.departure?.nights || 0}
                        onChange={e => handleDepartureDateChange('nights', parseInt(e.target.value) || 0)}
                        placeholder="자동 계산됨"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="admin-label">예약 현황/판매 상태</label>
                    <select 
                      className="form-control"
                      value={product.departure?.availability || 'available'}
                      onChange={e => setProduct({
                        ...product,
                        departure: { ...product.departure, availability: e.target.value }
                      })}
                    >
                      <option value="available">예약 신청 가능 (Available)</option>
                      <option value="waiting">대기 예약 접수 (Waiting)</option>
                      <option value="closed">예약 마감 (Closed)</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* RENDER FORM: Cruise Settings */}
            {selectedBlock === 'cruise' && (
              <section className="admin-card">
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>선사 및 크루즈선 명세</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>승객들이 탑승하게 될 크루즈 브랜드와 선박 스펙을 정의합니다.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="admin-label">크루즈 선사 (Line)</label>
                      <input 
                        className="form-control" 
                        value={product.cruiseInfo?.line || ""} 
                        onChange={e => setProduct({
                          ...product,
                          cruiseInfo: { ...product.cruiseInfo, line: e.target.value }
                        })}
                        placeholder="예시: 로얄캐리비안 크루즈" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">선박 명칭 (Ship Name)</label>
                      <input 
                        className="form-control" 
                        value={product.cruiseInfo?.shipName || ""} 
                        onChange={e => setProduct({
                          ...product,
                          cruiseInfo: { ...product.cruiseInfo, shipName: e.target.value }
                        })}
                        placeholder="예시: 심포니호 (Symphony of the Seas)" 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="admin-label">출발 승선항</label>
                      <input 
                        className="form-control" 
                        value={product.cruiseInfo?.embarkPort || ""} 
                        onChange={e => setProduct({
                          ...product,
                          cruiseInfo: { ...product.cruiseInfo, embarkPort: e.target.value }
                        })}
                        placeholder="예시: 이탈리아 로마 (치비타베키아)" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">도착 하선항</label>
                      <input 
                        className="form-control" 
                        value={product.cruiseInfo?.disembarkPort || ""} 
                        onChange={e => setProduct({
                          ...product,
                          cruiseInfo: { ...product.cruiseInfo, disembarkPort: e.target.value }
                        })}
                        placeholder="예시: 스페인 바르셀로나" 
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* RENDER FORM: Policy Sections */}
            {selectedBlock === 'sections' && (
              <section className="admin-card">
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>포함 / 불포함 사항 및 규정 설정</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>선박 요금에 포함되는 내역과 유의사항 항목을 목록으로 추가합니다.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Included List */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="admin-label" style={{ marginBottom: 0 }}>포함 사항</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <select 
                          style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '6px' }}
                          onChange={e => {
                            if (e.target.value) {
                              const current = product.sections?.included || [];
                              setProduct({
                                ...product,
                                sections: { ...product.sections, included: [...current, e.target.value] }
                              });
                              e.target.value = '';
                            }
                          }}
                        >
                          <option value="">-- 공통문구 추가 --</option>
                          {COMMON_PHRASES.included.map((p, i) => <option key={i} value={p}>{p.slice(0, 20)}...</option>)}
                        </select>
                        <button 
                          onClick={() => {
                            const current = product.sections?.included || [];
                            setProduct({ ...product, sections: { ...product.sections, included: [...current, ""] } });
                          }}
                          style={{ border: 'none', background: 'var(--bg-sub)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                        >
                          + 항목 추가
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(product.sections?.included || []).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            className="form-control" 
                            value={item} 
                            onChange={e => {
                              const list = [...(product.sections?.included || [])];
                              list[idx] = e.target.value;
                              setProduct({ ...product, sections: { ...product.sections, included: list } });
                            }}
                            placeholder="포함 서비스 내용 입력"
                          />
                          <button 
                            onClick={() => {
                              const list = product.sections.included.filter((_, i) => i !== idx);
                              setProduct({ ...product, sections: { ...product.sections, included: list } });
                            }} 
                            style={{ padding: '0 10px', border: 'none', background: '#ffebeb', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Excluded List */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="admin-label" style={{ marginBottom: 0 }}>불포함 사항</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <select 
                          style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '6px' }}
                          onChange={e => {
                            if (e.target.value) {
                              const current = product.sections?.excluded || [];
                              setProduct({
                                ...product,
                                sections: { ...product.sections, excluded: [...current, e.target.value] }
                              });
                              e.target.value = '';
                            }
                          }}
                        >
                          <option value="">-- 공통문구 추가 --</option>
                          {COMMON_PHRASES.excluded.map((p, i) => <option key={i} value={p}>{p.slice(0, 20)}...</option>)}
                        </select>
                        <button 
                          onClick={() => {
                            const current = product.sections?.excluded || [];
                            setProduct({ ...product, sections: { ...product.sections, excluded: [...current, ""] } });
                          }}
                          style={{ border: 'none', background: 'var(--bg-sub)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                        >
                          + 항목 추가
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(product.sections?.excluded || []).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            className="form-control" 
                            value={item} 
                            onChange={e => {
                              const list = [...(product.sections?.excluded || [])];
                              list[idx] = e.target.value;
                              setProduct({ ...product, sections: { ...product.sections, excluded: list } });
                            }}
                            placeholder="불포함 서비스 내용 입력"
                          />
                          <button 
                            onClick={() => {
                              const list = product.sections.excluded.filter((_, i) => i !== idx);
                              setProduct({ ...product, sections: { ...product.sections, excluded: list } });
                            }} 
                            style={{ padding: '0 10px', border: 'none', background: '#ffebeb', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notices List */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="admin-label" style={{ marginBottom: 0 }}>유의사항 및 약관 규정</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <select 
                          style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '6px' }}
                          onChange={e => {
                            if (e.target.value) {
                              const current = product.sections?.notices || [];
                              setProduct({
                                ...product,
                                sections: { ...product.sections, notices: [...current, e.target.value] }
                              });
                              e.target.value = '';
                            }
                          }}
                        >
                          <option value="">-- 공통문구 추가 --</option>
                          {COMMON_PHRASES.notices.map((p, i) => <option key={i} value={p}>{p.slice(0, 20)}...</option>)}
                        </select>
                        <button 
                          onClick={() => {
                            const current = product.sections?.notices || [];
                            setProduct({ ...product, sections: { ...product.sections, notices: [...current, ""] } });
                          }}
                          style={{ border: 'none', background: 'var(--bg-sub)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                        >
                          + 항목 추가
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(product.sections?.notices || []).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            className="form-control" 
                            value={item} 
                            onChange={e => {
                              const list = [...(product.sections?.notices || [])];
                              list[idx] = e.target.value;
                              setProduct({ ...product, sections: { ...product.sections, notices: list } });
                            }}
                            placeholder="유의문구 또는 취소 규정 입력"
                          />
                          <button 
                            onClick={() => {
                              const list = product.sections.notices.filter((_, i) => i !== idx);
                              setProduct({ ...product, sections: { ...product.sections, notices: list } });
                            }} 
                            style={{ padding: '0 10px', border: 'none', background: '#ffebeb', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* RENDER FORM: Flights & Transportation Config */}
            {selectedBlock === 'flights' && (
              <section className="admin-card">
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>항공 및 교통 정보</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>출발편 및 복귀편 교통수단의 상세 일정을 정의합니다.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* 출발편 */}
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plane size={16} /> 출발편 정보 (Departure)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="admin-label">교통 수단 유형</label>
                          <select 
                            className="form-control"
                            value={product.flights?.departure?.type || 'ship'}
                            onChange={e => {
                              const departure = { ...(product.flights?.departure || {}), type: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                          >
                            <option value="flight">항공 (Flight)</option>
                            <option value="ship">크루즈선 (Ship)</option>
                            <option value="other">기타 (Other)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="admin-label">운송사 (항공사/선사명)</label>
                          <input 
                            className="form-control"
                            value={product.flights?.departure?.name || ''}
                            onChange={e => {
                              const departure = { ...(product.flights?.departure || {}), name: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                            placeholder="예: 대한항공, 코스타 크루즈"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="admin-label">편명 (항공편/항차코드)</label>
                          <input 
                            className="form-control"
                            value={product.flights?.departure?.flightNo || ''}
                            onChange={e => {
                              const departure = { ...(product.flights?.departure || {}), flightNo: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                            placeholder="예: KE743, COSTA26"
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">소요 시간</label>
                          <input 
                            className="form-control"
                            value={product.flights?.departure?.duration || ''}
                            onChange={e => {
                              const departure = { ...(product.flights?.departure || {}), duration: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                            placeholder="예: 2시간 15분"
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">출발일</label>
                          <input 
                            type="date"
                            className="form-control"
                            value={product.flights?.departure?.depDate || ''}
                            onChange={e => {
                              const dateVal = e.target.value;
                              const weekdayVal = getWeekday(dateVal);
                              const departure = { ...(product.flights?.departure || {}), depDate: dateVal, depWeekday: weekdayVal };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="admin-label">출발지 (공항/항구 코드 포함)</label>
                          <input 
                            className="form-control"
                            value={product.flights?.departure?.depPort || ''}
                            onChange={e => {
                              const departure = { ...(product.flights?.departure || {}), depPort: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                            placeholder="예: 인천 (ICN), 부산항"
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">출발 시간</label>
                          <input 
                            type="time"
                            className="form-control"
                            value={product.flights?.departure?.depTime || ''}
                            onChange={e => {
                              const departure = { ...(product.flights?.departure || {}), depTime: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="admin-label">도착지 (공항/항구 코드 포함)</label>
                          <input 
                            className="form-control"
                            value={product.flights?.departure?.arrPort || ''}
                            onChange={e => {
                              const departure = { ...(product.flights?.departure || {}), arrPort: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                            placeholder="예: 나리타 (NRT), 요코하마항"
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">도착일</label>
                          <input 
                            type="date"
                            className="form-control"
                            value={product.flights?.departure?.arrDate || ''}
                            onChange={e => {
                              const dateVal = e.target.value;
                              const weekdayVal = getWeekday(dateVal);
                              const departure = { ...(product.flights?.departure || {}), arrDate: dateVal, arrWeekday: weekdayVal };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">도착 시간</label>
                          <input 
                            type="time"
                            className="form-control"
                            value={product.flights?.departure?.arrTime || ''}
                            onChange={e => {
                              const departure = { ...(product.flights?.departure || {}), arrTime: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), departure } });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

                  {/* 복귀편 */}
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plane size={16} style={{ transform: 'rotate(180deg)' }} /> 복귀편 정보 (Return)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="admin-label">교통 수단 유형</label>
                          <select 
                            className="form-control"
                            value={product.flights?.return?.type || 'ship'}
                            onChange={e => {
                              const returnData = { ...(product.flights?.return || {}), type: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                          >
                            <option value="flight">항공 (Flight)</option>
                            <option value="ship">크루즈선 (Ship)</option>
                            <option value="other">기타 (Other)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="admin-label">운송사 (항공사/선사명)</label>
                          <input 
                            className="form-control"
                            value={product.flights?.return?.name || ''}
                            onChange={e => {
                              const returnData = { ...(product.flights?.return || {}), name: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                            placeholder="예: 대한항공, 코스타 크루즈"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="admin-label">편명 (항공편/항차코드)</label>
                          <input 
                            className="form-control"
                            value={product.flights?.return?.flightNo || ''}
                            onChange={e => {
                              const returnData = { ...(product.flights?.return || {}), flightNo: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                            placeholder="예: KE744, COSTA27"
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">소요 시간</label>
                          <input 
                            className="form-control"
                            value={product.flights?.return?.duration || ''}
                            onChange={e => {
                              const returnData = { ...(product.flights?.return || {}), duration: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                            placeholder="예: 2시간 15분"
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">출발일</label>
                          <input 
                            type="date"
                            className="form-control"
                            value={product.flights?.return?.depDate || ''}
                            onChange={e => {
                              const dateVal = e.target.value;
                              const weekdayVal = getWeekday(dateVal);
                              const returnData = { ...(product.flights?.return || {}), depDate: dateVal, depWeekday: weekdayVal };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="admin-label">출발지 (공항/항구 코드 포함)</label>
                          <input 
                            className="form-control"
                            value={product.flights?.return?.depPort || ''}
                            onChange={e => {
                              const returnData = { ...(product.flights?.return || {}), depPort: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                            placeholder="예: 나리타 (NRT), 요코하마항"
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">출발 시간</label>
                          <input 
                            type="time"
                            className="form-control"
                            value={product.flights?.return?.depTime || ''}
                            onChange={e => {
                              const returnData = { ...(product.flights?.return || {}), depTime: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="admin-label">도착지 (공항/항구 코드 포함)</label>
                          <input 
                            className="form-control"
                            value={product.flights?.return?.arrPort || ''}
                            onChange={e => {
                              const returnData = { ...(product.flights?.return || {}), arrPort: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                            placeholder="예: 인천 (ICN), 부산항"
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">도착일</label>
                          <input 
                            type="date"
                            className="form-control"
                            value={product.flights?.return?.arrDate || ''}
                            onChange={e => {
                              const dateVal = e.target.value;
                              const weekdayVal = getWeekday(dateVal);
                              const returnData = { ...(product.flights?.return || {}), arrDate: dateVal, arrWeekday: weekdayVal };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="admin-label">도착 시간</label>
                          <input 
                            type="time"
                            className="form-control"
                            value={product.flights?.return?.arrTime || ''}
                            onChange={e => {
                              const returnData = { ...(product.flights?.return || {}), arrTime: e.target.value };
                              setProduct({ ...product, flights: { ...(product.flights || {}), return: returnData } });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* RENDER FORM: Route Map Config */}
            {selectedBlock === 'routeMap' && (
              <section className="admin-card">
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>여행코스 지도 설정</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    배경 지도를 등록하고 코스별 위치(경로 점)들을 설정합니다. 지도 위의 포인트를 클릭하여 원하는 위치로 지정해 주세요.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* 지도 이미지 등록 */}
                  <div className="form-group">
                    <label className="admin-label">배경 지도 이미지</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        className="form-control" 
                        value={product.routeMapImage || ""} 
                        onChange={e => setProduct({ ...product, routeMapImage: e.target.value })}
                        placeholder="배경 지도 이미지 URL (미설정 시 자체 동아시아 SVG 지도 사용)"
                      />
                      <button 
                        className="luxury-btn outline"
                        style={{ padding: '0 16px', flexShrink: 0, whiteSpace: 'nowrap' }}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if(file) {
                              handleImageUpload(file, (uploadedUrl) => {
                                setProduct(prev => ({ ...prev, routeMapImage: uploadedUrl }));
                              });
                            }
                          };
                          input.click();
                        }}
                      >
                        업로드
                      </button>
                    </div>
                  </div>

                  {/* 미니맵 좌표 편집기 */}
                  <div className="form-group">
                    <label className="admin-label">인터랙티브 좌표 미니맵 (클릭하여 좌표 수정)</label>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      아래 리스트에서 편집할 포인트를 선택한 후, 지도에서 원하는 위치를 클릭하면 좌표(X, Y)가 자동 조절됩니다.
                    </p>
                    <div 
                      onClick={(e) => {
                        if (selectedCoordIndex === null || selectedCoordIndex === undefined) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = parseFloat(((e.clientX - rect.left) / rect.width * 100).toFixed(1));
                        const y = parseFloat(((e.clientY - rect.top) / rect.height * 100).toFixed(1));
                        
                        const list = [...(product.routeCoordinates || [])];
                        if (list[selectedCoordIndex]) {
                          list[selectedCoordIndex] = {
                            ...list[selectedCoordIndex],
                            x,
                            y
                          };
                          setProduct({ ...product, routeCoordinates: list });
                        }
                      }}
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '16/10',
                        background: '#0B132B',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: selectedCoordIndex !== null ? 'crosshair' : 'default',
                        border: '1px solid var(--border-light)',
                        userSelect: 'none'
                      }}
                    >
                      {/* 배경 지도 */}
                      {product.routeMapImage ? (
                        <img 
                          src={getDirectUrl(product.routeMapImage)} 
                          alt="Route Map" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                        />
                      ) : (
                        // 동아시아 SVG 자체 간이 지도 (에디터 내 가이드용)
                        <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', opacity: 0.35, pointerEvents: 'none' }}>
                          <path d="M 50,20 Q 200,30 300,50 T 450,150 T 550,250 T 650,220 T 750,300" fill="none" stroke="#ffffff" strokeWidth="2" />
                          <text x="50%" y="50%" textAnchor="middle" fill="#ffffff" fontSize="12" opacity="0.6">배경 지도 이미지 미등록 (자체 지도 렌더링)</text>
                        </svg>
                      )}

                      {/* 좌표점 표시 */}
                      {(product.routeCoordinates || []).map((coord, idx) => {
                        const isSelected = selectedCoordIndex === idx;
                        return (
                          <div
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCoordIndex(idx);
                            }}
                            style={{
                              position: 'absolute',
                              left: `${coord.x}%`,
                              top: `${coord.y}%`,
                              transform: 'translate(-50%, -50%)',
                              width: isSelected ? '28px' : '22px',
                              height: isSelected ? '28px' : '22px',
                              borderRadius: '50%',
                              background: isSelected ? '#ff5722' : 'var(--primary)',
                              border: '2px solid #ffffff',
                              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: '10px',
                              fontWeight: '900',
                              cursor: 'pointer',
                              zIndex: isSelected ? 10 : 5,
                              transition: 'all 0.2s'
                            }}
                            title={coord.name}
                          >
                            {coord.label || (idx + 1)}
                          </div>
                        );
                      })}

                      {/* 경로 점 간의 선 연결 피드백 */}
                      {product.routeCoordinates && product.routeCoordinates.length > 1 && (
                        <svg 
                          style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            pointerEvents: 'none', 
                            zIndex: 2 
                          }}
                        >
                          {(() => {
                            return product.routeCoordinates.map((coord, idx) => {
                              if (idx === 0) return null;
                              const prev = product.routeCoordinates[idx - 1];
                              return (
                                <line 
                                  key={idx}
                                  x1={`${prev.x}%`} 
                                  y1={`${prev.y}%`} 
                                  x2={`${coord.x}%`} 
                                  y2={`${coord.y}%`} 
                                  stroke="#3b82f6" 
                                  strokeWidth="2" 
                                  strokeDasharray="4,4"
                                />
                              );
                            });
                          })()}
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* 포인트 리스트 편집 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800' }}>경로 포인트 리스트</span>
                      <button 
                        onClick={() => {
                          const current = product.routeCoordinates || [];
                          const nextIdx = current.length;
                          const newCoord = {
                            name: `포인트 ${nextIdx + 1}`,
                            x: 50,
                            y: 50,
                            label: `${nextIdx + 1}`
                          };
                          setProduct({
                            ...product,
                            routeCoordinates: [...current, newCoord]
                          });
                          setSelectedCoordIndex(nextIdx);
                        }}
                        style={{ border: 'none', background: 'var(--bg-sub)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                      >
                        + 포인트 추가
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(product.routeCoordinates || []).map((coord, idx) => {
                        const isSelected = selectedCoordIndex === idx;
                        return (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedCoordIndex(idx)}
                            style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'auto 1.5fr 1fr 1fr 1fr auto', 
                              gap: '10px', 
                              alignItems: 'center',
                              padding: '10px 12px',
                              background: isSelected ? 'rgba(59,130,246,0.08)' : '#ffffff',
                              border: isSelected ? '1px solid #3b82f6' : '1px solid var(--border-light)',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ 
                              width: '12px', 
                              height: '12px', 
                              borderRadius: '50%', 
                              border: '2px solid #3b82f6', 
                              background: isSelected ? '#3b82f6' : 'transparent',
                              flexShrink: 0
                            }} />

                            <input 
                              className="form-control" 
                              style={{ padding: '6px 8px', fontSize: '13px' }}
                              value={coord.name} 
                              onChange={e => {
                                const list = [...product.routeCoordinates];
                                list[idx] = { ...coord, name: e.target.value };
                                setProduct({ ...product, routeCoordinates: list });
                              }}
                              onClick={e => e.stopPropagation()}
                              placeholder="위치명 (예: 부산)"
                            />

                            <input 
                              className="form-control" 
                              style={{ padding: '6px 8px', fontSize: '13px' }}
                              value={coord.label || ''} 
                              onChange={e => {
                                const list = [...product.routeCoordinates];
                                list[idx] = { ...coord, label: e.target.value };
                                setProduct({ ...product, routeCoordinates: list });
                              }}
                              onClick={e => e.stopPropagation()}
                              placeholder="라벨 (예: 1, 3-1)"
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>X:</span>
                              <input 
                                type="number"
                                className="form-control" 
                                style={{ padding: '6px 8px', fontSize: '13px' }}
                                value={coord.x} 
                                onChange={e => {
                                  const list = [...product.routeCoordinates];
                                  list[idx] = { ...coord, x: parseFloat(e.target.value) || 0 };
                                  setProduct({ ...product, routeCoordinates: list });
                                }}
                                onClick={e => e.stopPropagation()}
                              />
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>%</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Y:</span>
                              <input 
                                type="number"
                                className="form-control" 
                                style={{ padding: '6px 8px', fontSize: '13px' }}
                                value={coord.y} 
                                onChange={e => {
                                  const list = [...product.routeCoordinates];
                                  list[idx] = { ...coord, y: parseFloat(e.target.value) || 0 };
                                  setProduct({ ...product, routeCoordinates: list });
                                }}
                                onClick={e => e.stopPropagation()}
                              />
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>%</span>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const list = product.routeCoordinates.filter((_, i) => i !== idx);
                                setProduct({ ...product, routeCoordinates: list });
                                if (selectedCoordIndex === idx) setSelectedCoordIndex(null);
                                else if (selectedCoordIndex > idx) setSelectedCoordIndex(selectedCoordIndex - 1);
                              }} 
                              style={{ 
                                padding: '6px 10px', 
                                border: 'none', 
                                background: '#ffebeb', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        );
                      })}
                      {(!product.routeCoordinates || product.routeCoordinates.length === 0) && (
                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px', background: '#ffffff', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
                          추가된 경로 포인트가 없습니다. "+ 포인트 추가" 버튼을 클릭하여 새로운 경로 점을 생성하세요.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* RENDER FORM: Schedule Image */}
            {selectedBlock === 'scheduleImage' && (
              <section className="admin-card">
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>세부 일정 통이미지 등록 (선택)</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    상세 페이지의 '상세 여행 데일리 루틴' 영역에 데일리일정 리스트 대신 노출할 <strong>통일정 이미지</strong>를 업로드하거나 주소를 입력합니다.
                  </p>
                  <p style={{ fontSize: '11px', color: '#e11d48', fontWeight: '600', marginTop: '8px' }}>
                    ⚠️ 이미지를 등록하면, 데일리 투어 일정표 대신 이 이미지가 상세 페이지에 노출됩니다. 데일리 투어 일정표를 보고 싶다면 이 이미지를 완전히 지우고(삭제) 비워두세요.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="admin-label">세부 일정 이미지 URL</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        className="form-control" 
                        value={product.scheduleImage || ""} 
                        onChange={e => setProduct({ ...product, scheduleImage: e.target.value })}
                        placeholder="예시: storage:... 또는 https://..."
                      />
                      <button 
                        className="luxury-btn outline"
                        style={{ padding: '0 16px', flexShrink: 0, whiteSpace: 'nowrap' }}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if(file) {
                              handleImageUpload(file, (uploadedUrl) => {
                                setProduct(prev => ({ ...prev, scheduleImage: uploadedUrl }));
                              });
                            }
                          };
                          input.click();
                        }}
                      >
                        업로드
                      </button>
                      {product.scheduleImage && (
                        <button 
                          className="luxury-btn outline"
                          style={{ padding: '0 16px', flexShrink: 0, whiteSpace: 'nowrap', color: '#ef4444', borderColor: '#ffebeb' }}
                          onClick={() => {
                            setProduct({ ...product, scheduleImage: "" });
                          }}
                        >
                          이미지 삭제
                        </button>
                      )}
                    </div>
                  </div>

                  {product.scheduleImage && (
                    <div style={{ marginTop: '10px' }}>
                      <label className="admin-label">현재 등록된 세부 일정 이미지 미리보기</label>
                      <div style={{ maxWidth: '100%', maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px', background: '#f8fafc' }}>
                        <SafeMedia src={product.scheduleImage} style={{ width: '100%', objectFit: 'contain' }} />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* RENDER FORM: SEO Config */}
            {selectedBlock === 'seo' && (
              <section className="admin-card">
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>검색엔진 최적화 (SEO)</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>포털 검색 시 표기되는 고유 웹페이지 메타 태그 데이터를 정의합니다.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="admin-label">SEO 타이틀 태그</label>
                    <input 
                      className="form-control" 
                      value={product.title} 
                      readOnly 
                      placeholder="상품명과 연동됩니다."
                    />
                  </div>

                  <div className="form-group">
                    <label className="admin-label">SEO 메타 디스크립션 (웹 페이지 요약문)</label>
                    <textarea 
                      className="form-control" 
                      value={product.description}
                      readOnly
                      rows={3} 
                      placeholder="상품 상세 설명 요약문과 연동됩니다."
                    />
                  </div>

                  <div className="form-group">
                    <label className="admin-label">소셜 미디어 공유용 이미지 (OG Image)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        className="form-control" 
                        value={product.heroImage || ""} 
                        onChange={e => setProduct({ ...product, heroImage: e.target.value })}
                        placeholder="공유시 보여줄 썸네일 이미지 주소"
                      />
                      <button 
                        className="luxury-btn outline"
                        style={{ padding: '0 16px', flexShrink: 0, whiteSpace: 'nowrap' }}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if(file) {
                              handleImageUpload(file, (uploadedUrl) => {
                                setProduct(prev => ({ ...prev, heroImage: uploadedUrl }));
                              });
                            }
                          };
                          input.click();
                        }}
                      >
                        업로드
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* RENDER FORM: Day Itinerary Block */}
            {Array.isArray(selectedBlock) && selectedBlock[0] === 'day' && (() => {
              const dayIndex = selectedBlock[1];
              const day = product.itineraryDays[dayIndex];
              if (!day) return null;

              return (
                <section className="admin-card">
                  <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800' }}>DAY {day.dayNumber} 상세 스케줄</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {day.date ? `${day.date} (${day.weekday}요일)` : '출발일 미등록 상태'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="luxury-btn outline" 
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                        onClick={() => duplicateDay(dayIndex)}
                      >
                        이 Day 복제
                      </button>
                      <button 
                        className="luxury-btn outline" 
                        style={{ padding: '6px 12px', fontSize: '11px', color: '#ef4444', borderColor: '#ffebeb' }}
                        onClick={() => deleteDay(dayIndex)}
                      >
                        이 Day 삭제
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="admin-label">일정 유형 (Type)</label>
                        <select 
                          className="form-control"
                          value={day.dayType}
                          onChange={e => {
                            const list = [...product.itineraryDays];
                            list[dayIndex] = { ...day, dayType: e.target.value };
                            setProduct({ ...product, itineraryDays: list });
                          }}
                        >
                          {DAY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="admin-label">도시 또는 항구명</label>
                        <input 
                          className="form-control" 
                          value={day.cityOrPort || ""} 
                          onChange={e => {
                            const list = [...product.itineraryDays];
                            list[dayIndex] = { ...day, cityOrPort: e.target.value };
                            setProduct({ ...product, itineraryDays: list });
                          }}
                          placeholder="예시: 요코하마, 해상, 로마" 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="admin-label">도착 시간 (선택)</label>
                        <input 
                          className="form-control" 
                          value={day.arrivalTime || ""} 
                          onChange={e => {
                            const list = [...product.itineraryDays];
                            list[dayIndex] = { ...day, arrivalTime: e.target.value };
                            setProduct({ ...product, itineraryDays: list });
                          }}
                          placeholder="예시: 08:00 (미기입시 미노출)" 
                        />
                      </div>

                      <div className="form-group">
                        <label className="admin-label">출항 시간 (선택)</label>
                        <input 
                          className="form-control" 
                          value={day.departureTime || ""} 
                          onChange={e => {
                            const list = [...product.itineraryDays];
                            list[dayIndex] = { ...day, departureTime: e.target.value };
                            setProduct({ ...product, itineraryDays: list });
                          }}
                          placeholder="예시: 19:00 (미기입시 미노출)" 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="admin-label">대표 랜드마크 일정 제목 (필수)</label>
                      <input 
                        className="form-control" 
                        value={day.title} 
                        onChange={e => {
                          const list = [...product.itineraryDays];
                          list[dayIndex] = { ...day, title: e.target.value };
                          setProduct({ ...product, itineraryDays: list });
                        }}
                        placeholder="예시: 요코하마 승선 및 크루즈 오리엔테이션" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="admin-label">여정 세부 묘사/설명</label>
                      <textarea 
                        className="form-control" 
                        value={day.description} 
                        onChange={e => {
                          const list = [...product.itineraryDays];
                          list[dayIndex] = { ...day, description: e.target.value };
                          setProduct({ ...product, itineraryDays: list });
                        }}
                        rows={4}
                        placeholder="상세한 일정을 설명형 문장으로 적어주세요." 
                      />
                    </div>

                    {/* Meal Configurations */}
                    <div style={{ background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
                      <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Utensils size={15} /> 식사 구분 설정</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '12px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '11px', fontWeight: '700' }}>아침 (조식)</label>
                          <input 
                            className="form-control" 
                            style={{ height: '34px', fontSize: '12px' }}
                            value={day.meals?.breakfast || ""} 
                            onChange={e => {
                              const list = [...product.itineraryDays];
                              list[dayIndex] = { ...day, meals: { ...day.meals, breakfast: e.target.value } };
                              setProduct({ ...product, itineraryDays: list });
                            }}
                            placeholder="예: 선내식 / 불포함" 
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '11px', fontWeight: '700' }}>점심 (중식)</label>
                          <input 
                            className="form-control" 
                            style={{ height: '34px', fontSize: '12px' }}
                            value={day.meals?.lunch || ""} 
                            onChange={e => {
                              const list = [...product.itineraryDays];
                              list[dayIndex] = { ...day, meals: { ...day.meals, lunch: e.target.value } };
                              setProduct({ ...product, itineraryDays: list });
                            }}
                            placeholder="예: 선내식 / 자유식" 
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '11px', fontWeight: '700' }}>저녁 (석식)</label>
                          <input 
                            className="form-control" 
                            style={{ height: '34px', fontSize: '12px' }}
                            value={day.meals?.dinner || ""} 
                            onChange={e => {
                              const list = [...product.itineraryDays];
                              list[dayIndex] = { ...day, meals: { ...day.meals, dinner: e.target.value } };
                              setProduct({ ...product, itineraryDays: list });
                            }}
                            placeholder="예: 크루즈정찬 / 자유식" 
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><BedDouble size={15} /> 숙박 정보</label>
                        <input 
                          className="form-control" 
                          value={day.stayType || ""} 
                          onChange={e => {
                            const list = [...product.itineraryDays];
                            list[dayIndex] = { ...day, stayType: e.target.value };
                            setProduct({ ...product, itineraryDays: list });
                          }}
                          placeholder="예: 선내박, 호텔박, 기내박" 
                        />
                      </div>

                      <div className="form-group">
                        <label className="admin-label">기타 비고 (추가 안내)</label>
                        <input 
                          className="form-control" 
                          value={day.notes || ""} 
                          onChange={e => {
                            const list = [...product.itineraryDays];
                            list[dayIndex] = { ...day, notes: e.target.value };
                            setProduct({ ...product, itineraryDays: list });
                          }}
                          placeholder="예: 여권 소지 필수" 
                        />
                      </div>
                    </div>

                    {/* Timeline items nesting */}
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <label className="admin-label" style={{ marginBottom: 0 }}><Clock size={16} style={{ marginRight: 6 }} /> 시간대별 세부 일정 타임라인 (선택)</label>
                        <button 
                          className="luxury-btn outline" 
                          style={{ padding: '4px 12px', fontSize: '11px' }}
                          onClick={() => {
                            const currentItems = day.items || [];
                            const list = [...product.itineraryDays];
                            list[dayIndex] = {
                              ...day,
                              items: [...currentItems, { time: "09:00", label: "일정 구분", description: "" }]
                            };
                            setProduct({ ...product, itineraryDays: list });
                          }}
                        >
                          + 시간 추가
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {(day.items || []).map((timelineItem, tIdx) => (
                          <div key={tIdx} style={{ display: 'flex', gap: '10px', background: 'var(--bg-sub)', padding: '12px', borderRadius: '10px', alignItems: 'center' }}>
                            <input 
                              style={{ width: '80px', flexShrink: 0 }}
                              className="form-control" 
                              value={timelineItem.time} 
                              onChange={e => {
                                const newItems = [...day.items];
                                newItems[tIdx] = { ...newItems[tIdx], time: e.target.value };
                                const list = [...product.itineraryDays];
                                list[dayIndex] = { ...day, items: newItems };
                                setProduct({ ...product, itineraryDays: list });
                              }}
                              placeholder="09:00"
                            />
                            <input 
                              style={{ width: '120px' }}
                              className="form-control" 
                              value={timelineItem.label || ""} 
                              onChange={e => {
                                const newItems = [...day.items];
                                newItems[tIdx] = { ...newItems[tIdx], label: e.target.value };
                                const list = [...product.itineraryDays];
                                list[dayIndex] = { ...day, items: newItems };
                                setProduct({ ...product, itineraryDays: list });
                              }}
                              placeholder="일정 구분 (예: 승선)"
                            />
                            <input 
                              style={{ flex: 1 }}
                              className="form-control" 
                              value={timelineItem.description || ""} 
                              onChange={e => {
                                const newItems = [...day.items];
                                newItems[tIdx] = { ...newItems[tIdx], description: e.target.value };
                                const list = [...product.itineraryDays];
                                list[dayIndex] = { ...day, items: newItems };
                                setProduct({ ...product, itineraryDays: list });
                              }}
                              placeholder="세부 일정 내용"
                            />
                            <button 
                              type="button" 
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                const newItems = (day.items || []).filter((_, idx) => idx !== tIdx);
                                const list = [...product.itineraryDays];
                                list[dayIndex] = { ...day, items: newItems };
                                setProduct({ ...product, itineraryDays: list });
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Day Media Images */}
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <label className="admin-label" style={{ marginBottom: 0 }}>📷 여정 이미지 갤러리 (선택)</label>
                        <button 
                          className="luxury-btn outline" 
                          style={{ padding: '4px 12px', fontSize: '11px' }}
                          onClick={() => {
                            const currentMedia = day.media || [];
                            const list = [...product.itineraryDays];
                            list[dayIndex] = {
                              ...day,
                              media: [...currentMedia, ""]
                            };
                            setProduct({ ...product, itineraryDays: list });
                          }}
                        >
                          + 이미지 추가
                        </button>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        해당 일자의 여정을 설명하는 사진을 등록합니다. PC에서는 2장씩, 모바일에서는 1장씩 가로 스크롤로 표시됩니다.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(day.media || []).map((mediaUrl, mIdx) => (
                          <div key={mIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              className="form-control" 
                              value={mediaUrl} 
                              onChange={e => {
                                const newMedia = [...(day.media || [])];
                                newMedia[mIdx] = e.target.value;
                                const list = [...product.itineraryDays];
                                list[dayIndex] = { ...day, media: newMedia };
                                setProduct({ ...product, itineraryDays: list });
                              }}
                              placeholder="이미지 URL 또는 오른쪽 버튼으로 업로드"
                              style={{ flex: 1 }}
                            />
                            <button 
                              className="luxury-btn outline"
                              style={{ padding: '0 16px', flexShrink: 0, whiteSpace: 'nowrap', fontSize: '12px' }}
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = e.target.files[0];
                                  if(file) {
                                    handleImageUpload(file, (uploadedUrl) => {
                                      setProduct(prev => {
                                        const list = [...prev.itineraryDays];
                                        const updatedDay = { ...list[dayIndex] };
                                        const newMedia = [...(updatedDay.media || [])];
                                        newMedia[mIdx] = uploadedUrl;
                                        updatedDay.media = newMedia;
                                        list[dayIndex] = updatedDay;
                                        return { ...prev, itineraryDays: list };
                                      });
                                    });
                                  }
                                };
                                input.click();
                              }}
                            >
                              업로드
                            </button>
                            <button 
                              onClick={() => {
                                const newMedia = (day.media || []).filter((_, idx) => idx !== mIdx);
                                const list = [...product.itineraryDays];
                                list[dayIndex] = { ...day, media: newMedia };
                                setProduct({ ...product, itineraryDays: list });
                              }} 
                              style={{ padding: '0 10px', border: 'none', background: '#ffebeb', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', height: '36px', display: 'flex', alignItems: 'center' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Media preview thumbnails */}
                      {day.media && day.media.filter(m => m && m.trim()).length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                          {day.media.filter(m => m && m.trim()).map((mediaUrl, mIdx) => (
                            <div key={mIdx} style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-light)' }}>
                              <SafeMedia src={mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );
            })()}
          </div>

          {/* Right Live Preview Panel */}
          <div style={{ flex: 1, position: 'sticky', top: '100px', alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="admin-section-title" style={{ margin: 0 }}>실시간 랜더링 미리보기</h3>
              <div style={{ display: 'flex', background: 'var(--bg-sub)', padding: '4px', borderRadius: '8px', gap: '4px' }}>
                <button 
                  className={`luxury-btn ${previewMode === 'mobile' ? '' : 'outline'}`}
                  style={{ padding: '4px 12px', fontSize: '11px' }}
                  onClick={() => setPreviewMode('mobile')}
                >
                  모바일
                </button>
                <button 
                  className={`luxury-btn ${previewMode === 'desktop' ? '' : 'outline'}`}
                  style={{ padding: '4px 12px', fontSize: '11px' }}
                  onClick={() => setPreviewMode('desktop')}
                >
                  PC/전체
                </button>
              </div>
            </div>

            <div style={{
              width: previewMode === 'mobile' ? '360px' : '100%',
              minHeight: previewMode === 'mobile' ? '640px' : '100%',
              background: previewPageBg,
              borderRadius: previewMode === 'mobile' ? '32px' : '0px',
              border: previewMode === 'mobile' ? '12px solid #1e293b' : `1px solid ${previewCardBorder}`,
              boxShadow: 'var(--shadow-lg)',
              overflowY: 'auto',
              maxHeight: previewMode === 'mobile' ? '660px' : 'none',
              position: 'relative'
            }}>
              
              {/* Product Hero Image */}
              <div style={{ height: '180px', background: '#e2e8f0', position: 'relative' }}>
                {product.thumbnails?.[0] ? (
                  <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>대문 이미지 없음</div>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    {product.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: '9px', fontWeight: '900', background: previewBranding.accentColor || 'var(--primary)', color: '#fff', padding: '3px 8px', borderRadius: '4px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Cruise Meta */}
              <div style={{ padding: '20px' }}>
                {product.subtitle && <p style={{ fontSize: '12px', color: previewBranding.accentColor || 'var(--primary)', fontWeight: '800', marginBottom: '4px' }}>{product.subtitle}</p>}
                <h1 style={{ fontSize: '20px', fontWeight: '900', color: previewTextColor, lineHeight: '1.3' }}>{product.title || "상품명을 입력해주세요"}</h1>
                
                {product.description && (
                  <p style={{ fontSize: '11px', color: previewMutedColor, marginTop: '6px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                    {product.description}
                  </p>
                )}
                
                {product.cruiseInfo && (product.cruiseInfo.line || product.cruiseInfo.shipName || product.cruiseInfo.embarkPort || product.cruiseInfo.disembarkPort) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', color: previewMutedColor, background: previewCardBg, border: `1px solid ${previewCardBorder}`, padding: '8px 12px', borderRadius: '8px' }}>
                    {(product.cruiseInfo.line || product.cruiseInfo.shipName) && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Ship size={12} color={previewBranding.accentColor || 'var(--primary)'} />
                        <span style={{ fontWeight: '700', color: previewTextColor }}>{product.cruiseInfo.line ? `[${product.cruiseInfo.line}] ` : ""}{product.cruiseInfo.shipName}</span>
                      </div>
                    )}
                    {(product.cruiseInfo.embarkPort || product.cruiseInfo.disembarkPort) && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <MapPin size={12} color="#ef4444" />
                        <span style={{ fontWeight: '600', color: previewTextColor }}>{product.cruiseInfo.embarkPort || "-"} 승선 → {product.cruiseInfo.disembarkPort || "-"} 하선</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${previewCardBorder}`, paddingTop: '16px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: previewMutedColor, display: 'block', fontWeight: '600' }}>
                      {product.paymentType === 'split' ? '예약금 및 할부제공' : '정가/할인금액'}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: previewBranding.priceColor || 'var(--primary)', marginTop: '2px', display: 'block' }}>
                      {product.paymentType === 'split' ? `${product.downPayment?.toLocaleString()}원` : `${product.price?.toLocaleString()}원`}
                    </span>
                  </div>
                  {product.paymentType === 'split' && product.installments && (
                    <span style={{ fontSize: '10px', background: previewIsDark ? 'rgba(59,130,246,0.1)' : '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontWeight: '800' }}>
                      * 후불 분할납부 월 34만원대
                    </span>
                  )}
                </div>
              </div>

              {/* Travel Main Schedule & Transport Preview */}
              {(hasDeparture || hasReturn) && (
                <div style={{
                  padding: '20px',
                  borderTop: `6px solid ${previewIsDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}`,
                  background: previewCardBg,
                  borderBottom: `1px solid ${previewCardBorder}`
                }}>
                  {/* Title & button row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${previewCardBorder}`,
                    paddingBottom: '12px',
                    marginBottom: '16px'
                  }}>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: '900',
                      color: previewTextColor,
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Calendar size={14} color={previewBranding.accentColor || 'var(--primary)'} />
                      여행 주요일정 및 교통편
                    </h3>
                    <button
                      onClick={() => setIsPreviewFlightModalOpen(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: previewBranding.accentColor || 'var(--primary)',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        transition: '0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = previewIsDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      항공 상세정보 보기 <ChevronRight size={12} />
                    </button>
                  </div>

                  {/* Departure & Return rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Departure transport */}
                    {hasDeparture && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            fontSize: '9px',
                            fontWeight: '900',
                            background: '#3b82f6',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '100px',
                            textTransform: 'uppercase'
                          }}>
                            출발
                          </span>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: previewTextColor,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Plane size={12} />
                            {product.flights.departure.name || "항공편"}
                          </span>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                          fontSize: '12px',
                          paddingLeft: '38px'
                        }}>
                          <span style={{ fontWeight: '800', color: previewTextColor }}>
                            {product.flights.departure.depPort || "-"}
                          </span>
                          <span style={{ color: previewMutedColor }}>→</span>
                          <span style={{ fontWeight: '800', color: previewTextColor }}>
                            {product.flights.departure.arrPort || "-"}
                          </span>
                          {product.flights.departure.duration && (
                            <span style={{
                              fontSize: '10px',
                              background: previewIsDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                              color: previewMutedColor,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: '600'
                            }}>
                              {product.flights.departure.duration} 소요
                            </span>
                          )}
                          {product.flights.departure.flightNo && (
                            <span style={{
                              fontSize: '10px',
                              background: previewIsDark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
                              color: '#2563eb',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: '700'
                            }}>
                              편명: {product.flights.departure.flightNo}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Return transport */}
                    {hasReturn && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        borderTop: `1px dashed ${previewCardBorder}`,
                        paddingTop: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            fontSize: '9px',
                            fontWeight: '900',
                            background: '#10b981',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '100px',
                            textTransform: 'uppercase'
                          }}>
                            도착
                          </span>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: previewTextColor,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Plane size={12} />
                            {product.flights.return.name || "항공편"}
                          </span>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                          fontSize: '12px',
                          paddingLeft: '38px'
                        }}>
                          <span style={{ fontWeight: '800', color: previewTextColor }}>
                            {product.flights.return.depPort || "-"}
                          </span>
                          <span style={{ color: previewMutedColor }}>→</span>
                          <span style={{ fontWeight: '800', color: previewTextColor }}>
                            {product.flights.return.arrPort || "-"}
                          </span>
                          {product.flights.return.duration && (
                            <span style={{
                              fontSize: '10px',
                              background: previewIsDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                              color: previewMutedColor,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: '600'
                            }}>
                              {product.flights.return.duration} 소요
                            </span>
                          )}
                          {product.flights.return.flightNo && (
                            <span style={{
                              fontSize: '10px',
                              background: previewIsDark ? 'rgba(16,185,129,0.1)' : '#eff6ff',
                              color: '#2563eb',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: '700'
                            }}>
                              편명: {product.flights.return.flightNo}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Itinerary Daily Routines Preview */}
              <div style={{ padding: '20px', borderTop: `6px solid ${previewIsDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}` }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '20px', color: previewTextColor }}>
                  {product.scheduleImage && product.scheduleImage.trim() !== "" ? "상세 여행 데일리 루틴 (통이미지)" : "상세 여행 데일리 루틴"}
                </h3>
                
                {product.scheduleImage && product.scheduleImage.trim() !== "" ? (
                  <SafeMedia src={product.scheduleImage} style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                    {/* Timeline connecting vertical line */}
                    <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '24px', width: '2px', background: previewCardBorder, zIndex: 1 }} />

                    {(product.itineraryDays || []).map((day, idx) => {
                      const typeObj = DAY_TYPES.find(t => t.value === day.dayType) || DAY_TYPES[1];
                      return (
                        <div key={idx} style={{ display: 'flex', gap: '14px', zIndex: 2, position: 'relative' }}>
                          {/* Timeline Circle with Icon */}
                          <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', background: previewIsDark ? 'rgba(30,41,59,0.9)' : '#eff6ff', border: `2px solid ${previewBranding.accentColor || 'var(--primary)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: previewBranding.accentColor || 'var(--primary)', flexShrink: 0
                          }}>
                            {typeObj.icon}
                          </div>

                          <div style={{ flex: 1, background: previewCardBg, border: `1px solid ${previewCardBorder}`, padding: '14px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <span style={{ fontSize: '9px', fontWeight: '900', color: previewBranding.accentColor || 'var(--primary)', textTransform: 'uppercase' }}>DAY 0{day.dayNumber}</span>
                              <span style={{ fontSize: '9px', fontWeight: '700', color: previewMutedColor }}>
                                {day.date ? `${day.date} (${day.weekday})` : ''}
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                              {day.cityOrPort && <span style={{ fontSize: '10px', background: previewBranding.accentColor ? `${previewBranding.accentColor}15` : 'var(--bg-sub)', padding: '2px 6px', borderRadius: '4px', fontWeight: '800', color: previewBranding.accentColor || 'var(--primary)' }}>⚓ {day.cityOrPort}</span>}
                              {day.arrivalTime && <span style={{ fontSize: '9px', color: previewMutedColor }}>도착 {day.arrivalTime}</span>}
                              {day.departureTime && <span style={{ fontSize: '9px', color: previewMutedColor }}>출항 {day.departureTime}</span>}
                            </div>

                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: previewTextColor, marginBottom: '6px' }}>{day.title}</h4>
                            <p style={{ fontSize: '11px', color: previewMutedColor, lineHeight: '1.5' }}>{day.description}</p>

                            {/* Media images preview */}
                            {day.media && day.media.filter(m => m && m.trim()).length > 0 && (
                              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '8px', paddingBottom: '4px', scrollSnapType: 'x mandatory' }}>
                                {day.media.filter(m => m && m.trim()).map((mediaUrl, mIdx) => (
                                  <div key={mIdx} style={{ flex: '0 0 60%', scrollSnapAlign: 'start', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/10', border: `1px solid ${previewCardBorder}` }}>
                                    <SafeMedia src={mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Nested timeline list */}
                            {day.items && day.items.length > 0 && (
                              <div style={{ background: previewIsDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${previewCardBorder}`, padding: '10px', borderRadius: '8px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {day.items.map((item, itemIdx) => (
                                  <div key={itemIdx} style={{ display: 'flex', gap: '8px', fontSize: '10px', color: previewMutedColor }}>
                                    <span style={{ fontWeight: '800', color: previewBranding.accentColor || 'var(--primary)' }}>{item.time}</span>
                                    <span style={{ fontWeight: '700', color: previewTextColor }}>{item.label}</span>
                                    <span>{item.description}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Meals list */}
                            {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                              <div style={{ borderTop: `1px solid ${previewCardBorder}`, paddingTop: '8px', marginTop: '8px', display: 'flex', gap: '8px', fontSize: '9px', color: previewMutedColor }}>
                                {day.meals.breakfast && <span>🍳 조식: {day.meals.breakfast}</span>}
                                {day.meals.lunch && <span>🥗 중식: {day.meals.lunch}</span>}
                                {day.meals.dinner && <span>🌙 석식: {day.meals.dinner}</span>}
                              </div>
                            )}

                            {/* Stay type & notes */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '9px', color: previewMutedColor }}>
                              {day.stayType && <span>🏨 숙소: {day.stayType}</span>}
                              {day.notes && <span style={{ color: '#ef4444' }}>⚠️ 비고: {day.notes}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Policy Sheet Preview */}
              {product.sections && (
                <div style={{ padding: '20px', borderTop: `6px solid ${previewIsDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}`, background: previewIsDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: previewTextColor, marginBottom: '12px' }}>포함 / 불포함 정보 및 취소 규정</h4>
                  
                  {product.sections.included && product.sections.included.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: previewBranding.accentColor || '#2563eb', display: 'block', marginBottom: '4px' }}>🔵 포함 사항</span>
                      {product.sections.included.map((item, i) => (
                        <div key={i} style={{ fontSize: '10px', color: previewMutedColor, paddingLeft: '8px', position: 'relative', marginBottom: '2px' }}>• {item}</div>
                      ))}
                    </div>
                  )}

                  {product.sections.excluded && product.sections.excluded.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: '#ef4444', display: 'block', marginBottom: '4px' }}>🔴 불포함 사항</span>
                      {product.sections.excluded.map((item, i) => (
                        <div key={i} style={{ fontSize: '10px', color: previewMutedColor, paddingLeft: '8px', position: 'relative', marginBottom: '2px' }}>• {item}</div>
                      ))}
                    </div>
                  )}

                  {product.sections.notices && product.sections.notices.length > 0 && (
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: '#f59e0b', display: 'block', marginBottom: '4px' }}>⚠️ 여행 약관 및 유의사항</span>
                      {product.sections.notices.map((item, i) => (
                        <div key={i} style={{ fontSize: '10px', color: previewMutedColor, paddingLeft: '8px', position: 'relative', marginBottom: '2px' }}>• {item}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {renderPreviewFlightModal()}
      </div>
    </div>
  );
};

export default AdminProductEditor;
