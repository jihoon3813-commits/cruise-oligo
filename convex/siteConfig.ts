import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("siteConfig").first();
  },
});

export const updateHero = mutation({
  args: {
    style: v.optional(v.string()),
    title: v.string(),
    subtitle: v.optional(v.string()),
    aboveTitle: v.optional(v.string()),
    belowTitle: v.optional(v.string()),
    bgType: v.string(),
    bgUrl: v.string(),
    bgOpacity: v.optional(v.number()),
    paddingX: v.optional(v.number()),
    textPosition: v.string(),
    verticalAlign: v.optional(v.string()),
    typography: v.optional(v.any()),
    buttons: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { hero: args });
    } else {
      await ctx.db.insert("siteConfig", { hero: args });
    }
  },
});

export const updateTheme = mutation({
  args: { theme: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { theme: args.theme });
    } else {
      await ctx.db.insert("siteConfig", { theme: args.theme });
    }
  },
});

export const updateProductBranding = mutation({
  args: {
    title: v.optional(v.string()),
    titleColor: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    subTitleTop: v.optional(v.string()),
    subTitleTopStyle: v.optional(v.any()),
    subTitleBottom: v.optional(v.string()),
    subTitleBottomStyle: v.optional(v.any()),
    mobileLayout: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { productListBranding: args });
    } else {
      await ctx.db.insert("siteConfig", { productListBranding: args });
    }
  },
});

export const updateReviewBranding = mutation({
  args: {
    show: v.optional(v.boolean()),
    title: v.optional(v.string()),
    titleColor: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    layout: v.optional(v.string()),
    subTitleTop: v.optional(v.string()),
    subTitleTopStyle: v.optional(v.any()),
    subTitleBottom: v.optional(v.string()),
    subTitleBottomStyle: v.optional(v.any()),
    mobileLayout: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { reviewSectionBranding: args });
    } else {
      await ctx.db.insert("siteConfig", { reviewSectionBranding: args });
    }
  },
});

export const updateProductDetailBranding = mutation({
  args: {
    layout: v.optional(v.string()),
    theme: v.optional(v.string()),
    titleColor: v.optional(v.string()),
    priceColor: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    descriptionColor: v.optional(v.string()),
    badgeColor: v.optional(v.string()),
    badgeTextColor: v.optional(v.string()),
    sectionTitleColor: v.optional(v.string()),
    buttonColor: v.optional(v.string()),
    buttonTextColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { productDetailBranding: args });
    } else {
      await ctx.db.insert("siteConfig", { productDetailBranding: args });
    }
  },
});

export const updatePrivacyPolicy = mutation({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { privacyPolicy: args.content });
    } else {
      await ctx.db.insert("siteConfig", { privacyPolicy: args.content });
    }
  },
});

export const updateGlobalSettings = mutation({
  args: {
    logo: v.optional(v.string()),
    favicon: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    adminPassword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("siteConfig", args);
    }
  },
});

export const updateAdminPassword = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { adminPassword: args.password });
    }
  },
});

export const updateFooter = mutation({
  args: {
    businessInfo: v.optional(v.string()),
    copyright: v.optional(v.string()),
    menus: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      url: v.string(),
    }))),
    links: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      url: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { footer: args });
    } else {
      await ctx.db.insert("siteConfig", { 
        footer: args,
        hero: {
          title: "Welcome",
          bgType: "color",
          bgUrl: "#000000",
          textPosition: "center"
        }
      });
    }
  },
});