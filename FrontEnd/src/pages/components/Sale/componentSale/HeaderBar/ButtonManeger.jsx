import "./HeaderBar.css";
import { useNavigate } from "react-router-dom";

export default function ButtonManeger(){
    const navigate = useNavigate();
    return(
        <div className="OnlyManeger">
        <button className="btn-gradient" onClick={() => navigate("/products")}>Quản Lý </button>
      </div>
    );
}