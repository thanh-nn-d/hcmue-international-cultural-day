import {
  CalendarDays,
  MapPin,
  UsersRound,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import InfoItem from "../components/InfoItem";
import PerformanceCarousel from "../components/PerformanceCarousel";
import { loadPublicSubmissions } from "../services/storage";

export default function Home() {
  const [items, setItems] = useState([]);

  const isBTC =
    localStorage.getItem("hicd_btc_authenticated") === "true";

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await loadPublicSubmissions();

        if (!active) return;

        // Trang chủ hiển thị tất cả nội dung đã được BTC duyệt,
        // không chia theo loại đăng ký.
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) {
          console.error("Không thể tải nội dung công khai:", error);
          setItems([]);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hicd_btc_authenticated");
    window.location.href = "/";
  };

  return (
    <>
      <section className="hero">
        <div className="hero-clouds" />

        <div className="container hero-content">
          <div className="hero-copy">
            <div className="script-title">Ngày hội</div>

            <h1>GIAO LƯU VĂN HÓA QUỐC TẾ</h1>

            <div className="hero-info">
              <InfoItem
                icon={<CalendarDays size={25} />}
                title="Thời gian"
                value="08g00 ngày 26/10/2026 (thứ Hai)"
              />

              <InfoItem
                icon={<MapPin size={25} />}
                title="Địa điểm"
                value="Cơ sở 280 An Dương Vương, Trường Đại học Sư phạm Thành phố Hồ Chí Minh"
              />

              <InfoItem
                icon={<UsersRound size={25} />}
                title="Đối tượng"
                value="Người học, viên chức, người lao động và khách mời trong nước, quốc tế"
              />
            </div>

            <div className="hero-actions">
              <Link
                to={isBTC ? "/admin" : "/dang-ky-ngay-hoi"}
                className="btn btn-primary"
              >
                {isBTC ? "QUẢN LÝ ĐĂNG KÝ" : "ĐĂNG KÝ NGÀY HỘI"}{" "}
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/cac-tiet-muc"
                className="btn btn-outline"
              >
                KHÁM PHÁ NGÀY HỘI <ArrowRight size={19} />
              </Link>
            </div>

            {isBTC && (
              <div className="home-btc-actions">
                <span>Đang đăng nhập với quyền Ban Tổ chức</span>

                <button
                  type="button"
                  className="home-btc-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section performances-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="heading-mark">
                <i />
                <i />
              </div>

              <h2>KHÁM PHÁ NGÀY HỘI</h2>

              <p>
                Cùng khám phá các sắc màu văn hóa và những hoạt động sẽ xuất
                hiện trong ngày hội nhé!
              </p>
            </div>

            <Link
              to="/cac-tiet-muc"
              className="see-all"
            >
              Xem tất cả <ArrowRight size={18} />
            </Link>
          </div>

          <PerformanceCarousel items={items} />
        </div>
      </section>
    </>
  );
}
