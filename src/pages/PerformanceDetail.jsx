import { ArrowLeft, Clock3, UsersRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getSubmissions } from "../services/storage";

export default function PerformanceDetail() {
  const { id } = useParams();
  const item = getSubmissions().find((entry) => entry.id === id);

  if (!item) {
    return <section className="page-section"><div className="container empty-state">Không tìm thấy tiết mục.</div></section>;
  }

  return (
    <section className="page-section">
      <div className="container detail-layout">
        <Link to="/cac-tiet-muc" className="back-link"><ArrowLeft size={17} /> Quay lại danh sách</Link>
        <article className="detail-card">
          <div className="detail-cover">
            {item.thumbnail ? <img src={item.thumbnail} alt={item.title} /> : <div className="detail-placeholder">GIAO LƯU VĂN HÓA QUỐC TẾ</div>}
          </div>
          <div className="detail-content">
            <span className="category-pill static">Tiết mục</span>
            <h1>{item.title}</h1>
            <p className="detail-unit">{item.unit}</p>
            <div className="detail-meta">
              <span><Clock3 size={18} /> {item.duration ? `${item.duration} phút` : "Chưa cập nhật"}</span>
              <span><UsersRound size={18} /> {item.people ? `${item.people} thành viên` : "Chưa cập nhật"}</span>
            </div>
            <div className="detail-section">
              <h3>Quốc gia / nền văn hóa đại diện</h3>
              <p>{item.culture || "Thông tin sẽ được cập nhật."}</p>
            </div>
            <div className="detail-section">
              <h3>Nội dung, ý nghĩa tiết mục</h3>
              <p>{item.meaning || "Thông tin sẽ được cập nhật."}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
