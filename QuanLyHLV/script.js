const TRAINER_STORAGE_KEY = "trainers";

let trainers = JSON.parse(localStorage.getItem(TRAINER_STORAGE_KEY) || "[]");

let editingId = null;

function saveTrainers() {
  localStorage.setItem(TRAINER_STORAGE_KEY, JSON.stringify(trainers));
}

function generateTrainerId() {
  if (trainers.length === 0) return "HLV001";

  const maxNumber = trainers.reduce((max, t) => {
    const num = parseInt(t.id.replace("HLV", ""), 10);
    return num > max ? num : max;
  }, 0);

  const next = maxNumber + 1;
  return "HLV" + String(next).padStart(3, "0");
}

function renderTrainerTable() {
  const tbody = document.getElementById("trainerTableBody");
  if (!tbody) return;

  if (trainers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:12px; color:#6b7280;">
          Chưa có huấn luyện viên nào. Nhấn "Thêm HLV" để tạo mới.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = trainers
    .map((t) => {
      let statusClass = "status-active";
      if (t.status === "Tạm nghỉ") statusClass = "status-pause";
      if (t.status === "Nghỉ việc") statusClass = "status-expired";

      return `
        <tr data-id="${t.id}">
          <td>${t.id}</td>
          <td>${t.fullName}</td>
          <td>${t.phone}</td>
          <td>${t.email || ""}</td>
          <td>${t.speciality || ""}</td>
          <td>${t.limitStudent || ""}</td>
          <td><span class="status ${statusClass}">${t.status}</span></td>
          <td>
            <button class="btn_update" type="button">Sửa</button>
            <button class="btn_delete" type="button">Xóa</button>
          </td>
        </tr>
      `;
    })
    .join("");
}


const modal = document.getElementById("trainerModal");
const modalTitle = document.getElementById("modalTitle");
const trainerForm = document.getElementById("trainerForm");
const btnAddTrainer = document.getElementById("btnAddTrainer");
const btnCancel = document.getElementById("btnCancel");

const inputFullName = document.getElementById("fullName");
const inputPhone = document.getElementById("phone");
const inputEmail = document.getElementById("email");
const inputSpeciality = document.getElementById("speciality");
const inputLimitStudent = document.getElementById("limitStudent");
const selectStatus = document.getElementById("status");

function openModalForCreate() {
  editingId = null;
  modalTitle.textContent = "Thêm huấn luyện viên";
  trainerForm.reset();
  // default
  inputLimitStudent.value = 10;
  selectStatus.value = "Đang dạy";
  modal.classList.add("show");
}

function openModalForEdit(trainer) {
  editingId = trainer.id;
  modalTitle.textContent = "Sửa huấn luyện viên";

  inputFullName.value = trainer.fullName;
  inputPhone.value = trainer.phone;
  inputEmail.value = trainer.email || "";
  inputSpeciality.value = trainer.speciality || "";
  inputLimitStudent.value = trainer.limitStudent || 10;
  selectStatus.value = trainer.status;

  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  trainerForm.reset();
  editingId = null;
}


function validateTrainerForm() {
  const fullName = inputFullName.value.trim();
  const phone = inputPhone.value.trim();
  const email = inputEmail.value.trim();
  const speciality = inputSpeciality.value.trim();
  const limitStudent = inputLimitStudent.value;
  const status = selectStatus.value;

  const errors = [];

  if (!fullName) errors.push("Vui lòng nhập họ tên.");
  if (!phone) errors.push("Vui lòng nhập số điện thoại.");

  if (email && !email.includes("@")) {
    errors.push("Email không hợp lệ.");
  }

  if (!limitStudent || Number(limitStudent) <= 0) {
    errors.push("Giới hạn học viên phải lớn hơn 0.");
  }

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return null;
  }

  return {
    fullName,
    phone,
    email,
    speciality,
    limitStudent: Number(limitStudent),
    status,
  };
}


if (trainerForm) {
  trainerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = validateTrainerForm();
    if (!formData) return;

    if (editingId) {
      trainers = trainers.map((t) =>
        t.id === editingId
          ? { ...t, ...formData }
          : t
      );
    } else {
      const newTrainer = {
        id: generateTrainerId(),
        ...formData,
      };
      trainers.push(newTrainer);
    }

    saveTrainers();
    renderTrainerTable();
    closeModal();
  });
}


if (btnAddTrainer) {
  btnAddTrainer.addEventListener("click", openModalForCreate);
}

if (btnCancel) {
  btnCancel.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}



const tbody = document.getElementById("trainerTableBody");

if (tbody) {
  tbody.addEventListener("click", (e) => {
    const btn = e.target;
    const row = btn.closest("tr");
    if (!row) return;

    const id = row.getAttribute("data-id");
    const trainer = trainers.find((t) => t.id === id);
    if (!trainer) return;

    if (btn.classList.contains("btn_update")) {
      openModalForEdit(trainer);
    }

    if (btn.classList.contains("btn_delete")) {
      const confirmDelete = confirm(
        `Bạn có chắc muốn xóa huấn luyện viên "${trainer.fullName}"?`
      );
      if (!confirmDelete) return;

      trainers = trainers.filter((t) => t.id !== id);
      saveTrainers();
      renderTrainerTable();
    }
  });
}

renderTrainerTable();
