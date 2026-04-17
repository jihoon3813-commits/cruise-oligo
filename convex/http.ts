import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/api/storage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);
    const storageId = searchParams.get("id");
    if (!storageId) {
      return new Response("Missing id parameter", { status: 400 });
    }

    try {
      const blob = await ctx.storage.get(storageId);
      if (!blob) {
        return new Response("File not found", { status: 404 });
      }

      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": blob.type || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (e) {
      return new Response("Error fetching file", { status: 500 });
    }
  }),
});

http.route({
  path: "/api/og-image",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const config = await ctx.runQuery(api.siteConfig.get);
    const ogImage = config?.ogImage;

    if (!ogImage) {
      return Response.redirect("https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80");
    }

    try {
      const storageId = ogImage.startsWith('storage:') ? ogImage.split('storage:')[1] : ogImage;
      const blob = await ctx.storage.get(storageId);
      
      if (!blob) {
        return Response.redirect("https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80");
      }

      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": blob.type || "image/jpeg",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (e) {
      return Response.redirect("https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80");
    }
  }),
});

http.route({
  path: "/api/site-config",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const config = await ctx.runQuery(api.siteConfig.get);
    return new Response(JSON.stringify(config), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }),
});

export default http;
