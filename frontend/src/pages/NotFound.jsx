import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link to="/" className="bg-[var(--color-secondary)] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
