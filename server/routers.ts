import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getStorefrontSettings, listProducts, saveStorefrontSettings, upsertProduct } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure.query(() => listProducts()),
    initialize: publicProcedure.input(z.object({ products: z.array(z.object({ name: z.string(), category: z.string(), price: z.number().int(), image: z.string(), tag: z.string(), description: z.string() })).max(250) })).mutation(async ({ input }) => {
      const existing = await listProducts();
      if (existing.length > 0) return existing;
      for (const product of input.products) await upsertProduct(product);
      return listProducts();
    }),
    save: publicProcedure.input(z.object({ id: z.number().int().optional(), name: z.string().min(1), category: z.string().min(1), price: z.number().int().nonnegative(), image: z.string().min(1), tag: z.string().min(1), description: z.string().min(1) })).mutation(({ input }) => upsertProduct(input)),
    settings: publicProcedure.query(() => getStorefrontSettings()),
    saveSettings: publicProcedure.input(z.object({ sourceOverride: z.string().max(20000) })).mutation(({ input }) => saveStorefrontSettings(input.sourceOverride)),
  }),
  media: router({
    uploadImage: publicProcedure.input(z.object({ fileName: z.string().min(1).max(160), contentType: z.string().regex(/^image\//), base64: z.string().max(8_000_000) })).mutation(async ({ input }) => {
      const raw = input.base64.replace(/^data:[^;]+;base64,/, "");
      const result = await storagePut(`sakith-tech-store/products/${input.fileName}`, Buffer.from(raw, "base64"), input.contentType);
      return result;
    }),
  }),
  ai: router({
    chat: publicProcedure.input(z.object({ message: z.string().min(1).max(500), catalog: z.array(z.string()).max(100) })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are the concise, friendly shopping assistant for Sakith Tech Store in Sri Lanka. Recommend only from the provided inventory when naming products. Mention that shoppers can use the exact ‘Order Now on WhatsApp’ button. Keep replies under 90 words and avoid inventing stock, warranties, or reviews." },
          { role: "user", content: `Inventory snapshot:\n${input.catalog.join("\n")}\n\nCustomer question: ${input.message}` },
        ],
      });
      const content = response.choices?.[0]?.message?.content;
      const text = typeof content === "string" ? content : "I could not decode that signal. Try asking about a category, budget, or use case.";
      return { text };
    }),
  }),
});

export type AppRouter = typeof appRouter;
