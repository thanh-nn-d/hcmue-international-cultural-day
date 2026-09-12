import {
  ArrowLeft,
  Clock3,
  ListChecks,
  Store,
  UsersRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  getSubmissions,
  REGISTRATION_TYPES,
} from "../services/storage";

const typeLabel = {
  [REGISTRATION_TYPES.ART]: "Chương trình nghệ thuật",
  [REGISTRATION_TYPES.EXHIBITION]: "Gian hàng triển lãm",
  [REGISTRATION_TYPES.ACTIVITY]: "Hoạt động của đơn vị",
};

function EmptyDetail() {
  return (
    <section className="page-section">
      <div className="container empty-state">
        Không tìm thấy nội dung hoặc nội dung chưa được công khai.
      </div>
    </section>
  );
}

function DetailSection({ title, children }) {
  return (
    <div className="detail-section">
      <h3>{title}</h3>
      <p>{children || "Thông tin sẽ được cập nhật."}</p>
    </div>
  );
}

function ArtProgramDetail({ item }) {
  return (
    <>
      <span className="category-pill static">
        {typeLabel[REGISTRATION_TYPES.ART]}
      </span>

      <h1>{item.title}</h1>

      <p className="detail-unit">{item.unit}</p>

      <div className="detail-meta">
        <span>
          <Clock3 size={18} />
          {item.duration ? `${item.duration} phút` : "Chưa cập nhật"}
        </span>

        <span>
          <UsersRound size={18} />
          {item.people ? `${item.people} thành viên` : "Chưa cập nhật"}
        </span>
      </div>

      <DetailSection title="Quốc gia / nền văn hóa đại diện">
        {item.culture}
      </DetailSection>

      <DetailSection title="Nội dung, ý nghĩa tiết mục">
        {item.meaning}
      </DetailSection>

      {item.technical && (
        <DetailSection title="Yêu cầu kỹ thuật">
          {item.technical}
        </DetailSection>
      )}
    </>
  );
}

function ExhibitionDetail({ item }) {
  return (
    <>
      <span className="category-pill static">
        {typeLabel[REGISTRATION_TYPES.EXHIBITION]}
      </span>

      <h1>Gian hàng triển lãm</h1>

      <p className="detail-unit">{item.unit}</p>

      <div className="detail-meta">
        <span>
          <Store size={18} />
          Gian hàng triển lãm
        </span>

      </div>

      <DetailSection title="Nội dung triển lãm">
        {item.exhibitionContent}
      </DetailSection>

      <DetailSection title="Bố cục trang trí">
        {item.layout}
      </DetailSection>
    </>
  );
}

function ActivityDetail({ item }) {
  const activities = Array.isArray(item.activities) ? item.activities : [];

  return (
    <>
      <span className="category-pill static">
        {typeLabel[REGISTRATION_TYPES.ACTIVITY]}
      </span>

      <h1>Hoạt động của đơn vị</h1>

      <p className="detail-unit">{item.unit}</p>

      <div className="detail-meta">
        <span>
          <ListChecks size={18} />
          {activities.length
            ? `${activities.length} hoạt động`
            : "Chưa cập nhật"}
        </span>
      </div>

      <div className="detail-section">
        <h3>Các hoạt động đăng ký</h3>

        {activities.length > 0 ? (
          <div className="detail-activity-list">
            {activities.map((activity, index) => (
              <div
                className="detail-activity-item"
                key={activity.id || `${activity.name}-${index}`}
              >
                <strong>
                  {index + 1}. {activity.name || "Hoạt động"}
                </strong>

                <p>
                  {activity.content || "Thông tin sẽ được cập nhật."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Thông tin sẽ được cập nhật.</p>
        )}
      </div>
    </>
  );
}

export default function PerformanceDetail() {
  const { id } = useParams();

  const item = getSubmissions().find(
    (entry) => entry.id === id && entry.status === "approved"
  );

  if (!item) {
    return <EmptyDetail />;
  }

  const registrationType =
    item.registrationType || REGISTRATION_TYPES.ART;

  let detailContent;

  if (registrationType === REGISTRATION_TYPES.EXHIBITION) {
    detailContent = <ExhibitionDetail item={item} />;
  } else if (registrationType === REGISTRATION_TYPES.ACTIVITY) {
    detailContent = <ActivityDetail item={item} />;
  } else {
    detailContent = <ArtProgramDetail item={item} />;
  }

  const isArt = registrationType === REGISTRATION_TYPES.ART;

  return (
    <section className="page-section">
      <div className="container detail-layout">
        <Link to="/cac-tiet-muc" className="back-link">
          <ArrowLeft size={17} />
          Quay lại danh sách
        </Link>

        <article className="detail-card">
          {isArt && (
            <div className="detail-cover">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.title} />
              ) : (
                <div className="detail-placeholder">
                  GIAO LƯU VĂN HÓA QUỐC TẾ
                </div>
              )}
            </div>
          )}

          {!isArt && (
            <div className="detail-cover detail-cover-type detail-cover-unified">
              {registrationType === REGISTRATION_TYPES.EXHIBITION ? (
                <Store size={58} strokeWidth={1.5} />
              ) : (
                <ListChecks size={58} strokeWidth={1.5} />
              )}

              <span>{typeLabel[registrationType]}</span>
            </div>
          )}

          <div className="detail-content detail-content-unified">{detailContent}</div>
        </article>
      </div>
    </section>
  );
}
