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
  const addSectionMutation = useMutation(api.sections.add);
  const updateSectionMutation = useMutation(api.sections.update);
  const deleteSectionMutation = useMutation(api.sections.remove);
  const addProductMutation = useMutation(api.products.add);
  const updateProductMutation = useMutation(api.products.update);
  const deleteProductMutation = useMutation(api.products.remove);
  const addReviewMutation = useMutation(api.reviews.add);
  const seedMutation = useMutation(api.init.seed);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  useEffect(() => {
    if (heroData === null) {
      seedMutation();
    }
  }, [heroData, seedMutation]);

  const config = useMemo(() => ({
    hero: heroData?.hero || DEFAULT_CONFIG.hero,
    sections: sectionsData?.map(s => ({ ...s, id: s._id })) || [],
    products: productsData?.map(p => ({ ...p, id: p._id })) || [],
    reviews: reviewsData?.map(r => ({ ...r, id: r._id })) || [],
  }), [heroData, sectionsData, productsData, reviewsData]);

  const uploadFile = async (file) => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    return storageId; // We'll use a component to resolve storageId to URL or just store high-level
  };

  const updateHero = async (data) => {
    await updateHeroMutation(data);
  };

  const addSection = async (data) => {
    await addSectionMutation({ 
      ...data, 
      style: data.style || "classic",
      showButton: data.showButton ?? true,
      bgType: data.bgType || "color",
      order: config.sections.length 
    });
  };

  const updateSection = async (id, data) => {
    await updateSectionMutation({ id, ...data });
  };

  const deleteSection = async (id) => {
    await deleteSectionMutation({ id });
  };

  const addProduct = async (data) => {
    await addProductMutation(data);
  };

  const updateProduct = async (id, data) => {
    await updateProductMutation({ id, ...data });
  };

  const deleteProduct = async (id) => {
    await deleteProductMutation({ id });
  };

  const addReview = async (data) => {
    await addReviewMutation(data);
  };

  return (
    <ConfigContext.Provider value={{
      config,
      loading: heroData === undefined,
      uploadFile,
      updateHero,
      addSection,
      updateSection,
      deleteSection,
      addProduct,
      updateProduct,
      deleteProduct,
      addReview
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
