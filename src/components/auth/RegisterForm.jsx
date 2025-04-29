import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useContext(AuthContext);
  
  const { name, email, password, confirmPassword, country } = formData;
  
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
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!country) {
      newErrors.country = 'Country is required';
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
    
    // Register user
    const { success, message } = await register({
      name,
      email,
      password,
      country
    });
    
    if (success) {
      toast.success('Registration successful!');
    } else {
      toast.error(message);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your account
          </Link>
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={onChange}
              className={`form-input ${errors.name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="John Doe"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={onChange}
              className={`form-input ${errors.email ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={onChange}
              className={`form-input ${errors.password ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="••••••"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={onChange}
              className={`form-input ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="••••••"
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>
          
          <div>
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              autoComplete="country"
              value={country}
              onChange={onChange}
              className={`form-input ${errors.country ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="United States"
            />
            {errors.country && <p className="form-error">{errors.country}</p>}
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Sign up'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;