import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const create = mutation({
    args : {
        title : v.string(),
    },
    handler : async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();
        if(!id){
            throw new Error("Unauthorized")
        }
        await ctx.db.insert("Projects", {
            title : "TARS",
            userID : id?.subject,
        })
    }

})

export const get = query({
    args : {},
    handler : async (ctx) => {
        const id = await ctx.auth.getUserIdentity();
        if(!id){
            return [];
        }
        return await ctx.db.query("Projects").withIndex("by_userID", (q)=>q.eq("userID", id.subject)).collect();
    }
}) 