import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <>
      {/* Top white bar */}
      <div className="kv-topbar bg-white">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="kv-brand d-flex align-items-center">
            <img src="/images/logo.png" alt="logo" width={64} />
            <span className="ms-2 fw-bold">Deuoz</span>
          </div>

          <div className="kv-avatar avt">
            <img src="https://i.pravatar.cc/40" alt="avatar" />
          </div>
        </div>
      </div>

      {/* Blue menu */}
      <header className="kv-topbar kv-blue">
        <div className="container-fluid d-flex justify-content-between ">
          <nav className="kv-navlinks">
            <NavLink to="/products" className="kv-link">
              Hàng hóa
            </NavLink>
            <NavLink to="/orders" className="kv-link">
              Đơn hàng
            </NavLink>
            <NavLink to="/customers" className="kv-link">
              Khách hàng
            </NavLink>
            <NavLink to="/staff" className="kv-link">
              Nhân viên
            </NavLink>
          </nav>

          <button className="kv-pill">Bán hàng</button>
        </div>
      </header>
    </>
  );
}
