import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  ClipboardList, 
  CreditCard, 
  FlaskConical, 
  LogOut, 
  Menu, 
  X,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/SignIn');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Patients', path: '/dashboard/patients', icon: <Users size={20} /> },
    { name: 'Appointments', path: '/dashboard/appointments', icon: <CalendarDays size={20} /> },
    { name: 'Visit Notes', path: '/dashboard/visits', icon: <ClipboardList size={20} /> },
    { name: 'Billing', path: '/dashboard/billing', icon: <CreditCard size={20} /> },
    { name: 'Lab Reports', path: '/dashboard/lab-reports', icon: <FlaskConical size={20} /> },
  ];

  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
          isActive 
            ? 'bg-primary-50 text-primary-700' 
            : 'text-neutral-600 hover:bg-neutral-100'
        }`
      }
      onClick={() => setSidebarOpen(false)}
    >
      <span className="mr-3">{item.icon}</span>
      {item.name}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary-600">Conexem EMR</span>
            </div>
            <button 
              className="lg:hidden text-neutral-500 hover:text-neutral-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
          
          {/* User menu */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircle className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-neutral-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center w-full px-4 py-2 text-sm font-medium text-neutral-600 rounded-md hover:bg-neutral-100 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-6">
          <button
            className="text-neutral-500 hover:text-neutral-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center">
            <span className="text-sm text-neutral-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;