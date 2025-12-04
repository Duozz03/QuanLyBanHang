import axios from "axios"
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./HomePage.css";

export default function AuthPage() {
  // modal luôn mở và không đóng
  const [isLoginOpen] = useState(true);

  const navigate = useNavigate();

  // form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("admin"); // admin or store
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const userRef = useRef(null);
  // useEffect(() => {
  //   const token =
  //     localStorage.getItem("accessToken") ||
  //     sessionStorage.getItem("accessToken");
  //   if (token) {
  //     axios
  //       .get("http://localhost:8080/users/2", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((res) => setUser(res.data))
  //       .catch((err) => console.error("Lỗi lấy user:", err));
  //   }

  // }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("at here")
  try {
    const res = await axios.post("http://localhost:8080/auth/token", {
      username,
      password,
    });
    console.log(res.data.result.token);
    const accessToken = res?.data?.result?.token;
    if (!accessToken) throw new Error("Không nhận được token");

    if (remember) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      sessionStorage.setItem("accessToken", accessToken);
    }

    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    const userRes = await axios.get("http://localhost:8080/users/myInfo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsername(userRes.data);
    console.log("ok");
    navigate("/products");
  } catch (err) {
    alert("Đăng nhập thất bại!");
    console.error("Lỗi:", err);
  }
};

  return (
    <div className="auth-screen">
      {/* background image kept from previous code (public/images/hero.jpg) */}
      <div className="auth-bg-single" />

      {/* modal backdrop (no click to close) */}
      {isLoginOpen && (
        <div className="modal-backdrop" aria-hidden>
          <div className="modal-dialog kv-login">
            <div className="kv-card">
              {/* logo */}
              {/* <div className="kv-logo-wrap">
                <img
                  src="/images/logo-kv.png"
                  alt="logo"
                  className="kv-logo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Crect rx='6' width='120' height='40' fill='%232563eb'/%3E%3Ctext x='50%25' y='56%25' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EDauoz%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div> */}

              <form onSubmit={handleSubmit} className="kv-form">
                {/* username */}
                <div className="kv-field">
                  <label className="kv-label">Tên đăng nhập</label>
                  <div className="kv-input-wrap">
                    <svg className="kv-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                      <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5 13 6.34 13 8s1.34 3 3 3zM8 21v-1a4 4 0 014-4h0a4 4 0 014 4v1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                      ref={userRef}
                      className="kv-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Tên đăng nhập"
                      required
                    />
                  </div>
                </div>

                {/* password */}
                <div className="kv-field">
                  <label className="kv-label">Mật khẩu</label>
                  <div className="kv-input-wrap">
                    <svg className="kv-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                      <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V8a5 5 0 0110 0v3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <input
                      className="kv-input"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu"
                      required
                    />

                    <button
                      type="button"
                      className="kv-eye"
                      onClick={() => setShowPass((s) => !s)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? (
                        // eye open
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        // eye closed
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                          <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.73 21.73 0 015.06-6.06" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 1l22 22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* remember + forgot */}
                <div className="kv-meta">
                  <label className="kv-remember">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />{" "}
                    Duy trì đăng nhập
                  </label>
                  <a className="kv-forgot" href="#forgot" onClick={(e) => e.preventDefault()}>
                    Quên mật khẩu?
                  </a>
                </div>

                {/* big split buttons */}
                <div className="kv-actions">
                  <button
                    type="button"
                    className={"kv-action kv-manage " + (mode === "admin" ? "active" : "")}
                    onClick={handleSubmit}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                      <path d="M3 12h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 6h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 18h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Quản lý</span>
                  </button>

                  <button
                    type="button"
                    className={"kv-action kv-store " + (mode === "store" ? "active" : "")}
                    onClick={() => setMode("store")}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                      <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 9V7a7 7 0 0 1 14 0v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Bán hàng</span>
                  </button>
                </div>

                {/* submit hidden but keep form submission on click of active action */}
                <div style={{ height: 0, overflow: "hidden" }}>
                  <button type="submit" aria-hidden>submit</button>
                </div>
              </form>

             
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
