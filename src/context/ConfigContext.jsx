import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

const DEFAULT_CONFIG = {
  hero: {
    title: "올리고 크루즈\n멤버십",
    subtitle: "당신을 위한 완벽한 여정",
    bgType: "image",
    bgUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    textPosition: "center",
    paddingX: 80
  },
  sections: [],
  products: [],
  reviews: []
};

const compressImage = (file, maxWidth = 1920, maxHeight = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    // Only compress standard image files, skip gif and svg
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            
            const compressedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now(),
            });

            // Return the compressed file only if it is actually smaller than original
            if (compressedFile.size < file.size) {
              console.log(`[Image Optimizer] Compressed "${file.name}" from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
              resolve(compressedFile);
            } else {
              console.log(`[Image Optimizer] Compressed file is not smaller, using original: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
              resolve(file);
            }
          },
          mimeType,
          mimeType === 'image/png' ? undefined : quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = event.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

export const ConfigProvider = ({ children }) => {
  const heroData = useQuery(api.siteConfig.get);
  const sectionsData = useQuery(api.sections.list);
  const productsData = useQuery(api.products.list);
  const reviewsData = useQuery(api.reviews.list);

  const updateHeroMutation = useMutation(api.siteConfig.updateHero);
  const updateThemeMutation = useMutation(api.siteConfig.updateTheme);
  const addSectionMutation = useMutation(api.sections.add);
  const updateSectionMutation = useMutation(api.sections.update);
  const deleteSectionMutation = useMutation(api.sections.remove);
  const addProductMutation = useMutation(api.products.add);
  const updateProductMutation = useMutation(api.products.update);
  const deleteProductMutation = useMutation(api.products.remove);
  const addReviewMutation = useMutation(api.reviews.add);
  const updateReviewMutation = useMutation(api.reviews.update);
  const deleteReviewMutation = useMutation(api.reviews.remove);
  const seedMutation = useMutation(api.init.seed);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateProductBrandingMutation = useMutation(api.siteConfig.updateProductBranding);
  const updateReviewBrandingMutation = useMutation(api.siteConfig.updateReviewBranding);
  const updateProductDetailBrandingMutation = useMutation(api.siteConfig.updateProductDetailBranding);
  const updatePrivacyPolicyMutation = useMutation(api.siteConfig.updatePrivacyPolicy);
  const updateGlobalSettingsMutation = useMutation(api.siteConfig.updateGlobalSettings);
  const updateAdminPasswordMutation = useMutation(api.siteConfig.updateAdminPassword);
  const updateFooterMutation = useMutation(api.siteConfig.updateFooter);
  const addReservationMutation = useMutation(api.reservations.add);
  const reservationsData = useQuery(api.reservations.list);
  const triggerDeployAction = useAction(api.vercel.triggerDeploy);

  useEffect(() => {
    if (heroData === null) {
      seedMutation();
    }
  }, [heroData, seedMutation]);

  const config = useMemo(() => {
    const raw = {
      theme: heroData?.theme || "white",
      hero: heroData?.hero || DEFAULT_CONFIG.hero,
      sections: [...(sectionsData || [])].sort((a,b) => (a.order || 0) - (b.order || 0)).map(s => ({ ...s, id: s._id })),
      products: productsData?.map(p => ({ ...p, id: p._id })) || [],
      reviews: reviewsData?.map(r => ({ ...r, id: r._id })) || [],
      productListBranding: heroData?.productListBranding || { title: "추천 패키지", titleColor: "var(--text-main)", bgColor: "#ffffff" },
      reviewSectionBranding: heroData?.reviewSectionBranding || { show: true, title: "여행 후기", titleColor: "var(--text-main)", bgColor: "var(--bg-sub)", layout: "slider" },
      productDetailBranding: heroData?.productDetailBranding || { layout: "luxury", theme: "light", titleColor: "#0F172A", priceColor: "var(--primary)", accentColor: "var(--primary)", buttonColor: "var(--primary)", buttonTextColor: "#ffffff" },
      privacyPolicy: heroData?.privacyPolicy || "개인정보 수집 및 이용에 동의합니다.",
      footer: heroData?.footer || {
        businessInfo: "회사명: 올리고 크루즈 | 대표자: 홍길동 | 주소: 서울특별시 강남구 테헤란로 123\n사업자등록번호: 123-45-67890 | TEL: 02-1234-5678",
        copyright: "© 2024 OLIGO CRUISE. All rights reserved.",
        menus: [
          { id: "m1", label: "이용약관", url: "/terms" },
          { id: "m2", label: "개인정보처리방침", url: "/privacy" }
        ],
        links: [],
        csCenter: {
          title: "CS CENTER",
          phone: "1600-0000",
          hours: "운영시간: 평일 09:00 ~ 18:00",
          extra: "점심시간: 12:00 ~ 13:00 (토/일/공휴일 휴무)"
        }
      },
      logo: heroData?.logo,
      favicon: heroData?.favicon,
      ogImage: heroData?.ogImage,
      metaDescription: heroData?.metaDescription || "올리고 크루즈 - 프리미엄 크루즈 멤버십 서비스"
    };

    const siteUrl = import.meta.env.VITE_CONVEX_SITE_URL || (import.meta.env.VITE_CONVEX_URL ? import.meta.env.VITE_CONVEX_URL.replace('.convex.cloud', '.convex.site') : "");
    const getDirectUrl = (val) => {
      if (!val) return "";
      if (val.startsWith('storage:')) {
        return `${siteUrl}/api/storage?id=${val.split('storage:')[1]}`;
      }
      return val;
    };

    return {
       ...raw,
       logoUrl: getDirectUrl(raw.logo),
       faviconUrl: getDirectUrl(raw.favicon),
       ogImageUrl: getDirectUrl(raw.ogImage),
    };
  }, [heroData, sectionsData, productsData, reviewsData]);

  const uploadFile = async (file) => {
    try {
      const optimizedFile = await compressImage(file);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": optimizedFile.type },
        body: optimizedFile,
      });
      
      if (!result.ok) {
        throw new Error(`Upload failed with status: ${result.status}`);
      }
      
      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const updateHero = async (data) => {
    const { 
      style, title, subtitle, aboveTitle, belowTitle, 
      bgType, bgUrl, bgOpacity, paddingX,
      textPosition, verticalAlign, typography, buttons 
    } = data;
    await updateHeroMutation({ 
      style: style || "classic", 
      title, 
      subtitle: subtitle || "",
      aboveTitle: aboveTitle || "",
      belowTitle: belowTitle || "",
      bgType, 
      bgUrl, 
      bgOpacity: bgOpacity ?? 1,
      paddingX: paddingX ?? 80,
      textPosition, 
      verticalAlign: verticalAlign || "middle",
      typography: typography || {},
      buttons: buttons || []
    });
  };

  const updateTheme = async (theme) => {
    await updateThemeMutation({ theme });
  };

  const addSection = async (data) => {
    const { title, content, aboveTitle, image, images, layout, mobileLayout, style, items, typography, showButton, buttonText, buttonLink, buttonStyles, cardStyles, bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, menuName } = data;
    await addSectionMutation({ 
      title, content, aboveTitle, image, images, layout, mobileLayout,
      style: style || "classic", 
      items: (items || []).map(item => ({
        ...item,
        highlights: item.highlights || [],
        highlightStyle: item.highlightStyle || "dot"
      })),
      typography: typography || {},
      showButton: showButton ?? true, 
      buttonText: buttonText || "자세히 보기",
      buttonLink, 
      buttonStyles: buttonStyles || { size: "medium" },
      cardStyles: cardStyles || { shadow: 0.1, borderRadius: 24, borderWidth: 1, borderColor: "#e2e8f0", bgColor: "#ffffff" },
      bgColor, 
      bgType: bgType || "color", 
      bgUrl, 
      bgOpacity: bgOpacity ?? 1,
      paddingTop: paddingTop ?? 120,
      paddingBottom: paddingBottom ?? 120,
      order: config.sections.length,
      menuName
    });
  };

  const updateSection = async (id, data) => {
    const { title, content, image, images, layout, mobileLayout, style, items, typography, showButton, buttonText, buttonLink, buttonStyles, cardStyles, bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, order, aboveTitle, menuName } = data;
    await updateSectionMutation({ 
      id, title, content, image, images, layout, mobileLayout, style, 
      items: (items || []).map(item => ({
        ...item,
        highlights: item.highlights || [],
        highlightStyle: item.highlightStyle || "dot"
      })),
      typography,
      showButton: Boolean(showButton), 
      buttonText, buttonLink, buttonStyles, cardStyles,
      aboveTitle,
      bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, order, menuName
    });
  };

  const deleteSection = async (id) => {
    await deleteSectionMutation({ id });
  };

  const addProduct = async (data) => {
    const { 
      title, description, price, originalPrice, thumbnails, paymentType, 
      downPayment, installments, scheduleImage, schedule, typography,
      subtitle, status, tags, heroImage, departure, cruiseInfo, 
      itineraryDays, sections, flights, routeMapImage, routeCoordinates 
    } = data;
    await addProductMutation({ 
      title, description, price, originalPrice, thumbnails, paymentType, 
      downPayment, installments, scheduleImage, schedule, typography,
      subtitle, status, tags, heroImage, departure, cruiseInfo, 
      itineraryDays, sections, flights, routeMapImage, routeCoordinates 
    });
  };

  const updateProduct = async (id, data) => {
    const { 
      title, description, price, originalPrice, thumbnails, paymentType, 
      downPayment, installments, scheduleImage, schedule, typography,
      subtitle, status, tags, heroImage, departure, cruiseInfo, 
      itineraryDays, sections, flights, routeMapImage, routeCoordinates 
    } = data;
    await updateProductMutation({ 
      id, title, description, price, originalPrice, thumbnails, paymentType, 
      downPayment, installments, scheduleImage, schedule, typography,
      subtitle, status, tags, heroImage, departure, cruiseInfo, 
      itineraryDays, sections, flights, routeMapImage, routeCoordinates 
    });
  };

  const updateProductBranding = async (data) => {
    if (!data) return;
    const { title, titleColor, bgColor, subTitleTop, subTitleTopStyle, subTitleBottom, subTitleBottomStyle, mobileLayout } = data;
    await updateProductBrandingMutation({ title, titleColor, bgColor, subTitleTop, subTitleTopStyle, subTitleBottom, subTitleBottomStyle, mobileLayout });
  };

  const updateReviewBranding = async (data) => {
    if (!data) return;
    const { show, title, titleColor, bgColor, layout, subTitleTop, subTitleTopStyle, subTitleBottom, subTitleBottomStyle, mobileLayout } = data;
    await updateReviewBrandingMutation({ show, title, titleColor, bgColor, layout, subTitleTop, subTitleTopStyle, subTitleBottom, subTitleBottomStyle, mobileLayout });
  };

  const updateProductDetailBranding = async (data) => {
    if (!data) return;
    await updateProductDetailBrandingMutation(data);
  };

  const updatePrivacyPolicy = async (content) => {
    await updatePrivacyPolicyMutation({ content });
  };

  const updateGlobalSettings = async (data) => {
    await updateGlobalSettingsMutation(data);
    // After saving global settings (which contains Meta Tags), trigger Vercel rebuild
    try {
      await triggerDeployAction();
    } catch (e) {
      console.error("Vercel deploy trigger failed:", e);
    }
  };

  const updateFooter = async (data) => {
    await updateFooterMutation(data);
    try {
      await triggerDeployAction();
    } catch (e) {
      console.error("Vercel deploy trigger failed:", e);
    }
  };

  const addReservation = async (data) => {
    await addReservationMutation({
      ...data,
      status: "pending"
    });
  };

  const updateAdminPassword = async (password) => {
    await updateAdminPasswordMutation({ password });
  };


  const deleteProduct = async (id) => {
    await deleteProductMutation({ id });
  };

  const addReview = async (data) => {
    const { author, rating, content, images, productTitle } = data;
    await addReviewMutation({ author, rating, content, images, productTitle });
  };

  const deleteReview = async (id) => {
    await deleteReviewMutation({ id });
  };

  const updateReview = async (id, data) => {
    await updateReviewMutation({ id, ...data });
  };

  return (
    <ConfigContext.Provider value={{
      config,
      loading: heroData === undefined,
      uploadFile,
      updateHero,
      updateTheme,
      addSection,
      updateSection,
      deleteSection,
      addProduct,
      updateProduct,
      deleteProduct,
      addReview,
      updateReview,
      deleteReview,
      updateProductBranding,
      updateReviewBranding,
      updateProductDetailBranding,
      updatePrivacyPolicy,
      updateGlobalSettings,
      updateFooter,
      updateAdminPassword,
      addReservation,
      reservations: reservationsData || []
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
