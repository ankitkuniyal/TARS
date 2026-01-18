import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  Projects: defineTable({
    title: v.string(),
    userID: v.string(),
    importStatus : v.optional(
        v.union(
            v.literal("importing"),
            v.literal("completed"),
            v.literal("failed"),
        )
    )
  }).index("by_userID",["userID"]),
});