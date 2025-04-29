import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectItem from '../components/projects/ProjectItem';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  
  const { user } = useContext(AuthContext);
  
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
        withCredentials: true
      });
      
      setProjects(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const handleProjectAdded = (newProject) => {
    setProjects([...projects, newProject]);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user?.name}. Here are your current projects.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowProjectForm(true)}
              disabled={projects.length >= 4}
              className={`btn ${
                projects.length >= 4 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'btn-primary'
              } flex items-center`}
            >
              <FiPlus className="mr-1" />
              New Project
            </button>
            {projects.length >= 4 && (
              <p className="mt-1 text-xs text-error-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                Maximum of 4 projects allowed
              </p>
            )}
          </div>
        </div>
      </div>
      
      {showProjectForm && (
        <div className="mb-8">
          <ProjectForm 
            onClose={() => setShowProjectForm(false)} 
            onProjectAdded={handleProjectAdded}
          />
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
          <p className="flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="mt-2 text-lg font-medium text-gray-900">No projects yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new project.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowProjectForm(true)}
              className="btn btn-primary"
            >
              <FiPlus className="mr-1" />
              New Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectItem key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;