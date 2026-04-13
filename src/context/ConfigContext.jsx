import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

const DEFAULT_CONFIG = {
  hero: {
    title: "OLIGO CRUISE\nMEMBERSHIP",
    subtitle: "PERFECT JOURNEY FOR YOU",
    bgType: "image", // "image" or "video"
    bgUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    textPosition: "center", // "left", "center", "right"
  },
  sections: [
    {
      id: "intro",
      title: "The Ultimate Luxury",
      content: "Experience the world's most prestigious cruises with Oligo Cruise Membership. We provide curated journeys that redefine luxury travel.",
      image: "https://images.unsplash.com/photo-1567815357002-ad216ca7bad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      layout: "text-left"
    },
    {
      id: "membership",
      title: "Exclusive Benefits",
      content: "As a member, you gain access to exclusive suites, private excursions, and dedicated concierge services available 24/7.",
      image: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      layout: "text-right"
    }
  ],
  products: [
    {
      id: "product-1",
      title: "Mediterranean Grand Tour",
      description: "14 days of Mediterranean bliss, visiting Italy, France, and Greece.",
      price: 15000000,
      thumbnails: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      paymentType: "split", // "full" or "split"
      downPayment: 3000000,
      installments: 12,
      schedule: [
        { day: 1, title: "Departure from Barcelona", content: "Boarding and welcome dinner." },
        { day: 2, title: "Marseille, France", content: "Exploring the old port and shopping." }
      ],
      scheduleImage: null
    }
  ],
  reviews: [
    {
      id: "review-1",
      user: "Kim Min-ji",
      rating: 5,
      content: "The best travel experience of my life. Everything was perfectly organized.",
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
