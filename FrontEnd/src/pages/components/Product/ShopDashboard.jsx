// ShopDashboard.jsx
import React, { useEffect, useState } from "react";
import "./ShopDashboard.css"; // giữ file CSS tuỳ chỉnh
import ProductDetail from "./ProductDetail";
import CreateProductModal from "./CreateProductModal";
import axios from "axios";

export default function ShopDashboard() {
  const [active, setActive] = useState("hanghoa");
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data.result || [];

        const urlImage = await Promise.all(
          data.map(async (p) => {
            try {
              const imgRes = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/products/${p.id}/image`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const base64String = imgRes.data.result;
              return {
                ...p,
                urlImage: `data:image/jpeg;base64,${base64String}`,
              };
            } catch (e) {
              return { ...p, urlImage: "/images/product-placeholder.png", e };
            }
          })
        );

        setProducts(urlImage);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải sản phẩm");
      }
    };

    loadProducts();
  }, []);

  const toggleRow = (id) => setExpandedId((p) => (p === id ? null : id));

  const openCreate = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleSave = (product, isEdit) => {
    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, ...product } : p))
      );
      setModalOpen(false);
      setExpandedId(product.id);
      setEditProduct(null);
    } else {
      let pid = product.id;
      if (products.find((p) => p.id === pid)) {
        pid = pid + "-" + Date.now().toString().slice(-4);
        product.id = pid;
      }
      const toAdd = {
        id: String(product.id),
        barcode: product.barcode || "",
        name: product.name || "",
        urlImage: product.urlImage,
        description: product.description || "",
        importPrice: Number(product.importPrice) || 0,
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 0,
        status: product.status || "ACTIVE",
        createdAt: product.createdAt || new Date().slice(0, 10),
        category: product.category || "",
        img: product.img || "",
      };
      setProducts((prev) => [...prev, toAdd]);
      setModalOpen(false);
      setExpandedId(toAdd.id);
    }
  };

  const handleDelete = async (product) => {
    try {
      const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
      // gọi API xóa trên backend bằng axios
      await axios.delete( `${import.meta.env.VITE_API_BASE_URL}/products/${product.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

      // cập nhật lại state frontend
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
  };

  return (
    <div className="kv-app">
      {/* top thin white bar (kept kv styles) */}
      <div
        className="kv-topbar"
        style={{ background: "linear-gradient(180deg,#fff,#fff)" }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="kv-brand">
              <img
                src="/images/logo.png"
                alt="logo"
                style={{
                  width: 64,
                  height: 50,
                  objectFit: "contain",
                  marginLeft: 0,
                }}
              />
              <div className="kv-brand-text ms-2 text-dark">Deuoz</div>
            </div>
          </div>

          <div className="kv-option d-none d-md-flex align-items-center">
            <div className="kv-top-icons">
              <div className="kv-icon-item">
                <i className="fa-solid fa-truck-fast"></i>
                <span>Giao hàng</span>
              </div>

              <div className="kv-icon-item">
                <i className="fa-regular fa-circle"></i>
                <span>Chủ đề</span>
              </div>

              <div className="kv-icon-item">
                <i className="fa-regular fa-message"></i>
                <span>Hỗ trợ</span>
              </div>

              <div className="kv-icon-item">
                <i className="fa-regular fa-comment-dots"></i>
                <span>Góp ý</span>
              </div>

              <div className="kv-icon-item">
                <img
                  src="https://flagcdn.com/w20/vn.png"
                  className="kv-flag"
                  alt="vn"
                />
                <span>Tiếng Việt</span>
              </div>

              <div className="kv-icon-circle">
                <i className="fa-regular fa-bell"></i>
              </div>

              <div className="kv-icon-circle">
                <i className="fa-solid fa-gear"></i>
              </div>

              <div className="kv-avatar">
                <img src="https://i.pravatar.cc/40" alt="avatar" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* blue nav strip using kv styles but bootstrap containers */}
      <header
        className="kv-topbar"
        style={{
          background: "linear-gradient(180deg,var(--blue),var(--blue-strong))",
          padding: "10px 0",
        }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <nav className="kv-navlinks ">
            <button
              className={"kv-link " + (active === "hanghoa" ? "active" : "")}
              onClick={() => setActive("hanghoa")}
            >
              Hàng hóa
            </button>
            <button
              className={"kv-link " + (active === "donhang" ? "active" : "")}
              onClick={() => setActive("donhang")}
            >
              Đơn hàng
            </button>
            <button
              className={"kv-link " + (active === "khachhang" ? "active" : "")}
              onClick={() => setActive("khachhang")}
            >
              Khách hàng
            </button>
          </nav>

          <div className="kv-top-right ms-auto ">
            <button className="kv-pill">Bán hàng</button>
          </div>
        </div>
      </header>

      {/* main: use bootstrap container + kv-main grid fallback */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            {/* spacing between nav and content */}
            <div style={{ height: 12 }} />
          </div>
        </div>

        <div className="row gx-4" style={{ margin: "0 100px" }}>
          {/* left sidebar (uses kv-panel) */}
          <aside className="col-12 col-lg-3">
            <div className="kv-panel">
              <h4 className="kv-panel-title">Bộ lọc</h4>
              <input className="kv-input" placeholder="Tìm nhóm..." />
            </div>
          </aside>

          {/* main table */}
          <section className="col-12 col-lg-6">
            <div className="d-flex align-items-center justify-content-between mb-3 kv-content-head">
              <div className="kv-actions">
                <input
                  className="kv-search"
                  placeholder="Tìm theo mã, tên hàng"
                />
                <button className="kv-btn" onClick={openCreate}>
                  + Tạo mới
                </button>
                <button className="kv-btn">Import file</button>
                <button className="kv-btn">Xuất file</button>
              </div>
            </div>

            <div className="kv-table-wrap">
              <div className="table-responsive">
                <table className="table kv-table mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: 34 }}>
                        <input type="checkbox" />
                      </th>
                      <th>Ảnh</th>
                      <th>Mã hàng</th>
                      <th>Tên hàng</th>
                      <th>Giá bán</th>
                      <th>Giá nhập</th>
                      <th>Tồn kho</th>
                      <th>Trạng thái</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((r) => (
                      <React.Fragment key={r.id}>
                        <tr
                          className={
                            "kv-row " + (expandedId === r.id ? "expanded" : "")
                          }
                          onClick={() => toggleRow(r.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            <input
                              type="checkbox"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td>
                            <img
                              src={r.urlImage || "/images/placeholder.png"}
                              alt=""
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{r.id}</td>
                          <td>{r.name}</td>
                          <td>{r.price}</td>
                          <td>{r.importPrice}</td>
                          <td>{r.quantity}</td>
                          <td>{r.status}</td>
                          <td>{r.createdAt}</td>
                        </tr>

                        {expandedId === r.id && (
                          <tr className="kv-detail-row">
                            <td colSpan={9}>
                              <ProductDetail
                                product={r}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                              />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}

                    {products.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center p-4 muted">
                          Không có sản phẩm
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* right suggestion */}
          <aside className="col-12 col-lg-3">
            <div className="kv-card-small">
              <h5>Gợi ý</h5>
              <p className="kv-muted">
                Sử dụng bộ lọc bên trái để tìm nhanh hàng hóa.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="kv-footer">© 2025 Dauoz — Demo dashboard</div>

      {/* CreateProductModal (giữ component hiện tại) */}
      <CreateProductModal
        key={editProduct ? editProduct.id : "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        onSave={handleSave}
        initialProduct={editProduct}
      />
    </div>
  );
}
