import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { AlertCircleIcon, GlobeIcon, Loader2Icon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProjects } from "@/hooks/projects/useProjectHooks";
import { Doc } from "../../../convex/_generated/dataModel";


interface ProjectCommandDialogProps{
    open : boolean,
    onOpenChange : (open:boolean) => void
}

const getProjectIcon = (project: Doc<"Projects">) => {
  if (project.importStatus === "completed") {
    return <FaGithub className="size-4 text-muted-foreground" />
  }

  if (project.importStatus === "failed") {
    return <AlertCircleIcon className="size-4 text-muted-foreground" />;
  }

  if (project.importStatus === "importing") {
    return (
      <Loader2Icon className="size-4 text-muted-foreground animate-spin" />
    );
  }

  return <GlobeIcon className="size-4 text-muted-foreground" />;
} 

const ProjectCommandDialog = ({open, onOpenChange}:ProjectCommandDialogProps) => {
    const router = useRouter();
    const projects = useProjects();

    const handleSelect = (projectId: string)=>{
        router.push(`/projects/${projectId}`);
        onOpenChange(false) 
    }
  return (
    <CommandDialog 
    open={open}
    onOpenChange={onOpenChange}
    title="Search Project"
    description="Search and navigate to your projects"
    className='rounded-2xl'
    >
        <CommandInput placeholder="Search projects..."/>
        <CommandList>
            <CommandEmpty>No Projects Found</CommandEmpty>
            <CommandGroup heading="Projects">
                {projects?.map((project)=>(
                    <CommandItem
                    key={project._id}
                    value={`${project.title}-${project._id}`}
                    onSelect={()=>handleSelect(project._id)}>
                        {getProjectIcon(project)}
                        <span>{project.title}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
        </CommandList>
    </CommandDialog>
  )
};


export default ProjectCommandDialog;
