import {
  Clock3,
  ListChecks,
  Store,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { REGISTRATION_TYPES } from "../services/storage";

const typeLabels = {
  [REGISTRATION_TYPES.ART]: "Chương trình nghệ thuật",
  [REGISTRATION_TYPES.EXHIBITION]: "Gian hàng triển lãm",
  [REGISTRATION_TYPES.ACTIVITY]: "Hoạt động của đơn vị",
};

export default function PerformanceCard({ item }) {
  const registrationType =
    item.registrationType || REGISTRATION_TYPES.ART;

  const isExhibition =
    registrationType === REGISTRATION_TYPES.EXHIBITION;

  const isActivity =
    registrationType === REGISTRATION_TYPES.ACTIVITY;

  const typeLabel =
    typeLabels[registrationType] || typeLabels[REGISTRATION_TYPES.ART];

  const activities = Array.isArray(item.activities)
    ? item.activities
    : [];

  const title = isExhibition
    ? "Gian hàng triển lãm"
    : isActivity
      ? "Hoạt động của đơn vị"
      : item.title || "Chương trình nghệ thuật";

  return (
    <Link
      className="performance-card"
      to={`/cac-tiet-muc/${item.id}`}
    >
      <div className="performance-thumb">
        {isExhibition ? (
          <div className="thumb-placeholder">
            <Store size={38} strokeWidth={1.5} />
            <span>GIAN HÀNG</span>
            <b className="thumb-event-title">
              TRIỂN LÃM VĂN HÓA
            </b>
          </div>
        ) : isActivity ? (
          <div className="thumb-placeholder">
            <ListChecks size={38} strokeWidth={1.5} />
            <span>NGÀY HỘI</span>
            <b className="thumb-event-title">
              HOẠT ĐỘNG CỦA ĐƠN VỊ
            </b>
          </div>
        ) : item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
          />
        ) : (
          <div className="thumb-placeholder">
            <span>NGÀY HỘI</span>
            <b className="thumb-event-title">
              GIAO LƯU VĂN HÓA QUỐC TẾ
            </b>
          </div>
        )}

        <span className="category-pill">
          {typeLabel}
        </span>

        <div className="hover-detail">
          <span>Xem chi tiết</span>
        </div>
      </div>

      <div className="performance-body">
        <h3>{title}</h3>

        <p>{item.unit || "Chưa cập nhật đơn vị"}</p>

        <div className="card-meta">
          {isExhibition ? (
            <>
              <span>
                <Store size={15} />
                Gian hàng
              </span>

              <span>
                <Clock3 size={15} />
                {item.completionTime || "Chưa cập nhật"}
              </span>
            </>
          ) : isActivity ? (
            <span>
              <ListChecks size={15} />
              {activities.length
                ? `${activities.length} hoạt động`
                : "Chưa cập nhật"}
            </span>
          ) : (
            <>
              <span>
                <Clock3 size={15} />
                {item.duration
                  ? `${item.duration} phút`
                  : "Chưa cập nhật"}
              </span>

              <span>
                <UsersRound size={15} />
                {item.people
                  ? `${item.people} thành viên`
                  : "Chưa cập nhật"}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}