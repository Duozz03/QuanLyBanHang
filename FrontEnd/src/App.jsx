import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header/HeaderMain";
import ShopDashboard from "./pages/components/Product/ShopDashboard";
import HomePage from "./pages/components/Login/HomePage";
import MainLayout from "./layout/MainLayout";
import ListCategory from "./pages/components/Category/ListCategory";
import ListUser from "./pages/components/User/ListUser";
import SalesLayout from "./pages/components/Sale/componentSale/SaleLayout";
import SaleHeaderLayout from "./layout/SaleHeaderLayout";



export default function App() {
  return (
    <>
      <Routes>
        {/* ===== LOGIN ===== */}
        <Route path="/login" element={<HomePage />} />

        {/* ===== TRANG QUẢN LÝ ===== */}
        <Route element={<MainLayout />}>
          <Route path="/products" element={<ShopDashboard />} />

          <Route path="/orders" element={<div>Khách hàng</div>} />
          <Route path="/category" element={<ListCategory />} />
          <Route path="/customers" element={<div>Khách hàng</div>} />
          <Route path="/user" element={<ListUser />} />
         
        </Route>

        {/* ===== TRANG BÁN HÀNG ===== */}
        <Route element={<SaleHeaderLayout />}>
          <Route path="/sales" element={<SalesLayout />} />
        </Route>
        {/* ===== DEFAULT ===== */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}
