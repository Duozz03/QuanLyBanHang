import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [showMenuProduct, setShowMenuProduct] = useState(false);
  const [showMenuUser, setshowMenuUser] = useState(false);


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
                <div
                  
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
                    <a href="/category">
                      Danh Sách Loại hàng
                    </a>
                  </li>
                </ul>
                </div>
              </div>

            <NavLink to="/orders" className="kv-link">
              Đơn hàng
            </NavLink>
            <NavLink to="/customers" className="kv-link">
              Khách hàng
            </NavLink>
            <div
                className="product-menu-wrapper"
                onMouseEnter={() =>
                  setshowMenuUser(true)
                }
                onMouseLeave={() => setshowMenuUser(false)}
              >
                <div className={`kv-link ${showMenuUser ? "active" : ""}`}>Nhân Viên</div>
                <div
                  
                  className={`mega-menu ${showMenuUser ? "show" : ""}`}
                >
                <ul className="menu-options">
                  <li>
                    <a href="/user">
                      Danh Sách Nhân viên
                    </a>
                  </li>
                </ul>
                </div>
              </div>
          </nav>

          <NavLink to="/sales" className="kv-pill" style={{ textDecoration: "none" }} >Bán hàng</NavLink>
        </div>
      </header>
    </>
  );
}
