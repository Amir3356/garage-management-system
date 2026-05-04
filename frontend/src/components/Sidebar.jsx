import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Car,
  History,
  Users,
  Settings,
  Wrench,
  X,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  UserCog
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { isAdmin, isClient, isMechanic } = useAuth();

  const isActive = (path) => location.pathname === path;

  const clientLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/vehicles', icon: Car, label: 'My Vehicles' },
    { to: '/book-service', icon: Calendar, label: 'Appointment' },
    { to: '/history', icon: History, label: 'History' },
  ];

  const adminLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/services', icon: Settings, label: 'Services' },
    { to: '/appointments', icon: ClipboardList, label: 'Appointments' },
    { to: '/mechanics', icon: UserCog, label: 'Mechanics' },
  ];

  const mechanicLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: Wrench, label: 'My Jobs' },
  ];

  const getLinks = () => {
    if (isAdmin) return adminLinks;
    if (isMechanic) return mechanicLinks;
    return clientLinks;
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex items-center justify-between p-4 lg:hidden ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && <span className="font-bold text-xl text-gray-900">GarageMS</span>}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collapse Toggle Button (Desktop only) */}
        <div className="hidden lg:flex justify-end p-2">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className={`p-4 space-y-1 ${isCollapsed ? 'px-2' : ''}`}>
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => onClose()}
                className={`flex items-center rounded-lg transition-all duration-200 group relative ${
                  isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'
                } ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? link.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-200 overflow-hidden ${
                  isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
                }`}>
                  {link.label}
                </span>
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {link.label}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
