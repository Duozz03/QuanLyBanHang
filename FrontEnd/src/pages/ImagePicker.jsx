// src/components/ImagePicker.jsx
import React, { useState, useRef, useEffect } from "react";

export default function ImagePicker({ initialUrl = null, onFileSelected }) {
  const [file, setFile] = useState(null);           // File object
  const [preview, setPreview] = useState(initialUrl); // preview URL (string)
  const inputRef = useRef(null);

  // Khi file thay đổi -> tạo object URL và revoke cũ
  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => {
      // cleanup khi file thay đổi hoặc component unmount
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Nếu component unmount: revoke preview nếu có (nếu preview do createObjectURL tạo ra)
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setPreview(initialUrl || null);
      if (onFileSelected) onFileSelected(null);
      return;
    }

    // optional: kiểm tra loại file
    if (!f.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh.");
      inputRef.current.value = ""; // reset input
      return;
    }

    setFile(f);
    if (onFileSelected) onFileSelected(f);
  }

  function handleRemove() {
    setFile(null);
    setPreview(initialUrl || null);
    inputRef.current.value = "";
    if (onFileSelected) onFileSelected(null);
  }

  return (
    <div>
      <label>Hình ảnh</label>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      {preview ? (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img
              src={preview}
              alt="preview"
              style={{
                width: 160,
                height: 160,
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />
            <div>
              <div style={{ marginBottom: 8 }}>
                {file ? file.name : "Ảnh mặc định / URL ban đầu"}
              </div>
              <button type="button" onClick={handleRemove}>
                Xóa ảnh
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 8, color: "#666" }}>Chưa chọn ảnh</div>
      )}
    </div>
  );
}
