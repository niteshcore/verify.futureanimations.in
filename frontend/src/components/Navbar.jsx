import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-[var(--color-secondary)]" />
              <span className="font-bold text-xl text-[var(--color-primary)]">TFA Verify</span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-[var(--color-secondary)] transition-colors">Home</Link>
            <Link to="/verify" className="text-gray-600 hover:text-[var(--color-secondary)] transition-colors">Verify</Link>
            <Link to="/about" className="text-gray-600 hover:text-[var(--color-secondary)] transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-[var(--color-secondary)] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
