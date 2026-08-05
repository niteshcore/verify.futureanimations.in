import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} The Future Animations. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
