// ShopDashboard.jsx
import React, { useEffect, useState } from "react";
import "./ShopDashboard.css";
import ProductDetail from "./ProductDetail";
import CreateProductModal from "./CreateProductModal";
import axios from "axios";
import { toast } from "react-toastify";

export default function ShopDashboard() {
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);

  // search dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // id đã thêm vào bảng tìm kiếm

  // phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ====== DERIVED (phải đặt trước các useEffect clamp) ======
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const displayProducts =
    selectedIds.length === 0
      ? products
      : products.filter((p) => selectedIds.includes(p.id));

  const totalItems = displayProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedProducts = displayProducts.slice(startIndex, endIndex);

  // ====== EFFECT: search dropdown ======
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
      .slice(0, 8);

    setSearchResults(results);
  }, [searchTerm, products]);

  // ====== EFFECT: load products ======
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

  // ====== EFFECT: clamp currentPage khi filter/xóa làm totalPages giảm ======
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // ====== handlers ======
  const handleSelectProduct = (product) => {
    if (selectedIds.includes(product.id)) return;
    setSelectedIds((prev) => [...prev, product.id]);
    setSearchTerm("");
    setSearchResults([]);
    setCurrentPage(1); // chọn filter -> về trang 1 cho dễ hiểu
  };

  const removeSelected = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    setCurrentPage(1);
  };

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
    const prevProduct = products.find((p) => String(p.id) === String(product.id));
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
      createdAt: product.createdAt || prevProduct?.createdAt || new Date().toISOString().slice(0, 10),
      urlImage: product.urlImage ?? prevProduct?.urlImage ??  "/images/product-placeholder.png",
    };

    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) =>
          String(p.id) === String(normalized.id)
            ? { ...p, ...normalized, urlImage: normalized.urlImage || p.urlImage }
            : p
        )
      );
      setModalOpen(false);
      setExpandedId(normalized.id);
      setEditProduct(null);
      return;
    }

    setProducts((prev) => {
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

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/products/${product.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      if (expandedId === product.id) setExpandedId(null);
      toast.success("Xóa thành công");
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
  };

  // ====== render helpers ======
  const pagingText = (() => {
    if (totalItems === 0) return "0 - 0 trong 0 hàng hóa";
    const from = startIndex + 1;
    const to = Math.min(endIndex, totalItems);
    return `${from} - ${to} trong ${totalItems} hàng hóa`;
  })();

  return (
    <div className="kv-app">
      <div className="container-fluid">
        <div className="row bm-3" style={{ margin: "0px 100px 0px 100px" }}>
          <h5 className="col-3 kv-heading-page">
            <span>Hàng Hóa</span>
          </h5>

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
                            "kv-row" + (expandedId === r.id ? " expanded" : "")
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

                    {totalItems === 0 && (
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
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  ◀
                </button>

                <span className="page-number">{currentPage}</span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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

              <div className="right">{pagingText}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="kv-footer">© 2025 Dauoz — Demo dashboard</div>

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
