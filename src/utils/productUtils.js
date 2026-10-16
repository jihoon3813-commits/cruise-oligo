/**
 * Utility functions for product date extraction, sorting, and formatting
 */

export const getProductDepartureDate = (product) => {
  if (!product) return null;
  if (product.departure?.startDate) {
    return product.departure.startDate;
  }
  if (product.flights?.departure?.depDate) {
    return product.flights.departure.depDate;
  }
  if (Array.isArray(product.itineraryDays) && product.itineraryDays.length > 0) {
    const firstDay = product.itineraryDays.find(d => d && d.date);
    if (firstDay?.date) return firstDay.date;
  }
  return null;
};

export const sortProducts = (products, sortBy = 'departureAsc') => {
  if (!products || !Array.isArray(products)) return [];
  const list = [...products];

  return list.sort((a, b) => {
    const dateA = getProductDepartureDate(a);
    const dateB = getProductDepartureDate(b);

    if (sortBy === 'departureAsc' || !sortBy) {
      // 출발일 빠른 순서 (가까운 날짜 우선)
      if (dateA && dateB) {
        const timeA = new Date(dateA).getTime();
        const timeB = new Date(dateB).getTime();
        if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
          return timeA - timeB;
        }
      }
      if (dateA && !dateB) return -1;
      if (!dateA && dateB) return 1;
      return (b._creationTime || 0) - (a._creationTime || 0);
    }

    if (sortBy === 'departureDesc') {
      // 출발일 늦은 순서
      if (dateA && dateB) {
        const timeA = new Date(dateA).getTime();
        const timeB = new Date(dateB).getTime();
        if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
          return timeB - timeA;
        }
      }
      if (dateA && !dateB) return -1;
      if (!dateA && dateB) return 1;
      return (b._creationTime || 0) - (a._creationTime || 0);
    }

    if (sortBy === 'latest') {
      // 최신 등록일자 순
      return (b._creationTime || 0) - (a._creationTime || 0);
    }

    if (sortBy === 'oldest') {
      // 등록일자 순 (오래된 순)
      return (a._creationTime || 0) - (b._creationTime || 0);
    }

    if (sortBy === 'priceAsc') {
      return (a.price || 0) - (b.price || 0);
    }

    if (sortBy === 'priceDesc') {
      return (b.price || 0) - (a.price || 0);
    }

    return 0;
  });
};

export const formatDepartureDisplay = (departure, itineraryDays) => {
  if (!departure && (!itineraryDays || itineraryDays.length === 0)) return null;

  const startDate = departure?.startDate || itineraryDays?.find(d => d && d.date)?.date;
  const endDate = departure?.endDate;
  const nights = departure?.nights;
  const days = departure?.days;

  if (!startDate) return null;

  const formatShort = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[0]}.${parts[1]}.${parts[2]}`;
    }
    return dateStr;
  };

  const formattedStart = formatShort(startDate);

  let durationText = '';
  if (nights !== undefined && days !== undefined && (nights > 0 || days > 0)) {
    durationText = `${nights}박 ${days}일`;
  }

  if (endDate) {
    const formattedEnd = formatShort(endDate);
    return {
      startDateFormatted: `${formattedStart} 출발`,
      dateRange: `${formattedStart} ~ ${formattedEnd}`,
      durationText,
      fullBadge: durationText ? `${formattedStart} 출발 (${durationText})` : `${formattedStart} 출발`
    };
  }

  return {
    startDateFormatted: `${formattedStart} 출발`,
    dateRange: formattedStart,
    durationText,
    fullBadge: durationText ? `${formattedStart} 출발 (${durationText})` : `${formattedStart} 출발`
  };
};
