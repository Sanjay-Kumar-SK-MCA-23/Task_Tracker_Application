import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { FiUser, FiMail, FiMapPin, FiLock } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        country: user.country || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);
  
  const { name, email, country, password, confirmPassword } = formData;
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when field is edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!country) {
      newErrors.country = 'Country is required';
    }
    
    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    
    // Prepare update data (only include password if provided)
    const updateData = {
      name,
      email,
      country,
      ...(password && { password }),
    };
    
    // Update profile
    const { success, message } = await updateProfile(updateData);
    
    if (success) {
      toast.success('Profile updated successfully!');
      // Clear password fields
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
    } else {
      toast.error(message);
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <label htmlFor="name" className="form-label flex items-center">
                <FiUser className="mr-1" />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={onChange}
                className={`form-input ${errors.name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="form-label flex items-center">
                <FiMail className="mr-1" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={onChange}
                className={`form-input ${errors.email ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="country" className="form-label flex items-center">
                <FiMapPin className="mr-1" />
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={country}
                onChange={onChange}
                className={`form-input ${errors.country ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              />
              {errors.country && <p className="form-error">{errors.country}</p>}
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
            <p className="text-sm text-gray-500 mb-4">
              Leave blank if you don't want to change your password.
            </p>
            
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="password" className="form-label flex items-center">
                  <FiLock className="mr-1" />
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={onChange}
                  className={`form-input ${errors.password ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                />
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="form-label flex items-center">
                  <FiLock className="mr-1" />
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={onChange}
                  className={`form-input ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary min-w-[120px]"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;