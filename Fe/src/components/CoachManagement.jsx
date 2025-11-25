import { useEffect, useState } from "react";
import Layout from "./Layout";
import "../styles/main.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function CoachManagement({ onSelectMenu }) {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    speciality: "",
    limitedStudent: 10,
    status: "true"
  });

  async function fetchCoaches() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/coach`);
      if (!res.ok) throw new Error("Không lấy được danh sách huấn luyện viên");
      const data = await res.json();
      console.log(data.data)
      setCoaches(data.data 
        || []);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải danh sách huấn luyện viên");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoaches();
  }, []);

  async function createCoach(data) {
    const res = await fetch(`${API_BASE_URL}/api/coach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Create coach error:", text);
      throw new Error("Không tạo được huấn luyện viên mới");
    }
    return res.json();
  }

  async function updateCoach(id, data) {
    const res = await fetch(`${API_BASE_URL}/api/coach/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Update coach error:", text);
      throw new Error("Không cập nhật được huấn luyện viên");
    }
    return res.json();
  }

  async function deleteCoach(id) {
    const res = await fetch(`${API_BASE_URL}/api/coach/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const text = await res.text();
      console.error("Delete coach error:", text);
      throw new Error("Không xóa được huấn luyện viên");
    }
  }

  function openModalForCreate() {
    setEditingId(null);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      speciality: "",
      limitedStudent: 10,
      status: "true"
    });
    setIsModalOpen(true);
  }

  function openModalForEdit(coach) {
    setEditingId(coach.id);
    setFormData({
      fullName: coach.fullName || "",
      phone: coach.phone || "",
      email: coach.email || "",
      speciality: coach.speciality || "",
      limitedStudent:
        typeof coach.limitedStudent === "number"
          ? coach.limitedStudent
          : Number(coach.limitedStudent || 10),
      status: coach.status === true || coach.status === "true" ? "true" : "false"
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "limitedStudent" ? Number(value) : value
    }));
  }

  function validateForm() {
    const errors = [];
    if (!formData.fullName.trim()) errors.push("Vui lòng nhập họ tên.");
    if (!formData.phone.trim()) errors.push("Vui lòng nhập số điện thoại.");
    if (!formData.limitedStudent || Number(formData.limitedStudent) <= 0)
      errors.push("Giới hạn học viên phải lớn hơn 0.");
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        const updated = await updateCoach(editingId, formData);
        setCoaches((prev) =>
          prev.map((c) => (c.id === editingId ? updated : c))
        );
      } else {
        const created = await createCoach(formData);
        const coachToAdd =
          !created || !created.id
            ? { id: "HLV" + Math.floor(Math.random() * 9000 + 1000), ...formData }
            : created;
        setCoaches((prev) => [...prev, coachToAdd]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi lưu huấn luyện viên");
    }
  }

  async function handleDelete(coach) {
    const ok = window.confirm(
      `Bạn có chắc muốn xóa huấn luyện viên "${coach.fullName}" không?`
    );
    if (!ok) return;

    try {
      await deleteCoach(coach._id);
      setCoaches((prev) => prev.filter((c) => c._id !== coach._id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi xóa huấn luyện viên");
    }
  }

  function getStatusClass(status) {
    const s = status === true || status === "true";
    return s ? "status status-active" : "status status-pause";
  }

  function getStatusLabel(status) {
    const s = status === true || status === "true";
    return s ? "Đang dạy" : "Tạm nghỉ";
  }

  return (
    <Layout
      activeMenu="coach"
      onSelectMenu={onSelectMenu}
      title="Quản lý huấn luyện viên"
      subtitle="Danh sách huấn luyện viên, chuyên môn và giới hạn học viên."
      searchPlaceholder="Tìm kiếm huấn luyện viên..."
    >
      <div className="action_bar">
        <button className="btn_add" onClick={openModalForCreate}>
          + Thêm HLV
        </button>
      </div>

      <div className="table_wrapper">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID HLV</th>
                <th>Họ tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Chuyên môn</th>
                <th>Giới hạn học viên</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coaches.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: 12 }}>
                    Chưa có huấn luyện viên nào. Nhấn "Thêm HLV" để tạo mới.
                  </td>
                </tr>
              ) : (
                coaches.map((c,index) => (
                  <tr key={c._id}>
                    <td>{index+1}</td>
                    <td>{c.fullName}</td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td>{c.speciality}</td>
                    <td>{c.limitedStudent}</td>
                    <td>
                      <span className={getStatusClass(c.status)}>
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn_update"
                        type="button"
                        onClick={() => openModalForEdit(c)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn_delete"
                        type="button"
                        onClick={() => handleDelete(c)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div
          className="modal"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal_content">
            <h3>{editingId ? "Sửa huấn luyện viên" : "Thêm huấn luyện viên"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form_group">
                <label htmlFor="fullName">Họ tên</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form_group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form_group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form_group">
                <label htmlFor="speciality">Chuyên môn</label>
                <input
                  type="text"
                  id="speciality"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  placeholder="Ví dụ: Yoga, Tăng cơ..."
                />
              </div>

              <div className="form_group">
                <label htmlFor="limitedStudent">Giới hạn học viên</label>
                <input
                  type="number"
                  id="limitedStudent"
                  name="limitedStudent"
                  min="1"
                  value={formData.limitedStudent}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form_group">
                <label htmlFor="status">Trạng thái</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="true">Đang dạy</option>
                  <option value="false">Tạm nghỉ</option>
                </select>
              </div>

              <div className="form_actions">
                <button type="button" className="btn_cancel" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="btn_save">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
