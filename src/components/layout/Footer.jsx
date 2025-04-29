import { FiGithub, FiMail, FiHeart } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white pt-8 pb-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <p className="text-center text-gray-500 text-sm">
              &copy; {currentYear} TaskTracker. All rights reserved.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex justify-center md:justify-end space-x-6">
              <a
                href="https://github.com/yourusername/task-tracker"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">GitHub</span>
                <FiGithub className="h-5 w-5" />
              </a>
              
              <a
                href="mailto:contact@example.com"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Email</span>
                <FiMail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <p className="text-center text-xs text-gray-400">
            Made with <FiHeart className="inline-block text-error-500" /> using MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;