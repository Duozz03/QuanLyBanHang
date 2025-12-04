// CreateProductModal.jsx
import React, { useState } from "react";
import axios from "axios";
import "./ShopDashboard.css";

export default function CreateProductModal({
  open,
  onClose,
  onSave,
  initialProduct = null,
}) {
  // init form once from initialProduct (no effect on later updates)

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
    status: initialProduct?.status || "ACTIVE", // "active" or "inactive"
    createAt: initialProduct?.createAt
      ? // normalize to yyyy-mm-dd for date input if possible
        initialProduct.createAt.length >= 10
        ? initialProduct.createAt.slice(0, 10)
        : initialProduct.createAt
      : new Date().toISOString().slice(0, 10),
    category: initialProduct?.category || "",
  }));

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(form.urlImage || null);

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
      createAt: form.create_at,
      category: form.category.trim(),
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
    }

    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      let res;
      if (isEdit) {
        // PUT để chỉnh sửa
        res = await axios.put(url, formData, {
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
    <div className="kv-modal-backdrop" onClick={onClose}>
      <div className="kv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kv-modal-header">
          <h3>{initialProduct ? "Chỉnh sửa hàng hóa" : "Tạo hàng hóa"}</h3>
          <button className="kv-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="kv-modal-body" method="post" onSubmit={handleSave}>
          <div className="kv-form-row">
            <label>Product ID</label>
            <input
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              disabled={!!initialProduct}
            />
          </div>

          <div className="kv-form-row">
            <label>Barcode ID</label>
            <input
              name="barcode"
              value={form.barcode_id}
              onChange={handleChange}
            />
          </div>

          <div className="kv-form-row">
            <label>Hình ảnh</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {previewUrl && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={previewUrl}
                  alt="preview"
                  style={{
                    width: 150,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            )}
          </div>
          <div className="kv-form-row">
            <label>Tên hàng</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="kv-form-row">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="kv-form-row" style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Import price</label>
              <input
                name="importPrice"
                value={form.import_price}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Sale price</label>
              <input
                name="price"
                value={form.sale_price}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="kv-form-row" style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Stock quantity</label>
              <input
                name="quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                type="number"
                step="1"
                min="0"
                placeholder="0"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="kv-form-row" style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>Create at</label>
              <input
                name="createAt"
                value={form.create_at}
                onChange={handleChange}
                type="date"
              />
            </div>
          </div>

          <div className="kv-modal-actions">
            <button type="button" className="kv-btn" onClick={onClose}>
              Bỏ qua
            </button>
            <button type="submit" className="kv-btn kv-primary">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
