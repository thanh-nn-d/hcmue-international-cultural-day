import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  RotateCcw,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  clearLocalSubmissions,
  getSubmissions,
  updateSubmissionStatus,
} from "../services/storage";

const statusLabel = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const statusDescription = {
  pending: "Đang chờ Ban Tổ chức xem xét.",
  approved: "Đã được duyệt và sẽ hiển thị công khai.",
  rejected: "Chưa được duyệt để hiển thị công khai.",
};

function DetailRow({ label, children }) {
  return (
    <div className="admin-detail-row">
      <span>{label}</span>
      <div>{children || "—"}</div>
    </div>
  );
}

function PerformanceApplication({ item, onChangeStatus }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="admin-application">
      <div className="admin-application-summary">
        <div className="admin-application-main">
          <div className="admin-application-number">TIẾT MỤC</div>
          <h2>{item.title || "Chưa có tên tiết mục"}</h2>
          <p>
            {item.unit || "Chưa cập nhật đơn vị"} ·{" "}
            {item.people ? `${item.people} người` : "Chưa cập nhật số lượng"}{" "}
            ·{" "}
            {item.duration
              ? `${item.duration} phút`
              : "Chưa cập nhật thời lượng"}
          </p>
        </div>

        <div className="admin-application-status">
          <span className={`status status-${item.status}`}>
            {statusLabel[item.status] || item.status}
          </span>
          <small>{statusDescription[item.status]}</small>
        </div>

        <button
          type="button"
          className="admin-detail-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {open ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
          <span>{open ? "Thu gọn" : "Xem chi tiết"}</span>
        </button>
      </div>

      {open && (
        <div className="admin-application-detail">
          <div className="admin-detail-section">
            <div className="admin-detail-section-title">
              <span>01</span>
              <div>
                <h3>Thông tin đơn vị</h3>
                <p>Thông tin liên hệ của đơn vị đăng ký.</p>
              </div>
            </div>

            <div className="admin-detail-grid">
              <DetailRow label="Đơn vị đăng ký">
                {item.unit}
              </DetailRow>
              <DetailRow label="Người phụ trách - Chức vụ">
                {item.contact}
              </DetailRow>
              <DetailRow label="Số điện thoại">
                {item.phone}
              </DetailRow>
            </div>
          </div>

          <div className="admin-detail-section">
            <div className="admin-detail-section-title">
              <span>02</span>
              <div>
                <h3>Thông tin tiết mục</h3>
                <p>Nội dung được cung cấp trong phiếu đăng ký.</p>
              </div>
            </div>

            <div className="admin-detail-grid admin-detail-grid-one">
              <DetailRow label="Tên tiết mục">
                {item.title}
              </DetailRow>
              <DetailRow label="Quốc gia / nền văn hóa đại diện">
                {item.culture}
              </DetailRow>
              <DetailRow label="Nội dung, ý nghĩa tiết mục">
                {item.meaning}
              </DetailRow>
            </div>

            <div className="admin-detail-grid">
              <DetailRow label="Số lượng người">
                {item.people ? `${item.people} người` : null}
              </DetailRow>
              <DetailRow label="Thời lượng biểu diễn">
                {item.duration ? `${item.duration} phút` : null}
              </DetailRow>
              <DetailRow label="Yêu cầu kỹ thuật">
                {item.technical}
              </DetailRow>
            </div>
          </div>

          <div className="admin-detail-section">
            <div className="admin-detail-section-title">
              <span>03</span>
              <div>
                <h3>Danh sách tham gia & xác nhận</h3>
                <p>Thông tin được gửi kèm hồ sơ đăng ký.</p>
              </div>
            </div>

            <div className="admin-detail-grid">
              <DetailRow label="Danh sách tham gia">
                {item.participantFileName || "Chưa cập nhật"}
              </DetailRow>
              <DetailRow label="Xác nhận cam kết tham gia">
                {item.commitment}
              </DetailRow>
            </div>
          </div>

          <div className="admin-review-bar">
            <div>
              <strong>Quyết định hiển thị</strong>
              <span>
                Chỉ chọn “Duyệt” khi tiết mục đáp ứng yêu cầu của chương trình.
              </span>
            </div>

            <div className="admin-review-actions">
              <button
                type="button"
                className="admin-review-btn admin-review-approve"
                onClick={() => onChangeStatus(item.id, "approved")}
              >
                <Check size={17} />
                Duyệt & hiển thị
              </button>

              <button
                type="button"
                className="admin-review-btn admin-review-reject"
                onClick={() => onChangeStatus(item.id, "rejected")}
              >
                <X size={17} />
                Từ chối
              </button>

              {item.status !== "pending" && (
                <button
                  type="button"
                  className="admin-review-btn admin-review-pending"
                  onClick={() => onChangeStatus(item.id, "pending")}
                >
                  <Eye size={17} />
                  Đưa về chờ duyệt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function Admin() {
  const [items, setItems] = useState(getSubmissions());
  const [filter, setFilter] = useState("all");

  const change = (id, status) => {
    setItems(updateSubmissionStatus(id, status));
  };

  const reset = () => {
    clearLocalSubmissions();
    setItems(getSubmissions());
  };

  const counts = useMemo(
    () => ({
      all: items.length,
      pending: items.filter((item) => item.status === "pending").length,
      approved: items.filter((item) => item.status === "approved").length,
      rejected: items.filter((item) => item.status === "rejected").length,
    }),
    [items]
  );

  const filteredItems =
    filter === "all"
      ? items
      : items.filter((item) => item.status === filter);

  return (
    <section className="page-section admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="page-title">
            <span className="eyebrow">KHU VỰC BAN TỔ CHỨC</span>
            <h1>Quản lý đăng ký</h1>
            <p>
              Xem toàn bộ nội dung hồ sơ đăng ký, kiểm tra thông tin và quyết
              định tiết mục nào được hiển thị công khai trên website.
            </p>
          </div>

          <button className="btn btn-light" onClick={reset}>
            <RotateCcw size={17} />
            Khôi phục dữ liệu mẫu
          </button>
        </div>

        <div className="admin-summary">
          <div className="admin-summary-item">
            <span>Tổng đăng ký</span>
            <strong>{counts.all}</strong>
          </div>
          <div className="admin-summary-item admin-summary-pending">
            <span>Chờ duyệt</span>
            <strong>{counts.pending}</strong>
          </div>
          <div className="admin-summary-item admin-summary-approved">
            <span>Đã duyệt</span>
            <strong>{counts.approved}</strong>
          </div>
          <div className="admin-summary-item admin-summary-rejected">
            <span>Từ chối</span>
            <strong>{counts.rejected}</strong>
          </div>
        </div>

        <div className="admin-filter">
          {[
            ["all", "Tất cả"],
            ["pending", "Chờ duyệt"],
            ["approved", "Đã duyệt"],
            ["rejected", "Từ chối"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
              <span>{counts[value]}</span>
            </button>
          ))}
        </div>

        <div className="admin-applications">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <PerformanceApplication
                key={item.id}
                item={item}
                onChangeStatus={change}
              />
            ))
          ) : (
            <div className="admin-empty">
              <div className="admin-empty-icon">
                <Eye size={25} />
              </div>
              <h2>Không có hồ sơ phù hợp</h2>
              <p>
                Hiện chưa có đăng ký nào trong trạng thái này.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
