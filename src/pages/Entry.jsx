import { ArrowRight, Globe2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import schoolLogo from "../assets/logo-hcmue.png";

export default function Entry() {
  return (
    <main className="entry-page">
      <div className="entry-background">
        <div className="entry-cloud entry-cloud-1" />
        <div className="entry-cloud entry-cloud-2" />
      </div>

      <div className="entry-container">
        {/* HEADER */}
        <header className="entry-header">
          <img
            src={schoolLogo}
            alt="Trường Đại học Sư phạm Thành phố Hồ Chí Minh"
            className="entry-school-logo"
          />
        </header>
          <div className="entry-header-title">
            <div>
              Chào mừng kỷ niệm 50 năm Ngày truyền thống Trường Đại học
              Sư phạm Thành phố Hồ Chí Minh
            </div>

            <span>(27/10/1976 - 27/10/2026)</span>
          </div>

        {/* CONTENT */}
        <section className="entry-content">
          <div className="entry-event-title">
            <div className="entry-script-title">Ngày hội</div>

            <h1>
              GIAO LƯU VĂN HÓA QUỐC TẾ
            </h1>

            <p>
              Cùng khám phá các sắc màu văn hóa sẽ xuất hiện trong ngày hội nhé!
            </p>
          </div>

          <div className="entry-divider" />

          <h2>Chào mừng bạn đến với ngày hội!</h2>

          <p className="entry-description">
            Vui lòng chọn hình thức truy cập để tiếp tục.
          </p>

          <div className="entry-options">
            {/* GUEST */}
            <Link
              to="/home"
              className="entry-option entry-option-guest"
            >
              <div className="entry-option-icon">
                <Globe2 size={32} strokeWidth={1.8} />
              </div>

              <div className="entry-option-content">
                <h3>Guest</h3>

                <p>
                  Khám phá các tiết mục và thông tin của ngày hội.
                </p>
              </div>

              <ArrowRight className="entry-option-arrow" size={22} />
            </Link>

            {/* BTC */}
            <Link
              to="/btc-login"
              className="entry-option entry-option-btc"
            >
              <div className="entry-option-icon">
                <ShieldCheck size={32} strokeWidth={1.8} />
              </div>

              <div className="entry-option-content">
                <h3>Ban Tổ chức</h3>

                <p>
                  Đăng nhập để quản lý và theo dõi các tiết mục đăng ký.
                </p>
              </div>

              <ArrowRight className="entry-option-arrow" size={22} />
            </Link>
          </div>
        </section>

        <footer className="entry-footer">
          <span>
            Ngày hội giao lưu văn hóa quốc tế
          </span>

          <span>•</span>

          <span>HCMUE 2026</span>
        </footer>
      </div>
    </main>
  );
}