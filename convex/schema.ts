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
      buttons: v.optional(v.array(v.object({
        id: v.string(),
        text: v.string(),
        link: v.string(),
        show: v.boolean(),
        style: v.optional(v.object({
          bgColor: v.optional(v.string()),
          textColor: v.optional(v.string()),
          borderColor: v.optional(v.string()),
          size: v.optional(v.string()), // "small", "medium", "large"
        }))
      }))),
      // Keep these temporarily to avoid breaking existing data validation during migration
      productListBranding: v.optional(v.any()),
      reviewSectionBranding: v.optional(v.any()),
    }),
    productListBranding: v.optional(v.object({
      title: v.optional(v.string()),
      titleColor: v.optional(v.string()),
      bgColor: v.optional(v.string()),
    })),
    reviewSectionBranding: v.optional(v.object({
      show: v.optional(v.boolean()),
      title: v.optional(v.string()),
      titleColor: v.optional(v.string()),
      bgColor: v.optional(v.string()),
      layout: v.optional(v.string()), // "slider", "grid"
    })),
    productDetailBranding: v.optional(v.object({
      layout: v.optional(v.string()), // "luxury", "split", "modern"
      theme: v.optional(v.string()), // "light", "dark", "glass"
      titleColor: v.optional(v.string()),
      priceColor: v.optional(v.string()),
      accentColor: v.optional(v.string()), // Used for icons etc
      descriptionColor: v.optional(v.string()),
      badgeColor: v.optional(v.string()),
      badgeTextColor: v.optional(v.string()),
      sectionTitleColor: v.optional(v.string()),
      buttonColor: v.optional(v.string()),
      buttonTextColor: v.optional(v.string()),
    })),
    logo: v.optional(v.string()),
    favicon: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    description: v.optional(v.string()),
    privacyPolicy: v.optional(v.string()),
  }),
  sections: defineTable({
    title: v.string(),
    content: v.string(),
    image: v.optional(v.string()), // Deprecated but kept for safety
    images: v.optional(v.array(v.string())), // Multiple images support
    layout: v.string(), // "left", "right"
    style: v.optional(v.string()), 
    aboveTitle: v.optional(v.string()), 
    items: v.optional(v.array(v.object({
      id: v.optional(v.string()),
      title: v.string(),
      content: v.string(),
      number: v.optional(v.string()), 
      image: v.optional(v.string()), // Per-item image
      aboveTitle: v.optional(v.string()), // Top small text
      aboveTitle2: v.optional(v.string()), // Above title small text
      tag: v.optional(v.string()), 
      icon: v.optional(v.string()),
      highlights: v.optional(v.array(v.string())), // Bullet points
      highlightStyle: v.optional(v.string()), // Bullet style
      typography: v.optional(v.object({
        above: v.optional(v.object({ color: v.optional(v.string()), fontSize: v.optional(v.number()) })),
        title: v.optional(v.object({ color: v.optional(v.string()), fontSize: v.optional(v.number()) })),
        content: v.optional(v.object({ color: v.optional(v.string()), fontSize: v.optional(v.number()) })),
      })),
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
    cardStyles: v.optional(v.object({
      shadow: v.optional(v.number()), // 0 to 1 intensity
      borderRadius: v.optional(v.number()), // px
      borderWidth: v.optional(v.number()), // px
      borderColor: v.optional(v.string()),
      bgColor: v.optional(v.string()),
    })),
    paddingTop: v.optional(v.number()), // px
    paddingBottom: v.optional(v.number()), // px
    order: v.optional(v.number()),
    menuName: v.optional(v.string()), // For dynamic navigation
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
    user: v.optional(v.string()), // Legacy field blocking schema push
    author: v.optional(v.string()),
    productTitle: v.optional(v.string()),
    rating: v.optional(v.number()),
    content: v.string(),
    images: v.optional(v.array(v.string())),
  }),
  reservations: defineTable({
    name: v.string(),
    phone: v.string(),
    productTitle: v.string(),
    notes: v.optional(v.string()),
    status: v.string(), // "pending", "contacted", "completed"
  }),
});
