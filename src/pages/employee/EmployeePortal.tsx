
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import EmployeeDashboard from './EmployeeDashboard';
import EmployeeAlerts from './EmployeeAlerts';
import EmployeeTasks from './EmployeeTasks';

const EmployeePortal = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'employee') {
    return <Navigate to="/login?portal=employee" replace />;
  }

  return (
    <EmployeeLayout>
      <Routes>
        <Route index element={<EmployeeDashboard />} />
        <Route path="alerts" element={<EmployeeAlerts />} />
        <Route path="tasks" element={<EmployeeTasks />} />
      </Routes>
    </EmployeeLayout>
  );
};

export default EmployeePortal;
