import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

const ProjectItem = ({ project }) => {
  return (
    <div className="card hover:shadow-lg hover:-translate-y-1 group">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {project.title}
        </h3>
      </div>
      
      <p className="mt-2 text-gray-600 line-clamp-2">{project.description}</p>
      
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <FiCalendar className="mr-1" />
        <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
      </div>
      
      <div className="mt-4">
        <Link
          to={`/projects/${project._id}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
        >
          View Details
          <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectItem;