"use client"
import { useState } from 'react'
import { Id } from '../../../convex/_generated/dataModel'
import { cn } from '@/lib/utils';
import { FaGithub } from 'react-icons/fa';

interface ProjectIdViewProps {
  projectID: Id<"Projects">;
}

const Tab = ({
    lable,
    isActive,
    onClick
}:{
    lable : string,
    isActive : boolean,
    onClick : ()=>void
})=> {
    return(
        <div onClick={onClick}
        className={cn(
            'flex items-center gap-2 h-full px-3 cursor-pointer text-muted-foreground hover: bg-sidebar/30 rounded-t-2xl ',
            isActive && "bg-background text-foreground"
        )}>
            <span className='text-sm'>
                {lable}
            </span>
        </div>
    )
}

const ProjectIdView: React.FC<ProjectIdViewProps> = ({ projectID }) => {
    const [activeView, setActiveView] = useState<"editor" | "preview">("editor")
    const onClick = ()=>{
        if (activeView==="editor"){
            setActiveView("preview")
        }
        else{
            setActiveView("editor")
        }
    }
  return (
    <div className='h-full flex flex-col'>
         <nav className='h-9 flex items-center bg-sidebar'>
            <Tab
            lable='Code'
            isActive={activeView==="editor"?true:false}
            onClick={onClick}/>
            <Tab
            lable='Preview'
            isActive={activeView==="preview"?true:false}
            onClick={onClick}/>
            <div className='flex-1 flex justify-end h-full'>
                <div className='flex items-center gap-2 h-full px-3 cursor-pointer text-muted-foreground hover:bg-accent/30 rounded-t-2xl'>
                    <FaGithub className='size-4'/>
                     <span className='text-sm'>Export</span>
                </div>
            </div>   
         </nav>
         <div className='flex-1 relative'>
            <div className={cn(
                "absolute inset-0",
                activeView=== "editor"? "visible" : "invisible"
            )}>
                Code editor
            </div>
            <div className={cn(
                "absolute inset-0",
                activeView=== "preview"? "visible" : "invisible"
            )}> Preview
            </div>
         </div>
    </div>
  ) 
}

export default ProjectIdView