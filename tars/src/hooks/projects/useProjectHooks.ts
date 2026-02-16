import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const useProjects = () => {
    return useQuery(api.projects.get)
}
export const useProjectsPartials = (limit : number) => {
    return useQuery(api.projects.getPartial,{limit})
}
export const useProject = (projectID : Id<"Projects">)=>{
    return useQuery(api.projects.getByID,{projectID})
}
export const useRenameProject = ()=>{
    return useMutation(api.projects.rename)
}