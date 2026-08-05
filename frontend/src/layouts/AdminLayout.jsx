import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Award, Users, Settings, LogOut, ShieldCheck } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-[var(--color-primary)] text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <ShieldCheck className="w-6 h-6 text-[var(--color-accent)] mr-2" />
          <span className="font-bold text-lg">TFA Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            <Link to="/admin" className={`flex items-center px-3 py-3 rounded-lg transition-colors ${isActive('/admin') && location.pathname === '/admin' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/admin/certificates" className={`flex items-center px-3 py-3 rounded-lg transition-colors ${isActive('/admin/certificates') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <Award className="w-5 h-5 mr-3" />
              Certificates
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-4 px-3">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {location.pathname === '/admin' ? 'Dashboard' : location.pathname.split('/').pop()}
          </h1>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
