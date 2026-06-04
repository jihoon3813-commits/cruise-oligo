import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const clearScheduleImage = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { scheduleImage: "" });
    return "Cleared scheduleImage";
  },
});

export const setScheduleImage = mutation({
  args: { id: v.id("products"), imageUrl: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { scheduleImage: args.imageUrl });
    return "Set scheduleImage to " + args.imageUrl;
  },
});
