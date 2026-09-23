import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Compass,
  Users,
  CalendarDays,
  Megaphone,
  Settings,
  Shield,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/my-clubs', label: 'My Clubs', icon: Users },
    { to: '/activities', label: 'Activities', icon: CalendarDays },
    { to: '/announcements', label: 'Announcements', icon: Megaphone },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/members', label: 'Members', icon: Users },
    { to: '/admin/activities', label: 'Activities', icon: CalendarDays },
    { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const coordinatorLinks = [
    { to: '/coordinator', label: 'Pending Approvals', icon: LayoutDashboard },
    { to: '/coordinator/clubs', label: 'Manage Clubs', icon: Shield },
  ];

  const links = user?.role === 'CLUB_ADMIN' ? adminLinks : user?.role === 'CLUB_COORDINATOR' ? coordinatorLinks : studentLinks;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? (user?.role === 'CLUB_ADMIN' ? '/admin' : user?.role === 'CLUB_COORDINATOR' ? '/coordinator' : '/dashboard') : '/'} className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-navy-900 text-lg hidden sm:block">
              BIT Clubs
            </span>
          </Link>

          {/* Desktop nav */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-medium text-xs">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user?.full_name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost btn-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn-primary btn-sm">Register</Link>
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && isAuthenticated && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 border-b border-gray-100 mb-2 pb-3">
              <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-medium text-xs">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-navy-900">{user?.full_name}</div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>
            </div>
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
