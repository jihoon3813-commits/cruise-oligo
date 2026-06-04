import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    thumbnails: v.array(v.string()),
    paymentType: v.string(),
    downPayment: v.optional(v.number()),
    installments: v.optional(v.number()),
    scheduleImage: v.optional(v.string()),
    schedule: v.optional(v.array(v.object({ day: v.number(), title: v.string(), content: v.string() }))),
    typography: v.optional(v.any()),
    
    subtitle: v.optional(v.string()),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    heroImage: v.optional(v.string()),
    departure: v.optional(v.object({
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      nights: v.optional(v.number()),
      days: v.optional(v.number()),
      price: v.optional(v.number()),
      availability: v.optional(v.string()),
    })),
    cruiseInfo: v.optional(v.object({
      line: v.optional(v.string()),
      shipName: v.optional(v.string()),
      embarkPort: v.optional(v.string()),
      disembarkPort: v.optional(v.string()),
    })),
    itineraryDays: v.optional(v.array(v.object({
      dayNumber: v.number(),
      date: v.optional(v.string()),
      weekday: v.optional(v.string()),
      dayType: v.string(),
      cityOrPort: v.optional(v.string()),
      arrivalTime: v.optional(v.string()),
      departureTime: v.optional(v.string()),
      title: v.string(),
      description: v.string(),
      meals: v.optional(v.object({
        breakfast: v.optional(v.union(v.boolean(), v.string())),
        lunch: v.optional(v.union(v.boolean(), v.string())),
        dinner: v.optional(v.union(v.boolean(), v.string())),
      })),
      stayType: v.optional(v.string()),
      notes: v.optional(v.string()),
      highlights: v.optional(v.array(v.string())),
      media: v.optional(v.array(v.string())),
      items: v.optional(v.array(v.object({
        time: v.string(),
        label: v.string(),
        description: v.optional(v.string())
      })))
    }))),
    sections: v.optional(v.object({
      included: v.optional(v.array(v.string())),
      excluded: v.optional(v.array(v.string())),
      notices: v.optional(v.array(v.string())),
    })),
    flights: v.optional(v.object({
      departure: v.optional(v.object({
        type: v.optional(v.string()),
        name: v.optional(v.string()),
        flightNo: v.optional(v.string()),
        duration: v.optional(v.string()),
        depPort: v.optional(v.string()),
        depTime: v.optional(v.string()),
        depDate: v.optional(v.string()),
        depWeekday: v.optional(v.string()),
        arrPort: v.optional(v.string()),
        arrTime: v.optional(v.string()),
        arrDate: v.optional(v.string()),
        arrWeekday: v.optional(v.string()),
      })),
      return: v.optional(v.object({
        type: v.optional(v.string()),
        name: v.optional(v.string()),
        flightNo: v.optional(v.string()),
        duration: v.optional(v.string()),
        depPort: v.optional(v.string()),
        depTime: v.optional(v.string()),
        depDate: v.optional(v.string()),
        depWeekday: v.optional(v.string()),
        arrPort: v.optional(v.string()),
        arrTime: v.optional(v.string()),
        arrDate: v.optional(v.string()),
        arrWeekday: v.optional(v.string()),
      })),
    })),
    routeMapImage: v.optional(v.string()),
    routeCoordinates: v.optional(v.array(v.object({
      name: v.string(),
      x: v.number(),
      y: v.number(),
      label: v.optional(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    title: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    thumbnails: v.array(v.string()),
    paymentType: v.string(),
    downPayment: v.optional(v.number()),
    installments: v.optional(v.number()),
    scheduleImage: v.optional(v.string()),
    schedule: v.optional(v.array(v.object({ day: v.number(), title: v.string(), content: v.string() }))),
    typography: v.optional(v.any()),
    
    subtitle: v.optional(v.string()),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    heroImage: v.optional(v.string()),
    departure: v.optional(v.object({
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      nights: v.optional(v.number()),
      days: v.optional(v.number()),
      price: v.optional(v.number()),
      availability: v.optional(v.string()),
    })),
    cruiseInfo: v.optional(v.object({
      line: v.optional(v.string()),
      shipName: v.optional(v.string()),
      embarkPort: v.optional(v.string()),
      disembarkPort: v.optional(v.string()),
    })),
    itineraryDays: v.optional(v.array(v.object({
      dayNumber: v.number(),
      date: v.optional(v.string()),
      weekday: v.optional(v.string()),
      dayType: v.string(),
      cityOrPort: v.optional(v.string()),
      arrivalTime: v.optional(v.string()),
      departureTime: v.optional(v.string()),
      title: v.string(),
      description: v.string(),
      meals: v.optional(v.object({
        breakfast: v.optional(v.union(v.boolean(), v.string())),
        lunch: v.optional(v.union(v.boolean(), v.string())),
        dinner: v.optional(v.union(v.boolean(), v.string())),
      })),
      stayType: v.optional(v.string()),
      notes: v.optional(v.string()),
      highlights: v.optional(v.array(v.string())),
      media: v.optional(v.array(v.string())),
      items: v.optional(v.array(v.object({
        time: v.string(),
        label: v.string(),
        description: v.optional(v.string())
      })))
    }))),
    sections: v.optional(v.object({
      included: v.optional(v.array(v.string())),
      excluded: v.optional(v.array(v.string())),
      notices: v.optional(v.array(v.string())),
    })),
    flights: v.optional(v.object({
      departure: v.optional(v.object({
        type: v.optional(v.string()),
        name: v.optional(v.string()),
        flightNo: v.optional(v.string()),
        duration: v.optional(v.string()),
        depPort: v.optional(v.string()),
        depTime: v.optional(v.string()),
        depDate: v.optional(v.string()),
        depWeekday: v.optional(v.string()),
        arrPort: v.optional(v.string()),
        arrTime: v.optional(v.string()),
        arrDate: v.optional(v.string()),
        arrWeekday: v.optional(v.string()),
      })),
      return: v.optional(v.object({
        type: v.optional(v.string()),
        name: v.optional(v.string()),
        flightNo: v.optional(v.string()),
        duration: v.optional(v.string()),
        depPort: v.optional(v.string()),
        depTime: v.optional(v.string()),
        depDate: v.optional(v.string()),
        depWeekday: v.optional(v.string()),
        arrPort: v.optional(v.string()),
        arrTime: v.optional(v.string()),
        arrDate: v.optional(v.string()),
        arrWeekday: v.optional(v.string()),
      })),
    })),
    routeMapImage: v.optional(v.string()),
    routeCoordinates: v.optional(v.array(v.object({
      name: v.string(),
      x: v.number(),
      y: v.number(),
      label: v.optional(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
