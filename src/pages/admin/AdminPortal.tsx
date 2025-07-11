
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminStock from './AdminStock';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';

const AdminPortal = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login?portal=admin" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="stock" element={<AdminStock />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPortal;
