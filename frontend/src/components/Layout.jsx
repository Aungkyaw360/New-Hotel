import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bed, Calendar, Users, Hotel } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Rooms', href: '/rooms', icon: Bed },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Guests', href: '/guests', icon: Users },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-primary-800 text-white">
        <div className="flex items-center justify-center h-16 bg-primary-900">
          <Hotel className="w-8 h-8 mr-2" />
          <h1 className="text-xl font-bold">Hotel Manager</h1>
        </div>
        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-900 border-l-4 border-white'
                    : 'hover:bg-primary-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
