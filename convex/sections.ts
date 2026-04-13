import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const typographyValidator = v.optional(v.object({
  title: v.optional(v.object({
    color: v.optional(v.string()),
    fontSize: v.optional(v.number()),
    fontFamily: v.optional(v.string()),
    textAlign: v.optional(v.string()),
    letterSpacing: v.optional(v.number()),
    lineHeight: v.optional(v.number()),
  })),
  content: v.optional(v.object({
    color: v.optional(v.string()),
    fontSize: v.optional(v.number()),
    fontFamily: v.optional(v.string()),
    textAlign: v.optional(v.string()),
    letterSpacing: v.optional(v.number()),
    lineHeight: v.optional(v.number()),
  })),
}));

const itemsValidator = v.optional(v.array(v.object({
  title: v.string(),
  content: v.string(),
  number: v.optional(v.string()),
  icon: v.optional(v.string()),
})));

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sections").collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    image: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    layout: v.string(),
    style: v.string(),
    items: itemsValidator,
    typography: typographyValidator,
    showButton: v.boolean(),
    buttonLink: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    bgType: v.string(),
    bgUrl: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sections", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("sections"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    image: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    layout: v.optional(v.string()),
    style: v.optional(v.string()),
    items: itemsValidator,
    typography: typographyValidator,
    showButton: v.optional(v.boolean()),
    buttonLink: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    bgType: v.optional(v.string()),
    bgUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
