import { Clock3, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const unitFlags = {
  "Khoa Ngữ văn": {
    flag: "https://flagcdn.com/w160/vn.png",
    country: "Việt Nam",
  },
  "Khoa Tiếng Anh": {
    flag: "https://flagcdn.com/w160/gb.png",
    country: "Anh",
  },
  "Khoa Tiếng Pháp": {
    flag: "https://flagcdn.com/w160/fr.png",
    country: "Pháp",
  },
  "Khoa Tiếng Nga": {
    flag: "https://flagcdn.com/w160/ru.png",
    country: "Nga",
  },
  "Khoa Tiếng Trung": {
    flag: "https://flagcdn.com/w160/cn.png",
    country: "Trung Quốc",
  },
  "Khoa Tiếng Nhật": {
    flag: "https://flagcdn.com/w160/jp.png",
    country: "Nhật Bản",
  },
  "Khoa Tiếng Hàn Quốc": {
    flag: "https://flagcdn.com/w160/kr.png",
    country: "Hàn Quốc",
  },
};

const typeInfo = {
  "art-program": {
    label: "TIẾT MỤC",
    title: "Chưa có tên tiết mục",
  },
  "exhibition-booth": {
    label: "GIAN HÀNG",
    title: "Gian hàng triển lãm",
  },
  "unit-activity": {
    label: "HOẠT ĐỘNG",
    title: "Hoạt động của đơn vị",
  },
};

function normalizeUnit(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

function getUnitInfo(unit) {
  const normalizedUnit = normalizeUnit(unit);

  return (
    Object.entries(unitFlags).find(
      ([name]) => normalizeUnit(name) === normalizedUnit
    )?.[1] || null
  );
}

function getContentType(item) {
  return item.registrationType || "art-program";
}

export default function PerformanceCard({ item }) {
  const firstPerformance =
    Array.isArray(item.performances) && item.performances.length > 0
      ? item.performances[0]
      : item;

  const contentType = getContentType(item);
  const info = typeInfo[contentType] || typeInfo["art-program"];
  const unitInfo = getUnitInfo(item.unit);

  const title =
    contentType === "art-program"
      ? firstPerformance.title || info.title
      : info.title;

  const duration =
    contentType === "art-program" ? firstPerformance.duration : null;

  const people =
    contentType === "art-program" ? firstPerformance.people : null;

  return (
    <Link
      className="performance-card"
      to={`/cac-tiet-muc/${item.id}`}
    >
      <div className="performance-thumb">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={title} />
        ) : unitInfo ? (
          <div className="thumb-placeholder thumb-country">
            <img
              className="country-flag-image"
              src={unitInfo.flag}
              alt={`Cờ ${unitInfo.country}`}
              loading="lazy"
            />
            <b>{unitInfo.country}</b>
          </div>
        ) : (
          <div className="thumb-placeholder">
            <span>NGÀY HỘI</span>
            <b>GIAO LƯU VĂN HÓA QUỐC TẾ</b>
          </div>
        )}

        <span className="category-pill">{info.label}</span>

        <div className="hover-detail">
          <span>Xem chi tiết</span>
        </div>
      </div>

      <div className="performance-body">
        <h3>{title}</h3>

        <p>{item.unit}</p>

        {contentType === "art-program" ? (
          <div className="card-meta">
            <span>
              <Clock3 size={15} />{" "}
              {duration ? `${duration} phút` : "Chưa cập nhật"}
            </span>

            <span>
              <UsersRound size={15} />{" "}
              {people ? `${people} thành viên` : "Chưa cập nhật"}
            </span>
          </div>
        ) : (
          <div className="card-meta">
            <span>{info.label}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
