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
  const seedMutation = useMutation(api.init.seed);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateProductBrandingMutation = useMutation(api.siteConfig.updateProductBranding);
  const updateReviewBrandingMutation = useMutation(api.siteConfig.updateReviewBranding);

  useEffect(() => {
    if (heroData === null) {
      seedMutation();
    }
  }, [heroData, seedMutation]);

  const config = useMemo(() => ({
    theme: heroData?.theme || "white",
    hero: heroData?.hero || DEFAULT_CONFIG.hero,
    sections: sectionsData?.sort((a,b) => (a.order || 0) - (b.order || 0)).map(s => ({ ...s, id: s._id })) || [],
    products: productsData?.map(p => ({ ...p, id: p._id })) || [],
    reviews: reviewsData?.map(r => ({ ...r, id: r._id })) || [],
    productListBranding: heroData?.productListBranding || { title: "추천 패키지", titleColor: "var(--text-main)", bgColor: "#ffffff" },
    reviewSectionBranding: heroData?.reviewSectionBranding || { show: true, title: "여행 후기", titleColor: "var(--text-main)", bgColor: "var(--bg-sub)", layout: "slider" }
  }), [heroData, sectionsData, productsData, reviewsData]);

  const uploadFile = async (file) => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    return storageId;
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
    const { title, content, image, images, layout, style, items, typography, showButton, buttonText, buttonLink, buttonStyles, bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom } = data;
    await addSectionMutation({ 
      title, content, image, images, layout, 
      style: style || "classic", 
      items: items || [],
      typography: typography || {},
      showButton: showButton ?? true, 
      buttonText: buttonText || "자세히 보기",
      buttonLink, 
      buttonStyles: buttonStyles || { size: "medium" },
      bgColor, 
      bgType: bgType || "color", 
      bgUrl, 
      bgOpacity: bgOpacity ?? 1,
      paddingTop: paddingTop ?? 120,
      paddingBottom: paddingBottom ?? 120,
      order: config.sections.length 
    });
  };

  const updateSection = async (id, data) => {
    const { title, content, image, images, layout, style, items, typography, showButton, buttonText, buttonLink, buttonStyles, bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, order } = data;
    await updateSectionMutation({ 
      id, title, content, image, images, layout, style, items, typography,
      showButton: Boolean(showButton), 
      buttonText, buttonLink, buttonStyles,
      bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, order 
    });
  };

  const deleteSection = async (id) => {
    await deleteSectionMutation({ id });
  };

  const addProduct = async (data) => {
    const { title, description, price, thumbnails, paymentType, downPayment, installments, scheduleImage, typography } = data;
    await addProductMutation({ title, description, price, thumbnails, paymentType, downPayment, installments, scheduleImage, typography });
  };

  const updateProduct = async (id, data) => {
    const { title, description, price, thumbnails, paymentType, downPayment, installments, scheduleImage, typography } = data;
    await updateProductMutation({ id, title, description, price, thumbnails, paymentType, downPayment, installments, scheduleImage, typography });
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

  const deleteProduct = async (id) => {
    await deleteProductMutation({ id });
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
      updateProductBranding,
      updateReviewBranding
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
