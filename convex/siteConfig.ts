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
    }
  },
});

export const updateProductBranding = mutation({
  args: {
    title: v.optional(v.string()),
    titleColor: v.optional(v.string()),
    bgColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { productListBranding: args });
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { reviewSectionBranding: args });
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
    }
  },
});

export const updatePrivacyPolicy = mutation({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { privacyPolicy: args.content });
    }
  },
});

export const updateGlobalSettings = mutation({
  args: {
    logo: v.optional(v.string()),
    favicon: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    }
  },
});