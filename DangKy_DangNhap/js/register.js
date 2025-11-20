// js/register.js

document.addEventListener('DOMContentLoaded', function() {

    const registerForm = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageContainer = document.getElementById('messageContainer');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        messageContainer.innerHTML = '';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // --- VALIDATION (Không thay đổi) ---
        if (email === '' || password === '' || confirmPassword === '') {
            showMessage('Vui lòng điền đầy đủ thông tin.', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showMessage('Mật khẩu nhập lại không khớp.', 'error');
            return;
        }
        if (password.length < 6) {
            showMessage('Mật khẩu phải có ít nhất 6 ký tự.', 'error');
            return;
        }

        // ===== PHẦN CẬP NHẬT =====
        // Nếu tất cả kiểm tra đều qua:
        // 1. Hiển thị thông báo thành công.
        showMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');
        
        // 2. Đặt một khoảng thời gian chờ (ví dụ: 2 giây) rồi mới chuyển trang.
        // Điều này giúp người dùng kịp đọc thông báo.
        setTimeout(function() {
            // 3. Chuyển hướng người dùng đến trang đăng nhập.
            window.location.href = 'index.html'; 
        }, 2000); // 2000 milliseconds = 2 giây
    });

    function showMessage(text, type) {
        messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
    }
});