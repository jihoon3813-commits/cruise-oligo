import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { Calendar, CreditCard, Ship, MapPin, ArrowLeft, ChevronRight, ChevronLeft, Star, Clock, X, Compass, Flag, Plane, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';
import BookingModal from '../components/BookingModal';

const GALLERY_HEIGHT_DESKTOP = 600;
const GALLERY_HEIGHT_MOBILE = 280;

const getDayIcon = (dayType) => {
  switch (dayType) {
    case 'embarkation':
      return <Ship size={18} />;
    case 'port':
      return <MapPin size={18} />;
    case 'cruising':
      return <Compass size={18} />;
    case 'disembarkation':
      return <Flag size={18} />;
    case 'flight':
      return <Plane size={18} />;
    default:
      return <MapPin size={18} />;
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const { config } = useConfig();
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [galleryIdx, setGalleryIdx] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [isFlightModalOpen, setIsFlightModalOpen] = React.useState(false);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const product = config.products.find(p => p.id === id);
  const branding = config.productDetailBranding || {};

  if (!product) return <div className="container" style={{ paddingTop: '160px' }}>상품을 찾을 수 없습니다.</div>;

  const typo = product.typography || {};
  const getStyle = (t, baseSize, scale = 1) => {
    let color = typo[t]?.color;
    if (t === 'title' && branding.titleColor) color = branding.titleColor;
    if (t === 'price' && branding.priceColor) color = branding.priceColor;
    if (t === 'description' && branding.descriptionColor) color = branding.descriptionColor;

    let fontSize = typo[t]?.fontSize ? typo[t].fontSize * scale : parseInt(baseSize);
    if (isMobile) {
        if (t === 'title') fontSize = Math.min(fontSize, 36);
        else if (t === 'description') fontSize = Math.min(fontSize, 16);
        else if (t === 'price') fontSize = Math.min(fontSize, 28);
        else fontSize = fontSize * 0.8;
    }

    return {
      fontSize: `${fontSize}px`,
      color: color,
      fontWeight: t === 'title' || t === 'price' ? '900' : '400'
    };
  };

  const isDark = branding.theme === 'dark';
  const isGlass = branding.theme === 'glass';
  
  const pageBg = isDark ? '#0F172A' : (isGlass ? '#F1F5F9' : '#ffffff');
  const textColor = isDark ? '#F8FAFC' : 'var(--text-main)';
  const mutedColor = isDark ? '#94A3B8' : (branding.descriptionColor || 'var(--text-muted)');
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : (isGlass ? 'rgba(255,255,255,0.7)' : '#ffffff');
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'var(--border-light)';

  const openGallery = (idx = 0) => {
    setGalleryIdx(idx);
    setIsGalleryOpen(true);
  };

  const galleryHeight = isMobile ? GALLERY_HEIGHT_MOBILE : GALLERY_HEIGHT_DESKTOP;
  const extraCount = product.thumbnails.length > 2 ? product.thumbnails.length - 2 : 0;

  const renderSchedule = () => {
    if (product.scheduleImage && product.scheduleImage.trim() !== "") {
        return <SafeMedia src={product.scheduleImage} style={{ width: '100%', borderRadius: isMobile ? '24px' : '40px', boxShadow: 'var(--shadow-md)' }} />;
    }

    if (product.itineraryDays && product.itineraryDays.length > 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '32px' : '48px', position: 'relative' }}>
          {/* Vertical Timeline Link Line */}
          <div style={{ 
            position: 'absolute', 
            left: isMobile ? '19px' : '23px', 
            top: '24px', 
            bottom: '24px', 
            width: '2px', 
            background: isDark ? 'rgba(255,255,255,0.1)' : 'var(--border-light)', 
            zIndex: 1 
          }} />

          {product.itineraryDays.map((day, i) => {
            const hasMeals = day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner);
            const hasTimelineItems = day.items && day.items.length > 0;

            return (
              <div key={i} style={{ display: 'flex', gap: isMobile ? '16px' : '32px', zIndex: 2, position: 'relative' }}>
                {/* Day Icon Container */}
                <div style={{ 
                  width: isMobile ? '40px' : '48px', 
                  height: isMobile ? '40px' : '48px', 
                  borderRadius: '50%', 
                  background: isDark ? 'rgba(30,41,59,0.9)' : '#eff6ff', 
                  border: `2px solid ${branding.accentColor || 'var(--primary)'}`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: branding.accentColor || 'var(--primary)', 
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {getDayIcon(day.dayType)}
                </div>

                {/* Day Detail Card */}
                <div style={{ 
                  flex: 1, 
                  background: cardBg, 
                  border: `1px solid ${cardBorder}`, 
                  borderRadius: isMobile ? '20px' : '32px', 
                  padding: isMobile ? '20px' : '32px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '900', color: branding.accentColor || 'var(--primary)' }}>
                      DAY 0{day.dayNumber}
                    </div>
                    {day.date && (
                      <div style={{ fontSize: isMobile ? '11px' : '13px', color: mutedColor, fontWeight: '600' }}>
                        {day.date} ({day.weekday}요일)
                      </div>
                    )}
                  </div>

                  {/* Port and Times Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {day.cityOrPort && (
                      <span style={{ 
                        fontSize: isMobile ? '11px' : '12px', 
                        background: branding.accentColor ? `${branding.accentColor}15` : 'var(--bg-sub)', 
                        color: branding.accentColor || 'var(--primary)',
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontWeight: '800' 
                      }}>
                        ⚓ {day.cityOrPort}
                      </span>
                    )}
                    {day.arrivalTime && (
                      <span style={{ fontSize: '12px', color: mutedColor }}>
                        도착 {day.arrivalTime}
                      </span>
                    )}
                    {day.departureTime && (
                      <span style={{ fontSize: '12px', color: mutedColor }}>
                        {day.arrivalTime ? '| ' : ''}출항 {day.departureTime}
                      </span>
                    )}
                  </div>

                  {/* Day Title & Description */}
                  <h4 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', marginBottom: '12px', color: textColor }}>
                    {day.title}
                  </h4>
                  <p style={{ color: mutedColor, fontSize: isMobile ? '14px' : '16px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {day.description}
                  </p>

                  {/* Day Media Image Gallery */}
                  {day.media && day.media.filter(m => m && m.trim()).length > 0 && (
                    <div style={{ marginTop: '20px', position: 'relative' }}>
                      <div style={{
                        display: 'flex',
                        gap: isMobile ? '12px' : '16px',
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                        paddingBottom: '8px',
                        scrollbarWidth: 'thin',
                      }}>
                        {day.media.filter(m => m && m.trim()).map((mediaUrl, mIdx) => (
                          <div 
                            key={mIdx} 
                            style={{
                              flex: `0 0 ${isMobile ? 'calc(100% - 16px)' : 'calc(50% - 8px)'}`,
                              scrollSnapAlign: 'start',
                              borderRadius: isMobile ? '16px' : '20px',
                              overflow: 'hidden',
                              aspectRatio: '16/10',
                              boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.08)',
                              border: `1px solid ${cardBorder}`,
                            }}
                          >
                            <SafeMedia 
                              src={mediaUrl} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              alt={`${day.title} 이미지 ${mIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      {/* Scroll indicator dots */}
                      {day.media.filter(m => m && m.trim()).length > (isMobile ? 1 : 2) && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                          {day.media.filter(m => m && m.trim()).map((_, dotIdx) => (
                            <div 
                              key={dotIdx}
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: branding.accentColor || 'var(--primary)',
                                opacity: 0.3,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Nested Timeline Details */}
                  {hasTimelineItems && (
                    <div style={{ 
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'var(--bg-sub)', 
                      padding: isMobile ? '16px' : '24px', 
                      borderRadius: '16px', 
                      marginTop: '20px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      border: `1px solid ${cardBorder}`
                    }}>
                      {day.items.map((item, tIdx) => (
                        <div key={tIdx} style={{ display: 'flex', gap: '12px', fontSize: isMobile ? '12px' : '14px', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: '900', color: branding.accentColor || 'var(--primary)', minWidth: '45px' }}>{item.time}</span>
                          <span style={{ fontWeight: '800', color: textColor, minWidth: '80px' }}>{item.label}</span>
                          <span style={{ color: mutedColor }}>{item.description}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Meal configurations */}
                  {hasMeals && (
                    <div style={{ 
                      borderTop: `1px solid ${cardBorder}`, 
                      paddingTop: '16px', 
                      marginTop: '20px', 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: isMobile ? '10px' : '20px', 
                      fontSize: isMobile ? '11px' : '13px', 
                      color: mutedColor 
                    }}>
                      {day.meals.breakfast && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          🍳 <strong style={{ color: textColor }}>조식</strong> : {day.meals.breakfast}
                        </div>
                      )}
                      {day.meals.lunch && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          🥗 <strong style={{ color: textColor }}>중식</strong> : {day.meals.lunch}
                        </div>
                      )}
                      {day.meals.dinner && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          🌙 <strong style={{ color: textColor }}>석식</strong> : {day.meals.dinner}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stay type & notes footer */}
                  {(day.stayType || day.notes) && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      flexWrap: 'wrap', 
                      gap: '12px',
                      marginTop: '16px', 
                      fontSize: isMobile ? '11px' : '13px', 
                      color: mutedColor,
                      borderTop: `1px dashed ${cardBorder}`,
                      paddingTop: '12px'
                    }}>
                      {day.stayType && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          🏨 <strong style={{ color: textColor }}>숙박</strong> : {day.stayType}
                        </div>
                      )}
                      {day.notes && (
                        <div style={{ color: '#ef4444', fontWeight: '600' }}>
                          ⚠️ 안내 : {day.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '40px' }}>
            {(product.schedule || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: isMobile ? '20px' : '40px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: branding.accentColor || 'var(--primary)', minWidth: isMobile ? '50px' : '60px', paddingTop: '4px' }}>DAY 0{item.day}</div>
                    <div>
                        <h4 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', marginBottom: '8px', color: textColor }}>{item.title}</h4>
                        <p style={{ color: mutedColor, fontSize: isMobile ? '14px' : '16px', lineHeight: '1.7' }}>{item.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
  };

  const renderMainScheduleAndFlights = () => {
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
    
    if (!hasDeparture && !hasReturn) {
      return null;
    }

    const nights = product.departure?.nights || 0;
    const days = product.departure?.days || 0;
    const scheduleTitle = nights && days ? `${nights}박 ${days}일 여행 주요일정` : "여행 주요일정";

    return (
      <div style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: isMobile ? '24px' : '32px',
        padding: isMobile ? '20px' : '32px',
        marginBottom: isMobile ? '32px' : '48px',
        boxShadow: 'var(--shadow-sm)',
        backdropFilter: isGlass ? 'blur(20px)' : 'none'
      }}>
        {/* Title & button row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: `1px solid ${cardBorder}`,
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: '900',
            color: textColor,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Calendar size={isMobile ? 18 : 22} color={branding.accentColor || 'var(--primary)'} />
            {scheduleTitle}
          </h3>
          {(hasDeparture || hasReturn) && (
            <button
              onClick={() => setIsFlightModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: branding.accentColor || 'var(--primary)',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: '0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              항공 상세정보 보기 <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Departure & Return rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Departure transport */}
          {hasDeparture && (
            <div style={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '12px' : '24px',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: isMobile ? 'auto' : '180px'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '900',
                  background: '#3b82f6',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  textTransform: 'uppercase'
                }}>
                  출발
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: textColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Plane size={16} />
                  {product.flights.departure.name || "항공편"}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: isMobile ? '13px' : '15px'
              }}>
                <span style={{ fontWeight: '800', color: textColor }}>
                  {product.flights.departure.depPort || "-"}
                </span>
                <span style={{ color: mutedColor }}>→</span>
                <span style={{ fontWeight: '800', color: textColor }}>
                  {product.flights.departure.arrPort || "-"}
                </span>
                {product.flights.departure.duration && (
                  <span style={{
                    fontSize: '11px',
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg-sub)',
                    color: mutedColor,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}>
                    {product.flights.departure.duration} 소요
                  </span>
                )}
                {product.flights.departure.flightNo && (
                  <span style={{
                    fontSize: '11px',
                    background: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
                    color: '#2563eb',
                    padding: '3px 8px',
                    borderRadius: '6px',
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
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '12px' : '24px',
              flexDirection: isMobile ? 'column' : 'row',
              borderTop: hasDeparture ? `1px dashed ${cardBorder}` : 'none',
              paddingTop: hasDeparture ? '20px' : '0px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: isMobile ? 'auto' : '180px'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '900',
                  background: '#10b981',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  textTransform: 'uppercase'
                }}>
                  도착
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: textColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Plane size={16} />
                  {product.flights.return.name || "항공편"}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: isMobile ? '13px' : '15px'
              }}>
                <span style={{ fontWeight: '800', color: textColor }}>
                  {product.flights.return.depPort || "-"}
                </span>
                <span style={{ color: mutedColor }}>→</span>
                <span style={{ fontWeight: '800', color: textColor }}>
                  {product.flights.return.arrPort || "-"}
                </span>
                {product.flights.return.duration && (
                  <span style={{
                    fontSize: '11px',
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg-sub)',
                    color: mutedColor,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}>
                    {product.flights.return.duration} 소요
                  </span>
                )}
                {product.flights.return.flightNo && (
                  <span style={{
                    fontSize: '11px',
                    background: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5',
                    color: '#059669',
                    padding: '3px 8px',
                    borderRadius: '6px',
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
    );
  };

  const renderFlightModal = () => {
    if (!product.flights && !product.cruiseInfo) return null;
    const dep = product.flights?.departure;
    const ret = product.flights?.return;

    const formatDateString = (dateStr, weekday) => {
      if (!dateStr) return "";
      const [y, m, d] = dateStr.split('-');
      return `${y}년 ${m}월 ${d}일${weekday ? ` (${weekday})` : ""}`;
    };

    return (
      <AnimatePresence>
        {isFlightModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFlightModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(12px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '16px' : '24px'
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
                background: isDark ? '#1E293B' : '#ffffff',
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
                background: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', color: textColor, margin: 0 }}>
                  항공 및 교통 상세 정보
                </h3>
                <button
                  onClick={() => setIsFlightModalOpen(false)}
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
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}
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
                {dep && (
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
                      background: isDark ? 'rgba(0,0,0,0.1)' : '#F8FAFC',
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
                {ret && (
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
                      background: isDark ? 'rgba(0,0,0,0.1)' : '#F8FAFC',
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



              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: `1px solid ${cardBorder}`,
                textAlign: 'right',
                background: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC'
              }}>
                <button
                  onClick={() => setIsFlightModalOpen(false)}
                  style={{
                    background: branding.accentColor || 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  확인
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderRouteMap = () => {
    const coords = product.routeCoordinates || [];
    if (!product.routeMapImage && coords.length === 0) return null;

    const siteUrl = import.meta.env.VITE_CONVEX_SITE_URL || (import.meta.env.VITE_CONVEX_URL ? import.meta.env.VITE_CONVEX_URL.replace('.convex.cloud', '.convex.site') : "");
    const getDirectUrl = (val) => {
      if (!val) return "";
      if (val.startsWith('storage:')) {
        return `${siteUrl}/api/storage?id=${val.split('storage:')[1]}`;
      }
      return val;
    };

    const hasMapImage = product.routeMapImage;

    return (
      <div style={{
        marginTop: isMobile ? '40px' : '64px',
        marginBottom: isMobile ? '40px' : '64px',
        borderTop: `1px solid ${cardBorder}`,
        paddingTop: isMobile ? '40px' : '64px'
      }}>
        <h2 style={{
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: '900',
          marginBottom: '8px',
          color: branding.sectionTitleColor || textColor
        }}>
          지도로 보는 여행코스
        </h2>
        <p style={{
          fontSize: isMobile ? '13px' : '15px',
          color: mutedColor,
          marginBottom: isMobile ? '24px' : '32px',
          fontWeight: '600'
        }}>
          항차별 상세 기항지와 운항 경로를 한눈에 확인해보세요.
        </p>

        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: isMobile ? '1.2/1' : '16/10',
          borderRadius: isMobile ? '24px' : '40px',
          overflow: 'hidden',
          background: isDark ? '#0F172A' : '#EFF6FF',
          border: `1px solid ${cardBorder}`,
          boxShadow: 'var(--shadow-md)'
        }}>
          {hasMapImage ? (
            <img
              src={getDirectUrl(product.routeMapImage)}
              alt="Route Map Background"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.95
              }}
            />
          ) : (
            // Premium Fallback Sea Map SVG
            <svg
              viewBox="0 0 800 500"
              style={{
                width: '100%',
                height: '100%',
                display: 'block'
              }}
            >
              {/* Oceanic Background Gradients */}
              <defs>
                <radialGradient id="seaGrad" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor={isDark ? '#1E293B' : '#EFF6FF'} />
                  <stop offset="100%" stopColor={isDark ? '#0F172A' : '#DBEAFE'} />
                </radialGradient>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>
              <rect width="800" height="500" fill="url(#seaGrad)" />

              {/* Grid Lines */}
              <g stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(37,99,235,0.03)'} strokeWidth="1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <line key={`x-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`y-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
                ))}
              </g>

              {/* Sea Waves / Nautical decorations */}
              <path d="M 100 80 Q 120 70 140 80 T 180 80" fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(37,99,235,0.08)'} strokeWidth="1.5" />
              <path d="M 600 400 Q 620 390 640 400 T 680 400" fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(37,99,235,0.08)'} strokeWidth="1.5" />
              <path d="M 250 320 Q 270 310 290 320 T 330 320" fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(37,99,235,0.08)'} strokeWidth="1.5" />

              {/* Compass Rose */}
              <g transform="translate(100, 400)" opacity={isDark ? 0.15 : 0.25}>
                <circle cx="0" cy="0" r="40" fill="none" stroke={isDark ? '#ffffff' : '#2563eb'} strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="0" cy="0" r="30" fill="none" stroke={isDark ? '#ffffff' : '#2563eb'} strokeWidth="0.75" />
                <path d="M 0,-45 L 6,-10 L 0,0 L -6,-10 Z" fill={isDark ? '#ffffff' : '#2563eb'} />
                <path d="M 0,45 L 6,10 L 0,0 L -6,10 Z" fill={isDark ? '#94a3b8' : '#60a5fa'} />
                <path d="M 45,0 L 10,6 L 0,0 L 10,-6 Z" fill={isDark ? '#ffffff' : '#2563eb'} />
                <path d="M -45,0 L -10,6 L 0,0 L -10,-6 Z" fill={isDark ? '#94a3b8' : '#60a5fa'} />
                <text x="-4" y="-48" fontSize="10" fontWeight="900" fill={isDark ? '#ffffff' : '#1e3a8a'}>N</text>
              </g>

              {/* Nautical Text Label */}
              <text x="740" y="460" fontSize="10" fontWeight="700" fill={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(37,99,235,0.2)'} letterSpacing="0.2em" textAnchor="end">
                EAST ASIA CRUISE MAP
              </text>

              {/* Simplified East Asian Coastline Path for Premium look */}
              <path
                d="M -50,-50 L 120,-50 Q 150,20 180,60 T 220,110 T 200,160 T 210,210 Q 180,220 150,250 T 110,280 T 80,310 T 50,330 T 30,370 T -50,420 Z"
                fill={isDark ? '#1E293B' : '#E2E8F0'}
                opacity="0.3"
                filter="url(#shadow)"
              />
              <path
                d="M 500,-50 Q 520,30 540,60 T 580,120 T 600,190 T 570,250 T 630,300 T 700,340 T 750,400 T 850,450 L 850,-50 Z"
                fill={isDark ? '#1E293B' : '#E2E8F0'}
                opacity="0.3"
                filter="url(#shadow)"
              />
            </svg>
          )}

          {/* SVG Overlay containing connecting dashed lines */}
          <svg
            viewBox="0 0 800 500"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <defs>
              {/* Marker for line direction */}
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill={branding.accentColor || '#3b82f6'} />
              </marker>
            </defs>

            {/* Connecting paths */}
            {coords.map((coord, idx) => {
              if (idx === 0) return null;
              const prev = coords[idx - 1];
              
              // Scale from percentages to 800x500 coordinates
              const x1 = ((parseFloat(prev.x) || 0) / 100) * 800;
              const y1 = ((parseFloat(prev.y) || 0) / 100) * 500;
              const x2 = ((parseFloat(coord.x) || 0) / 100) * 800;
              const y2 = ((parseFloat(coord.y) || 0) / 100) * 500;

              return (
                <line
                  key={`line-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={branding.accentColor || '#3B82F6'}
                  strokeWidth="3.5"
                  strokeDasharray="8,6"
                  markerEnd="url(#arrow)"
                />
              );
            })}
          </svg>

          {/* Overlay Nodes (Interactive HTML Elements positioned absolutely using % values) */}
          {coords.map((coord, idx) => {
            const xVal = parseFloat(coord.x) || 0;
            const yVal = parseFloat(coord.y) || 0;
            return (
              <div
                key={`node-${idx}`}
                style={{
                  position: 'absolute',
                  left: `${xVal}%`,
                  top: `${yVal}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20
                }}
              >
                {/* Node Badge */}
                <div
                  style={{
                    width: isMobile ? '24px' : '32px',
                    height: isMobile ? '24px' : '32px',
                    borderRadius: '50%',
                    background: branding.accentColor || 'var(--primary)',
                    border: '2.5px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: isMobile ? '10px' : '12px',
                    fontWeight: '900',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    cursor: 'default'
                  }}
                >
                  {coord.label || (idx + 1)}
                </div>

                {/* Node Name Card (Glassmorphism) */}
                <div
                  style={{
                    marginTop: '6px',
                    background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${cardBorder}`,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: isMobile ? '10px' : '12px',
                    fontWeight: '800',
                    color: textColor,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    whiteSpace: 'nowrap',
                    cursor: 'default'
                  }}
                >
                  {coord.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGalleryModal = () => (
    <AnimatePresence>
      {isGalleryOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsGalleryOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(16px)',
            zIndex: 5000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '0' : '40px'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsGalleryOpen(false)}
            style={{
              position: 'absolute', top: '24px', right: '24px', zIndex: 5010,
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: 'none', borderRadius: '50%',
              width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff'
            }}
          >
            <X size={24} />
          </button>

          {/* Counter */}
          <div style={{
            position: 'absolute', top: '28px', left: '50%', transform: 'translateX(-50%)',
            color: '#fff', fontSize: '14px', fontWeight: '700', zIndex: 5010,
            background: 'rgba(255,255,255,0.1)', padding: '6px 20px', borderRadius: '100px'
          }}>
            {galleryIdx + 1} / {product.thumbnails.length}
          </div>

          {/* Image */}
          <motion.div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '1000px',
              height: isMobile ? '70vh' : '80vh',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={galleryIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <SafeMedia
                  src={product.thumbnails[galleryIdx]}
                  style={{
                    maxWidth: '100%', maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: isMobile ? '0' : '24px'
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation arrows */}
          {product.thumbnails.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx - 1 + product.thumbnails.length) % product.thumbnails.length); }}
                style={{
                  position: 'absolute', left: isMobile ? '12px' : '32px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                  border: 'none', borderRadius: '50%',
                  width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', zIndex: 5010
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx + 1) % product.thumbnails.length); }}
                style={{
                  position: 'absolute', right: isMobile ? '12px' : '32px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                  border: 'none', borderRadius: '50%',
                  width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', zIndex: 5010
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {product.thumbnails.length > 1 && (
            <div style={{
              position: 'absolute', bottom: isMobile ? '20px' : '32px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', zIndex: 5010,
              background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '16px',
              backdropFilter: 'blur(8px)', maxWidth: '90vw', overflowX: 'auto'
            }}>
              {product.thumbnails.map((thumb, idx) => (
                <div
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setGalleryIdx(idx); }}
                  style={{
                    width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden',
                    cursor: 'pointer', flexShrink: 0,
                    border: idx === galleryIdx ? '2px solid #fff' : '2px solid transparent',
                    opacity: idx === galleryIdx ? 1 : 0.5,
                    transition: '0.2s'
                  }}
                >
                  <SafeMedia src={thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="product-detail" style={{ 
      paddingTop: isMobile ? '80px' : '100px', 
      paddingBottom: isMobile ? '40px' : '100px', 
      background: pageBg,
      color: textColor,
      minHeight: '100vh',
      transition: '0.3s'
    }}>
      <div className="container" style={{ padding: isMobile ? '0 20px' : '0' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: isMobile ? '20px' : '32px', fontSize: '13px', color: mutedColor }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
          <ChevronRight size={14} />
          <span style={{ color: textColor, fontWeight: '700' }}>{product.title}</span>
        </div>

        {/* Dynamic Layouts */}
        {branding.layout === 'split' ? (
           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '64px', marginBottom: isMobile ? '40px' : '80px', alignItems: 'center' }}>
              <div 
                onClick={() => openGallery(0)} 
                style={{ height: `${galleryHeight}px`, borderRadius: isMobile ? '24px' : '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', cursor: 'pointer' }}
              >
                 <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                 <h1 style={{ ...getStyle('title', '48px', 1.2), lineHeight: '1.2', marginBottom: '16px' }}>{product.title}</h1>
                 <p style={{ ...getStyle('description', '20px', 1.1), lineHeight: '1.7', color: mutedColor, whiteSpace: 'pre-wrap' }}>{product.description}</p>
              </div>
           </div>
        ) : (
           /* Default/Luxury Layout Header — fixed height */
           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: isMobile ? '12px' : '24px', height: `${galleryHeight}px`, maxHeight: `${galleryHeight}px`, overflow: 'hidden', marginBottom: isMobile ? '40px' : '64px' }}>
             <div 
               onClick={() => openGallery(0)} 
               style={{ overflow: 'hidden', borderRadius: isMobile ? '20px' : '32px', boxShadow: 'var(--shadow-lg)', cursor: 'pointer', minHeight: 0, height: '100%' }}
             >
               <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
             </div>
             {!isMobile && (
               <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '24px', minHeight: 0, height: '100%' }}>
                 <div 
                   onClick={() => openGallery(1)} 
                   style={{ overflow: 'hidden', borderRadius: '32px', cursor: 'pointer', minHeight: 0 }}
                 >
                    <SafeMedia src={product.thumbnails[1] || product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.8)' }} />
                 </div>
                 <div 
                   onClick={() => openGallery(2)} 
                   style={{ 
                     background: cardBg, backdropFilter: isGlass ? 'blur(20px)' : 'none', 
                     borderRadius: '32px', display: 'flex', flexDirection: 'column', 
                     alignItems: 'center', justifyContent: 'center', 
                     border: `1px solid ${cardBorder}`, cursor: 'pointer',
                     minHeight: 0, transition: '0.3s'
                   }}
                   onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9'}
                   onMouseLeave={e => e.currentTarget.style.background = cardBg}
                 >
                    <span style={{ fontSize: '28px', fontWeight: '900', color: branding.accentColor || 'var(--primary)' }}>+{extraCount > 0 ? extraCount : product.thumbnails.length}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: mutedColor, marginTop: '4px' }}>사진 전체보기</span>
                 </div>
               </div>
             )}
           </div>
        )}

        <div style={{ 
          display: (branding.layout === 'modern' || isMobile) ? 'block' : 'grid', 
          gridTemplateColumns: branding.layout === 'modern' ? '1fr' : (branding.layout === 'split' ? '1fr 1fr' : '2fr 1fr'), 
          gap: (branding.layout === 'modern' || isMobile) ? '40px' : (branding.layout === 'split' ? '64px' : '24px'), 
          alignItems: 'start' 
        }}>
          {/* Main Content */}
          <div style={{ maxWidth: (branding.layout === 'modern' && !isMobile) ? '800px' : 'none', margin: (branding.layout === 'modern' && !isMobile) ? '0 auto' : '0' }}>
            {branding.layout !== 'split' && <h1 style={{ ...getStyle('title', '56px', 1.2), lineHeight: '1.2', marginBottom: '20px' }}>{product.title}</h1>}
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: branding.badgeColor || cardBg, 
                  color: branding.badgeTextColor || textColor,
                  border: branding.badgeColor ? 'none' : `1px solid ${cardBorder}`, 
                  padding: '8px 18px', 
                  borderRadius: '100px', 
                  fontSize: '13px', 
                  fontWeight: '700' 
              }}>
                 <Clock size={14} color={branding.badgeColor ? branding.badgeTextColor : (branding.accentColor || "var(--primary)")} /> 
                 {product.departure?.nights ? `${product.departure.nights}박 ${product.departure.days}일 여정` : (product.schedule?.length ? `${product.schedule.length - 1}박 ${product.schedule.length}일 여정` : "프리미엄 여정")}
              </div>
              <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: branding.badgeColor || cardBg, 
                  color: branding.badgeTextColor || textColor,
                  border: branding.badgeColor ? 'none' : `1px solid ${cardBorder}`, 
                  padding: '8px 18px', 
                  borderRadius: '100px', 
                  fontSize: '13px', 
                  fontWeight: '700' 
              }}>
                 <Ship size={14} color={branding.badgeColor ? branding.badgeTextColor : (branding.accentColor || "var(--primary)")} /> 
                 {product.cruiseInfo?.shipName ? `${product.cruiseInfo.line ? `[${product.cruiseInfo.line}] ` : ""}${product.cruiseInfo.shipName}` : "럭셔리 크루즈"}
              </div>
              {product.cruiseInfo && (product.cruiseInfo.embarkPort || product.cruiseInfo.disembarkPort) && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: branding.badgeColor || cardBg, 
                    color: branding.badgeTextColor || textColor,
                    border: branding.badgeColor ? 'none' : `1px solid ${cardBorder}`, 
                    padding: '8px 18px', 
                    borderRadius: '100px', 
                    fontSize: '13px', 
                    fontWeight: '700' 
                }}>
                   <MapPin size={14} color={branding.badgeColor ? branding.badgeTextColor : '#ef4444'} /> 
                   {product.cruiseInfo.embarkPort || "-"} 승선 → {product.cruiseInfo.disembarkPort || "-"} 하선
                </div>
              )}
            </div>

            {branding.layout !== 'split' && <p style={{ ...getStyle('description', '20px', 1.1), lineHeight: '1.7', marginBottom: isMobile ? '40px' : '80px', color: mutedColor, whiteSpace: 'pre-wrap' }}>{product.description}</p>}

            <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: isMobile ? '40px' : '80px', marginBottom: isMobile ? '40px' : '0' }}>
              {renderMainScheduleAndFlights()}
              {renderRouteMap()}
              <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '900', marginBottom: isMobile ? '32px' : '48px', color: branding.sectionTitleColor || textColor }}>상세 여행 데일리 루틴</h2>
              {renderSchedule()}
            </div>

            {product.sections && (
              ((product.sections.included && product.sections.included.length > 0) || 
               (product.sections.excluded && product.sections.excluded.length > 0) || 
               (product.sections.notices && product.sections.notices.length > 0))
            ) && (
              <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: isMobile ? '40px' : '80px', marginTop: isMobile ? '40px' : '80px' }}>
                <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '900', marginBottom: isMobile ? '32px' : '48px', color: branding.sectionTitleColor || textColor }}>이용 약관 및 유의사항</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {product.sections.included && product.sections.included.length > 0 && (
                    <div style={{ background: isDark ? 'rgba(16,185,129,0.03)' : '#f0fdf4', border: `1px solid ${isDark ? 'rgba(16,185,129,0.1)' : '#bbf7d0'}`, padding: isMobile ? '24px' : '32px', borderRadius: '24px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>🔵 포함 사항</h4>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
                        {product.sections.included.map((item, idx) => (
                          <li key={idx} style={{ fontSize: isMobile ? '13px' : '15px', color: textColor, lineHeight: '1.6', paddingLeft: '14px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 0, color: '#16a34a' }}>•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.sections.excluded && product.sections.excluded.length > 0 && (
                    <div style={{ background: isDark ? 'rgba(239,68,68,0.03)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(239,68,68,0.1)' : '#fecaca'}`, padding: isMobile ? '24px' : '32px', borderRadius: '24px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>🔴 불포함 사항</h4>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
                        {product.sections.excluded.map((item, idx) => (
                          <li key={idx} style={{ fontSize: isMobile ? '13px' : '15px', color: textColor, lineHeight: '1.6', paddingLeft: '14px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 0, color: '#dc2626' }}>•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.sections.notices && product.sections.notices.length > 0 && (
                    <div style={{ background: isDark ? 'rgba(245,158,11,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(245,158,11,0.1)' : '#fef3c7'}`, padding: isMobile ? '24px' : '32px', borderRadius: '24px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>⚠️ 필수 유의사항 및 안내 규정</h4>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, margin: 0 }}>
                        {product.sections.notices.map((item, idx) => (
                          <li key={idx} style={{ fontSize: isMobile ? '13px' : '15px', color: textColor, lineHeight: '1.6', paddingLeft: '14px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 0, color: '#d97706' }}>•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside style={{ 
            position: (branding.layout === 'modern' || isMobile) ? 'static' : 'sticky', 
            top: '120px', 
            marginTop: (branding.layout === 'modern' || isMobile) ? '40px' : '0',
            maxWidth: (branding.layout === 'modern' && !isMobile) ? '800px' : 'none',
            margin: (branding.layout === 'modern' && !isMobile) ? '0 auto' : '0'
          }}>
            <div style={{ 
              padding: isMobile ? '32px' : '48px', 
              borderRadius: isMobile ? '32px' : '40px', 
              background: cardBg,
              backdropFilter: isGlass ? 'blur(30px)' : 'none',
              border: `1px solid ${cardBorder}`,
              boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.5)' : '0 30px 60px rgba(0,0,0,0.08)' 
            }}>
               <div style={{ marginBottom: isMobile ? '32px' : '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                     <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: mutedColor }}>
                        {product.paymentType === 'split' ? '예약금 및 구성' : '총 패키지 금액'}
                     </span>
                     {product.paymentType === 'split' && (
                        <span style={{ fontSize: '10px', padding: '2px 8px', background: branding.accentColor || 'var(--primary)', color: '#fff', borderRadius: '4px', fontWeight: '800' }}>분할납부형</span>
                     )}
                  </div>
                  
                  <div style={{ marginTop: '8px' }}>
                     {product.paymentType === 'split' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                           <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                              <span style={{ fontSize: '14px', color: mutedColor }}>패키지 정가:</span>
                              <span style={{ fontSize: '18px', fontWeight: '700', color: textColor }}>{product.originalPrice?.toLocaleString()}원</span>
                           </div>
                           <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'var(--bg-sub)', padding: '20px', borderRadius: '20px', border: `1px solid ${cardBorder}` }}>
                              <div style={{ fontSize: '13px', color: branding.accentColor || 'var(--primary)', fontWeight: '800', marginBottom: '4px' }}>지금 필요한 예약금</div>
                              <div style={{ fontSize: '32px', fontWeight: '900', color: branding.accentColor || 'var(--primary)' }}>{product.downPayment?.toLocaleString()}원</div>
                              <p style={{ fontSize: '12px', color: mutedColor, marginTop: '8px', lineHeight: '1.5' }}>
                                 * 나머지 잔금은 여행을 안전하게 다녀오신 후<br/>납입하시는 안심 플랜 상품입니다.
                              </p>
                           </div>
                        </div>
                     ) : (
                        <>
                           {product.originalPrice > 0 && product.originalPrice > product.price && (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '15px', color: mutedColor, textDecoration: 'line-through', fontWeight: '500' }}>{product.originalPrice.toLocaleString()}원</span>
                                <span style={{ fontSize: '16px', color: '#ef4444', fontWeight: '900' }}>{Math.round((1 - product.price / product.originalPrice) * 100)}% 할인</span>
                             </div>
                           )}
                           <div style={{ ...getStyle('price', '42px', 1.2), color: branding.accentColor || (isDark ? '#fff' : 'var(--primary)') }}>
                              {product.price.toLocaleString()}원
                           </div>
                           {product.originalPrice > product.price ? (
                             <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: '700', marginTop: '12px' }}>* 총 {(product.originalPrice - product.price).toLocaleString()}원 즉시 할인 적용됨</p>
                           ) : (
                             <p style={{ fontSize: '13px', color: mutedColor, fontWeight: '700', marginTop: '12px' }}>* 오직 올리고크루즈에서만 가능한 특별가</p>
                           )}
                        </>
                     )}
                  </div>
               </div>

               <button 
                  className="luxury-btn" 
                  onClick={() => setIsBookingOpen(true)}
                  style={{ 
                    width: '100%', 
                    padding: '18px', 
                    borderRadius: '16px', 
                    fontSize: '15px', 
                    justifyContent: 'center',
                    background: branding.buttonColor || 'var(--primary)',
                    color: branding.buttonTextColor || '#ffffff'
                  }}
               >
                  전문 상담 신청하기
               </button>
               <p style={{ textAlign: 'center', fontSize: '11px', color: mutedColor, marginTop: '16px' }}>* 전문가 상담 후 최종 예약이 확정됩니다.</p>
            </div>
          </aside>
        </div>
      </div>
      
      {renderGalleryModal()}
      {renderFlightModal()}

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        productTitle={product.title}
        accentColor={branding.buttonColor || 'var(--primary)'}
      />
    </div>
  );
};

export default ProductDetail;
