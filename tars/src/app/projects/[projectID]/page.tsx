import ProjectIdView from '@/pages/projects/ProjectIdView';
import React from 'react'

const ProjectID = async ({params}:{params : Promise<{projectID:string}>}) => {
    const {projectID} = await params;

  return (
    <ProjectIdView projectID={projectID}/>
  )
}

export default ProjectID