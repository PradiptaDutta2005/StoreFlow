
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import StorekeeperLayout from '@/components/layouts/StorekeeperLayout';
import StorekeeperDashboard from './StorekeeperDashboard';
import StockManagement from './StockManagement';
import OrderRegistration from './OrderRegistration';
import AlertManagement from './AlertManagement';

const StorekeeperPortal = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'storekeeper') {
    return <Navigate to="/login?portal=storekeeper" replace />;
  }

  return (
    <StorekeeperLayout>
      <Routes>
        <Route index element={<StorekeeperDashboard />} />
        <Route path="stock" element={<StockManagement />} />
        <Route path="orders" element={<OrderRegistration />} />
        <Route path="alerts" element={<AlertManagement />} />
      </Routes>
    </StorekeeperLayout>
  );
};

export default StorekeeperPortal;
