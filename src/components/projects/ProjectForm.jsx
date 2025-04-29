import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

const ProjectForm = ({ onClose, onProjectAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { title, description } = formData;
  
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/projects`, formData, {
        withCredentials: true
      });
      
      toast.success('Project created successfully!');
      
      // Call the callback function to update the projects list
      if (onProjectAdded) {
        onProjectAdded(res.data);
      }
      
      // Close the form
      if (onClose) {
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Create New Project</h3>
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
              Project Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={onChange}
              className={`form-input ${errors.title ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="My Awesome Project"
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
              placeholder="Describe your project..."
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
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
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;