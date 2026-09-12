import schoolLogo from "../assets/logo-hcmue.png";
import anniversaryLogo from "../assets/logo-50-hcmue.png";

export default function AnniversaryHeader({ className = "" }) {
  return (
    <header className={`anniversary-header ${className}`.trim()}>
      <img
        src={schoolLogo}
        alt="Trường Đại học Sư phạm Thành phố Hồ Chí Minh"
        className="anniversary-header__school-logo"
      />

      <div className="anniversary-header__title">
        <div>
          Chào mừng kỷ niệm 50 năm Ngày truyền thống Trường Đại học
          Sư phạm Thành phố Hồ Chí Minh
        </div>
        <span>(27/10/1976 - 27/10/2026)</span>
      </div>

      <img
        src={anniversaryLogo}
        alt="Logo kỷ niệm 50 năm Trường Đại học Sư phạm Thành phố Hồ Chí Minh"
        className="anniversary-header__anniversary-logo"
      />
    </header>
  );
}
