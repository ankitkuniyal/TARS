import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verifyAuth } from "./auth";


export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    const projectID = await ctx.db.insert("Projects", {
      title: args.title,
      userID: id.subject,
      updatedAt: Date.now(),
    });

    return projectID;
  },
});

export const getPartial = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    if (!id) {
      return [];
    }
    return await ctx.db
      .query("Projects")
      .withIndex("by_userID", (q) => q.eq("userID", id.subject))
      .take(args.limit);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const id = await verifyAuth(ctx);
    if (!id) return [];

   return await ctx.db
      .query("Projects")
      .withIndex("by_userID", (q) => q.eq("userID", id.subject))
      .collect();
  },
});
