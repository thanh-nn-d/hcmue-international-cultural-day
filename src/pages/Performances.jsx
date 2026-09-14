import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PerformanceCard from "../components/PerformanceCard";
import { Link } from "react-router-dom";
import {
  loadPublicSubmissions,
  REGISTRATION_TYPES,
} from "../services/storage";

const contentSections = [
  {
    type: REGISTRATION_TYPES.ART,
    title: "Chương trình nghệ thuật",
  },
  {
    type: REGISTRATION_TYPES.EXHIBITION,
    title: "Gian hàng triển lãm",
  },
  {
    type: REGISTRATION_TYPES.ACTIVITY,
    title: "Hoạt động của đơn vị",
  },
];

function ExhibitionCard({ item }) {
  return (
    <Link
      className="public-registration-card"
      to={`/cac-tiet-muc/${item.id}`}
    >
      <div className="public-registration-card__number">GIAN HÀNG</div>
      <h3>Gian hàng triển lãm</h3>

      <div className="public-registration-card__meta">
        <span>{item.unit || "Chưa cập nhật đơn vị"}</span>
      </div>
    </Link>
  );
}

function ActivityCard({ item }) {
  const activities = Array.isArray(item.activities) ? item.activities : [];

  return (
    <Link
      className="public-registration-card"
      to={`/cac-tiet-muc/${item.id}`}
    >
      <div className="public-registration-card__number">HOẠT ĐỘNG</div>
      <h3>Hoạt động của đơn vị</h3>

      <div className="public-registration-card__meta">
        <span>{item.unit || "Chưa cập nhật đơn vị"}</span>
      </div>

      {activities.length > 0 && (
        <div className="public-registration-card__activities">
          {activities.map((activity, index) => (
            <div
              className="public-registration-card__activity"
              key={activity.id || `${activity.name}-${index}`}
            >
              <strong>{activity.name || `Hoạt động ${index + 1}`}</strong>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}

function RegistrationCard({ item }) {
  if (item.registrationType === REGISTRATION_TYPES.EXHIBITION) {
    return <ExhibitionCard item={item} />;
  }

  if (item.registrationType === REGISTRATION_TYPES.ACTIVITY) {
    return <ActivityCard item={item} />;
  }

  return <PerformanceCard item={item} />;
}

export default function Performances() {
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await loadPublicSubmissions();

        if (active) {
          setItems(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Không thể tải nội dung Ngày hội."
          );
          setItems([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const publicItems = useMemo(
    () =>
      items.filter((item) =>
        contentSections.some(
          (section) =>
            (item.registrationType || REGISTRATION_TYPES.ART) ===
            section.type
        )
      ),
    [items]
  );

  const units = useMemo(
    () => [
      ...new Set(
        publicItems.map((item) => item.unit).filter(Boolean)
      ),
    ],
    [publicItems]
  );

  const filtered = useMemo(() => {
    return publicItems.filter((item) => {
      const searchableText =
        item.registrationType === REGISTRATION_TYPES.EXHIBITION
          ? `${item.exhibitionContent || ""} ${item.unit || ""} ${item.layout || ""}`
          : item.registrationType === REGISTRATION_TYPES.ACTIVITY
            ? `${item.unit || ""} ${(item.activities || [])
                .map(
                  (activity) =>
                    `${activity.name || ""} ${activity.content || ""}`
                )
                .join(" ")}`
            : `${item.title || ""} ${item.unit || ""} ${item.culture || ""}`;

      const matchesQuery = searchableText
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesUnit = unit === "all" || item.unit === unit;

      return matchesQuery && matchesUnit;
    });
  }, [publicItems, query, unit]);

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-title public-content-page-title">
          <h1>Các nội dung tham gia</h1>
        </div>

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

        <div className="filter-bar">
          <div className="search-box">
            <Search size={19} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm nội dung, tên tiết mục, đơn vị..."
            />
          </div>

          <div className="select-box">
            <SlidersHorizontal size={18} />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="all">Tất cả đơn vị</option>
              {units.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Đang tải các nội dung đã được duyệt...
          </div>
        ) : (
          <div className="public-registration-sections">
            {contentSections.map((section) => {
              const sectionItems = filtered.filter(
                (item) =>
                  (item.registrationType || REGISTRATION_TYPES.ART) ===
                  section.type
              );

              return (
                <section
                  className="public-registration-section"
                  key={section.type}
                >
                  <div className="public-registration-section__header">
                    <div>
                      <h2 className="public-registration-section__title">
                        {section.title}
                      </h2>
                    </div>

                    <span className="public-registration-section__count">
                      {sectionItems.length} nội dung
                    </span>
                  </div>

                  {sectionItems.length > 0 ? (
                    <div className="performance-grid">
                      {sectionItems.map((item) => (
                        <RegistrationCard
                          key={item.id}
                          item={item}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      Chưa có nội dung nào được duyệt trong mục này.
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
