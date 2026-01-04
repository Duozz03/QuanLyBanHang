import { FaSearch } from "react-icons/fa";
import "./HeaderBar.css";

export default function SearchProductInput() {
  return (
    <div className="search-produce-input bg-white m-2">
      <FaSearch size={18} className="m-2"/>
      <input
        className="bg-white"
        type="text"
        name="id"
        placeholder="Tìm hàng hoá"
        style={{ border: "none", outline: "none", width: 505}}
      />
    </div>
  );
}