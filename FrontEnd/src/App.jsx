import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header/HeaderMain";
import ShopDashboard from "./pages/components/Product/ShopDashboard";
import HomePage from "./pages/components/Login/HomePage";
import MainLayout from "./layout/MainLayout";
import ListCategory from "./pages/components/Category/ListCategory";
import ListUser from "./pages/components/User/ListUser";



export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<HomePage />} />
        <Route element={<MainLayout/>}>
        <Route path="/products" element={<ShopDashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
        
        <Route path="/category" element={<ListCategory />} />
        <Route path="/customers" element={<div>Khách hàng</div>} />
        <Route path="/user" element={<ListUser/>} />
        </Route>
      </Routes>
      </>
  );
}



