import Header from "../pages/Header/HeaderMain";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}