import { useState, useEffect } from "react";
import "../styles/main.css";

export default function Layout({
  activeMenu = "coach",
  title,
  subtitle,
  searchPlaceholder = "Tìm kiếm...",
  onSelectMenu,
  children,
}) {
  const [openMenu, setOpenMenu] = useState(false);

  const handleClickMenu = (menuKey) => (e) => {
    e.preventDefault();
    if (onSelectMenu) onSelectMenu(menuKey);
  };

  useEffect(() => {
    function handleClickOutside() {
      setOpenMenu(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function toggleDropdown(e) {
    e.stopPropagation();
    setOpenMenu((prev) => !prev);
  }

  function handleLogout() {
    alert("Đăng xuất thành công!");
  }

  return (
    <div className="page_wrapper">
      <div className="side_bar">
        <div className="side_bar_title">
          <h1>Gym Admin</h1>
        </div>
        <div className="side_bar_content">
          <a
            href="#"
            className={activeMenu === "member" ? "menu_item active" : "menu_item"}
            onClick={handleClickMenu("member")}
          >
            Quản lý hội viên
          </a>

          <a
            href="#"
            className={activeMenu === "coach" ? "menu_item active" : "menu_item"}
            onClick={handleClickMenu("coach")}
          >
            Quản lý huấn luyện viên
          </a>
        </div>
      </div>

      <div className="main_content">
        <header>
          <div className="header_left">
            <div className="box_input">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-search"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
              <input type="text" placeholder={searchPlaceholder} />
            </div>
          </div>

          <div className="header_right">
            <img
              src="https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg"
              alt="Avatar"
            />
            <div className="info">
              <h4>Moni Roy</h4>
              <p>Admin</p>
            </div>

            <div className="header_right_icon" onClick={toggleDropdown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>

              {openMenu && (
                <div className="dropdown_menu">
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main>
          <div className="main_header">
            <div>
              <div className="main_title">{title}</div>
              {subtitle && <p className="main_subtitle">{subtitle}</p>}
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
