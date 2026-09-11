import { Clock3, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function PerformanceCard({ item }) {
  return (
    <Link className="performance-card" to={`/cac-tiet-muc/${item.id}`}>
      <div className="performance-thumb">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} />
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
        <h3>{item.title}</h3>
        <p>{item.unit}</p>
        <div className="card-meta">
          <span><Clock3 size={15} /> {item.duration ? `${item.duration} phút` : "Chưa cập nhật"}</span>
          <span><UsersRound size={15} /> {item.people ? `${item.people} thành viên` : "Chưa cập nhật"}</span>
        </div>
      </div>
    </Link>
  );
}
