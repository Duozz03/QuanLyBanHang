import { Routes, Route, Navigate } from "react-router-dom";
import ShopDashboard from "./pages/ShopDashboard";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Routes>
  <Route path="/login" element={<HomePage/>} />
  <Route path="/product" element={<ShopDashboard/>} />
   <Route path="*" element={<Navigate to="/login" />} />
</Routes>
  );
}


