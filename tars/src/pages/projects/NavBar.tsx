"use client";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { useProject, useRenameProject } from "@/hooks/projects/useProjectHooks";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CloudCheckIcon, LoaderIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";


const NavBar = ({ projectID }: { projectID: Id<"Projects"> }) => {
  const project = useProject(projectID);
  const renameProject = useRenameProject();

  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState("");

  const handleStartRename = () => {
    if (!project) return;
    setName(project.title);
    setIsRenaming(true);
  };
  const handleSubmit = () => {
    if (!project) return;
    setIsRenaming(false);
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === project.title) return;
    renameProject({ title: trimmedName, projectID: projectID });
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
    }
  };

  return (
    <nav className="flex justify-between items-center gap-x-2 p-2 px-4  h-12">
      <div className="flex items-center gap-x-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="flex items-center gap-1.5" asChild>
                <Button variant="ghost" className="w-fit! p-1.5! h-7! " asChild>
                  <Link href={"/"}>
                    <Image
                      src={"/logo.svg"}
                      alt="Logo"
                      width={30}
                      height={30}
                    />
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="ml-0! mr-1! " />
            <BreadcrumbItem>
              {isRenaming ? (
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  onFocus={(e) => {
                    e.currentTarget.select();
                  }}
                  onBlur={() => {}}
                  onKeyDown={handleKeyDown}
                  className ="text-lg bg-transparent text-foreground outline-none focus:ring-1 focus:ring-inset focus: ring-ring font-medium max-w-400 truncate rounded-2xl px-2 "
                />
              ) : (
                <BreadcrumbPage
                  onClick={handleStartRename}
                  className="text-lg cursor-pointer hover:text-primary font-medium max-w-400 truncate"
                >
                  {project?.title ?? "Loading..."}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {project?.importStatus === "importing" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
            </TooltipTrigger>
          </Tooltip>
        ) : (project?.updatedAt &&(
          <Tooltip>
            <TooltipTrigger>
              <CloudCheckIcon className="size-4 text-muted-foreground"/>
            </TooltipTrigger>
            <TooltipContent>
            Saved{" "}
            {formatDistanceToNow(project.updatedAt, {addSuffix : true})}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <UserButton />
      </div>
    </nav>
  );
};

export default NavBar;
