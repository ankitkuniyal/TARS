import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verifyAuth } from "./auth";
import { useProject } from "@/hooks/projects/useProjectHooks";
import { Id } from "./_generated/dataModel";

export const getAllFiles = query({
  args: { projectID: v.id("Projects") },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    if (!id) return [];

    const project = await ctx.db.get("Projects", args.projectID);
    if (!project) {
      throw new Error("Project Not Found");
    }
    if (project.userID != id.subject) {
      throw new Error("Unauthorized Access");
    }

    return await ctx.db
      .query("Files")
      .withIndex("by_projectID", (q) => q.eq("projectID", args.projectID))
      .collect();
  },
});

export const getFile = query({
  args: { fileID: v.id("Files") },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    if (!id) return [];

    const file = await ctx.db.get("Files", args.fileID);
    if (!file) {
      throw new Error("File Not Found");
    }

    const project = useProject(file.projectID);

    if (!project) throw new Error("Project Not Found");

    if (project?.userID !== id.subject) {
      throw new Error("Unauthorized Access");
    }
    return file;
  },
});

export const getFolderContents = query({
  args: { projectID: v.id("Projects"), parentID: v.optional(v.id("Files")) },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    if (!id) return [];

    const project = await ctx.db.get("Projects", args.projectID);
    if (!project) {
      throw new Error("Project Not Found");
    }
    if (project.userID != id.subject) {
      throw new Error("Unauthorized Access");
    }

    const files = await ctx.db
      .query("Files")
      .withIndex("by_parent_project", (q) =>
        q.eq("parentID", args.parentID).eq("projectID", args.projectID),
      )
      .collect();
    return files.sort((a, b) => {
      if (a.type == "folder" && b.type == "file") return -1;
      if (a.type == "file" && b.type == "folder") return 1;

      return a.name.localeCompare(b.name);
    });
  },
});
export const createFile = mutation({
  args: {
    projectID: v.id("Projects"),
    parentID: v.optional(v.id("Files")),
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    if (!id) return [];

    const project = await ctx.db.get("Projects", args.projectID);
    if (!project) {
      throw new Error("Project Not Found");
    }
    if (project.userID != id.subject) {
      throw new Error("Unauthorized Access");
    }

    const files = await ctx.db
      .query("Files")
      .withIndex("by_parent_project", (q) =>
        q.eq("parentID", args.parentID).eq("projectID", args.projectID),
      )
      .collect();

    const existing = files.find(
      (file) => file.name === args.name && file.type === "file",
    );
    if (existing) throw new Error("File with same name already exists.");

    await ctx.db.insert("Files", {
      parentID: args.parentID,
      content: args.content,
      type: "file",
      name: args.name,
      projectID: args.projectID,
      updatedAt: Date.now(),
    });
  },
});
export const createFolder = mutation({
  args: {
    projectID: v.id("Projects"),
    parentID: v.optional(v.id("Files")),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    if (!id) return [];

    const project = await ctx.db.get("Projects", args.projectID);
    if (!project) {
      throw new Error("Project Not Found");
    }
    if (project.userID != id.subject) {
      throw new Error("Unauthorized Access");
    }

    const files = await ctx.db
      .query("Files")
      .withIndex("by_parent_project", (q) =>
        q.eq("parentID", args.parentID).eq("projectID", args.projectID),
      )
      .collect();

    const existing = files.find(
      (file) => file.name === args.name && file.type === "folder",
    );
    if (existing) throw new Error("Folder with same name already exists.");

    await ctx.db.insert("Files", {
      parentID: args.parentID,
      type: "folder",
      name: args.name,
      projectID: args.projectID,
      updatedAt: Date.now(),
    });
    await ctx.db.patch("Projects",args.projectID,{
        updatedAt : Date.now()
    })
  },
});

export const renameFile = mutation({
  args: {
    fileID: v.id("Files"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    if (!id) return [];

    const file = await ctx.db.get("Files", args.fileID);
    if (!file) {
      throw new Error("File Not Found");
    }
    const project = await ctx.db.get("Projects", file.projectID);
    if (!project) {
      throw new Error("File Not Found");
    }
    if (project.userID != id.subject) {
      throw new Error("Unauthorized Access");
    }

    const siblings = await ctx.db
      .query("Files")
      .withIndex("by_parent_project", (q) =>
        q.eq("parentID", file.parentID).eq("projectID", file.projectID),
      )
      .collect();

    const existing = siblings.find((sibling) => {
      sibling.name == args.newName &&
        sibling.type == file.type &&
        sibling._id != args.fileID;
    });

    if (existing)
      throw new Error(`A ${file.type} with same name already exists`);

    await ctx.db.patch("Files", args.fileID, {
      name: args.newName,
      updatedAt: Date.now(),
    });
    await ctx.db.patch("Projects",file.projectID,{
        updatedAt : Date.now()
    })
  },
});

export const deleteFile = mutation({
  args: {
    fileID: v.id("Files"),
  },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    if (!id) return [];

    const file = await ctx.db.get("Files", args.fileID);
    if (!file) {
      throw new Error("File Not Found");
    }
    const project = await ctx.db.get("Projects", file.projectID);
    if (!project) {
      throw new Error("File Not Found");
    }
    if (project.userID != id.subject) {
      throw new Error("Unauthorized Access");
    }

    const recursiveDelete = async (fileID: Id<"Files">) => {
      const item = await ctx.db.get("Files", fileID);

      if (!item) return;

      if (item.type === "folder") {
        const children = await ctx.db
          .query("Files")
          .withIndex("by_parent_project", (q) =>
            q.eq("parentID", fileID).eq("projectID", item.projectID),
          )
          .collect();
 
          for(const child of children){
            await recursiveDelete(child._id)
          } 
      }
      if(item.storageId) await ctx.storage.delete(item.storageId)
      
        await ctx.db.delete("Files",fileID)
    };
    await recursiveDelete(args.fileID)
    await ctx.db.patch("Projects",file.projectID,{
        updatedAt : Date.now()
    })
  },
});
export const updateFile = mutation({
  args: {
    fileID: v.id("Files"),
    content : v.string()
  },
  handler: async (ctx, args) => {
    const id = await verifyAuth(ctx);
    if (!id) return [];

    const file = await ctx.db.get("Files", args.fileID);
    if (!file) {
      throw new Error("File Not Found");
    }
    const project = await ctx.db.get("Projects", file.projectID);
    if (!project) {
      throw new Error("File Not Found");
    }
    if (project.userID != id.subject) {
      throw new Error("Unauthorized Access");
    }
    await ctx.db.patch("Files",args.fileID,{
        content : args.content,
        updatedAt : Date.now()
    })
    await ctx.db.patch("Projects",file.projectID,{
        updatedAt : Date.now()
    })

  
  },
});
