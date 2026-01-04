// CreateProductModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CreateProductModal.css";
import CreateCategoryModal from "../Category/CreateCategory";
import { toast } from "react-toastify";

export default function CreateProductModal({
  open,
  onClose,
  onSave,
  initialProduct = null,
}) {
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [category, setcategory] = useState([]);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data.result || [];
        console.log("data", data);

        setcategory(data);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải loại");
      }
    };

    loadCategory();
  }, []);

  const [form, setForm] = useState({
    barcode: "",
    name: "",
    urlImage: "",
    description: "",
    importPrice: "",
    price: "",
    quantity: "",
    status: "ACTIVE",
    categoryId: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Khi mở modal hoặc đổi initialProduct (edit), sync lại form
  useEffect(() => {
    const next = {
      barcode: initialProduct?.barcode || "",
      name: initialProduct?.name || "",
      urlImage: initialProduct?.urlImage || "",
      description: initialProduct?.description || "",
      importPrice:
        initialProduct?.importPrice != null
          ? String(initialProduct.importPrice)
          : "",
      price: initialProduct?.price != null ? String(initialProduct.price) : "",
      quantity:
        initialProduct?.quantity != null ? String(initialProduct.quantity) : "",
      status: initialProduct?.status || "ACTIVE",
      categoryId: initialProduct?.categoryId || "",
    };
    setForm(next);
    setSelectedFile(null);
    setPreviewUrl(next.urlImage || null);
  }, [open, initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  if (!open) return null;

  const handleSave = async (e) => {
    e.preventDefault();

    const importPriceNum = Number(form.importPrice);
    const salePriceNum = Number(form.price);
    const stockNum = parseInt(form.quantity === "" ? "0" : form.quantity, 10);

    if (isNaN(importPriceNum) || importPriceNum < 0) {
      toast.warning("Giá vốn phải là số >= 0");
      return;
    }
    if (isNaN(salePriceNum) || salePriceNum < 0) {
      toast.warning("Giá bán phải là số >= 0");
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      toast.warning("Tồn kho phải là số nguyên >= 0");
      return;
    }

    const product = {
      barcode: form.barcode.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      importPrice: importPriceNum,
      price: salePriceNum,
      quantity: stockNum,
      status: form.status,
      categoryId: form.categoryId,
    };

    const isEdit = !!initialProduct;
    const baseUrl = "http://localhost:8080/products";

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      const headers = { Authorization: `Bearer ${token}` };

      let res;
      if (isEdit) {
        const productId = initialProduct.id;
        res = await axios.put(`${baseUrl}/${productId}`, formData, { headers });
      } else {
        console.log(product);
        res = await axios.post(baseUrl, formData, { headers });
      }

      const savedProduct = res.data?.result ?? res.data;
      console.log("Kết quả từ backend:", res.data);
      const uiProduct = {
        ...savedProduct,
        id: isEdit
          ? initialProduct.id
          : savedProduct.id ?? savedProduct.result?.id,
        urlImage: selectedFile
          ? previewUrl
          : initialProduct?.urlImage ?? previewUrl ?? savedProduct.urlImage,
      };
      if (typeof onSave === "function") onSave(uiProduct, isEdit);
      toast.success(
        isEdit ? "Cập nhật hàng hóa thành công" : "Thêm hàng hóa thành công"
      );
      // đóng modal sau khi lưu thành công
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error";

      toast.error("Gửi dữ liệu thất bại: " + msg);
    }
  };

  function flattenTree(nodes, level = 0, result = []) {
    for (const n of nodes) {
      result.push({
        id: n.id,
        name: `${"— ".repeat(level)}${n.name}`,
        level,
      });
      if (n.children?.length) {
        flattenTree(n.children, level + 1, result);
      }
    }
    return result;
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(form.urlImage || null);
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  return (
    <>
      <div className="modal-backdrop custom-backdrop" onClick={onClose}>
        <div
          className="modal d-block"
          onClick={(e) => e.stopPropagation()}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl mt-5 ">
            <div className="modal-content">
              <div className="modal-header align-items-start">
                <div>
                  <h5 className="modal-title">
                    {initialProduct ? "Chỉnh sửa hàng hóa" : "Tạo hàng hóa"}
                  </h5>
                </div>

                <div className="ms-auto">
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                  ></button>
                </div>
              </div>

              <div className="px-4 pt-0 ">
                <ul className="nav nav-tabs custom-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      data-bs-toggle="tab"
                      type="button"
                      role="tab"
                    >
                      Thông tin
                    </button>
                  </li>
                </ul>
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body py-3 px-4">
                  <div className="row gx-4">
                    <div className="col-lg-8">
                      <div className="row g-3">
                        <div className="col-6">
                          <label className="form-label">Tên hàng</label>
                          <input
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Tên hàng (bắt buộc)"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Mã vạch</label>
                          <input
                            className="form-control"
                            name="barcode"
                            value={form.barcode} // FIX: form.barcode_id -> form.barcode
                            onChange={handleChange}
                            placeholder="Nhập mã vạch"
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label">
                            Nhóm hàng / Thương hiệu
                          </label>
                          <div className="d-flex gap-2">
                            <select
                              className="form-select flex-grow-1"
                              name="categoryId"
                              value={form.categoryId}
                              onChange={handleChange}
                            >
                              <option value="">
                                Chọn nhóm hàng (Bắt buộc)
                              </option>
                              {flattenTree(category).map((n) => (
                                <option key={n.id} value={n.id}>
                                  {n.name}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              className="btn btn-link small"
                              onClick={() => setOpenCreateCategory(true)}
                            >
                              Tạo mới
                            </button>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="card section-card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                              <strong>Giá vốn, giá bán</strong>
                              <button
                                type="button"
                                className="btn btn-sm btn-link"
                              >
                                Thiết lập giá
                              </button>
                            </div>
                            <div className="card-body">
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label className="form-label">Giá vốn</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="importPrice"
                                    value={form.importPrice}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Giá bán</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="card section-card">
                            <div className="card-header">
                              <strong>Tồn kho</strong>
                            </div>
                            <div className="card-body">
                              <div className="row g-3">
                                <div className="col-md-4">
                                  <label className="form-label">Tồn kho</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="form-label">Mô tả</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="image-uploader">
                        <div className="img-box d-flex align-items-center justify-content-center">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="preview"
                              className="img-fluid"
                            />
                          ) : (
                            <div className="text-center text-muted">
                              <div className="mb-2">Thêm ảnh</div>
                              <small>Mỗi ảnh không quá 2 MB</small>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 d-grid">
                          <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                          <label
                            htmlFor="fileInput"
                            className="btn btn-outline-secondary"
                          >
                            Chọn ảnh
                          </label>
                        </div>

                        <div className="mt-4">
                          <label className="form-label">Trạng thái</label>
                          <select
                            className="form-select"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                          >
                            <option value="ACTIVE">Kinh Doanh</option>
                            <option value="INACTIVE">Ngừng Kinh Doanh</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer d-flex justify-content-between px-4">
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      onClick={onClose}
                    >
                      Bỏ qua
                    </button>
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary">
                      Lưu
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <CreateCategoryModal
        open={openCreateCategory}
        onClose={() => setOpenCreateCategory(false)}
        onSave={(category) => {
          console.log("Category mới:", category);
          // Sau này: gọi API POST /categories rồi update list categories trong state cha
        }}
      />
    </>
  );
}
