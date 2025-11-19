document.addEventListener("DOMContentLoaded", () => {
    const btnAdd = document.getElementById("btnAdd");
    const trainerTableBody = document.getElementById("trainerTableBody");

    const modal = document.getElementById("trainerModal");
    const modalTitle = document.getElementById("modalTitle");
    const trainerForm = document.getElementById("trainerForm");

    const inputFullName = document.getElementById("fullName");
    const inputPhone = document.getElementById("phone");
    const inputStatus = document.getElementById("status");
    const inputPackage = document.getElementById("package");
    const inputExpiredDate = document.getElementById("expiredDate");

    const btnCancel = document.getElementById("btnCancel");

    let editingRow = null;

    function openModal(mode, row = null) {
        editingRow = row;

        if (mode === "add") {
            modalTitle.textContent = "Thêm Huấn Luyện Viên";
            trainerForm.reset();
            inputStatus.value = "Còn Hạn";
        } else if (mode === "edit" && row) {
            modalTitle.textContent = "Sửa Huấn Luyện Viên";

            const cells = row.children;
            inputFullName.value = cells[1].textContent;
            inputPhone.value = cells[2].textContent;
            inputStatus.value = cells[3].textContent;
            inputPackage.value = cells[4].textContent;
            inputExpiredDate.value = cells[5].textContent; 
        }

        modal.classList.add("show");
    }

    function closeModal() {
        modal.classList.remove("show");
        editingRow = null;
    }

    if (btnAdd) {
        btnAdd.addEventListener("click", () => {
            openModal("add");
        });
    }

    function attachRowEvents(row) {
        const btnUpdate = row.querySelector(".btn_update");
        const btnDelete = row.querySelector(".btn_delete");

        if (btnUpdate) {
            btnUpdate.addEventListener("click", () => {
                openModal("edit", row);
            });
        }

        if (btnDelete) {
            btnDelete.addEventListener("click", () => {
                const name = row.children[1].textContent;
                const isConfirm = confirm(
                    `Bạn có chắc muốn xóa huấn luyện viên "${name}" không?`
                );
                if (isConfirm) {
                    row.remove();
                }
            });
        }
    }

    document.querySelectorAll("#trainerTableBody tr").forEach((row) => {
        attachRowEvents(row);
    });

    trainerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = inputFullName.value.trim();
        const phone = inputPhone.value.trim();
        const status = inputStatus.value;
        const pack = inputPackage.value.trim();
        const expired = inputExpiredDate.value; 

        if (!name || !phone || !expired) {
            alert("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Ngày hết hạn!");
            return;
        }

        if (editingRow) {
            const cells = editingRow.children;
            cells[1].textContent = name;
            cells[2].textContent = phone;
            cells[3].textContent = status;
            cells[4].textContent = pack;
            cells[5].textContent = expired;
        } else {
            let newId = 1;
            const lastRow = trainerTableBody.lastElementChild;
            if (lastRow) {
                const lastId = parseInt(lastRow.children[0].textContent, 10);
                if (!isNaN(lastId)) {
                    newId = lastId + 1;
                }
            }

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${newId}</td>
                <td>${name}</td>
                <td>${phone}</td>
                <td>${status}</td>
                <td>${pack}</td>
                <td>${expired}</td>
                <td>
                    <button class="btn_update" title="Sửa thông tin huấn luyện viên này">Sửa</button>
                    <button class="btn_delete" title="Xóa huấn luyện viên này">Xóa</button>
                </td>
            `;
            trainerTableBody.appendChild(newRow);
            attachRowEvents(newRow);
        }

        closeModal();
    });

    btnCancel.addEventListener("click", () => {
        closeModal();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
