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
    image: v.optional(v.string()), // Deprecated but kept for safety
    images: v.optional(v.array(v.string())), // Multiple images support
    layout: v.string(), // "left", "right"
    style: v.optional(v.string()), // "classic", "split-card", "minimal-centered", "gallery", "feature-cards", "process"
    items: v.optional(v.array(v.object({
      title: v.string(),
      content: v.string(),
      number: v.optional(v.string()), // e.g., "01"
      icon: v.optional(v.string()),
    }))),
    typography: v.optional(v.object({
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
    })),
    showButton: v.optional(v.boolean()),
    buttonLink: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    bgType: v.optional(v.string()), // "color", "image", "video"
    bgUrl: v.optional(v.string()), // For image/video backgrounds
    order: v.optional(v.number()),
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
