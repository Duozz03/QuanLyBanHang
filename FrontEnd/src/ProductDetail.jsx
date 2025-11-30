// ProductDetail.jsx
import React from "react";
import "./ShopDashboard.css"; // dùng chung CSS (hoặc tạo file CSS riêng nếu muốn)

export default function ProductDetail({ product, onEdit, onDelete }) {
  // product: { id, sku, name, price, img, group, ... }
  if (!product) return null;

  return (
    <div className="kv-detail-card" onClick={(e) => e.stopPropagation()}>
      <div className="kv-detail-left">
        <img
          src={product.img || "/images/product-placeholder.png"}
          alt={product.name}
          style={{ width: 120, height: 120, borderRadius: 8, objectFit: "cover" }}
        />
      </div>

      <div className="kv-detail-right">
        <h3 style={{ margin: 0 }}>{product.name}</h3>
        <p className="muted" style={{ marginTop: 6 }}>
          Nhóm hàng: {product.group || "Chưa phân loại"}
        </p>

        <div className="kv-detail-grid" style={{ marginTop: 12 }}>
          <div>
            <div className="label">Mã hàng</div>
            <div className="value">{product.sku || product.id}</div>
          </div>

          <div>
            <div className="label">Tồn kho</div>
            <div className="value">{product.stock ?? 0}</div>
          </div>

          <div>
            <div className="label">Giá bán</div>
            <div className="value">{product.price ?? 0}</div>
          </div>

          <div>
            <div className="label">Thương hiệu</div>
            <div className="value">{product.brand || "Chưa có"}</div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <button
            className="kv-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(product);
            }}
          >
            Chỉnh sửa
          </button>

          <button
            className="kv-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(product);
            }}
            style={{ marginLeft: 8 }}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
