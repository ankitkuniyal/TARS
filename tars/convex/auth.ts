import { MutationCtx, QueryCtx } from "./_generated/server";

export const verifyAuth = async (ctx: MutationCtx | QueryCtx)=>{

    const id = await ctx.auth.getUserIdentity();

    if(!id){
        throw new Error("Unauthorized")
    }

    return id;
};