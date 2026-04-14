import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  siteConfig: defineTable({
    theme: v.optional(v.string()), // "white", "midnight", "cream", "grey", "lavender", "ocean"
    hero: v.object({
      style: v.optional(v.string()), // "classic", "full-bg", "split", "card", "minimal", "video-focus"
      title: v.string(),
      subtitle: v.optional(v.string()),
      aboveTitle: v.optional(v.string()),
      belowTitle: v.optional(v.string()),
      bgType: v.string(),
      bgUrl: v.string(),
      bgOpacity: v.optional(v.number()),
      paddingX: v.optional(v.number()), // Horizontal padding px
      textPosition: v.string(), // "left", "center", "right"
      verticalAlign: v.optional(v.string()), // "top", "middle", "bottom"
      typography: v.optional(v.object({
        above: v.optional(v.any()), // Reusing typography object structure
        title: v.optional(v.any()),
        subtitle: v.optional(v.any()),
        below: v.optional(v.any()),
      })),
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
    buttonText: v.optional(v.string()),
    buttonLink: v.optional(v.string()),
    buttonStyles: v.optional(v.object({
      bgColor: v.optional(v.string()),
      borderColor: v.optional(v.string()),
      textColor: v.optional(v.string()),
      size: v.optional(v.string()), // "small", "medium", "large"
    })),
    bgColor: v.optional(v.string()),
    bgType: v.optional(v.string()), // "color", "image", "video"
    bgUrl: v.optional(v.string()), // For image/video backgrounds
    bgOpacity: v.optional(v.number()), // 0 to 1
    paddingTop: v.optional(v.number()), // px
    paddingBottom: v.optional(v.number()), // px
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
    typography: v.optional(v.any()),
  }),
  reviews: defineTable({
    user: v.string(),
    rating: v.number(),
    content: v.string(),
    images: v.optional(v.array(v.string())),
  }),
});
