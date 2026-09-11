import { NavLink, useLocation } from "react-router-dom";
import { Globe2, Home as HomeIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo-hcmue.png";

const guestLinks = [
  { to: "/home", label: "Trang chủ", icon: HomeIcon },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/dang-ky-tiet-muc", label: "Đăng ký tiết mục" },
  { to: "/cac-tiet-muc", label: "Các tiết mục tham gia" },
];

const btcLinks = [
  { to: "/home", label: "Trang chủ", icon: HomeIcon },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/admin", label: "Quản lý đăng ký" },
  { to: "/cac-tiet-muc", label: "Các tiết mục tham gia" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const authenticated =
    localStorage.getItem("hicd_btc_authenticated") === "true";

  // BTC giữ phiên đăng nhập khi đi Trang chủ/Giới thiệu/Các tiết mục.
  const isBTC = authenticated;
  const links = isBTC ? btcLinks : guestLinks;

  return (
    <header className="site-header">
      <div className="brand-strip">
        <div className="container brand-inner">
          <NavLink
            to={isBTC ? "/home" : "/home"}
            className="brand-logo"
            onClick={() => setOpen(false)}
          >
            <img
              src={logo}
              alt="Trường Đại học Sư phạm Thành phố Hồ Chí Minh"
            />
          </NavLink>

          <div className="anniversary-copy">
            <div className="anniversary-line">
              Chào mừng kỷ niệm 50 năm Ngày truyền thống Trường Đại học Sư
              phạm Thành phố Hồ Chí Minh
            </div>
            <span>(27/10/1976 - 27/10/2026)</span>
          </div>

          <div
            className="anniversary-placeholder"
            aria-label="Logo biểu trưng 50 năm"
          >
            <span>50</span>
            <small>1976 - 2026</small>
          </div>
        </div>
      </div>

      <nav className="main-nav">
        <div className="container nav-inner">
          <button
            className="mobile-menu-btn"
            onClick={() => setOpen((value) => !value)}
            aria-label="Mở menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-links ${open ? "is-open" : ""}`}>
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={() => setOpen(false)}
              >
                {Icon && <Icon size={18} />}
                <span>{label}</span>
              </NavLink>
            ))}

            <div className="language">
              <Globe2 size={18} />
              <span>VI</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
