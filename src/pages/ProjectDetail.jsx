import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import TaskForm from '../components/tasks/TaskForm';
import TaskItem from '../components/tasks/TaskItem';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
          withCredentials: true
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/tasks?projectId=${id}`, {
          withCredentials: true
        })
      ]);
      
      setProject(projectRes.data);
      setProjectForm({
        title: projectRes.data.title,
        description: projectRes.data.description,
      });
      setTasks(tasksRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project data');
      toast.error('Failed to fetch project data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);
  
  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
  };
  
  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
  };
  
  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
  };
  
  const updateProject = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/${id}`,
        projectForm,
        { withCredentials: true }
      );
      
      setProject(res.data);
      setShowEditProjectForm(false);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    }
  };
  
  const deleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? All tasks in this project will also be deleted.')) {
      setIsDeleting(true);
      
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
          withCredentials: true
        });
        
        toast.success('Project deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete project');
        setIsDeleting(false);
      }
    }
  };
  
  // Group tasks by status
  const groupedTasks = {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Completed': tasks.filter(task => task.status === 'Completed'),
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
          <p className="flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </p>
          <div className="mt-4">
            <Link to="/dashboard" className="text-primary-600 hover:text-primary-800">
              <FiArrowLeft className="inline mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-800">
          <FiArrowLeft className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      {showEditProjectForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Edit Project</h2>
          <form onSubmit={updateProject}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="form-label">
                  Project Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowEditProjectForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Update Project
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <p className="mt-2 text-gray-600">{project.description}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button
                onClick={() => setShowEditProjectForm(true)}
                className="btn btn-outline flex items-center"
              >
                <FiEdit2 className="mr-1" />
                Edit
              </button>
              
              <button
                onClick={deleteProject}
                disabled={isDeleting}
                className={`btn ${isDeleting ? 'bg-gray-300 cursor-not-allowed' : 'btn-danger'} flex items-center`}
              >
                <FiTrash2 className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn btn-primary flex items-center"
            >
              <FiPlus className="mr-1" />
              Add Task
            </button>
          </div>
        </div>
      </div>
      
      {showTaskForm && (
        <div className="mb-8">
          <TaskForm 
            projectId={id}
            onClose={() => setShowTaskForm(false)}
            onTaskAdded={handleTaskAdded}
          />
        </div>
      )}
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div key={status} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {status}
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-sm bg-gray-100 rounded-full">
                {statusTasks.length}
              </span>
            </h3>
            
            <div className="space-y-4">
              {statusTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No tasks</p>
              ) : (
                statusTasks.map((task) => (
                  <TaskItem 
                    key={task._id} 
                    task={task}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;