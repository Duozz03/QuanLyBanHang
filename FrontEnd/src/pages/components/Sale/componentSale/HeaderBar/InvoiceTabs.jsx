
import "./HeaderBar.css";

/**
 * 📑 InvoiceTabs
 * - Hiển thị danh sách tab hóa đơn
 * - Có 1 tab mặc định không thể đóng
 */


export default function InvoiceTabs({
  tabs = [],
  activeTab,
  onChangeTab,
  onCloseTab,
  onAddTab,
}) {
  return (
    <div className="invoice-tabs"  style={{ display: "flex" }}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab-item ${tab.id === activeTab ? "active" : ""}`}
          onClick={() => onChangeTab(tab.id)}
        >
          <span className="tab-title">{tab.title}</span>

          {/* ❌ NÚT ĐÓNG CHỈ HIỆN KHI closable === true */}
          {tab.closable && (
            <button
              className="tab-close"
              onClick={(e) => {
                
                e.stopPropagation(); // ⚠️ tránh click lan sang chọn tab
                onCloseTab(tab.id);
              }}
            >
              ×
            </button>
          )}
        </div>
      ))}

      {/* ➕ Thêm tab mới */}
      <button className="tab-add" onClick={onAddTab}>
        +
      </button>
    </div>
  );
}
