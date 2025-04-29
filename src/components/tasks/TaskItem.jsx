import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { format } from 'date-fns';
import { FiEdit2, FiTrash2, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import TaskForm from './TaskForm';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-accent-100 text-accent-800';
      case 'Completed':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const deleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${task._id}`, {
          withCredentials: true
        });
        
        toast.success('Task deleted successfully');
        
        if (onTaskDeleted) {
          onTaskDeleted(task._id);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete task');
        setIsDeleting(false);
      }
    }
  };
  
  const handleTaskUpdate = (updatedTask) => {
    if (onTaskUpdated) {
      onTaskUpdated(updatedTask);
    }
    setShowEditForm(false);
  };
  
  return (
    <>
      {showEditForm ? (
        <TaskForm
          projectId={task.project}
          task={task}
          onClose={() => setShowEditForm(false)}
          onTaskUpdated={handleTaskUpdate}
        />
      ) : (
        <div className="card hover:shadow-lg slide-in">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="text-gray-400 hover:text-primary-600 transition-colors"
                aria-label="Edit task"
              >
                <FiEdit2 className="h-5 w-5" />
              </button>
              
              <button
                onClick={deleteTask}
                disabled={isDeleting}
                className={`${isDeleting ? 'text-gray-300' : 'text-gray-400 hover:text-error-600'} transition-colors`}
                aria-label="Delete task"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <p className="mt-2 text-gray-600">{task.description}</p>
          
          <div className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              <span>Created {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
            </div>
            
            {task.completedAt && (
              <div className="flex items-center text-success-600">
                <FiCheckCircle className="mr-1" />
                <span>Completed {format(new Date(task.completedAt), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;