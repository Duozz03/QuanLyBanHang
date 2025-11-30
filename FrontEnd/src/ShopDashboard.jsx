// ShopDashboard.jsx
import React, { useState } from "react";
import "./ShopDashboard.css";
import ProductDetail from "./ProductDetail";
import CreateProductModal from "./CreateProductModal";

export default function ShopDashboard() {
  const [active, setActive] = useState("hanghoa");
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // sản phẩm đang chỉnh sửa (null = tạo mới)

  // initial demo products
  const [products, setProducts] = useState([
    {
      id: "10225873544",
      sku: "10225873544",
      name: "Bánh mì Staff chà bông 55gr",
      price: 0,
      img: "/images/banhstaff.jpg",
      group: "Bánh > Bánh tươi, sandwich",
      stock: 0,
      brand: "Staff",
      giaban: 0,
      giavon: 0,
      khachdat: 0,
      thoigiantao: "30/11/2025",
      dukien: "-",
    },
    {
      id: "10225873545",
      sku: "10225873545",
      name: "Bánh quy Socola 100gr",
      price: 12000,
      img: "/images/banhscl.jpg",
      group: "Bánh > Bánh quy",
      stock: 15,
      brand: "CookieCo",
      giaban: 12000,
      giavon: 8000,
      khachdat: 1,
      thoigiantao: "01/12/2025",
      dukien: "-",
    },
  ]);

  const toggleRow = (id) => setExpandedId((p) => (p === id ? null : id));

  // mở modal tạo mới
  const openCreate = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  // mở modal edit với product
  const handleEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  // gọi khi lưu (create hoặc update)
  // onSave sẽ truyền (product, isEdit)
  const handleSave = (product, isEdit) => {
    if (isEdit) {
      // cập nhật sản phẩm (theo sku)
      setProducts((prev) => prev.map((p) => (p.sku === product.sku ? { ...p, ...product } : p)));
      setModalOpen(false);
      setExpandedId(product.sku);
      setEditProduct(null);
    } else {
      // tạo mới (nếu sku trùng -> thêm hậu tố)
      let sku = product.sku;
      if (products.find((p) => p.sku === sku)) {
        sku = sku + "-" + Date.now().toString().slice(-4);
        product.sku = sku;
        product.id = sku;
      }
      setProducts((prev) => [...prev, product]);
      setModalOpen(false);
      setExpandedId(product.sku);
    }
  };

  const handleDelete = (product) => {
    if (!window.confirm(`Xóa ${product.name}?`)) return;
    setProducts((p) => p.filter((x) => x.sku !== product.sku));
    if (expandedId === product.sku) setExpandedId(null);
  };

  return (
    <div className="kv-app">
      {/* header simplified */}
      <header className="kv-topbar">
        <div className="kv-top-left">
          <div className="kv-brand">
            <div className="kv-brand-icon">🟦</div>
            <div className="kv-brand-text">Deuoz</div>
          </div>

          <nav className="kv-navlinks">
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
        </div>

        <div className="kv-top-right">
          <button className="kv-btn kv-pill kv-primary">Bán hàng</button>
        </div>
      </header>

      {/* main */}
      <div className="kv-main">
        <aside className="kv-sidebar">
          <div className="kv-panel">
            <h4 className="kv-panel-title">Bộ lọc</h4>
            <input className="kv-input" placeholder="Tìm nhóm..." />
          </div>
        </aside>

        <section className="kv-content">
          <div className="kv-content-head">
            <h3>Danh sách hàng hóa</h3>
            <div className="kv-actions">
              <input className="kv-search" placeholder="Tìm theo mã, tên hàng" />
              <button className="kv-btn" onClick={openCreate}>
                + Tạo mới
              </button>
              <button className="kv-btn">Import file</button>
              <button className="kv-btn">Xuất file</button>
            </div>
          </div>

          <div className="kv-table-wrap">
            <table className="kv-table">
              <thead>
                <tr>
                  <th style={{ width: 34 }}>
                    <input type="checkbox" />
                  </th>
                  <th>Ảnh</th>
                  <th>Mã hàng</th>
                  <th>Tên hàng</th>
                  <th>Giá bán</th>
                  <th>Giá vốn</th>
                  <th>Tồn kho</th>
                  <th>Khách đặt</th>
                  <th>Thời gian tạo</th>
                  <th>Dự kiến hết hàng</th>
                </tr>
              </thead>
              <tbody>
                {products.map((r) => (
                  <React.Fragment key={r.sku}>
                    <tr
                      className={"kv-row " + (expandedId === r.sku ? "expanded" : "")}
                      onClick={() => toggleRow(r.sku)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td>
                        <img
                          src={r.img}
                          alt=""
                          style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }}
                        />
                      </td>
                      <td>{r.sku}</td>
                      <td>{r.name}</td>
                      <td>{r.giaban}</td>
                      <td>{r.giavon}</td>
                      <td>{r.stock}</td>
                      <td>{r.khachdat}</td>
                      <td>{r.thoigiantao}</td>
                      <td>{r.dukien}</td>
                    </tr>

                    {expandedId === r.sku && (
                      <tr className="kv-detail-row">
                        <td colSpan={10}>
                          <ProductDetail product={r} onEdit={handleEdit} onDelete={handleDelete} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="kv-right">
          <div className="kv-card-small">
            <h5>Gợi ý</h5>
            <p className="kv-muted">Sử dụng bộ lọc bên trái để tìm nhanh hàng hóa.</p>
          </div>
        </aside>
      </div>

      <div className="kv-footer">© 2025 Dauoz — Demo dashboard</div>

      {/* remount modal when editProduct changes by giving key -> avoids effect setState issue */}
      <CreateProductModal
        key={editProduct ? editProduct.sku : "new"}
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
