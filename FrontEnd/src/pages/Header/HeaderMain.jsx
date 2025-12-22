import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [showMenuProduct, setShowMenuProduct] = useState(false);


  return (
    <>
      {/* Top white bar */}
      <div className="kv-topbar bg-white">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="mobileMenu">
            <img src="/images/logo.png" alt="logo" width={64} height={48} />
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
              <div
                className="product-menu-wrapper"
                onMouseEnter={() =>
                  setShowMenuProduct(true)
                }
                onMouseLeave={() => setShowMenuProduct(false)}
              >
                <div className={`kv-link ${showMenuProduct ? "active" : ""}`}>Hàng Hóa</div>
                <NavLink
                  to="/products"
                  className={`mega-menu ${showMenuProduct ? "show" : ""}`}
                >
                <p className="small-title">Hàng hóa</p>
                <ul className="menu-options">
                  <li>
                    <a href="/products">
                      Danh Sách Hàng Hóa
                    </a>
                  </li>
                  <li>
                    <a href="/categories">
                      Danh Sách Loại hàng
                    </a>
                  </li>
                </ul>
                </NavLink>
              </div>

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
