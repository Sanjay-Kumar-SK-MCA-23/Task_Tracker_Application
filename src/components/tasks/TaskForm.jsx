import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

const TaskForm = ({ projectId, task = null, onClose, onTaskAdded, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'To Do',
    project: projectId,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { title, description, status } = formData;
  
  const isEditing = !!task;
  
  const statusOptions = ['To Do', 'In Progress', 'Completed'];
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when field is edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    return newErrors;
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/tasks/${task._id}`,
          formData,
          { withCredentials: true }
        );
        
        toast.success('Task updated successfully!');
        
        if (onTaskUpdated) {
          onTaskUpdated(res.data);
        }
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/tasks`,
          formData,
          { withCredentials: true }
        );
        
        toast.success('Task created successfully!');
        
        if (onTaskAdded) {
          onTaskAdded(res.data);
        }
      }
      
      if (onClose) {
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} task`);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="form-label">
              Task Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={onChange}
              className={`form-input ${errors.title ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="Task title"
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={description}
              onChange={onChange}
              className={`form-input ${errors.description ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="Describe your task..."
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>
          
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={onChange}
              className="form-input"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;