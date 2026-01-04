import axios from "axios";
import { useState } from "react";
import ProductGrid from "./SalesLayout/ProductInfor/ProductGrid";
import SearchCustomerInput from "./SalesLayout/SearchCustomerInput";
import "./SalesLayout/SalesLayout.css";
import CartBox from "./SalesLayout/ProductSelectTion/CartBox";
import { toast } from "react-toastify";

export default function SalesLayout() {

  /* =========================
      STATE HÓA ĐƠN (TỐI GIẢN)
  ========================= */
  const [invoices, setInvoices] = useState([
    {
      id: null,
      items: [],
      discount: 0
    }
  ]);

  const activeInvoice = invoices[0];

  /* =========================
      TÍNH TỔNG TIỀN
  ========================= */
  const calculateTotalPrice = () => {
    if (!activeInvoice || activeInvoice.items.length === 0) {
      return 0;
    }

    return activeInvoice.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  /* =========================
      ADD PRODUCT  ✅ SỬA Ở ĐÂY
  ========================= */
  const addProductToInvoice = (product) => {
    setInvoices(prev =>
      prev.map((invoice, index) => {
        if (index !== 0) return invoice;

        const existed = invoice.items.find(
          i => i.productId === product.id
        );

        let newItems;

        if (existed) {
          newItems = invoice.items.map(i =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          newItems = [
            ...invoice.items,
            {
              productId: product.id,
              name: product.name,              // 👈 THÊM TÊN
              quantity: 1,
              price: Number(product.price)     // 👈 GIỮ ĐỂ TÍNH TIỀN
            }
          ];
        }

        return {
          ...invoice,
          items: newItems
        };
      })
    );
  };

  /* =========================
      INCREASE / DECREASE
  ========================= */
  const increaseQty = (productId) => {
    setInvoices(prev =>
      prev.map((invoice, index) => {
        if (index !== 0) return invoice;

        return {
          ...invoice,
          items: invoice.items.map(i =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      })
    );
  };

  const decreaseQty = (productId) => {
    setInvoices(prev =>
      prev.map((invoice, index) => {
        if (index !== 0) return invoice;

        return {
          ...invoice,
          items: invoice.items
            .map(i =>
              i.productId === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter(i => i.quantity > 0)
        };
      })
    );
  };

  /* =========================
      CHECKOUT (ĐÚNG DTO BE)
  ========================= */
  const handleCheckout = async () => {
    if (!activeInvoice || activeInvoice.items.length === 0) {
      alert("Chưa có sản phẩm để thanh toán");
      return;
    }

    const payload = {
      discount: activeInvoice.discount,
      details: activeInvoice.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    };

    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/invoices`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success("Thanh toán thành công");

      // 🔄 reset hóa đơn
      setInvoices([
        {
          id: null,
          items: [],
          discount: 0
        }
      ]);

    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại");
    }
  };

  /* =========================
      UI
  ========================= */
  return (
    <div className="sales-layout">
      {/* ===== LEFT ===== */}
      <div className="sales-left">
        <div className="box cart-box">
          <CartBox
            cartItems={activeInvoice.items}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
          />
        </div>

        <div className="box cart-summary-box">
          Tổng tiền: {calculateTotalPrice().toLocaleString()}
        </div>
      </div>

      {/* ===== RIGHT ===== */}
      <div className="sales-right">
        <div className="box product-box">
          <SearchCustomerInput />
          <ProductGrid
            onAddProduct={addProductToInvoice}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
