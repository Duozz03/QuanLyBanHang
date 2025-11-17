// src/AuthPage.jsx
import React, { useState } from "react";
import "./HomePage.css";
import vnProvinces from "./data/vn-provinces.json";

export default function AuthPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  
  //Form đăng nhập 
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    mode: "admin",
  });

  // Kiểm tra ràng buộc giá trị input, nếu thõa mãn hết thì chuyển qua from đăng kí user
  const [registerStep, setRegisterStep] = useState(1);

  //Form cửa hàng
  const [storeForm, setStoreForm] = useState({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    storeCategory: "",
   province: "", // tên tỉnh/thành
  district: "", // tên quận/huyện
  ward: "",     // tên phường/xã (nếu muốn dùng)
  });

  //Tạo User Admin
  const [ownerForm, setOwnerForm] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerUsername: "",
    ownerPassword: "",
    ownerPasswordConfirm: "",
  });

  //Mới thêm
const provinces = vnProvinces; // import từ JSON

const districts =
  provinces.find((p) => p.name === storeForm.province)?.districts || [];

const wards =
  districts.find((d) => d.name === storeForm.district)?.wards || [];
  //


  // ===== Handlers =====
  // Lấy giá trị từ login form đổ vào 
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  // Thông tin hiển thị sau khi submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert(
      `Đăng nhập: ${loginForm.username}\nChế độ: ${
        loginForm.mode === "admin" ? "Trang quản lý" : "Trang bán hàng"
      }`
    );
  };

  // Lấy giá trị từ Form Business đổ vào
  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    if (name === "storePhone") {
    const onlyDigits = value.replace(/\D/g, "").slice(0, 10); // <-- cắt 10 số // bỏ hết ký tự không phải số
    setStoreForm(prev => ({
      ...prev,
      storePhone: onlyDigits,
    }));
    return;
  }
    setStoreForm((prev) => ({ ...prev, [name]: value }));
  };

  //Lấy thông tin từ Form User đổ vào
  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerForm((prev) => ({
       ...prev,
        [name]: value,
// đổi tỉnh -> reset quận, phường
    ...(name === "province" ? { district: "", ward: "" } : {}),
    // đổi quận -> reset phường
    ...(name === "district" ? { ward: "" } : {}),
      }));
  };

  //Kiểm tra hợp lệ để chuyển sang form đăng kí user
  const handleNextStep = () => {
    if (!storeForm.storeName.trim()) {
      alert("Vui lòng nhập tên cửa hàng.");
      return;
    }
    if (!storeForm.storeAddress.trim()) {
      alert("Vui lòng nhập địa chỉ cửa hàng.");
      return;
    }
    if (!storeForm.storePhone.trim()) {
      alert("Vui lòng nhập số điện thoại liên hệ cửa hàng.");
      return;
    }
    setRegisterStep(2);
  };

  
  const handlePrevStep = () => setRegisterStep(1);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (ownerForm.ownerPassword !== ownerForm.ownerPasswordConfirm) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

  

    alert(`Tên cửa hàng: ${storeForm.storeName}
    Địa chỉ: ${storeForm.storeAddress}, ${storeForm.ward}, ${storeForm.district}, ${storeForm.province}
    SĐT: ${storeForm.storePhone}
    Tên Admin: ${ownerForm.ownerName}
    Email: ${ownerForm.ownerEmail}
    Tài khoản: ${ownerForm.ownerUsername}
    Mật khẩu: ${ownerForm.ownerPassword}
    `
    
  
  );

    setStoreForm({
      storeName: "",
      storeAddress: "",
      storePhone: "",
      storeCategory: "",
    });
    setOwnerForm({
      ownerName: "",
      ownerEmail: "",
      ownerUsername: "",
      ownerPassword: "",
      ownerPasswordConfirm: "",
    });
    setRegisterStep(1);
  };

  // ===== JSX =====
  return (
    <div className="auth-screen">
      {/* Background blobs */}
      <div className="auth-bg-layer auth-bg-layer-1" />
      <div className="auth-bg-layer auth-bg-layer-2" />

      {/* HEADER */}
      <header className="auth-nav">
        <div className="auth-nav-left">
          <div className="auth-logo-mark">S</div>
          <div>
            <div className="auth-logo-title">Dauoz</div>
            <div className="auth-logo-caption">Quản lý bán hàng thông minh</div>
          </div>
        </div>
        <div className="auth-nav-right">
          <a href="#features" className="auth-nav-link d-none d-md-inline">
            Tính năng
          </a>
          <a href="#how" className="auth-nav-link d-none d-md-inline">
            Cách hoạt động
          </a>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => setIsLoginOpen(true)}
          >
            Đăng nhập
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="auth-main">
        <div className="container-xl">
          <div className="row gx-5 gy-4 align-items-center">
            {/* HERO LEFT */}
            <div className="col-lg-5 order-2 order-lg-1">
              <section className="auth-hero">
                <span className="auth-badge">Phiên bản dành cho chủ cửa hàng</span>
                <h1 className="auth-hero-title">
                  Một nơi duy nhất để <span>quản lý cửa hàng của bạn</span>.
                </h1>
                <p className="auth-hero-sub">
                  Kết nối sản phẩm, đơn hàng, tồn kho, nhân viên và doanh thu
                  trong một nền tảng trực quan – giúp bạn ra quyết định nhanh
                  hơn, chính xác hơn.
                </p>

                <div className="row g-3 auth-feature-row">
                  <div className="col-12">
                    <div className="auth-feature-card">
                      <div className="auth-feature-icon">📦</div>
                      <div>
                        <div className="auth-feature-title">
                          Quản lý tồn kho thông minh
                        </div>
                        <div className="auth-feature-desc">
                          Cảnh báo hết hàng, tồn âm, đề xuất nhập hàng theo tốc
                          độ bán.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="auth-feature-card small">
                      <div className="auth-feature-icon">🏬</div>
                      <div>
                        <div className="auth-feature-title">Bán hàng dễ dàng</div>
                        <div className="auth-feature-desc">
                          Thanh toán nhanh gọn, dễ tiếp cận, dễ sử dụng.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="auth-feature-card small">
                      <div className="auth-feature-icon">📈</div>
                      <div>
                        <div className="auth-feature-title">
                          Báo cáo theo thời gian thực
                        </div>
                        <div className="auth-feature-desc">
                          Xem doanh thu, lợi nhuận, top sản phẩm mọi lúc.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="auth-mini-stats mt-3">
                  <div className="auth-mini-stat">
                    <div className="auth-mini-label">Thời gian triển khai</div>
                    <div className="auth-mini-value">Trong ngày</div>
                  </div>
                  <div className="auth-mini-stat">
                    <div className="auth-mini-label">Hỗ trợ</div>
                    <div className="auth-mini-value">7 ngày / tuần</div>
                  </div>
                </div>
              </section>
            </div>

            {/* FORM RIGHT */}
            <div className="col-lg-7 order-1 order-lg-2">
              <section className="auth-panel-wrapper">
                <div className="auth-panel shadow-lg">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h2 className="h4 mb-1">Tạo cửa hàng của bạn</h2>
                      <p className="text-muted small mb-0">
                        Bước {registerStep} / 2 –{" "}
                        {registerStep === 1
                          ? "Nhập thông tin cửa hàng"
                          : "Thông tin chủ cửa hàng"}
                      </p>
                    </div>
                    <span className="badge rounded-pill bg-light text-muted">
                      Mất khoảng 1–2 phút
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="auth-stepper mb-4">
                    <div className="auth-stepper-track">
                      <div
                        className={
                          "auth-stepper-progress " +
                          (registerStep === 1 ? "half" : "full")
                        }
                      />
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <div className="text-center">
                        <div
                          className={
                            "auth-step-dot " +
                            (registerStep >= 1 ? "active" : "")
                          }
                        >
                          1
                        </div>
                        <div className="small mt-1">Cửa hàng</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={
                            "auth-step-dot " +
                            (registerStep >= 2 ? "active" : "")
                          }
                        >
                          2
                        </div>
                        <div className="small mt-1">Chủ cửa hàng</div>
                      </div>
                    </div>
                  </div>

                  {/* FORM */}
                  <form
                    onSubmit={
                      registerStep === 2
                        ? handleRegisterSubmit
                        : (e) => e.preventDefault()
                    }
                  >
                    {registerStep === 1 && (
  <>
    <div className="mb-3">
      <label className="form-label">
        Tên cửa hàng<span className="text-danger">*</span>
      </label>
      <input
        type="text"
        className="form-control auth-input"
        name="storeName"
        value={storeForm.storeName}
        onChange={handleStoreChange}
        placeholder="Ví dụ: Cửa hàng Sunrise Mart"
        required
      />
    </div>



{/* Tỉnh / Quận / Phường */}
<div className="row">
  <div className="col-md-4 mb-3">
    <label className="form-label">Tỉnh / Thành phố</label>
    <select
      className="form-select auth-input"
      name="province"
      value={storeForm.province}
      onChange={handleStoreChange}
    >
      <option value="">-- Chọn tỉnh / thành --</option>
      {provinces.map((p) => (
        <option key={p.name} value={p.name}>
          {p.name}
        </option>
      ))}
    </select>
  </div>

  <div className="col-md-4 mb-3">
    <label className="form-label">Quận / Huyện</label>
    <select
      className="form-select auth-input"
      name="district"
      value={storeForm.district}
      onChange={handleStoreChange}
      disabled={!storeForm.province}
    >
      <option value="">-- Chọn quận / huyện --</option>
      {districts.map((d) => (
        <option key={d.name} value={d.name}>
          {d.name}
        </option>
      ))}
    </select>
  </div>

  <div className="col-md-4 mb-3">
    <label className="form-label">Phường / Xã</label>
    <select
      className="form-select auth-input"
      name="ward"
      value={storeForm.ward}
      onChange={handleStoreChange}
      disabled={!storeForm.district}
    >
      <option value="">-- Chọn phường / xã --</option>
      {wards.map((w) => (
        <option key={w.name} value={w.name}>
          {w.name}
        </option>
      ))}
    </select>
  </div>
</div>
    {/* Địa chỉ chi tiết */}
<div className="mb-3">
  <label className="form-label">Địa chỉ</label>
  <input
    type="text"
    className="form-control auth-input"
    name="storeAddress"
    value={storeForm.storeAddress}
    onChange={handleStoreChange}
    placeholder="Số nhà, tên đường..."
  />
</div>

    {/* Số điện thoại + Ngành hàng giữ nguyên như trước */}
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Số điện thoại</label>
        <input
          type="tel"
          className="form-control auth-input"
          name="storePhone"
          value={storeForm.storePhone}
          onChange={handleStoreChange}
          placeholder="Ví dụ: 0909 xxx xxx"
          
        />
      </div>

      { /* Ngành hàng */}
      
    </div>

    <div className="d-flex justify-content-between align-items-center mt-2">
      <div className="small text-muted">
      </div>
      <button
        type="button"
        className="btn btn-success px-4"
        onClick={handleNextStep}
      >
        Tiếp tục
      </button>
    </div>
  </>
)}


                    {registerStep === 2 && (
                      <>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              Họ tên chủ cửa hàng
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control auth-input"
                              name="ownerName"
                              value={ownerForm.ownerName}
                              onChange={handleOwnerChange}
                              placeholder="Nguyễn Văn A"
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              Email<span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control auth-input"
                              name="ownerEmail"
                              value={ownerForm.ownerEmail}
                              onChange={handleOwnerChange}
                              placeholder="owner@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              Tên đăng nhập<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control auth-input"
                              name="ownerUsername"
                              value={ownerForm.ownerUsername}
                              onChange={handleOwnerChange}
                              placeholder="username"
                              required
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Mật khẩu<span className="text-danger">*</span>
                            </label>
                            <input
                              type="password"
                              className="form-control auth-input"
                              name="ownerPassword"
                              value={ownerForm.ownerPassword}
                              onChange={handleOwnerChange}
                              required
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Xác nhận<span className="text-danger">*</span>
                            </label>
                            <input
                              type="password"
                              className="form-control auth-input"
                              name="ownerPasswordConfirm"
                              value={ownerForm.ownerPasswordConfirm}
                              onChange={handleOwnerChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="d-flex justify-content-between mt-2">
                          <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={handlePrevStep}
                          >
                            Quay lại
                          </button>
                          <button type="submit" className="btn btn-success px-4">
                            Hoàn tất đăng ký
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Đăng nhập StoreSuite</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsLoginOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                      type="text"
                      className="form-control auth-input"
                      name="username"
                      value={loginForm.username}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control auth-input"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Đăng nhập vào:</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="modeAdmin"
                          name="mode"
                          value="admin"
                          checked={loginForm.mode === "admin"}
                          onChange={handleLoginChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="modeAdmin"
                        >
                          Trang quản lý
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="modeStore"
                          name="mode"
                          value="store"
                          checked={loginForm.mode === "store"}
                          onChange={handleLoginChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="modeStore"
                        >
                          Trang bán hàng
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setIsLoginOpen(false)}
                  >
                    Đóng
                  </button>
                  <button type="submit" className="btn btn-success px-4">
                    Đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
