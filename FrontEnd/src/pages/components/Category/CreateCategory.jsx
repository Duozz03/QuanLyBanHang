
import React, { useState } from "react";

export default function CreateCategoryModal({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");

  if (!open) return null;

  return (
    <div className="modal-backdrop custom-backdrop" onClick={onClose}>
      <div
        className="modal d-block mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog" style={{ maxWidth: 420 }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm nhóm hàng</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <label className="form-label">Tên nhóm</label>
              <input
                className="form-control mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label className="form-label">Nhóm cha</label>
              <select
                className="form-select"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">-- Lựa chọn --</option>
                {/* map category ở đây */}
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={onClose}>
                Bỏ qua
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onSave({ name, parentId });
                  onClose();
                }}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
