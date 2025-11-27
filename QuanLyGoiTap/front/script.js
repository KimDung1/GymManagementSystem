const API = "http://localhost:3000/api/packages";

loadPackages();

async function loadPackages() {
    const res = await fetch(API);
    const data = await res.json();

    const tbody = document.getElementById("table_body");
    tbody.innerHTML = "";

    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString()} ₫</td>
                <td>${item.days} ngày</td>
                <td>${item.status === "active" ? "Hoạt động" : "Ngưng"}</td>
                <td>${item.description}</td>
                <td>
                    <button class="btn_edit" onclick="editPackage(${item.id})">Sửa</button>
                    <button class="btn_delete" onclick="deletePackage(${item.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

function resetForm() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("days").value = "";
    document.getElementById("status").value = "active";
    document.getElementById("description").value = "";
    document.getElementById("form_title").innerText = "Thêm Gói Tập";
}

async function savePackage() {
    const id = document.getElementById("id").value;

    const data = {
        name: document.getElementById("name").value,
        price: Number(document.getElementById("price").value),
        days: Number(document.getElementById("days").value),
        status: document.getElementById("status").value,
        description: document.getElementById("description").value,
    };

    if (id) {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } else {
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    }

    resetForm();
    loadPackages();
}

async function editPackage(id) {
    const res = await fetch(API);
    const list = await res.json();
    const item = list.find(p => p.id === id);

    document.getElementById("id").value = item.id;
    document.getElementById("name").value = item.name;
    document.getElementById("price").value = item.price;
    document.getElementById("days").value = item.days;
    document.getElementById("status").value = item.status;
    document.getElementById("description").value = item.description;
    document.getElementById("form_title").innerText = "Cập Nhật Gói Tập";
}

async function deletePackage(id) {
    if (!confirm("Bạn có chắc muốn xóa?")) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadPackages();
}
