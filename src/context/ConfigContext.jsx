import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

const DEFAULT_CONFIG = {
  hero: {
    title: "올리고 크루즈\n멤버십",
    subtitle: "당신을 위한 완벽한 여정",
    bgType: "image", // "image" or "video"
    bgUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    textPosition: "center", // "left", "center", "right"
  },
  sections: [
    {
      id: "intro",
      title: "궁극의 럭셔리",
      content: "올리고 크루즈 멤버십과 함께 세계에서 가장 권위 있는 크루즈를 경험해 보세요. 우리는 럭셔리 여행의 정의를 새롭게 하는 큐레이팅된 여정을 제공합니다.",
      image: "https://images.unsplash.com/photo-1567815357002-ad216ca7bad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      layout: "text-left"
    },
    {
      id: "membership",
      title: "독점적 혜택",
      content: "멤버십 회원으로서 독점적인 스위트룸, 프라이빗 익스커션 및 24시간 전담 컨시어지 서비스를 이용하실 수 있습니다.",
      image: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      layout: "text-right"
    }
  ],
  products: [
    {
      id: "product-1",
      title: "지중해 그랜드 투어",
      description: "이탈리아, 프랑스, 그리스를 방문하는 14일간의 지중해 축복.",
      price: 15000000,
      thumbnails: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      paymentType: "split", // "full" or "split"
      downPayment: 3000000,
      installments: 12,
      schedule: [
        { day: 1, title: "바르셀로나 출발", content: "승선 및 환영 만찬." },
        { day: 2, title: "마르세유, 프랑스", content: "올드 포트 탐방 및 쇼핑." }
      ],
      scheduleImage: null
    }
  ],
  reviews: [
    {
      id: "review-1",
      user: "김민지",
      rating: 5,
      content: "내 인생 최고의 여행 경험이었습니다. 모든 것이 완벽하게 조직되었습니다.",
      images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
    }
  ]
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('oligo_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('oligo_config', JSON.stringify(config));
  }, [config]);

  const updateHero = (heroData) => {
    setConfig(prev => ({ ...prev, hero: { ...prev.hero, ...heroData } }));
  };

  const updateSection = (id, sectionData) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...sectionData } : s)
    }));
  };

  const addSection = (section) => {
    setConfig(prev => ({ ...prev, sections: [...prev.sections, section] }));
  };

  const deleteSection = (id) => {
    setConfig(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
  };

  const addProduct = (product) => {
    setConfig(prev => ({ ...prev, products: [...prev.products, product] }));
  };

  const updateProduct = (id, productData) => {
    setConfig(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...productData } : p)
    }));
  };

  const addReview = (review) => {
    setConfig(prev => ({ ...prev, reviews: [...prev.reviews, review] }));
  };

  return (
    <ConfigContext.Provider value={{
      config,
      updateHero,
      updateSection,
      addSection,
      deleteSection,
      addProduct,
      updateProduct,
      addReview
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
