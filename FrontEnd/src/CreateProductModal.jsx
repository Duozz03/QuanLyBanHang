// CreateProductModal.jsx
import React, { useState, useRef } from "react";
import "./ShopDashboard.css";

export default function CreateProductModal({ open, onClose, onSave, initialProduct = null }) {
  const fileRef = useRef();

  // init form once from initialProduct (no effect)
  const [form, setForm] = useState(() => ({
    sku: initialProduct?.sku || "",
    name: initialProduct?.name || "",
    price: initialProduct?.price ?? "",
    imgFile: null,
    imgUrl: initialProduct?.img || "",
    group: initialProduct?.group || "",
    stock: initialProduct?.stock ?? "",
    brand: initialProduct?.brand || "",
  }));

  // If component is remounted each time parent passes new key, this init runs fresh.
  // handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setForm((p) => ({ ...p, imgFile: f, imgUrl: url }));
  };

  if (!open) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.sku.trim() || !form.name.trim()) {
      alert("Vui lòng nhập Mã hàng và Tên hàng.");
      return;
    }
    const product = {
      id: form.sku,
      sku: form.sku,
      name: form.name,
      price: Number(form.price) || 0,
      img: form.imgUrl || "",
      group: form.group || "",
      stock: Number(form.stock) || 0,
      brand: form.brand || "",
      giaban: Number(form.price) || 0,
      thoigiantao: initialProduct?.thoigiantao || new Date().toLocaleDateString(),
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
            <label>Mã hàng (sku)</label>
            <input name="sku" value={form.sku} onChange={handleChange} disabled={!!initialProduct} />
          </div>

          <div className="kv-form-row">
            <label>Tên hàng</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="kv-form-row" style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Giá bán</label>
              <input name="price" value={form.price} onChange={handleChange} type="number" />
            </div>
            <div style={{ flex: 1 }}>
              <label>Tồn kho</label>
              <input name="stock" value={form.stock} onChange={handleChange} type="number" />
            </div>
          </div>

          <div className="kv-form-row">
            <label>Nhóm hàng</label>
            <input name="group" value={form.group} onChange={handleChange} />
          </div>

          <div className="kv-form-row">
            <label>Thương hiệu</label>
            <input name="brand" value={form.brand} onChange={handleChange} />
          </div>

          <div className="kv-form-row">
            <label>Ảnh (Upload hoặc URL)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
              <input value={form.imgUrl} onChange={(e)=> setForm(p=>({...p, imgUrl: e.target.value}))} placeholder="Hoặc dán URL" />
            </div>
          </div>

          {form.imgUrl && <img src={form.imgUrl} alt="preview" style={{ width: 120 }} />}

          <div className="kv-modal-actions">
            <button type="button" className="kv-btn" onClick={onClose}>Bỏ qua</button>
            <button type="submit" className="kv-btn kv-primary">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
