// ShopDashboard.jsx
import React, { useEffect, useState } from "react";
import "./ShopDashboard.css";
import ProductDetail from "./ProductDetail";
import CreateProductModal from "./CreateProductModal";
import axios from "axios";

export default function ShopDashboard() {


  const [active, setActive] = useState("hanghoa");
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // sản phẩm đang chỉnh sửa (null = tạo mới)

        // const { data, loading, error } = useProducts();
  
    

  // initial demo products (theo cấu trúc mới)
  const [products, setProducts] = useState([]);

  useEffect(() => {

    const loadProducts = async () => {
      try {
        // 1. Lấy danh sách sản phẩm 
        const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

        const data = res.data.result;

        // 2. Load ảnh cho từng sản phẩm
        const urlImage = await Promise.all(
          data.map(async (p) => {
            try {
              const imgRes = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/products/${p.id}/image`,
                              {
                headers: { Authorization: `Bearer ${token}` },
              }

              );

              const base64String = imgRes.data.result;
    
              return { ...p, urlImage: `data:image/jpeg;base64,${base64String}` };
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


// if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error.message}</div>;
//     if (!data || data.length === 0) return <div>Không có sản phẩm</div>;


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
        prev.map((p) => (p.id === product.id ? { ...p, ...product } : p))
      );
      setModalOpen(false);
      setExpandedId(product.id);
      setEditProduct(null);
    } else {
      // tạo mới (nếu product_id trùng -> thêm hậu tố)
      let pid = product.id;
      if (products.find((p) => p.id === pid)) {
        pid = pid + "-" + Date.now().toString().slice(-4);
        product.id = pid;
      }
      // keep any missing optional fields with defaults
      const toAdd = {
        id: String(product.id),
        barcode: product.barcode || "",
        name: product.name || "",
        urlImage: product.urlImage,
        description: product.description || "",
        importPrice: Number(product.importPrice) || 0,
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 0,
        status: product.status || "active",
        createAt: product.createAt || new Date().toISOString().slice(0, 10),
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
      <div className="parent">
           <div className="kv-brand">
                <img style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }} src="../public/images/logo.png" alt="" />
                <div className="kv-brand-text">Deuoz</div>
          </div>
          <div className="kv-option">
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
    <img src="https://flagcdn.com/w20/vn.png" className="kv-flag" />
    <span>Tiếng Việt</span>
  </div>

  <div className="kv-icon-circle">
    <i className="fa-regular fa-bell"></i>
  </div>

  <div className="kv-icon-circle">
    <i className="fa-solid fa-gear"></i>
  </div>

  <div className="kv-avatar">
    <img src="https://i.pravatar.cc/40" />
  </div>

</div>
          </div>
          </div>
          
      <header className="kv-topbar">
      
        <div className="kv-top-left">
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
                  <React.Fragment key={r.id}>
                    <tr
                      className={"kv-row " + (expandedId === r.id ? "expanded" : "")}
                      onClick={() => toggleRow(r.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td>
                        <img
                          src={r.urlImage || "/images/placeholder.png"}
                          alt=""
                          style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }}
                        />
                      </td>
                      <td>{r.id}</td>
                      <td>{r.name}</td>
                      <td>{r.price}</td>
                      <td>{r.importPrice}</td>
                      <td>{r.quantity}</td>
                      <td>{r.status}</td>
                      <td>{r.createAt}</td>
                    </tr>

                    {expandedId === r.id && (
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
