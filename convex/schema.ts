import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  siteConfig: defineTable({
    hero: v.object({
      title: v.string(),
      subtitle: v.string(),
      bgType: v.string(),
      bgUrl: v.string(),
      textPosition: v.string(),
    }),
  }),
  sections: defineTable({
    title: v.string(),
    content: v.string(),
    image: v.string(), // Main content image
    layout: v.string(), // "left", "right"
    style: v.string(), // "classic", "split-card", "minimal-centered"
    showButton: v.boolean(),
    buttonLink: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    bgType: v.string(), // "color", "image", "video"
    bgUrl: v.optional(v.string()), // For image/video backgrounds
    order: v.number(),
  }),
  products: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    thumbnails: v.array(v.string()),
    paymentType: v.string(),
    downPayment: v.optional(v.number()),
    installments: v.optional(v.number()),
    schedule: v.optional(v.array(v.object({ day: v.number(), title: v.string(), content: v.string() }))),
    scheduleImage: v.optional(v.string()),
  }),
  reviews: defineTable({
    user: v.string(),
    rating: v.number(),
    content: v.string(),
    images: v.optional(v.array(v.string())),
  }),
});
