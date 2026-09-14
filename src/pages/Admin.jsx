import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  RotateCcw,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getSubmissions,
  loadSubmissions,
  updateSubmissionStatus,
  REGISTRATION_TYPES,
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

const registrationTypeItems = [
  [REGISTRATION_TYPES.ART, "Chương trình nghệ thuật"],
  [REGISTRATION_TYPES.EXHIBITION, "Gian hàng triển lãm"],
  [REGISTRATION_TYPES.ACTIVITY, "Hoạt động của đơn vị"],
];

function DetailRow({ label, children }) {
  return (
    <div className="admin-detail-row">
      <span>{label}</span>
      <div>{children || "—"}</div>
    </div>
  );
}

function SummaryBreakdown({ items, status }) {
  return (
    <div className="admin-summary-breakdown">
      {registrationTypeItems.map(([type, label]) => {
        const count = items.filter(
          (item) =>
            (item.registrationType || REGISTRATION_TYPES.ART) === type &&
            (!status || item.status === status)
        ).length;

        return (
          <div className="admin-summary-breakdown-item" key={type}>
            <span>{label}</span>
            <strong>{count}</strong>
          </div>
        );
      })}
    </div>
  );
}

function ApplicationTitle({ item }) {
  const type = item.registrationType || REGISTRATION_TYPES.ART;

  if (type === REGISTRATION_TYPES.EXHIBITION) {
    return (
      <>
        <div className="admin-application-number">GIAN HÀNG</div>
        <h2>{item.exhibitionContent || "Chưa có nội dung triển lãm"}</h2>
        <p>
          {item.unit || "Chưa cập nhật đơn vị"} ·{" "}
          {item.completionTime || "Chưa cập nhật thời gian hoàn thiện"}
        </p>
      </>
    );
  }

  if (type === REGISTRATION_TYPES.ACTIVITY) {
    const activityCount = Array.isArray(item.activities)
      ? item.activities.length
      : 0;

    return (
      <>
        <div className="admin-application-number">HOẠT ĐỘNG</div>
        <h2>
          {activityCount > 0
            ? `${activityCount} hoạt động đã đăng ký`
            : "Chưa có tên hoạt động"}
        </h2>
        <p>
          {item.unit || "Chưa cập nhật đơn vị"} ·{" "}
          {item.contact || "Chưa cập nhật người phụ trách"}
        </p>
      </>
    );
  }

  const firstPerformance =
    Array.isArray(item.performances) && item.performances.length > 0
      ? item.performances[0]
      : item;

  return (
    <>
      <div className="admin-application-number">TIẾT MỤC</div>
      <h2>{firstPerformance.title || "Chưa có tên tiết mục"}</h2>
      <p>
        {item.unit || "Chưa cập nhật đơn vị"} ·{" "}
        {firstPerformance.people
          ? `${firstPerformance.people} người`
          : "Chưa cập nhật số lượng"} ·{" "}
        {firstPerformance.duration
          ? `${firstPerformance.duration} phút`
          : "Chưa cập nhật thời lượng"}
        {Array.isArray(item.performances) && item.performances.length > 1
          ? ` · ${item.performances.length} tiết mục`
          : ""}
      </p>
    </>
  );
}

function ConfirmationSection({ number, commitment }) {
  return (
    <div className="admin-detail-section">
      <div className="admin-detail-section-title">
        <span>{number}</span>
        <div>
          <h3>Xác nhận tham gia</h3>
          <p>Xác nhận cuối cùng của đơn vị trong phiếu đăng ký.</p>
        </div>
      </div>

      <div className="admin-detail-grid">
        <DetailRow label="Xác nhận tham gia">
          {commitment || "Chưa xác nhận"}
        </DetailRow>
      </div>
    </div>
  );
}

function PerformanceApplication({ item, onChangeStatus, processingId, processingStatus }) {
  const [open, setOpen] = useState(false);
  const type = item.registrationType || REGISTRATION_TYPES.ART;
  const isArt = type === REGISTRATION_TYPES.ART;
  const isExhibition = type === REGISTRATION_TYPES.EXHIBITION;

  return (
    <article className="admin-application">
      <div className="admin-application-summary">
        <div className="admin-application-main">
          <ApplicationTitle item={item} />
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
              <DetailRow label="Đơn vị đăng ký">{item.unit}</DetailRow>
              <DetailRow label="Người phụ trách - Chức vụ">
                {item.contact}
              </DetailRow>
              {isArt && (
                <DetailRow label="Số điện thoại">{item.phone}</DetailRow>
              )}
            </div>
          </div>

          {isArt && (
            <>
              <div className="admin-detail-section">
                <div className="admin-detail-section-title">
                  <span>02</span>
                  <div>
                    <h3>Thông tin chương trình nghệ thuật</h3>
                    <p>Nội dung được cung cấp trong phiếu đăng ký.</p>
                  </div>
                </div>

                {(Array.isArray(item.performances) ? item.performances : [item]).map(
                  (performance, index) => (
                    <div key={performance.id || index}>
                      <div className="admin-detail-grid admin-detail-grid-one">
                        <DetailRow label={`Tên tiết mục ${index + 1}`}>
                          {performance.title}
                        </DetailRow>
                        <DetailRow label="Quốc gia / nền văn hóa đại diện">
                          {performance.culture}
                        </DetailRow>
                        <DetailRow label="Nội dung, ý nghĩa tiết mục">
                          {performance.meaning}
                        </DetailRow>
                      </div>

                      <div className="admin-detail-grid">
                        <DetailRow label="Số lượng người">
                          {performance.people
                            ? `${performance.people} người`
                            : null}
                        </DetailRow>
                        <DetailRow label="Thời lượng biểu diễn">
                          {performance.duration
                            ? `${performance.duration} phút`
                            : null}
                        </DetailRow>
                        <DetailRow label="Yêu cầu kỹ thuật">
                          {performance.technical}
                        </DetailRow>
                        <DetailRow label="Video demo">
                          {performance.demoVideo ? (
                            <a
                              href={performance.demoVideo}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Mở video demo
                            </a>
                          ) : (
                            "Chưa cập nhật"
                          )}
                        </DetailRow>
                        <DetailRow label="Nhạc nền">
                          {performance.backgroundMusic ? (
                            <a
                              href={performance.backgroundMusic}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Mở file nhạc nền
                            </a>
                          ) : (
                            "Chưa cập nhật"
                          )}
                        </DetailRow>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="admin-detail-section">
                <div className="admin-detail-section-title">
                  <span>03</span>
                  <div>
                    <h3>Danh sách tham gia &amp; Dự trù kinh phí</h3>
                    <p>Thông tin file được gửi kèm hồ sơ đăng ký.</p>
                  </div>
                </div>

                <div className="admin-detail-grid">
                  <DetailRow label="Danh sách tham gia">
                    {item.participantFileUrl ? (
                      <a
                        href={item.participantFileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Mở danh sách tham gia
                      </a>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </DetailRow>
                  <DetailRow label="Dự trù kinh phí">
                    {item.budgetFileUrl ? (
                      <a
                        href={item.budgetFileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Mở dự trù kinh phí
                      </a>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </DetailRow>
                  <DetailRow label="Xác nhận tham gia">
                    {item.commitment || "Chưa xác nhận"}
                  </DetailRow>
                </div>
              </div>
            </>
          )}

          {isExhibition && (
            <>
              <div className="admin-detail-section">
                <div className="admin-detail-section-title">
                  <span>02</span>
                  <div>
                    <h3>Thông tin gian hàng</h3>
                    <p>Nội dung được cung cấp trong phiếu đăng ký.</p>
                  </div>
                </div>

                <div className="admin-detail-grid admin-detail-grid-one">
                  <DetailRow label="Nội dung triển lãm">
                    {item.exhibitionContent}
                  </DetailRow>
                </div>

                <div className="admin-detail-grid">
                  <DetailRow label="Thời gian hoàn thiện">
                    {item.completionTime}
                  </DetailRow>
                  <DetailRow label="Nhân sự phụ trách - SĐT">
                    {item.contact}
                  </DetailRow>
                  <DetailRow label="Bố cục trang trí">
                    {item.layout || "Không có thông tin"}
                  </DetailRow>
                </div>
              </div>

              <ConfirmationSection number="03" commitment={item.commitment} />
            </>
          )}

          {type === REGISTRATION_TYPES.ACTIVITY && (
            <>
              <div className="admin-detail-section">
                <div className="admin-detail-section-title">
                  <span>02</span>
                  <div>
                    <h3>Thông tin hoạt động</h3>
                    <p>Các hoạt động được đơn vị đăng ký.</p>
                  </div>
                </div>

                {Array.isArray(item.activities) && item.activities.length > 0 ? (
                  item.activities.map((activity, index) => (
                    <div
                      className="admin-detail-grid admin-detail-grid-one"
                      key={index}
                    >
                      <DetailRow label={`Tên hoạt động ${index + 1}`}>
                        {activity.name}
                      </DetailRow>
                      <DetailRow label="Nội dung thực hiện">
                        {activity.content}
                      </DetailRow>
                    </div>
                  ))
                ) : (
                  <div className="admin-detail-grid admin-detail-grid-one">
                    <DetailRow label="Hoạt động">Chưa cập nhật</DetailRow>
                  </div>
                )}

                <div className="admin-detail-grid">
                  <DetailRow label="Nhân sự phụ trách - SĐT">
                    {item.contact}
                  </DetailRow>
                </div>
              </div>

              <ConfirmationSection number="03" commitment={item.commitment} />
            </>
          )}

          <div className="admin-review-bar">
            <div>
              <strong>Quyết định xử lý hồ sơ</strong>
              <span>
                Chỉ chọn “Duyệt” khi nội dung đăng ký đáp ứng yêu cầu của
                chương trình.
              </span>
            </div>

            <div className="admin-review-actions">
              <button
                type="button"
                className={`admin-review-btn ${
                  item.status === "approved"
                    ? "admin-review-approved-done"
                    : "admin-review-approve"
                }`}
                onClick={() => {
                  if (
                    item.status !== "approved" &&
                    processingId !== item.registrationId
                  ) {
                    onChangeStatus(item.registrationId, "approved");
                  }
                }}
                disabled={
                  item.status === "approved" ||
                  processingId === item.registrationId
                }
              >
                {processingId === item.registrationId &&
                processingStatus === "approved" ? (
                  <>
                    <span className="admin-spinner" />
                    Đang duyệt...
                  </>
                ) : (
                  <>
                    <Check size={17} />
                    {item.status === "approved"
                      ? "Đã duyệt"
                      : "Duyệt & hiển thị"}
                  </>
                )}
              </button>

              <button
                type="button"
                className="admin-review-btn admin-review-reject"
                onClick={() => {
                  if (processingId !== item.registrationId) {
                    onChangeStatus(item.registrationId, "rejected");
                  }
                }}
                disabled={processingId === item.registrationId}
              >
                {processingId === item.registrationId &&
                processingStatus === "rejected" ? (
                  <>
                    <span className="admin-spinner" />
                    Đang từ chối...
                  </>
                ) : (
                  <>
                    <X size={17} />
                    Từ chối
                  </>
                )}
              </button>

              {item.status !== "pending" && (
                <button
                  type="button"
                  className="admin-review-btn admin-review-pending"
                  onClick={() => {
                    if (processingId !== item.registrationId) {
                      onChangeStatus(item.registrationId, "pending");
                    }
                  }}
                  disabled={processingId === item.registrationId}
                >
                  {processingId === item.registrationId &&
                  processingStatus === "pending" ? (
                    <>
                      <span className="admin-spinner" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Eye size={17} />
                      Đưa về chờ duyệt
                    </>
                  )}
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
  const [selectedType, setSelectedType] = useState(REGISTRATION_TYPES.ART);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [processingStatus, setProcessingStatus] = useState("");

  const refresh = async () => {
    try {
      setError("");
      const data = await loadSubmissions();
      setItems(data);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const change = async (id, status) => {
    let rejectionReason = "";

    if (status === "rejected") {
      rejectionReason =
        window.prompt("Nhập lý do từ chối hồ sơ:")?.trim() || "";

      if (!rejectionReason) {
        return;
      }
    }

    try {
      setError("");
      setProcessingId(id);
      setProcessingStatus(status);

      const next = await updateSubmissionStatus(
        id,
        status,
        rejectionReason
      );
      setItems(next);
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái hồ sơ.");
    } finally {
      setProcessingId(null);
      setProcessingStatus("");
    }
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

  const typeItems = items.filter(
    (item) =>
      (item.registrationType || REGISTRATION_TYPES.ART) === selectedType
  );

  const filteredItems =
    filter === "all"
      ? typeItems
      : typeItems.filter((item) => item.status === filter);

  const typeCounts = {
    all: typeItems.length,
    pending: typeItems.filter((item) => item.status === "pending").length,
    approved: typeItems.filter((item) => item.status === "approved").length,
    rejected: typeItems.filter((item) => item.status === "rejected").length,
  };

  return (
    <section className="page-section admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="page-title">
            <h1>Quản lý đăng ký</h1>
            <p>
              Xem toàn bộ hồ sơ đăng ký của chương trình nghệ thuật, gian hàng
              triển lãm và hoạt động của các đơn vị; kiểm tra thông tin và quyết
              định trạng thái hồ sơ.
            </p>
          </div>

          <button
            className="btn btn-light"
            onClick={refresh}
            disabled={loading}
          >
            <RotateCcw size={17} />
            {loading ? "Đang tải..." : "Làm mới dữ liệu"}
          </button>
        </div>

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <RotateCcw size={25} />
            </div>
            <h2>Đang tải hồ sơ</h2>
            <p>Đang lấy dữ liệu đăng ký mới nhất từ hệ thống.</p>
          </div>
        ) : (
          <>
        <div className="admin-summary">
          <div className="admin-summary-item">
            <div className="admin-summary-heading">
              <span>Tổng đăng ký</span>
              <strong>{counts.all}</strong>
            </div>
            <SummaryBreakdown items={items} />
          </div>

          <div className="admin-summary-item admin-summary-pending">
            <div className="admin-summary-heading">
              <span>Chờ duyệt</span>
              <strong>{counts.pending}</strong>
            </div>
            <SummaryBreakdown items={items} status="pending" />
          </div>

          <div className="admin-summary-item admin-summary-approved">
            <div className="admin-summary-heading">
              <span>Đã duyệt</span>
              <strong>{counts.approved}</strong>
            </div>
            <SummaryBreakdown items={items} status="approved" />
          </div>

          <div className="admin-summary-item admin-summary-rejected">
            <div className="admin-summary-heading">
              <span>Từ chối</span>
              <strong>{counts.rejected}</strong>
            </div>
            <SummaryBreakdown items={items} status="rejected" />
          </div>
        </div>

        <div className="admin-registration-tabs">
          <button
            type="button"
            className={selectedType === REGISTRATION_TYPES.ART ? "active" : ""}
            onClick={() => {
              setSelectedType(REGISTRATION_TYPES.ART);
              setFilter("all");
            }}
          >
            <strong>01</strong>
            <span>Chương trình nghệ thuật</span>
            <em>{items.filter((item) => (item.registrationType || REGISTRATION_TYPES.ART) === REGISTRATION_TYPES.ART).length}</em>
          </button>

          <button
            type="button"
            className={
              selectedType === REGISTRATION_TYPES.EXHIBITION ? "active" : ""
            }
            onClick={() => {
              setSelectedType(REGISTRATION_TYPES.EXHIBITION);
              setFilter("all");
            }}
          >
            <strong>02</strong>
            <span>Gian hàng triển lãm</span>
            <em>{items.filter((item) => (item.registrationType || REGISTRATION_TYPES.ART) === REGISTRATION_TYPES.EXHIBITION).length}</em>
          </button>

          <button
            type="button"
            className={
              selectedType === REGISTRATION_TYPES.ACTIVITY ? "active" : ""
            }
            onClick={() => {
              setSelectedType(REGISTRATION_TYPES.ACTIVITY);
              setFilter("all");
            }}
          >
            <strong>03</strong>
            <span>Hoạt động của đơn vị</span>
            <em>{items.filter((item) => (item.registrationType || REGISTRATION_TYPES.ART) === REGISTRATION_TYPES.ACTIVITY).length}</em>
          </button>
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
              <span>{typeCounts[value]}</span>
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
                processingId={processingId}
                processingStatus={processingStatus}
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
          </>
        )}
      </div>
    </section>
  );
}
