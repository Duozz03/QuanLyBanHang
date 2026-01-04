// Header
import Salesp from "./HeaderBar/Salep";
import SearchProductInput from "./HeaderBar/SearchProductInput";
import "./HeaderBar/HeaderBar.css";
import ButtonManeger from "./HeaderBar/ButtonManeger";

export default function HeaderBar() {
  return (
    <div className="header-bar">
      <SearchProductInput />
      <Salesp />
      <ButtonManeger/>
    </div>
  );
}

