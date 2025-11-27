// frontend/js/register.js
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const hoTenInput = document.getElementById('ho_ten');
    const emailInput = document.getElementById('email');
    const soDienThoaiInput = document.getElementById('so_dienthoai');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageContainer = document.getElementById('messageContainer');

    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        messageContainer.innerHTML = '';

        const ho_ten = hoTenInput.value.trim();
        const email = emailInput.value.trim();
        const so_dienthoai = soDienThoaiInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validation
        if (ho_ten === '' || email === '' || password === '' || confirmPassword === '') {
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

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ho_ten,
                    email,
                    so_dienthoai,
                    password,
                    confirm_password: confirmPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                showMessage(data.message, 'success');
                setTimeout(function() {
                    window.location.href = '/';
                }, 2000);
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