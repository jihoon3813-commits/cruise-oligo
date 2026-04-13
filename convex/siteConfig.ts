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
      // Mock hero data if needed or just don't allow theme change if no config
    }
  },
});
