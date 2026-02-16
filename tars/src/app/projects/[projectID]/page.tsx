import ProjectIdView from '@/pages/projects/ProjectIdView';
import { Id } from '../../../../convex/_generated/dataModel';

const ProjectID = async ({params}:{params : Promise<{projectID:Id<"Projects">}>}) => {
    const {projectID} = await params;

  return (
    <ProjectIdView projectID={projectID}/>
  )
}

export default ProjectID