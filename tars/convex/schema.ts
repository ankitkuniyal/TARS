import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  Projects: defineTable({
    title: v.string(),
    userID: v.string(),
    updatedAt: v.number(),
    importStatus: v.optional(
      v.union(
        v.literal("importing"),
        v.literal("completed"),
        v.literal("failed"),
      ),
    ),
    exportStatus: v.optional(
      v.union(
        v.literal("exporting"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("cancelled"),
      ),
    ),
    exportRepoUrl: v.optional(v.string()),
  }).index("by_userID", ["userID"]),

  Files: defineTable({
    projectID: v.id("Projects"),
    parentID: v.optional(v.id("Files")),
    name: v.string(),
    type: v.union(v.literal("file"), v.literal("folder")),
    content: v.optional(v.string()), // For text files only
    storageId: v.optional(v.id("_storage")), // For bianry files
    updatedAt: v.number(),
  })
    .index("by_projectID", ["projectID"])
    .index("by_parentID", ["parentID"])
    .index("by_parent_project", ["parentID", "projectID"]),
});
