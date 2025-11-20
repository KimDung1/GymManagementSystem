// js/login.js

document.addEventListener('DOMContentLoaded', function() {

    // 1. Lấy các phần tử HTML
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageContainer = document.getElementById('messageContainer');

    // 2. Thêm sự kiện 'submit' cho form
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn form tải lại trang

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // 3. Thực hiện VALIDATION cơ bản
        if (email === '' || password === '') {
             showMessage('Vui lòng nhập email và mật khẩu.', 'error');
        } else {
             showMessage('Đã kiểm tra. Sẵn sàng đăng nhập...', 'success');
             // Nhớ rằng: Không thể kiểm tra mật khẩu có đúng hay không ở đây!
        }
  
        showMessage('Đăng nhập thành công! Đang chuyển hướng...', 'success');

        // Đợi 1.5 giây rồi chuyển đến trang dashboard
        setTimeout(function() {
            window.location.href = 'DatLichHoc_LopTap\index.html';
        }, 1500); // 1.5 giây
});

    // Hàm trợ giúp để hiển thị thông báo
    function showMessage(text, type) {
        messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
    }
});