import ProjectIdLayout from "@/pages/projects/ProjectIdLayout";
import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectID: Id<"Projects"> }>;
}) => {
    const {projectID}= await params;
  return (
   <ProjectIdLayout
   projectID={projectID}>
    {children}
   </ProjectIdLayout>
);
};

export default Layout;
