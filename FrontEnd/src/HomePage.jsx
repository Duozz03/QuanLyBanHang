import React, { useState } from "react";

export default function AuthPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    mode: "admin", // 'admin' hoặc 'store'
  });

  const [registerStep, setRegisterStep] = useState(1);

  const [storeForm, setStoreForm] = useState({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    storeCategory: "",
  });

  const [ownerForm, setOwnerForm] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerUsername: "",
    ownerPassword: "",
    ownerPasswordConfirm: "",
  });

  // ================== HANDLERS ==================

  // Login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // TODO: gọi API đăng nhập
    console.log("Login data:", loginForm);
    alert(
      `Đăng nhập với user: ${loginForm.username}\nChế độ: ${
        loginForm.mode === "admin" ? "Trang quản lý" : "Trang bán hàng"
      }`
    );
  };

  // Store
  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (!storeForm.storeName.trim()) {
      alert("Vui lòng nhập tên cửa hàng.");
      return;
    }
    setRegisterStep(2);
  };

  // Owner
  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrevStep = () => setRegisterStep(1);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (ownerForm.ownerPassword !== ownerForm.ownerPasswordConfirm) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    // TODO: gọi API đăng ký (gửi storeForm + ownerForm)
    console.log("Store data:", storeForm);
    console.log("Owner data:", ownerForm);

    alert("Đăng ký cửa hàng và tài khoản chủ cửa hàng thành công!");

    // reset
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

  // ================== JSX ==================

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        {/* Cột trái */}
        <div
          className="col-12 col-md-4 d-flex flex-column justify-content-between text-white p-4 p-md-5"
          style={{
            background:
              "linear-gradient(135deg, #22c55e 0%, #0f172a 40%, #020617 100%)",
          }}
        >
          <div>
            <h1 className="fw-bold display-6 mb-3">Quản lý bán hàng</h1>
            <p className="small mb-0">
              Hệ thống giúp bạn quản lý cửa hàng, sản phẩm, đơn hàng và doanh
              thu một cách dễ dàng và trực quan.
            </p>
          </div>

          <div className="mt-4">
            <button
              className="btn btn-outline-light w-100"
              onClick={() => setIsLoginOpen(true)}
            >
              Đăng nhập
            </button>
          </div>
        </div>

        {/* Cột phải */}
        <div className="col-12 col-md-8 bg-dark text-white p-4 p-md-5">
          <div className="mx-md-4">
            <h2 className="h3 mb-1">Đăng ký cửa hàng</h2>
            <p className="text-secondary small mb-3">
              Bước {registerStep} / 2 –{" "}
              {registerStep === 1
                ? "Thông tin cửa hàng"
                : "Thông tin chủ cửa hàng"}
            </p>

            {/* Stepper */}
            <div className="d-flex align-items-center mb-4">
              <div className="d-flex align-items-center me-4">
                <span
                  className={
                    "badge rounded-pill me-2 " +
                    (registerStep >= 1 ? "bg-success" : "bg-secondary")
                  }
                >
                  1
                </span>
                <span className="small">Cửa hàng</span>
              </div>
              <div className="d-flex align-items-center">
                <span
                  className={
                    "badge rounded-pill me-2 " +
                    (registerStep >= 2 ? "bg-success" : "bg-secondary")
                  }
                >
                  2
                </span>
                <span className="small">Chủ cửa hàng</span>
              </div>
            </div>

            {/* FORM ĐĂNG KÝ */}
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
                    <label className="form-label">Tên cửa hàng</label>
                    <input
                      type="text"
                      className="form-control"
                      name="storeName"
                      value={storeForm.storeName}
                      onChange={handleStoreChange}
                      placeholder="Ví dụ: Cửa hàng ABC"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Địa chỉ</label>
                    <input
                      type="text"
                      className="form-control"
                      name="storeAddress"
                      value={storeForm.storeAddress}
                      onChange={handleStoreChange}
                      placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="storePhone"
                      value={storeForm.storePhone}
                      onChange={handleStoreChange}
                      placeholder="Ví dụ: 0909 xxx xxx"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Ngành hàng</label>
                    <select
                      className="form-select"
                      name="storeCategory"
                      value={storeForm.storeCategory}
                      onChange={handleStoreChange}
                    >
                      <option value="">-- Chọn ngành hàng --</option>
                      <option value="fashion">Thời trang</option>
                      <option value="food">Ăn uống</option>
                      <option value="electronics">Điện tử</option>
                      <option value="cosmetics">Mỹ phẩm</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleNextStep}
                    >
                      Tiếp tục
                    </button>
                  </div>
                </>
              )}

              {registerStep === 2 && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Họ tên chủ cửa hàng</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ownerName"
                      value={ownerForm.ownerName}
                      onChange={handleOwnerChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="ownerEmail"
                      value={ownerForm.ownerEmail}
                      onChange={handleOwnerChange}
                      placeholder="owner@example.com"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ownerUsername"
                      value={ownerForm.ownerUsername}
                      onChange={handleOwnerChange}
                      placeholder="username"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      name="ownerPassword"
                      value={ownerForm.ownerPassword}
                      onChange={handleOwnerChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      name="ownerPasswordConfirm"
                      value={ownerForm.ownerPasswordConfirm}
                      onChange={handleOwnerChange}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      onClick={handlePrevStep}
                    >
                      Quay lại
                    </button>
                    <button type="submit" className="btn btn-success">
                      Hoàn tất đăng ký
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* POPUP ĐĂNG NHẬP */}
      {isLoginOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Đăng nhập</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setIsLoginOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                      type="text"
                      className="form-control"
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
                      className="form-control"
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
                          name="mode"
                          id="modeAdmin"
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
                          name="mode"
                          id="modeStore"
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

                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={() => setIsLoginOpen(false)}
                  >
                    Đóng
                  </button>
                  <button type="submit" className="btn btn-success">
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
