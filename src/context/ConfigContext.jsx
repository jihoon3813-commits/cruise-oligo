import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
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
  const deleteReviewMutation = useMutation(api.reviews.remove);
  const seedMutation = useMutation(api.init.seed);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateProductBrandingMutation = useMutation(api.siteConfig.updateProductBranding);
  const updateReviewBrandingMutation = useMutation(api.siteConfig.updateReviewBranding);
  const updateProductDetailBrandingMutation = useMutation(api.siteConfig.updateProductDetailBranding);
  const updatePrivacyPolicyMutation = useMutation(api.siteConfig.updatePrivacyPolicy);
  const updateGlobalSettingsMutation = useMutation(api.siteConfig.updateGlobalSettings);
  const updateAdminPasswordMutation = useMutation(api.siteConfig.updateAdminPassword);
  const addReservationMutation = useMutation(api.reservations.add);
  const reservationsData = useQuery(api.reservations.list);

  useEffect(() => {
    if (heroData === null) {
      seedMutation();
    }
  }, [heroData, seedMutation]);

  const resolvedLogo = useQuery(api.files.getUrl, heroData?.logo?.startsWith('storage:') ? { storageId: heroData.logo.split('storage:')[1] } : "skip");
  const resolvedFavicon = useQuery(api.files.getUrl, heroData?.favicon?.startsWith('storage:') ? { storageId: heroData.favicon.split('storage:')[1] } : "skip");
  const resolvedOgImage = useQuery(api.files.getUrl, heroData?.ogImage?.startsWith('storage:') ? { storageId: heroData.ogImage.split('storage:')[1] } : "skip");

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
      logo: heroData?.logo,
      favicon: heroData?.favicon,
      ogImage: heroData?.ogImage,
      metaDescription: heroData?.metaDescription || "올리고 크루즈 - 프리미엄 크루즈 멤버십 서비스"
    };

    return {
       ...raw,
       logoUrl: raw.logo?.startsWith('storage:') ? resolvedLogo : raw.logo,
       faviconUrl: raw.favicon?.startsWith('storage:') ? resolvedFavicon : raw.favicon,
       ogImageUrl: raw.ogImage?.startsWith('storage:') ? resolvedOgImage : raw.ogImage,
    };
  }, [heroData, sectionsData, productsData, reviewsData, resolvedLogo, resolvedFavicon, resolvedOgImage]);

  const uploadFile = async (file) => {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
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
    const { title, content, aboveTitle, image, images, layout, style, items, typography, showButton, buttonText, buttonLink, buttonStyles, cardStyles, bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, menuName } = data;
    await addSectionMutation({ 
      title, content, aboveTitle, image, images, layout, 
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
    const { title, content, image, images, layout, style, items, typography, showButton, buttonText, buttonLink, buttonStyles, cardStyles, bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, order, aboveTitle, menuName } = data;
    await updateSectionMutation({ 
      id, title, content, image, images, layout, style, 
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
    const { title, description, price, thumbnails, paymentType, downPayment, installments, scheduleImage, schedule, typography } = data;
    await addProductMutation({ title, description, price, thumbnails, paymentType, downPayment, installments, scheduleImage, schedule, typography });
  };

  const updateProduct = async (id, data) => {
    const { title, description, price, thumbnails, paymentType, downPayment, installments, scheduleImage, schedule, typography } = data;
    await updateProductMutation({ id, title, description, price, thumbnails, paymentType, downPayment, installments, scheduleImage, schedule, typography });
  };

  const updateProductBranding = async (data) => {
    if (!data) return;
    const { title, titleColor, bgColor } = data;
    await updateProductBrandingMutation({ title, titleColor, bgColor });
  };

  const updateReviewBranding = async (data) => {
    if (!data) return;
    const { show, title, titleColor, bgColor, layout } = data;
    await updateReviewBrandingMutation({ show, title, titleColor, bgColor, layout });
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
      deleteReview,
      updateProductBranding,
      updateReviewBranding,
      updateProductDetailBranding,
      updatePrivacyPolicy,
      updateGlobalSettings,
      updateAdminPassword,
      addReservation,
      reservations: reservationsData || []
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
