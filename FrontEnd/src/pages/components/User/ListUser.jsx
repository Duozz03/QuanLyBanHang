// ShopDashboard.jsx
import React, { useEffect, useState } from "react";

import axios from "axios";
import "./ListUser.css"; // giữ file CSS tuỳ chỉnh
export default function ListUser() {
  const [user, setUser] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data.result || [];
        console.log("data", data);

        setUser(data);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải User");
      }
    };

    loadUser();
  }, []);

  return (
    <div className="kv-app">
      {/* main: use bootstrap container + kv-main grid fallback */}
      <div className="container-fluid">
        <div className="row bm-3" style={{ margin: "0px 100px 0px 100px" }}>
          <h5 className="col-3 kv-heading-page">
            <span>Nhân viên</span>
          </h5>

          {/* main table */}
          <div className="col-9 d-flex align-items-center justify-content-between kv-content-head">
            <div className="chip-search-wrapper">
              <input
                className="chip-input"
                placeholder="Tìm nhân viên"
                
                
              />
            </div>

            <div className="d-flex gap-2">
              <button className="kv-btn ml-5">+ Nhân viên</button>
            </div>
          </div>
        </div>

        <div className="row gx-4" style={{ margin: "0 100px" }}>
          {/* ⬅ Sidebar */}
          <aside className="col-12 col-lg-3">
            <div className="kv-panel">
              <h4 className="kv-panel-title">Bộ lọc</h4>
              <input className="kv-input" placeholder="Tìm nhóm..." />
            </div>
          </aside>

          <div className="col-12 col-lg-9">
            <div className="kv-table-container">
              <div className="kv-table-wrap">
                <table className="table kv-table mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: 34 }}>
                        <input type="checkbox" />
                      </th>
                      <th>Tên tài khoản</th>
                      <th>Tên nhân viên</th>
                      <th>Địa chỉ</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Trạng thái</th>
                      <th>Chức vụ</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.map((r) => (
                      <React.Fragment key={r.id}>
                        <tr
                        //   className={
                        //     "kv-row" + (expandedId === r.id ? "expanded" : "")
                        //   }
                        //   onClick={() => toggleRow(r.id)}
                        //   style={{ cursor: "pointer" }}
                        >
                          <td>
                            <input
                              type="checkbox"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>

                          <td>{r.username}</td>
                          <td>{r.fullName}</td>
                          <td>{r.address}</td>
                          <td>{r.email}</td>
                          <td>{r.sdt}</td>
                          <td>{r.status === "ACTIVE" ? "Đang Hoạt Động" : "Ngừng Hoạt Động" }</td>
                          <td>{r.role}</td>
                          <td>{r.create_at}</td>
                        </tr>

                        {/* {expandedId === r.id && (
                                              <tr className="kv-detail-row">
                                                <td colSpan={9}>
                                                  <ProductDetail
                                                    product={r}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                  />
                                                </td>
                                              </tr>
                                            )} */}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination-bar">
                <div className="left">
                  <span>Hiển thị</span>
                  <select>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  <span>dòng</span>
                </div>

                <div className="center">
                  <button>⏮</button>
                  <button>◀</button>

                  <button>▶</button>
                  <button>⏭</button>
                </div>

                <div className="right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="kv-footer">© 2025 Dauoz — Demo dashboard</div>
    </div>
  );
}
