import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useProjects = ( ) => {
    return useQuery(api.projects.get)
}
export const useProjectsPartials = (limit : number) => {
    return useQuery(api.projects.getPartial,{limit})
}