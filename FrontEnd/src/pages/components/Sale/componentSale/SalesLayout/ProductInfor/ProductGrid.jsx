import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import "../SalesLayout.css";

const COLS = 3;
const ROWS = 5;
const PAGE_SIZE = COLS * ROWS;

export default function ProductGrid({ onAddProduct , onCheckout }) {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  /* ================= LOAD DATA (BASE64) ================= */
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

        const productsWithImages = await Promise.all(
          data.map(async (p) => {
            try {
              const imgRes = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/products/${p.id}/image`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              return {
                ...p,
                urlImage: `data:image/jpeg;base64,${imgRes.data.result}`,
              };
            } catch {
              return {
                ...p,
                urlImage: "/images/product-placeholder.png",
              };
            }
          })
        );

        setProducts(productsWithImages);
        setPage(1);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải sản phẩm");
      }
    };

    loadProducts();
  }, []);

  /* ================= PHÂN TRANG ================= */
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageProducts = products.slice(startIndex, endIndex);

  /* ================= CLICK SẢN PHẨM ================= */


  /* ================= RENDER ================= */
  return (
    <div
      className="product-wrapper"
      onClick={() => setSelectedId(null)}
    >
      {/* ===== GRID ===== */}
      <div className="product-grid">
        {pageProducts.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            isActive={item.id === selectedId}
            onClick={() => {
              onAddProduct(item);
            }}
          />
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="product-footer">
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ◀
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            ▶
          </button>
        </div>

        <button className="btn-pay" onClick={onCheckout}>
          THANH TOÁN
        </button>
      </div>
    </div>
  );
}
