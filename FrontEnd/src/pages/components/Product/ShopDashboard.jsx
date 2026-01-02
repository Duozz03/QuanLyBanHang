// ShopDashboard.jsx
import React, { useEffect, useState } from "react";
import "./ShopDashboard.css"; // giữ file CSS tuỳ chỉnh
import ProductDetail from "./ProductDetail";
import CreateProductModal from "./CreateProductModal";
import axios from "axios";

export default function ShopDashboard() {
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);

  //search dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // id đã thêm vào bảng tìm kiếm

  useEffect(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      setSearchResults([]);
      return;
    }

    const results = products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(keyword) ||
          p.barcode?.toString().includes(keyword)
      )
      .slice(0, 8); // giới hạn 8 dòng giống KiotViet

    setSearchResults(results);
  }, [searchTerm, products]);

  const handleSelectProduct = (product) => {
    if (selectedIds.includes(product.id)) return; // 🚫 không thêm trùng

    setSelectedIds((prev) => [...prev, product.id]);

    setSearchTerm("");
    setSearchResults([]);
  };
  const removeSelected = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  //Phân trang
  const [currentPage, setCurrentPage] = useState(1); // reset về trang ban đầu
  const [pageSize, setPageSize] = useState(10); // số sản phẩm / trang

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

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
    if (!product) return;

    // Chuẩn hoá dữ liệu đầu vào từ backend
    const normalized = {
      ...product,
      id: String(product.id),
      barcode: product.barcode ?? "",
      name: product.name ?? "",
      description: product.description ?? "",
      importPrice: Number(product.importPrice) || 0,
      price: Number(product.price) || 0,
      quantity: Number(product.quantity) || 0,
      status: product.status || "ACTIVE",
      categoryId: product.categoryId || "",
      // FIX: Date object không slice được
      createdAt: product.createdAt || new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      // ảnh: nếu backend chưa trả urlImage thì dùng placeholder
      urlImage: product.urlImage || "/images/product-placeholder.png",
    };

    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) =>
          String(p.id) === String(normalized.id)
            ? {
                ...p,
                ...normalized,
                // nếu backend không trả urlImage, giữ urlImage cũ
                urlImage: normalized.urlImage || p.urlImage,
              }
            : p
        )
      );

      setModalOpen(false);
      setExpandedId(normalized.id);
      setEditProduct(null);
      return;
    }

    // CREATE
    setProducts((prev) => {
      // tránh trùng id (hiếm khi xảy ra nếu backend sinh id chuẩn)
      const exists = prev.some((p) => String(p.id) === String(normalized.id));
      const finalProduct = exists
        ? { ...normalized, id: `${normalized.id}-${Date.now()}` }
        : normalized;

      return [...prev, finalProduct];
    });

    setModalOpen(false);
    setExpandedId(normalized.id);
  };

  const handleDelete = async (product) => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      // gọi API xóa trên backend bằng axios
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/products/${product.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // cập nhật lại state frontend
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
  };
  const displayProducts =
    selectedIds.length === 0
      ? products // 👉 chưa chọn gì → hiện tất cả
      : products.filter((p) => selectedIds.includes(p.id));

  const paginatedProducts = displayProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(displayProducts.length / pageSize);

  return (
    <div className="kv-app">
      {/* main: use bootstrap container + kv-main grid fallback */}
      <div className="container-fluid">
        <div className="row bm-3" style={{ margin: "0px 100px 0px 100px" }}>
          <h5 className="col-3 kv-heading-page">
            <span>Hàng Hóa</span>
          </h5>

          {/* main table */}
          <div className="col-9 d-flex align-items-center justify-content-between kv-content-head">
            <div className="chip-search-wrapper">
              {selectedIds.map((id) => {
                const p = products.find((x) => x.id === id);
                if (!p) return null;

                return (
                  <span key={id} className="chip">
                    {p.barcode}
                    <button onClick={() => removeSelected(id)}>×</button>
                  </span>
                );
              })}

              <input
                className="chip-input"
                placeholder="Tìm theo mã, tên hàng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      className="search-item"
                      onClick={() => handleSelectProduct(p)}
                    >
                      <img src={p.urlImage} alt="" />
                      <div>
                        <strong>{p.name}</strong>
                        <div className="kv-muted">{p.barcode}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <button className="kv-btn ml-5" onClick={openCreate}>
                + Tạo mới
              </button>
              <button className="kv-btn">Import file</button>
              <button className="kv-btn">Xuất file</button>
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
                    {paginatedProducts.map((r) => (
                      <React.Fragment key={r.id}>
                        <tr
                          className={
                            "kv-row" + (expandedId === r.id ? "expanded" : "")
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
                          <td>
                            {r.status === "ACTIVE"
                              ? "Kinh Doanh"
                              : "Ngừng Kinh Doanh"}
                          </td>
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
              <div className="pagination-bar">
                <div className="left">
                  <span>Hiển thị</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  <span>dòng</span>
                </div>

                <div className="center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    ⏮
                  </button>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    ◀
                  </button>

                  <span className="page-number">{currentPage}</span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    ▶
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    ⏭
                  </button>
                </div>

                <div className="right">
                  {`${(currentPage - 1) * pageSize + 1}
      - ${Math.min(currentPage * pageSize, 10)}
      trong ${10} hàng hóa`}
                </div>
              </div>
            </div>
          </div>
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
