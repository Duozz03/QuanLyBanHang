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

  // initial demo products (theo cấu trúc mới)
  const [products, setProducts] = useState([
    {
      product_id: "10225873544",
      barcode_id: "89010225873544",
      name: "Bánh mì Staff chà bông 55gr",
      description: "Bánh mì tươi có chà bông, gói 55gr",
      import_price: 5000,
      sale_price: 8000,
      stock_quantity: 0,
      status: "active",
      create_at: "2025-11-30",
      category: "Bánh > Bánh tươi, sandwich",
      img: "/images/banhstaff.jpg", // giữ ảnh nếu có
    },
    {
      product_id: "10225873545",
      barcode_id: "89010225873545",
      name: "Bánh quy Socola 100gr",
      description: "Bánh quy vị socola ngọt nhẹ",
      import_price: 8000,
      sale_price: 12000,
      stock_quantity: 15,
      status: "active",
      create_at: "2025-12-01",
      category: "Bánh > Bánh quy",
      img: "/images/banhscl.jpg",
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
      // cập nhật sản phẩm theo product_id
      setProducts((prev) =>
        prev.map((p) => (p.product_id === product.product_id ? { ...p, ...product } : p))
      );
      setModalOpen(false);
      setExpandedId(product.product_id);
      setEditProduct(null);
    } else {
      // tạo mới (nếu product_id trùng -> thêm hậu tố)
      let pid = product.product_id;
      if (products.find((p) => p.product_id === pid)) {
        pid = pid + "-" + Date.now().toString().slice(-4);
        product.product_id = pid;
      }
      // keep any missing optional fields with defaults
      const toAdd = {
        product_id: String(product.product_id),
        barcode_id: product.barcode_id || "",
        name: product.name || "",
        description: product.description || "",
        import_price: Number(product.import_price) || 0,
        sale_price: Number(product.sale_price) || 0,
        stock_quantity: Number(product.stock_quantity) || 0,
        status: product.status || "active",
        create_at: product.create_at || new Date().toISOString().slice(0, 10),
        category: product.category || "",
        img: product.img || "", // modal hiện chưa quản lý img nhưng giữ tham số nếu có
      };
      setProducts((prev) => [...prev, toAdd]);
      setModalOpen(false);
      setExpandedId(toAdd.product_id);
    }
  };

  const handleDelete = (product) => {
    if (!window.confirm(`Xóa ${product.name}?`)) return;
    setProducts((p) => p.filter((x) => x.product_id !== product.product_id));
    if (expandedId === product.product_id) setExpandedId(null);
  };

  return (
    <div className="kv-app">
      {/* header simplified */}
      <header className="kv-topbar">
        <div className="kv-top-left">
          <div className="kv-brand">
            <img style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }} src="../public/images/logo.png" alt="" />
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

            <div className="kv-top-right">
          <button className="kv-btn kv-pill kv-primary">Bán hàng</button>
        </div>
          </nav>
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
                  <th>Product ID</th>
                  <th>Tên hàng</th>
                  <th>Sale price</th>
                  <th>Import price</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {products.map((r) => (
                  <React.Fragment key={r.product_id}>
                    <tr
                      className={"kv-row " + (expandedId === r.product_id ? "expanded" : "")}
                      onClick={() => toggleRow(r.product_id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td>
                        <img
                          src={r.img || "/images/placeholder.png"}
                          alt=""
                          style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }}
                        />
                      </td>
                      <td>{r.product_id}</td>
                      <td>{r.name}</td>
                      <td>{r.sale_price}</td>
                      <td>{r.import_price}</td>
                      <td>{r.stock_quantity}</td>
                      <td>{r.status}</td>
                      <td>{r.create_at}</td>
                    </tr>

                    {expandedId === r.product_id && (
                      <tr className="kv-detail-row">
                        <td colSpan={11}>
                          {/* ProductDetail component vẫn nhận product; nếu nó kỳ vọng các trường cũ,
                              hãy cập nhật ProductDetail hoặc ProductDetail có thể đọc các trường mới.
                              Bạn cũng có thể tạo bản chuyển đổi (compatibility) ở đây nếu cần). */}
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
        key={editProduct ? editProduct.product_id : "new"}
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
