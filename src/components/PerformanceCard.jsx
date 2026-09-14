import { Clock3, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const unitFlags = {
  "Khoa Ngữ văn": {
    flag: "🇻🇳",
    country: "Việt Nam",
  },
  "Khoa Tiếng Anh": {
    flag: "🇬🇧",
    country: "Anh",
  },
  "Khoa Tiếng Pháp": {
    flag: "🇫🇷",
    country: "Pháp",
  },
  "Khoa Tiếng Nga": {
    flag: "🇷🇺",
    country: "Nga",
  },
  "Khoa Tiếng Trung": {
    flag: "🇨🇳",
    country: "Trung Quốc",
  },
  "Khoa Tiếng Nhật": {
    flag: "🇯🇵",
    country: "Nhật Bản",
  },
  "Khoa Tiếng Hàn Quốc": {
    flag: "🇰🇷",
    country: "Hàn Quốc",
  },
};

export default function PerformanceCard({ item }) {
  const firstPerformance =
    Array.isArray(item.performances) && item.performances.length > 0
      ? item.performances[0]
      : item;

  const unitInfo = unitFlags[item.unit];

  return (
    <Link className="performance-card" to={`/cac-tiet-muc/${item.id}`}>
      <div className="performance-thumb">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={firstPerformance.title || "Chương trình nghệ thuật"}
          />
        ) : unitInfo ? (
          <div className="thumb-placeholder thumb-country">
            <span className="country-flag" aria-hidden="true">
              {unitInfo.flag}
            </span>

            <b>{unitInfo.country}</b>
          </div>
        ) : (
          <div className="thumb-placeholder">
            <span>NGÀY HỘI</span>
            <b>GIAO LƯU VĂN HÓA QUỐC TẾ</b>
          </div>
        )}

        <span className="category-pill">Tiết mục</span>

        <div className="hover-detail">
          <span>Xem chi tiết</span>
        </div>
      </div>

      <div className="performance-body">
        <h3>{firstPerformance.title || "Chưa có tên tiết mục"}</h3>

        <p>{item.unit}</p>

        <div className="card-meta">
          <span>
            <Clock3 size={15} />{" "}
            {firstPerformance.duration
              ? `${firstPerformance.duration} phút`
              : "Chưa cập nhật"}
          </span>

          <span>
            <UsersRound size={15} />{" "}
            {firstPerformance.people
              ? `${firstPerformance.people} thành viên`
              : "Chưa cập nhật"}
          </span>
        </div>
      </div>
    </Link>
  );
}