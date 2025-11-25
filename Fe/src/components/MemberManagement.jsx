import { useEffect, useState } from "react";
import Layout from "./Layout";
import "../styles/main.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function MemberManagement({ onSelectMenu }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    status: "true",
    package: "",
    expiredDate: ""
  });

  async function fetchMembers() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/member`);
      if (!res.ok) throw new Error("Không lấy được danh sách hội viên");
      const data = await res.json();
       setMembers(data.data 
        || []);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải danh sách hội viên");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  async function createMember(data) {
    const res = await fetch(`${API_BASE_URL}/api/member`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Create member error:", text);
      throw new Error("Không tạo được hội viên mới");
    }
    return res.json();
  }

  async function updateMember(id, data) {
    const res = await fetch(`${API_BASE_URL}/api/member/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Update member error:", text);
      throw new Error("Không cập nhật được hội viên");
    }
    return res.json();
  }

  async function deleteMember(id) {
    const res = await fetch(`${API_BASE_URL}/api/member/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Delete member error:", text);
      throw new Error("Không xóa được hội viên");
    }
  }

  function openModalForCreate() {
    setEditingId(null);
    setFormData({
      fullName: "",
      phone: "",
      status: "true",
      package: "",
      expiredDate: ""
    });
    setIsModalOpen(true);
  }

  function normalizeDate(value) {
    if (!value) return "";
    if (value.includes("T")) return value.split("T")[0];
    return value;
  }

  function openModalForEdit(member) {
    setEditingId(member.id);
    setFormData({
      fullName: member.fullName || "",
      phone: member.phone || "",
      status:
        member.status === true || member.status === "true" ? "true" : "false",
      package: member.package || "",
      expiredDate: normalizeDate(member.expiredDate)
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
      [name]: value
    }));
  }

  function validateForm() {
    const errors = [];
    if (!formData.fullName.trim()) errors.push("Vui lòng nhập họ tên.");
    if (!formData.phone.trim()) errors.push("Vui lòng nhập số điện thoại.");
    if (!formData.expiredDate) errors.push("Vui lòng chọn ngày hết hạn.");

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
        const updated = await updateMember(editingId, formData);
        setMembers((prev) =>
          prev.map((m) => (m.id === editingId ? updated : m))
        );
      } else {
        const created = await createMember(formData);
        const memberToAdd =
          !created || !created.id
            ? {
                id: "MB" + Math.floor(Math.random() * 9000 + 1000),
                ...formData
              }
            : created;
        setMembers((prev) => [...prev, memberToAdd]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi lưu hội viên");
    }
  }

  async function handleDelete(member) {
    const ok = window.confirm(
      `Bạn có chắc muốn xóa hội viên "${member.fullName}" không?`
    );
    if (!ok) return;
    try {
      await deleteMember(member._id);
      setMembers((prev) => prev.filter((m) => m._id !== member._id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi xóa hội viên");
    }
  }

  function getStatusClass(status) {
    const s = status === true || status === "true";
    return s ? "status status-active" : "status status-expired";
  }

  function getStatusLabel(status) {
    const s = status === true || status === "true";
    return s ? "Còn hạn" : "Hết hạn";
  }

  return (
    <Layout
      activeMenu="member"
      onSelectMenu={onSelectMenu}
      title="Quản lý hội viên"
      subtitle="Danh sách hội viên, trạng thái và gói tập tại phòng gym."
      searchPlaceholder="Tìm kiếm hội viên..."
    >
      <div className="action_bar">
        <button className="btn_add" onClick={openModalForCreate}>
          + Thêm hội viên
        </button>
      </div>

      <div className="table_wrapper">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ Tên</th>
                <th>Số Điện Thoại</th>
                <th>Trạng Thái</th>
                <th>Gói Tập</th>
                <th>Hết Hạn</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 12 }}>
                    Chưa có hội viên nào. Nhấn "Thêm hội viên" để tạo mới.
                  </td>
                </tr>
              ) : (
                members.map((m,index) => (
                  <tr key={m._id}>
                    <td>{index+1}</td>
                    <td>{m.fullName}</td>
                    <td>{m.phone}</td>
                    <td>
                      <span className={getStatusClass(m.status)}>
                        {getStatusLabel(m.status)}
                      </span>
                    </td>
                    <td>{m.package}</td>
                    <td>{normalizeDate(m.expiredDate)}</td>
                    <td>
                      <button
                        className="btn_update"
                        type="button"
                        onClick={() => openModalForEdit(m)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn_delete"
                        type="button"
                        onClick={() => handleDelete(m)}
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
            <h3>{editingId ? "Sửa hội viên" : "Thêm hội viên"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form_group">
                <label htmlFor="fullName">Họ Tên</label>
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
                <label htmlFor="phone">Số Điện Thoại</label>
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
                <label htmlFor="status">Trạng Thái</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="true">Còn hạn</option>
                  <option value="false">Hết hạn</option>
                </select>
              </div>

              <div className="form_group">
                <label htmlFor="package">Gói Tập</label>
                <input
                  type="text"
                  id="package"
                  name="package"
                  placeholder="Gói tập 1 tháng..."
                  value={formData.package}
                  onChange={handleChange}
                />
              </div>

              <div className="form_group">
                <label htmlFor="expiredDate">Hết Hạn</label>
                <input
                  type="date"
                  id="expiredDate"
                  name="expiredDate"
                  value={formData.expiredDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form_actions">
                <button
                  type="button"
                  className="btn_cancel"
                  onClick={closeModal}
                >
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
