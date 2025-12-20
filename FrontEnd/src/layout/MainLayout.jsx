// layout/MainLayout.jsx
import Header from "../pages/Header/HeaderMain";
import { Outlet } from "react-router-dom";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <>
      {/* HEADER – KHÔNG SCROLL */}
      <Header />

      {/* CONTENT – CÓ SCROLL */}
      <main className="kv-content-wrapper">
        <Outlet />
      </main>
    </>
  );
}