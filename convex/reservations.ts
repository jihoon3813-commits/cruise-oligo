import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reservations").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    productTitle: v.string(),
    notes: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reservations", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("reservations"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("reservations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
