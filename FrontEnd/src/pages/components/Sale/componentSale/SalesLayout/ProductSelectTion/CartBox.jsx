import "../SalesLayout.css";

export default function CartBox({ cartItems, onIncrease, onDecrease }) {


  if (!cartItems || cartItems.length === 0) {
    return <div className="cart-empty">Chưa có sản phẩm</div>;
  }

  return (
    <div className="cart-list">
      {cartItems.map((item, index) => (
        <div
          className="cart-row"
          key={item.productId}   // ✅ key duy nhất
        >
          {/* STT */}
          <div className="cart-col index">{index + 1}</div>

          {/* TÊN + MÃ */}
          <div className="cart-col info">
            <div className="name">{item.name}</div>
            <div className="code">#{item.productId}</div>
          </div>

          {/* SỐ LƯỢNG */}
          <div className="cart-col qty">
            <button onClick={() => onDecrease(item.productId)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => onIncrease(item.productId)}>+</button>
          </div>

          {/* GIÁ */}
          <div className="cart-col price">
           {(item.price * item.quantity).toLocaleString()}

          </div>

          {/* ACTION */}
          <div className="cart-col action">⋮</div>
        </div>
      ))}
    </div>
  );
}
