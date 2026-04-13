import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    image: v.string(),
    layout: v.string(),
    style: v.string(),
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
    title: v.string(),
    content: v.string(),
    image: v.string(),
    layout: v.string(),
    style: v.string(),
    showButton: v.boolean(),
    buttonLink: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    bgType: v.string(),
    bgUrl: v.optional(v.string()),
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
