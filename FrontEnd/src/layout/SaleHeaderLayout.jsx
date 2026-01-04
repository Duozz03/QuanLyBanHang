import { Outlet } from "react-router-dom";
import HeaderBar from "../pages/components/Sale/componentSale/HeaderBar";

export default function SaleHeaderLayout() {
  return (
    <>
      {/* HEADER BÁN HÀNG */}
      <HeaderBar />

      {/* NỘI DUNG BÁN HÀNG */}
      <Outlet />
    </>
  );
}
