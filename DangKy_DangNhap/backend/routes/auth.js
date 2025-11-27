const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const router = express.Router();

// Đăng ký tài khoản
router.post('/register', async (req, res) => {
  try {
    const { ho_ten, email, so_dienthoai, password, confirm_password } = req.body;

    // Validation
    if (!ho_ten || !email || !password || !confirm_password) {
      return res.json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    if (password !== confirm_password) {
      return res.json({ success: false, message: 'Mật khẩu nhập lại không khớp.' });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    // Kiểm tra email đã tồn tại
    const [existingUsers] = await db.execute(
      'SELECT ma_nguoidung FROM nguoidung WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.json({ success: false, message: 'Email này đã được sử dụng.' });
    }

    // TÌM VAI TRÒ "THÀNH VIÊN" - LINH HOẠT HƠN
    let ma_vaitro = 3; // Mặc định là thành viên

    // Kiểm tra xem vai trò 3 có tồn tại không
    try {
      const [roles] = await db.execute(
        'SELECT ma_vaitro FROM vaitro WHERE ma_vaitro = ?',
        [ma_vaitro]
      );

      // Nếu không tìm thấy vai trò 3, tìm vai trò đầu tiên
      if (roles.length === 0) {
        const [allRoles] = await db.execute('SELECT ma_vaitro FROM vaitro ORDER BY ma_vaitro LIMIT 1');
        if (allRoles.length > 0) {
          ma_vaitro = allRoles[0].ma_vaitro;
        } else {
          // Nếu không có vai trò nào, tạo vai trò mặc định
          const [insertResult] = await db.execute(
            'INSERT INTO vaitro (ten_vaitro, mo_ta) VALUES (?, ?)',
            ['Thành viên', 'Người dùng thông thường']
          );
          ma_vaitro = insertResult.insertId;
        }
      }
    } catch (roleError) {
      console.error('Lỗi khi tìm vai trò:', roleError);
      // Vẫn tiếp tục với ma_vaitro = 3
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo mã định danh
    const ma_dinhdanh = 'PG' + Date.now();

    console.log('Đang đăng ký user:', { email, ma_vaitro });

    // Lưu người dùng mới
    const [result] = await db.execute(
      'INSERT INTO nguoidung (ma_dinhdanh, ho_ten, email, so_dienthoai, matkhau, ma_vaitro) VALUES (?, ?, ?, ?, ?, ?)',
      [ma_dinhdanh, ho_ten, email, so_dienthoai, hashedPassword, ma_vaitro]
    );

    console.log('✅ Đăng ký thành công! User ID:', result.insertId);

    res.json({ 
      success: true, 
      message: 'Đăng ký thành công!' 
    });

  } catch (error) {
    console.error('❌ Lỗi đăng ký:', error);
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.json({ 
        success: false, 
        message: 'Lỗi hệ thống. Vui lòng liên hệ quản trị viên.' 
      });
    }
    
    res.json({ 
      success: false, 
      message: 'Lỗi hệ thống: ' + error.message 
    });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: 'Vui lòng nhập email và mật khẩu.' });
    }

    // Tìm người dùng trong database
    const [users] = await db.execute(
      'SELECT * FROM nguoidung WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
    }

    const user = users[0];

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.matkhau);
    
    if (!isPasswordValid) {
      return res.json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (user.kich_hoat !== 1) {
      return res.json({ success: false, message: 'Tài khoản của bạn đã bị khóa.' });
    }

    // Lưu thông tin vào session
    req.session.user = {
      ma_nguoidung: user.ma_nguoidung,
      ho_ten: user.ho_ten,
      email: user.email,
      ma_vaitro: user.ma_vaitro
    };

    res.json({ 
      success: true, 
      message: 'Đăng nhập thành công!',
      user: {
        ho_ten: user.ho_ten,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
});

// Đăng xuất
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ success: false, message: 'Lỗi đăng xuất.' });
    }
    res.json({ success: true, message: 'Đăng xuất thành công!' });
  });
});

// Kiểm tra đăng nhập
router.get('/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ 
      success: true, 
      user: req.session.user 
    });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;