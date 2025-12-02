// ProductDetail.jsx
import React from "react";
import "./ShopDashboard.css"; // dùng chung CSS (hoặc tạo file CSS riêng nếu muốn)




export default function ProductDetail({ product, onEdit, onDelete }) {





  if (!product) return null;

  const formatCurrency = (v) => {
    if (v == null || isNaN(Number(v))) return "0";
    return Number(v).toLocaleString();
  };



  return (
    <div className="kv-detail-card" onClick={(e) => e.stopPropagation()}>
      <div className="kv-detail-left">
        <img
          src={product.urlImage || "/images/product-placeholder.png"}
          alt={product.name}
          style={{ width: 120, height: 120, borderRadius: 8, objectFit: "cover" }}
        />
      </div>

      <div className="kv-detail-right">
        <h3 style={{ margin: 0 }}>{product.name}</h3>
        <p className="muted" style={{ marginTop: 6 }}>
          {product.description || "Không có mô tả"}
        </p>

        <div className="kv-detail-grid" style={{ marginTop: 12 }}>
          <div>
            <div className="label">Product ID</div>
            <div className="value">{product.id || "—"}</div>
          </div>

          <div>
            <div className="label">Barcode</div>
            <div className="value">{product.barcode || "—"}</div>
            <></>
          </div>

          <div>
            <div className="label">Tồn kho</div>
            <div className="value">{product.quantity ?? 0}</div>
          </div>

          <div>
            <div className="label">Sale price</div>
            <div className="value">{formatCurrency(product.price)}</div>
          </div>

          <div>
            <div className="label">Import price</div>
            <div className="value">{formatCurrency(product.importPrice)}</div>
          </div>

          <div>
            <div className="label">Trạng thái</div>
            <div className="value">{product.status || "inactive"}</div>
          </div>

          <div>
            <div className="label">Ngày tạo</div>
            <div className="value">{product.createAt || "—"}</div>
          </div>

          <div>
            <div className="label">Danh mục</div>
            <div className="value">{product.category || "Chưa phân loại"}</div>
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
