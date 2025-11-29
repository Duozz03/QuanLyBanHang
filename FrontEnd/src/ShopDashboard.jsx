import React, { useState } from "react";
import "./ShopDashboard.css";

/**
 * ShopDashboard.jsx
 * Giao diện giả (static) giống KiotViet để demo.
 */

export default function ShopDashboard() {
  // state tab hiện tại
  const [active, setActive] = useState("tongquan"); // mặc định tab Tổng quan

  // handler đổi tab
  const handleNav = (tab) => {
    setActive(tab);
    console.log("Đã chuyển sang tab:", tab);
  };

  // demo data (thay bằng API later)
  const rows = [
    { id: "DV001", name: "Khang", phone: "0123456789", note: 0 },
    { id: "DV002", name: "Lan", phone: "0987654321", note: 1 },
  ];

  return (
    <div className="kv-app">
      {/* TOP NAV */}
      <header className="kv-topbar">
        <div className="kv-top-left">
          <div className="kv-brand">
            <div className="kv-brand-icon">🟦</div>
            <div className="kv-brand-text">Deuoz</div>
          </div>

          <nav className="kv-navlinks" aria-label="Main navigation">
            <button
              className={"kv-link " + (active === "tongquan" ? "active" : "")}
              onClick={() => handleNav("tongquan")}
            >
              Tổng quan
            </button>

            <button
              className={"kv-link " + (active === "hanghoa" ? "active" : "")}
              onClick={() => handleNav("hanghoa")}
            >
              Hàng hóa
            </button>

            <button
              className={"kv-link " + (active === "donhang" ? "active" : "")}
              onClick={() => handleNav("donhang")}
            >
              Đơn hàng
            </button>

            <button
              className={"kv-link " + (active === "khachhang" ? "active" : "")}
              onClick={() => handleNav("khachhang")}
            >
              Khách hàng
            </button>

            <button
              className={"kv-link " + (active === "nhanvien" ? "active" : "")}
              onClick={() => handleNav("nhanvien")}
            >
              Nhân viên
            </button>
          </nav>
        </div>

        <div className="kv-top-right">
          <button className="kv-btn kv-pill kv-primary">Bán hàng</button>
        </div>
      </header>

      {/* MAIN LAYOUT  */}
     <div className="kv-main">
        {/* LEFT SIDEBAR */}
        <aside className="kv-sidebar">
          <div className="kv-panel">
            <h4 className="kv-panel-title">Trạng thái nhân viên</h4>
            <label className="kv-radio">
              <input type="radio" name="status" defaultChecked /> Đang làm việc
            </label>
            <label className="kv-radio">
              <input type="radio" name="status" /> Đã nghỉ
            </label>
          </div>

          <div className="kv-panel">
            <h4 className="kv-panel-title">Phòng ban</h4>
            <input placeholder="Chọn phòng ban" className="kv-input" />
          </div>

          <div className="kv-panel">
            <h4 className="kv-panel-title">Chức danh</h4>
            <input placeholder="Chọn chức danh" className="kv-input" />
          </div>
        </aside>

        {/* CONTENT */}
        <section className="kv-content">
          <div className="kv-content-head">
            <h3>Danh sách nhân viên</h3>
            <div className="kv-actions">
              <input className="kv-search" placeholder="Tìm theo mã, tên nhân viên" />
              <button className="kv-btn">+ Nhân viên</button>
              <button className="kv-btn">Nhập file</button>
              <button className="kv-btn">Xuất file</button>
            </div>
          </div>

          <div className="kv-table-wrap">
            <table className="kv-table">
              <thead>
                <tr>
                  <th style={{ width: 34 }}><input type="checkbox" /></th>
                  <th>Ảnh</th>
                  <th>Mã nhân viên</th>
                  <th>Mã chấm công</th>
                  <th>Tên nhân viên</th>
                  <th>Số điện thoại</th>
                  <th>Số CMND/CCCD</th>
                  <th>Nợ và tạm ứng</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td><input type="checkbox" /></td>
                    <td><div className="kv-avatar">👤</div></td>
                    <td>{r.id}</td>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>—</td>
                    <td>{r.note}</td>
                    <td />
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan="9" className="kv-empty">Chưa có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* RIGHT (optional) */}
        <aside className="kv-right">
          <div className="kv-card-small">
            <h5>Gợi ý</h5>
            <p className="kv-muted">Sử dụng bộ lọc bên trái để tìm nhanh nhân viên.</p>
          </div>
        </aside>
      </div>

      {/* FOOTER helper small */}
      <div className="kv-footer">
        <span>© 2025 Dauoz — Demo dashboard</span>
      </div>
    </div>
  );
}
