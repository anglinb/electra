import { withDashboard } from '../../hoc/withDashboard'


const Projects = () => {

  return (
    <div className="max-w-5xl mx-auto px-6 pb-16 space-y-3">
      <div className="bg-white dark:bg-gray-900 py-16">
        <h1>Project Settings Here</h1>
    	</div>
    </div>
  )
}

// export default Projects;
export default withDashboard(Projects)
