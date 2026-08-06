import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, PlusCircle, Database } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/admin" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight block">The Future Animations</span>
                <span className="text-[10px] text-slate-400 block tracking-widest uppercase font-semibold">QR Verification Portal</span>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-2 border-l border-slate-800 pl-8">
              <Link 
                to="/admin" 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive('/admin') 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create QR</span>
              </Link>
              <Link 
                to="/admin/certificates" 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive('/admin/certificates') 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Registry</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* Mobile Nav Links */}
            <nav className="flex md:hidden items-center gap-1">
              <Link 
                to="/admin" 
                className={`p-2 rounded-xl transition-all ${isActive('/admin') ? 'text-blue-500 bg-slate-800' : 'text-slate-400 hover:text-white'}`}
                title="Create QR"
              >
                <PlusCircle className="w-5 h-5" />
              </Link>
              <Link 
                to="/admin/certificates" 
                className={`p-2 rounded-xl transition-all ${isActive('/admin/certificates') ? 'text-blue-500 bg-slate-800' : 'text-slate-400 hover:text-white'}`}
                title="Registry"
              >
                <Database className="w-5 h-5" />
              </Link>
            </nav>

            <div className="hidden sm:flex items-center gap-3 border-l border-slate-850 pl-6">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-300">{user.username}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">{user.role}</p>
              </div>
            </div>

            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-xl transition-all border border-slate-800 hover:border-slate-700 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} The Future Animations. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminLayout;
