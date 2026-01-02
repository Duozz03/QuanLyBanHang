import "../Product/ShopDashboard.css";

export default function UserDetail({ user, onEdit, onDelete }) {
  if (!user) return null;

  return (
    <div className="kv-detail-card">
      <div className="kv-detail-right">
        <h3 style={{ margin: 0 }}>{}</h3>
        <p className="muted" style={{ marginTop: 6 }}>
          {}
        </p>

        <div className="kv-detail-grid" style={{ marginTop: 12 }}>
          <div>
            <div className="label">Tên tài khoản</div>
            <div className="value">{user.username}</div>
          </div>

          <div>
            <div className="label">Tên người dùng</div>
            <div className="value">{user.fullName}</div>
            <></>
          </div>

          <div>
            <div className="label">Địa chỉ</div>
            <div className="value">{user.address}</div>
          </div>

          <div>
            <div className="label">Email</div>
            <div className="value">{user.email}</div>
          </div>

          <div>
            <div className="label">Số điện thoại</div>
            <div className="value">{user.sdt}</div>
          </div>

          <div>
            <div className="label">Ngày tạo</div>
            <div className="value">{user.create_at}</div>
          </div>

          <div>
            <div className="label">Trạng thái</div>
            <div className="value">{user.status}</div>
          </div>

          <div>
            <div className="label">Role</div>
            <div className="value">{user.role}</div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="kv-btn" onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(user);
            }}>Chỉnh sửa</button>

          <button className="kv-btn" 
          onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(user);
            }} style={{ marginLeft: 8 }}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
