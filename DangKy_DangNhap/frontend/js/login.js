// frontend/js/login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageContainer = document.getElementById('messageContainer');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === '' || password === '') {
            showMessage('Vui lòng nhập email và mật khẩu.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                showMessage(data.message, 'success');
                setTimeout(function() {
                    // Chuyển hướng đến trang chính sau khi đăng nhập thành công
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            showMessage('Có lỗi xảy ra, vui lòng thử lại.', 'error');
        }
    });

    function showMessage(text, type) {
        messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
    }
});