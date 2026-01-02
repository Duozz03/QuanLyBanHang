import { useReducer, useEffect } from "react";
import axios from "axios";

///// Sử dụng useReducer
const initialState = {
  values: {
    username: "",
    fullName: "",
    sdt: "",
    address: "",
    email: "",
    status: "ACTIVE",
    role: "STAFF",
    password: "",
  },
  errors: {},
};

//////// Rule validate
const validators = {
  username: (v) => (!v ? "Tên tài khoản không được để trống" : ""),

  fullName: (v) => (!v ? "Tên người dùng không được để trống" : ""),

  address: (v) => (!v ? "Địa chỉ không được để trống" : ""),

  sdt: (v) =>
    !/^\d{10}$/.test(v)
      ? "Số điện thoại không hợp lệ, vui lòng nhập đúng số điện thoại "
      : "",

  email: (v) =>
    !v
      ? "Email không được để trống"
      : !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v)
      ? "Email phải là Gmail (vd: example@gmail.com)"
      : "",

  password: (v) => (v.length < 6 ? "Mật khẩu tối thiểu 6 ký tự" : ""),
};

//////// useReducer
function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE": {
      const { name, value } = action.payload;
      const error = validators[name] ? validators[name](value) : "";

      return {
        ...state,
        values: {
          ...state.values,
          [name]: value,
        },
        errors: {
          ...state.errors,
          [name]: error,
        },
      };
    }

    case "SET_FORM":
      return {
        ...state,
        values: action.payload,
        errors: {},
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };

    default:
      return state;
  }
}

export default function CreateUser({open, onClose, editUser, onSuccess }) {
  
  // const [errors, setErrors] = useState({
  //   username: "",
  // });

  const [state, dispatch] = useReducer(formReducer, initialState);

  const { values, errors } = state;

  useEffect(() => {
  if (editUser) {
    dispatch({
      type: "SET_FORM",
      payload: {
        username: editUser.username || "",
        fullName: editUser.fullName || "",
        sdt: editUser.sdt || "",
        address: editUser.address || "",
        email: editUser.email || "",
        status: editUser.status || "ACTIVE",
        role: editUser.role || "STAFF",
        password: "",
      },
    });
  } else {
    dispatch({
      type: "SET_FORM",
      payload: initialState.values,
    });
  }
}, [editUser]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch({
      type: "CHANGE",
      payload: { name, value },
    });
  };

  const validateForm = async () => {
    const newErrors = {};

    for (const key in validators) {
      const error = validators[key](values[key]);
      if (error) newErrors[key] = error;
    }

    if (Object.keys(newErrors).length > 0) {
      dispatch({ type: "SET_ERRORS", payload: newErrors });
      return false;
    }

    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!editUser) {
  const exists = res.data.result.some(
    (u) => u.username === values.username
  );

  if (exists) {
    dispatch({
      type: "SET_ERRORS",
      payload: {
        username: "Tên tài khoản đã tồn tại",
      },
    });
    return false;
  }
}


      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

    if (!open) return null;

  const handleSave = async () => {
  const isValid = await validateForm();
  if (!isValid) return;

  const user = {
    username: values.username.trim(),
    fullName: values.fullName.trim(),
    address: values.address.trim(),
    email: values.email.trim(),
    sdt: values.sdt.trim(),
    status: values.status,
    role: values.role,
    ...(values.password && { password: values.password.trim() }),
  };

  try {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (editUser) {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/${editUser.id}`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cập nhật user thành công");
      onSuccess();   // 👈 reload data
onClose();
    } else {
      // ➕ CREATE
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Thêm user thành công");
    }

    onClose();
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-3">
          {/* ===== HEADER ===== */}
          <div className="modal-header">
            <h5 className="modal-title">
  {editUser ? "Chỉnh sửa nhân viên" : "Thêm mới nhân viên"}
</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* ===== BODY ===== */}
          <div className="modal-body p-0">
            {/* TABS */}
            <ul className="nav nav-tabs px-3 pt-2">
              <li className="nav-item">
                <button className="nav-link active">Thông tin</button>
              </li>
            </ul>

            {/* CONTENT */}
            <div className="p-4 bg-light">
              <div className="d-flex gap-4">
                {/* RIGHT: FORM */}
                <div className="flex-grow-1 bg-white p-4 rounded shadow-sm">
                  <h6 className="mb-3 fw-semibold">Thông tin khởi tạo</h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Tên Tài khoản</label>
                      <input
                        onChange={handleChange}
                        className={`form-control ${
                          errors.username ? "is-invalid" : ""
                        }`}
                        placeholder="Tên tài khoản để đăng nhập"
                        value={values.username}
                        name="username"
                      />
                      {/* ❗ Thông báo lỗi (hidden nếu rỗng) */}
                      {values.username && (
                        <div className="invalid-feedback">
                          {errors.username}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tên Người dùng</label>
                      <input
                        onChange={handleChange}
                        className={`form-control ${
                          errors.fullName ? "is-invalid" : ""
                        }`}
                        value={values.fullName}
                        name="fullName"
                      />
                      {/* ❗ Thông báo lỗi (hidden nếu rỗng) */}
                      {errors.fullName && (
                        <div className="invalid-feedback">
                          {errors.fullName}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        onChange={handleChange}
                        className={`form-control ${
                          errors.sdt ? "is-invalid" : ""
                        }`}
                        value={values.sdt}
                        name="sdt"
                      />
                      {/* ❗ Thông báo lỗi (hidden nếu rỗng) */}
                      {errors.sdt && (
                        <div className="invalid-feedback">{errors.sdt}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Địa chỉ</label>
                      <input
                        onChange={handleChange}
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        value={values.address}
                        name="address"
                      />
                      {/* ❗ Thông báo lỗi (hidden nếu rỗng) */}
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        onChange={handleChange}
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        value={values.email}
                        name="email"
                      />
                      {/* ❗ Thông báo lỗi (hidden nếu rỗng) */}
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Trạng thái</label>
                      <select
                        onChange={handleChange}
                        className="form-select"
                        name="status"
                        value={values.status}
                      >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Ngưng hoạt động</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <select
                        onChange={handleChange}
                        className="form-select"
                        name="role"
                        value={values.role}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="STAFF">STAFF</option>
                        <option value="WAREHOUSE">WAREHOUSE</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Mật Khẩu</label>
                      <input
                        onChange={handleChange}
                        className="form-control"
                        name="password"
                        value={values.password}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== FOOTER ===== */}
          <div className="modal-footer">
            <button className="btn btn-outline-secondary">Bỏ qua</button>
            <button className="btn btn-primary" onClick={handleSave}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
