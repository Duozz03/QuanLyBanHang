import { FaSearch } from "react-icons/fa";
import "./SalesLayout.css";

export default function SearchCustomerInput() {
  return (
    <div className="search-produce-input m-2">
      <FaSearch size={18} className="m-2"/>
      <input
      
        type="text"
        name="id"
        placeholder="Tìm khách hành"
        style={{ border: "none", outline: "none", width: 700}}
      />
    </div>
  );
}