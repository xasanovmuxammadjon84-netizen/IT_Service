import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Monitor, User, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../services/storageService';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');
  const [user, setUser] = useState(getCurrentUser());

  // Listen for storage changes to update navbar state
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    
    // Check periodically or on route change
    window.addEventListener('storage', handleStorageChange);
    // Custom event for immediate updates within the app
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, [location]);

  const handleUserLogout = () => {
    logoutUser();
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  return (
    <nav className="bg-brand-black border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Monitor className="h-8 w-8 text-brand-yellow" />
              <span className="text-xl font-bold text-white tracking-wider">
                IT <span className="text-brand-yellow">SERVICE</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!isAdmin ? (
              <>
                <Link to="/" className="text-gray-300 hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Xizmatlar
                </Link>
                
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-brand-yellow text-sm hidden sm:block">
                      {user.name}
                    </span>
                    <button 
                      onClick={handleUserLogout}
                      className="text-gray-300 hover:text-red-400 p-2 rounded-md transition-colors"
                      title="Chiqish"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500 text-xs hidden sm:block">Mehmon</span>
                )}

                <Link to="/admin" className="text-gray-300 hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 border border-transparent hover:border-gray-700">
                  <User size={16} /> Admin
                </Link>
              </>
            ) : (
              <Link to="/" className="text-brand-yellow hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Saytga qaytish
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};