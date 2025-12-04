import { Routes, Route, Navigate } from "react-router-dom";
import ShopDashboard from "./pages/components/Product/ShopDashboard";
import HomePage from "./pages/components/Login/HomePage";

export default function App() {
  return (
    <Routes>
  <Route path="/login" element={<HomePage/>} />
  <Route path="/products" element={<ShopDashboard/>} />
   <Route path="*" element={<Navigate to="/login" />} />
</Routes>
  );
}


