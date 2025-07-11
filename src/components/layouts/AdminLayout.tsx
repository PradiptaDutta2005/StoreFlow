import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Package, Users, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Stock Management', href: '/admin/stock', icon: Package },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Order Overview', href: '/admin/orders', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
  <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
    {/* Sidebar */}
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:static lg:inset-0`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b bg-gradient-to-r from-store-blue to-store-blue-light">
        <div className="flex items-center space-x-2">
          <Package className="w-8 h-8 text-white" />
          <span className="text-xl font-bold text-white">StoreFlow</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-white/20"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Sidebar Links */}
      <div className="p-4">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Admin Panel</p>
          <p className="font-semibold text-store-blue">{user?.name}</p>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-store-blue to-store-blue-light text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-store-blue'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>

    {/* Main content wrapper */}
    <div className="flex-1 flex flex-col">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white shadow-sm border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="text-store-blue"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-store-blue">Admin Portal</h1>
        <div className="w-10" />
      </div>

      {/* Page content */}
      <main className="p-4 lg:p-8 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);
};

export default AdminLayout;