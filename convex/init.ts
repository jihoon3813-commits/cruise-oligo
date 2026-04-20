import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (!existing) {
      await ctx.db.insert("siteConfig", {
        hero: {
          title: "올리고 크루즈\n멤버십",
          subtitle: "당신을 위한 완벽한 여정",
          bgType: "image",
          bgUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
          textPosition: "left",
        },
        adminPassword: "1111",
        footer: {
          businessInfo: "회사명: 올리고 크루즈 | 대표자: 홍길동 | 주소: 서울특별시 강남구 테헤란로 123\n사업자등록번호: 123-45-67890 | TEL: 02-1234-5678",
          copyright: "© 2024 OLIGO CRUISE. All rights reserved.",
          menus: [
            { id: "1", label: "이용약관", url: "/terms" },
            { id: "2", label: "개인정보처리방침", url: "/privacy" },
            { id: "3", label: "회사소개", url: "/about" }
          ],
          links: [
            { id: "s1", label: "인스타그램", url: "https://instagram.com" }
          ]
        }
      });
    }

    const sections = await ctx.db.query("sections").collect();
    if (sections.length === 0) {
      await ctx.db.insert("sections", {
        title: "궁극의 럭셔리",
        content: "올리고 크루즈 멤버십과 함께 세계에서 가장 권위 있는 크루즈를 경험해 보세요.",
        image: "https://images.unsplash.com/photo-1567815357002-ad216ca7bad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        layout: "left",
        style: "classic",
        showButton: true,
        buttonLink: "#membership",
        bgColor: "#ffffff",
        bgType: "color",
        order: 1
      });
    }

    const products = await ctx.db.query("products").collect();
    if (products.length === 0) {
      await ctx.db.insert("products", {
        title: "지중해 그랜드 투어",
        description: "이탈리아, 프랑스, 그리스를 방문하는 14일간의 지중해 축복.",
        price: 15000000,
        thumbnails: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        paymentType: "split",
        downPayment: 3000000,
        installments: 12,
      });
    }
  }
});
