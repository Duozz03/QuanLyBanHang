// CreateProductModal.jsx
import React, { useState } from "react";
import "./ShopDashboard.css";

export default function CreateProductModal({ open, onClose, onSave, initialProduct = null }) {
  // init form once from initialProduct (no effect on later updates)
  const [form, setForm] = useState(() => ({
    product_id: initialProduct?.product_id || "",
    barcode_id: initialProduct?.barcode_id || "",
    name: initialProduct?.name || "",
    description: initialProduct?.description || "",
    import_price: initialProduct?.import_price != null ? String(initialProduct.import_price) : "",
    sale_price: initialProduct?.sale_price != null ? String(initialProduct.sale_price) : "",
    stock_quantity: initialProduct?.stock_quantity != null ? String(initialProduct.stock_quantity) : "",
    status: initialProduct?.status || "active", // "active" or "inactive"
    create_at:
      initialProduct?.create_at
        ? // normalize to yyyy-mm-dd for date input if possible
          (initialProduct.create_at.length >= 10 ? initialProduct.create_at.slice(0, 10) : initialProduct.create_at)
        : new Date().toISOString().slice(0, 10),
    category: initialProduct?.category || "",
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  if (!open) return null;

  const handleSave = (e) => {
    e.preventDefault();

    // Basic validations
    if (!form.product_id.trim() || !form.name.trim()) {
      alert("Vui lòng nhập Product ID và Tên sản phẩm.");
      return;
    }

    const importPriceNum = Number(form.import_price);
    const salePriceNum = Number(form.sale_price);
    const stockNum = parseInt(form.stock_quantity === "" ? "0" : form.stock_quantity, 10);

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

    // Build product object with appropriate types
    const product = {
      product_id: String(form.product_id).trim(),
      barcode_id: String(form.barcode_id).trim(),
      name: String(form.name).trim(),
      description: String(form.description || "").trim(),
      import_price: importPriceNum,
      sale_price: salePriceNum,
      stock_quantity: stockNum,
      status: String(form.status || "active"),
      // store create_at as ISO date string (yyyy-mm-dd). If want full timestamp, parent can transform.
      create_at: String(form.create_at),
      category: String(form.category || "").trim(),
    };

    const isEdit = !!initialProduct;
    onSave(product, isEdit);
  };

  return (
    <div className="kv-modal-backdrop" onClick={onClose}>
      <div className="kv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kv-modal-header">
          <h3>{initialProduct ? "Chỉnh sửa hàng hóa" : "Tạo hàng hóa"}</h3>
          <button className="kv-close" onClick={onClose}>✕</button>
        </div>

        <form className="kv-modal-body" onSubmit={handleSave}>
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
            <input name="barcode_id" value={form.barcode_id} onChange={handleChange} />
          </div>

          <div className="kv-form-row">
            <label>Tên hàng</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="kv-form-row">
            <label>Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
          </div>

          <div className="kv-form-row" style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Import price</label>
              <input
                name="import_price"
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
                name="sale_price"
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
                name="stock_quantity"
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
              <input name="category" value={form.category} onChange={handleChange} />
            </div>
          </div>

          <div className="kv-form-row" style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>Create at</label>
              <input name="create_at" value={form.create_at} onChange={handleChange} type="date" />
            </div>
          </div>

          <div className="kv-modal-actions">
            <button type="button" className="kv-btn" onClick={onClose}>Bỏ qua</button>
            <button type="submit" className="kv-btn kv-primary">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
