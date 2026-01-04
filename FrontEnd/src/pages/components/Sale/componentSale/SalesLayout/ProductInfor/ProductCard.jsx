import "../SalesLayout.css";


export default function ProductCard({ product, isActive, onClick }) {
  return (
    <div
      className={`product-card ${isActive ? "active" : ""}`}
      onClick={() => {
        onClick();
      }}
    >
      <img src={product.urlImage} alt={product.name} />
      <div className="product-name">{product.name}</div>
      <div className="product-qty">{product.quantity}</div>
    </div>
  );
}
