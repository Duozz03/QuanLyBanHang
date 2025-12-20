// CreateProductModal.jsx
import React, { useState } from "react";
import axios from "axios";
import "./CreateProductModal.css";
import "./ShopDashboard.jsx";
import CreateCategoryModal from "../Category/CreateCategory";

export default function CreateProductModal({
  open,
  onClose,
  onSave,
  initialProduct = null,
}) {
  // init form once from initialProduct (no effect on later updates)

  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [form, setForm] = useState(() => ({
    barcode: initialProduct?.barcode || "",
    name: initialProduct?.name || "",
    urlImage: initialProduct?.urlImage || "",
    description: initialProduct?.description || "",
    importPrice:
      initialProduct?.importPrice != null
        ? String(initialProduct.importPrice)
        : "",
    price: initialProduct?.price != null ? String(initialProduct.price) : "",
    quantity:
      initialProduct?.quantity != null ? String(initialProduct.quantity) : "",
    status: initialProduct?.status || "0", // "active" or "inactive",
    category: initialProduct?.category || "",
  }));

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(form.urlImage || null);
  //
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  if (!open) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("handleSave chạy — form:", form);

    const importPriceNum = Number(form.importPrice);
    const salePriceNum = Number(form.price);
    const stockNum = parseInt(form.quantity === "" ? "0" : form.quantity, 10);

    if (isNaN(importPriceNum) || importPriceNum < 0) {
      alert("Import price phải là số >= 0.");
      return;
    }
    if (isNaN(salePriceNum) || salePriceNum < 0) {
      alert("Sale price phải là số >= 0.");
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      alert("Stock quantity phải là số nguyên >= 0.");
      return;
    }

    

    // Build product object
    const product = {
      barcode: form.barcode.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      importPrice: importPriceNum,
      price: salePriceNum,
      quantity: stockNum,
      status: form.status,
      category: form.category,
    };

    const isEdit = !!initialProduct;
    const url = "http://localhost:8080/products";

    // Tạo FormData chứa cả product JSON và file ảnh
    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );
    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      formData.append(
        "image",
        new Blob([], { type: "application/octet-stream" })
      );
    }

    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      let res;
      if (isEdit) {
        // PUT để chỉnh sửa
        const productId = initialProduct.id;
        res = await axios.put(`${url}/${productId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // POST để tạo mới
        res = await axios.post(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      console.log("Kết quả từ backend:", res.data);
      if (typeof onSave === "function") onSave(res.data, isEdit);
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu:", err);
      alert("Gửi dữ liệu thất bại: " + err.message);
    }
    window.location.reload();
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    


    // tạo preview
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  return (
    <>
    <div className="modal-backdrop custom-backdrop" onClick={onClose}>
      <div
        className="modal d-block"
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-xl mt-5 ">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header align-items-start">
              <div>
                <h5 className="modal-title">
                  {initialProduct ? "Chỉnh sửa hàng hóa" : "Tạo hàng hóa"}
                </h5>
                
              </div>

              <div className="ms-auto">
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                ></button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-0 ">
              <ul className="nav nav-tabs custom-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    data-bs-toggle="tab"
                    type="button"
                    role="tab"
                  >
                    Thông tin
                  </button>
                </li>
              </ul>
            </div>

            {/* Body */}
            <form onSubmit={handleSave}>
              <div className="modal-body py-3 px-4">
                <div className="row gx-4">
                  {/* Left: form fields */}
                  <div className="col-lg-8">
                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label">Tên hàng</label>
                        <input
                          className="form-control"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Tên hàng (bắt buộc)"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Mã vạch</label>
                        <input
                          className="form-control"
                          name="barcode"
                          value={form.barcode_id}
                          onChange={handleChange}
                          placeholder="Nhập mã vạch"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">
                          Nhóm hàng / Thương hiệu
                        </label>
                        <div className="d-flex gap-2">
                          <select
                            className="form-select flex-grow-1"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                          >
                            <option value="">Chọn nhóm hàng (Bắt buộc)</option>
                            {/* bạn có thể map options ở đây */}
                          </select>
                          
                          <button type="button" className="btn btn-link small"  onClick={() => setOpenCreateCategory(true)} >
                            Tạo mới
                          </button>
                        </div>
                      </div>

                      {/* Card section: Giá vốn, Giá bán */}
                      <div className="col-12">
                        <div className="card section-card">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <strong>Giá vốn, giá bán</strong>
                            <button
                              type="button"
                              className="btn btn-sm btn-link"
                            >
                              Thiết lập giá
                            </button>
                          </div>
                          <div className="card-body">
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label">Giá vốn</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="importPrice"
                                  value={form.importPrice}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Giá bán</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="price"
                                  value={form.price}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card section: Tồn kho */}
                      <div className="col-12">
                        <div className="card section-card">
                          <div className="card-header">
                            <strong>Tồn kho</strong>
                          </div>
                          <div className="card-body">
                            <div className="row g-3">
                              <div className="col-md-4">
                                <label className="form-label">Tồn kho</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="quantity"
                                  value={form.quantity}
                                  onChange={handleChange}
                                />
                              </div>
                              {/* <div className="col-md-4">
                            <label className="form-label">Định mức thấp nhất</label>
                            <input type="number" className="form-control" name="minStock" value={form.minStock || ""} onChange={handleChange} />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Định mức cao nhất</label>
                            <input type="number" className="form-control" name="maxStock" value={form.maxStock || ""} onChange={handleChange} />
                          </div> */}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mô tả (tab second could show more) */}
                      <div className="col-12">
                        <label className="form-label">Mô tả</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Right: image uploader + status/createAt */}
                  <div className="col-lg-4">
                    <div className="image-uploader">
                      <div className="img-box d-flex align-items-center justify-content-center">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="preview"
                            className="img-fluid"
                          />
                        ) : (
                          <div className="text-center text-muted">
                            <div className="mb-2">Thêm ảnh</div>
                            <small>Mỗi ảnh không quá 2 MB</small>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 d-grid">
                        <input
                          id="fileInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="fileInput"
                          className="btn btn-outline-secondary"
                        >
                          Chọn ảnh
                        </label>
                      </div>

                      <div className="mt-4">
                        <label className="form-label">Trạng thái</label>
                        <select
                          className="form-select"
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                        >
                          <option value="ACTIVE">Kinh Doanh</option>
                          <option value="INACTIVE">Ngừng Kinh Doanh</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer d-flex justify-content-between px-4">
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={onClose}
                  >
                    Bỏ qua
                  </button>
                </div>

                <div>
                  <button type="submit" className="btn btn-primary">
                    Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    {/* ===== MODAL CON: THÊM NHÓM HÀNG ===== */}
    <CreateCategoryModal
      open={openCreateCategory}
      onClose={() => setOpenCreateCategory(false)}
      onSave={(category) => {
        console.log("Category mới:", category);
        // TODO: gọi API POST /categories
        // TODO: load lại danh sách category cho select
      }}
    />
    </>
  );
}
