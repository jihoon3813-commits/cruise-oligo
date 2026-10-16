/**
 * Utility functions for product date extraction, sorting, and formatting
 */

/**
 * 상품명(제목) 또는 텍스트에서 날짜를 지능적으로 추출합니다.
 * 지원 형식:
 * 1. 8자리 숫자: 20260522
 * 2. 한국어 형식: 2026년 5월 22일, 26년 5월 22일, 26년 5월 22일출발
 * 3. 년.월.일 형식: 2026.05.22, 2026-05-22, 2026/05/22, 2026.5.2
 * 4. 2자리 년도: 26.05.22, 26-05-22, 26/05/22, 26.5.2
 * 5. 월/일 형식: 5월 22일, 5/22, 05/22, 5.22 출발 (현재 연도 기준)
 */
export const extractDateFromText = (text) => {
  if (!text || typeof text !== 'string') return null;

  // 1. 8자리 연속 숫자 (YYYYMMDD) - 예: 20260522 지중해
  const pattern8Digits = /(?:^|[^\d])(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(?:$|[^\d])/;
  const match8Digits = text.match(pattern8Digits);
  if (match8Digits) {
    return `${match8Digits[1]}-${match8Digits[2]}-${match8Digits[3]}`;
  }

  // 2. YYYY년 M(M)월 D(D)일 or YY년 M(M)월 D(D)일 (공백 유무 무관)
  const patternKoreanFull = /(?:20)?(\d{2})년\s*(\d{1,2})월\s*(\d{1,2})일?/;
  const matchKorFull = text.match(patternKoreanFull);
  if (matchKorFull) {
    const year = matchKorFull[1].length === 2 ? `20${matchKorFull[1]}` : matchKorFull[1];
    const month = matchKorFull[2].padStart(2, '0');
    const day = matchKorFull[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 3. YYYY[.-/]M(M)[.-/]D(D) (예: 2026.05.22, 2026.5.2, 2026-5-22, 2026/05/22)
  const patternYMD = /(20\d{2})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/;
  const matchYMD = text.match(patternYMD);
  if (matchYMD) {
    const year = matchYMD[1];
    const month = matchYMD[2].padStart(2, '0');
    const day = matchYMD[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 4. YY[.-/]M(M)[.-/]D(D) (예: 26.05.22, 26.5.2, 26-5-22)
  const patternShortYMD = /(?:^|[^\d])(\d{2})[.\-\/](\d{1,2})[.\-\/](\d{1,2})(?:$|[^\d])/;
  const matchShortYMD = text.match(patternShortYMD);
  if (matchShortYMD) {
    const year = `20${matchShortYMD[1]}`;
    const month = matchShortYMD[2].padStart(2, '0');
    const day = matchShortYMD[3].padStart(2, '0');
    const mNum = parseInt(month, 10);
    const dNum = parseInt(day, 10);
    if (mNum >= 1 && mNum <= 12 && dNum >= 1 && dNum <= 31) {
      return `${year}-${month}-${day}`;
    }
  }

  // 5. M(M)월 D(D)일 (예: 5월 22일, 5월22일, 12월 5일)
  const patternMD = /(\d{1,2})월\s*(\d{1,2})일?/;
  const matchMD = text.match(patternMD);
  if (matchMD) {
    const currentYear = new Date().getFullYear() || 2026;
    const month = matchMD[1].padStart(2, '0');
    const day = matchMD[2].padStart(2, '0');
    return `${currentYear}-${month}-${day}`;
  }

  // 6. M(M)/D(D) or M(M).D(D) (예: 5/22, 05/22, 5.22 출발)
  const patternSlashMD = /(?:^|[\s\[\(])(\d{1,2})[\/.](\d{1,2})(?:[\s\]\)]|출발|$)/;
  const matchSlashMD = text.match(patternSlashMD);
  if (matchSlashMD) {
    const mNum = parseInt(matchSlashMD[1], 10);
    const dNum = parseInt(matchSlashMD[2], 10);
    if (mNum >= 1 && mNum <= 12 && dNum >= 1 && dNum <= 31) {
      const currentYear = new Date().getFullYear() || 2026;
      return `${currentYear}-${String(mNum).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
    }
  }

  return null;
};

/**
 * 상품의 정렬 및 표시에 사용할 출발 일자를 반환합니다.
 * 상품명(title)에 명시된 일자를 최우선으로 적용합니다.
 */
export const getProductDepartureDate = (product) => {
  if (!product) return null;

  // 1순위: 상품명(title)에 명시된 날짜
  const dateFromTitle = extractDateFromText(product.title);
  if (dateFromTitle) return dateFromTitle;

  // 2순위: 서브타이틀(subtitle)에 명시된 날짜
  const dateFromSubtitle = extractDateFromText(product.subtitle);
  if (dateFromSubtitle) return dateFromSubtitle;

  // 3순위: departure.startDate
  if (product.departure?.startDate) {
    return product.departure.startDate;
  }

  // 4순위: flights.departure.depDate
  if (product.flights?.departure?.depDate) {
    return product.flights.departure.depDate;
  }

  // 5순위: itineraryDays 첫 번째 날짜
  if (Array.isArray(product.itineraryDays) && product.itineraryDays.length > 0) {
    const firstDay = product.itineraryDays.find(d => d && d.date);
    if (firstDay?.date) return firstDay.date;
  }

  return null;
};

/**
 * 상품 목록을 정렬합니다.
 */
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

/**
 * 상품의 날짜 표시 정보(뱃지, 기간 등)를 생성합니다.
 * 상품명에 명시된 날짜를 최우선으로 반영합니다.
 */
export const formatDepartureDisplay = (productOrDeparture, itineraryDays) => {
  if (!productOrDeparture) return null;

  let product = null;
  let departure = null;
  let daysList = null;

  if (productOrDeparture.title !== undefined || productOrDeparture.departure !== undefined) {
    product = productOrDeparture;
    departure = product.departure;
    daysList = product.itineraryDays;
  } else {
    departure = productOrDeparture;
    daysList = itineraryDays;
  }

  // 상품명에서 날짜 우선 추출
  const dateFromTitle = product ? (extractDateFromText(product.title) || extractDateFromText(product.subtitle)) : null;
  const startDate = dateFromTitle || departure?.startDate || daysList?.find(d => d && d.date)?.date;
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
