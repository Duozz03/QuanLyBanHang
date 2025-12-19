import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header/HeaderMain";
import ShopDashboard from "./pages/components/Product/ShopDashboard";
import HomePage from "./pages/components/Login/HomePage";
import MainLayout from "./layout/MainLayout";



export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<HomePage />} />
        <Route element={<MainLayout/>}>
        <Route path="/products" element={<ShopDashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
        
        <Route path="/orders" element={<div>Đơn hàng</div>} />
        <Route path="/customers" element={<div>Khách hàng</div>} />
        <Route path="/staff" element={<div>Nhân viên</div>} />
        </Route>
      </Routes>
      </>
  );
}



