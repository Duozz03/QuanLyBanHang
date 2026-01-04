import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header/HeaderMain";
import ShopDashboard from "./pages/components/Product/ShopDashboard";
import HomePage from "./pages/components/Login/HomePage";
import MainLayout from "./layout/MainLayout";
import ListCategory from "./pages/components/Category/ListCategory";
import ListUser from "./pages/components/User/ListUser";
import UserDetail from "./pages/components/User/UserDetail";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
      <Routes>
        {/* ===== LOGIN ===== */}
        <Route path="/login" element={<HomePage />} />
        <Route element={<MainLayout />}>
          <Route path="/products" element={<ShopDashboard />} />
          <Route path="*" element={<Navigate to="/login" />} />

          <Route path="/orders" element={<UserDetail />} />
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
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme="light"
      />
    </>
  );
}
