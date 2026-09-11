import { CalendarDays, MapPin, UsersRound, ArrowRight, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import InfoItem from "../components/InfoItem";
import PerformanceCarousel from "../components/PerformanceCarousel";
import { getSubmissions } from "../services/storage";
import buildingA01 from "../assets/building-a01.png";
import border from "../assets/vien-hcmue.png";

export default function Home() {
  const items = getSubmissions().filter((item) => item.status === "approved");
  const isBTC =
    localStorage.getItem("hicd_btc_authenticated") === "true";

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
            <h1>GIAO LƯU<br />VĂN HÓA QUỐC TẾ</h1>
            <div className="hero-info">
              <InfoItem icon={<CalendarDays size={25} />} title="Thời gian" value="Bổ sung thông tin sau" />
              <InfoItem icon={<MapPin size={25} />} title="Địa điểm" value="Bổ sung thông tin sau" />
              <InfoItem icon={<UsersRound size={25} />} title="Đối tượng" value="Bổ sung thông tin sau" />
            </div>

            <div className="hero-actions">
              <Link
                to={isBTC ? "/admin" : "/dang-ky-tiet-muc"}
                className="btn btn-primary"
              >
                {isBTC ? "QUẢN LÝ ĐĂNG KÝ" : "ĐĂNG KÝ TIẾT MỤC"}{" "}
                <ArrowRight size={19} />
              </Link>

              <Link to="/cac-tiet-muc" className="btn btn-outline">
                XEM CÁC TIẾT MỤC ĐÃ ĐĂNG KÝ <ArrowRight size={19} />
              </Link>
            </div>

            {isBTC && (
              <div className="home-btc-actions">
                <span>Đang đăng nhập với quyền Ban Tổ chức</span>
                <button type="button" onClick={handleLogout}>
                  <LogOut size={17} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

          <div className="hero-art">
            <div className="hero-brand-element" aria-hidden="true"><i /><i /></div>
            <img src={buildingA01} alt="Hình minh họa tòa nhà HCMUE" />
            <img className="hero-ribbon" src={border} alt="" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="section performances-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="heading-mark"><i /><i /></div>
              <h2>CÁC TIẾT MỤC ĐÃ ĐĂNG KÝ</h2>
              <p>Cùng khám phá các sắc màu văn hóa sẽ xuất hiện trong ngày hội nhé!</p>
            </div>
            <Link to="/cac-tiet-muc" className="see-all">Xem tất cả <ArrowRight size={18} /></Link>
          </div>
          <PerformanceCarousel items={items} />
        </div>
      </section>
    </>
  );
}
