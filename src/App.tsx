
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
//import EmployeeLogin from "@/pages/employee/EmployeeLogin";
// Pages
import Landing from "./pages/Landing";
import CustomerPortal from "./pages/customer/CustomerPortal";
import CustomerSignup from "./pages/customer/CustomerSignup";
import StorekeeperPortal from "./pages/storekeeper/StorekeeperPortal";
import EmployeePortal from "./pages/employee/EmployeePortal";
import AdminPortal from "./pages/admin/AdminPortal";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/customer/signup" element={<CustomerSignup />} />
              <Route path="/customer/*" element={<CustomerPortal />} />
              <Route path="/storekeeper/*" element={<StorekeeperPortal />} />
              <Route path="/employee/*" element={<EmployeePortal />} />
              <Route path="/admin/*" element={<AdminPortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
