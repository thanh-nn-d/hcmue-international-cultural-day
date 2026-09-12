import { NavLink } from "react-router-dom";
import { ArrowLeft, Globe2, Home as HomeIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo-hcmue.png";
import logo50 from "../assets/logo-50-hcmue.png";

const guestLinks = [
  { to: "/home", label: "Trang chủ", icon: HomeIcon },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/dang-ky-ngay-hoi", label: "Đăng ký Ngày hội" },
  { to: "/cac-tiet-muc", label: "Khám phá Ngày hội" },
];

const btcLinks = [
  { to: "/home", label: "Trang chủ", icon: HomeIcon },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/admin", label: "Quản lý đăng ký" },
  { to: "/cac-tiet-muc", label: "Khám phá Ngày hội" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
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

          <div className="anniversary-logo">
            <img
              src={logo50}
              alt="Logo kỷ niệm 50 năm Trường Đại học Sư phạm Thành phố Hồ Chí Minh"
            />
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

            {!isBTC && (
              <NavLink
                to="/"
                className="nav-link nav-back-entry"
                onClick={() => {
                  localStorage.removeItem("hicd_btc_authenticated");
                  setOpen(false);
                }}
              >
                <ArrowLeft size={18} />
                <span>Quay lại trang chọn</span>
              </NavLink>
            )}

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
