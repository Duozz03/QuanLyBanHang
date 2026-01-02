// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import "./ShopDashboard.css"; 
import axios from "axios";



export default function ProductDetail({ product, onEdit, onDelete }) {

  const [idcategory, setIdcategory] = useState("");
 const loadidCategory = async () => {
    try{
      const token = 
      localStorage.getItem("accessToken") ||
       sessionStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/categories/${product.categoryId}`,
         { headers:{ Authorization: `Bearer ${token}` }  } 
      );
        const data = res.data.result || [];
        
      setIdcategory(data);  
    } catch (err){
      console.error(err);
      alert("Lỗi khi tải loại");
    }
  };
useEffect(() => {
  loadidCategory();
}, []);



  if (!product) return null;

  const formatCurrency = (v) => {
    if (v == null || isNaN(Number(v))) return "0";
    return Number(v).toLocaleString();
  };
console.log(product.categoryId);



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
            <div className="label">Mã hàng hóa</div>
            <div className="value">{product.id || "—"}</div>
          </div>

          <div>
            <div className="label">Mã vạch</div>
            <div className="value">{product.barcode || "—"}</div>
            <></>
          </div>

          <div>
            <div className="label">Tồn kho</div>
            <div className="value">{product.quantity ?? 0}</div>
          </div>

          <div>
            <div className="label">Giá bán</div>
            <div className="value">{formatCurrency(product.price)}</div>
          </div>

          <div>
            <div className="label">Giá nhập</div>
            <div className="value">{formatCurrency(product.importPrice)}</div>
          </div>

          <div>
            <div className="label">Trạng thái</div>
            <div className="value">{product.status === "ACTIVE" ? "Kinh doanh": "Ngừng kinh doanh"}</div>
          </div>

          <div>
            <div className="label">Ngày tạo</div>
            <div className="value">{product.createdAt || "-"}</div>
          </div>

          <div>
            <div className="label">Danh mục</div>
            <div className="value">{idcategory.name || "Chưa phân loại" }</div>
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
