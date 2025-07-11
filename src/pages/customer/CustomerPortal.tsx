
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import CustomerLayout from '@/components/layouts/CustomerLayout';
import CustomerDashboard from './CustomerDashboard';
import OrderHistory from './OrderHistory';
import ProductSearch from './ProductSearch';
import StoreMap from './StoreMap';
import LoyaltyPoints from './LoyaltyPoints';

const CustomerPortal = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'customer') {
    return <Navigate to="/login?portal=customer" replace />;
  }

  return (
    <CustomerLayout>
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/map" element={<StoreMap />} />
        <Route path="/loyalty" element={<LoyaltyPoints />} />
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerPortal;
