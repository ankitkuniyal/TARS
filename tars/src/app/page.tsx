"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);
  return (
    <main className="flex gap-2">
      <Button onClick={()=>{createProject({ title : "TARS" })}}>
        Add Project
      </Button>
      {projects?.map((project) => (
        <div key={project._id} className="border rounded-full p-10 ">
          {project._id}
          <p>{`Title : ${project.title}`}</p>
          <p>{`OwnerID : ${project.userID}`}</p>
        </div>
      ))}
    </main>
  );
}