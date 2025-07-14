//Not needed
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { useAuth } from "@/contexts/AuthContext";
// import { api } from "@/services/api";

// const EmployeeLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     if (!email || !password) {
//       toast.error("Please enter both email and password");
//       return;
//     }

//     setLoading(true);
//     try {
//       const employee = await api.employeeLogin(email, password);
//       login({
//         id: employee.employeeId,
//         role: "employee",
//         name: employee.name,
//       });
//       toast.success(`Welcome, ${employee.name}!`);
//       navigate("/employee/EmployeeDashboard");
//     } catch (err: any) {
//       toast.error(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-blue-50">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-center">Employee Login</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label>Email</Label>
//             <Input
//               type="email"
//               placeholder="emp@store.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div>
//             <Label>Password</Label>
//             <Input
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <Button onClick={handleLogin} disabled={loading} className="w-full">
//             {loading ? "Logging in..." : "Login"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default EmployeeLogin;
