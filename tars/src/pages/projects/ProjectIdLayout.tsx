"use client";
import React from "react";
import NavBar from "./NavBar";
import { Id } from "../../../convex/_generated/dataModel";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
const ProjectIdLayout = ({
  children,
  projectID,
}: {
  children: React.ReactNode;
  projectID: Id<"Projects">;
}) => {
  const MIN_SIDEBAR_WIDIH = 200;
  const MAX_SIDEBAR_WIDTH = 800;
  const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;
  const DEFAULT_MAIN_SIZE = 1000;

  return (
    <div className="w-full h-screen flex flex-col">
      <NavBar projectID={projectID} />
      <div className="flex-1 flex overflow-hidden">
        <Allotment
          className="flex-1"
          defaultSizes={[DEFAULT_MAIN_SIZE, DEFAULT_CONVERSATION_SIDEBAR_WIDTH]}
        >
          <Allotment.Pane>{children}</Allotment.Pane>
          <Allotment.Pane
            snap
            minSize={MIN_SIDEBAR_WIDIH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}>
            <div>Conversational Sidebar</div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};

export default ProjectIdLayout;
