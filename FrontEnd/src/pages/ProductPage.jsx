import React, { useState, useEffect } from "react";
import CreateProductModal from "./CreateProductModal";


export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  <CreateProductModal
  open={modalOpen}
  onClose={() => { setModalOpen(false); setEditingProduct(null); }}
  onSave={handleSave}
  onSendField={(productId) => {
    alert("Modal gửi product_id: " + productId);
    // nếu muốn, bạn có thể gửi productId riêng lẻ tới một endpoint khác ở đây
    // fetch("/api/some-endpoint", { method: "POST", body: JSON.stringify({ id: productId }) })
  }}
  initialProduct={editingProduct}
/>

  const token = localStorage.getItem("token");

  // Load danh sách sản phẩm
  useEffect(() => {
    fetch("http://localhost:8080/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error(err));
  }, []);

  // Lưu sản phẩm (tạo mới hoặc sửa)
  // ProductPage.jsx (chỉ phần handleSave)
// ProductPage.jsx - handleSave (thay thế phần cũ)
const handleSave = async (product, isEdit) => {
  console.log("ProductPage.handleSave nhận:", product, isEdit);

  const url = isEdit
    ? `http://localhost:8080/api/products/${encodeURIComponent(product.product_id)}`
    : "http://localhost:8080/api/products";

  const method = isEdit ? "PUT" : "POST";
  const token = localStorage.getItem("token"); // nếu cần auth

  try {
    console.log("Sẽ gửi request:", method, url);
    console.log("Body JSON:", JSON.stringify(product));

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        // nếu backend yêu cầu token:
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(product),
    });

    console.log("Fetch trả về status:", res.status);

    // Nếu response không phải JSON, dùng res.text() để debug
    const text = await res.text();
    console.log("Response text:", text);

    if (!res.ok) {
      // show backend error nếu có
let serverMsg = text;
try {
  serverMsg = JSON.parse(text);
} catch (parseErr) {
  console.warn("Không parse được JSON response từ server:", parseErr);
  console.warn("Raw response:", text);
  // keep serverMsg as raw text so we can display it
}
const message = (serverMsg && serverMsg.message) ? serverMsg.message : (typeof serverMsg === "string" ? serverMsg : `Server returned ${res.status}`);
throw new Error(message);

    }

    const saved = JSON.parse(text); // response json parsed
    console.log("Sản phẩm đã lưu:", saved);
    alert("Lưu thành công: " + (saved.product_id || saved.name || "OK"));

    // cập nhật UI
    if (isEdit) {
      setProducts(prev => prev.map(p => p.product_id === saved.product_id ? saved : p));
    } else {
      setProducts(prev => [saved, ...prev]);
    }

    setModalOpen(false);
    setEditingProduct(null);
  } catch (err) {
    console.error("Lỗi khi gửi tới backend:", err);
    alert("Lưu thất bại: " + err.message);
  }
};



  return (
    <div>
      <button onClick={() => setModalOpen(true)}>➕ Thêm hàng hóa</button>

      {/* GỌI MODAL Ở ĐÂY */}
      <CreateProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        initialProduct={editingProduct}
      />

      {/* DANH SÁCH SẢN PHẨM */}
      <h3>Danh sách sản phẩm</h3>
      {products.map((p) => (
        <div key={p.product_id} style={{ marginBottom: 8 }}>
          <strong>{p.name}</strong> — Giá: {p.sale_price}
          <button
            style={{ marginLeft: 10 }}
            onClick={() => {
              setEditingProduct(p);
              setModalOpen(true);
            }}
          >
            ✏️ Sửa
          </button>
        </div>
      ))}
    </div>
  );
}
