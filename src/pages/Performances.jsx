import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PerformanceCard from "../components/PerformanceCard";
import { getSubmissions, REGISTRATION_TYPES } from "../services/storage";

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
      <div className="public-registration-card__number">
        GIAN HÀNG
      </div>

      <h3>Gian hàng triển lãm</h3>

      <div className="public-registration-card__meta">
        <span>
          {item.unit || "Chưa cập nhật đơn vị"}
        </span>
      </div>
    </Link>
  );
}

function ActivityCard({ item }) {
  const activities = Array.isArray(item.activities)
    ? item.activities
    : [];

  const firstActivity = activities[0];

  return (
    <Link
      className="public-registration-card"
      to={`/cac-tiet-muc/${item.id}`}
    >
      <div className="public-registration-card__number">
        HOẠT ĐỘNG
      </div>

      <h3>
        {firstActivity?.name || "Hoạt động của đơn vị"}
      </h3>

      <div className="public-registration-card__meta">
        <span>
          {item.unit || "Chưa cập nhật đơn vị"}
        </span>
      </div>
    </Link>
  );
}

function RegistrationCard({ item }) {
  const registrationType =
    item.registrationType || REGISTRATION_TYPES.ART;

  if (registrationType === REGISTRATION_TYPES.EXHIBITION) {
    return <ExhibitionCard item={item} />;
  }

  if (registrationType === REGISTRATION_TYPES.ACTIVITY) {
    return <ActivityCard item={item} />;
  }

  return <PerformanceCard item={item} />;
}

export default function Performances() {
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState("all");

  const items = getSubmissions().filter(
    (item) =>
      item.status === "approved" &&
      contentSections.some(
        (section) =>
          (item.registrationType || REGISTRATION_TYPES.ART) ===
          section.type
      )
  );

  const units = [
    ...new Set(
      items
        .map((item) => item.unit)
        .filter(Boolean)
    ),
  ];

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const registrationType =
        item.registrationType || REGISTRATION_TYPES.ART;

      let searchableText = "";

      if (registrationType === REGISTRATION_TYPES.EXHIBITION) {
        searchableText = [
          item.exhibitionContent,
          item.unit,
          item.layout,
        ]
          .filter(Boolean)
          .join(" ");
      } else if (
        registrationType === REGISTRATION_TYPES.ACTIVITY
      ) {
        searchableText = [
          item.unit,
          ...(Array.isArray(item.activities)
            ? item.activities.flatMap((activity) => [
                activity.name,
                activity.content,
              ])
            : []),
        ]
          .filter(Boolean)
          .join(" ");
      } else {
        searchableText = [
          item.title,
          item.unit,
          item.culture,
          item.meaning,
        ]
          .filter(Boolean)
          .join(" ");
      }

      const matchesQuery = searchableText
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesUnit =
        unit === "all" || item.unit === unit;

      return matchesQuery && matchesUnit;
    });
  }, [items, query, unit]);

  return (
    <section className="page-section">
      <div className="container">
        {/* PAGE TITLE */}
        <div className="public-content-page-title">
          <h1>Các nội dung tham gia</h1>
        </div>

        {/* FILTER */}
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
              <option value="all">
                Tất cả đơn vị
              </option>

              {units.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="public-registration-sections">
          {contentSections.map((section) => {
            const sectionItems = filtered.filter(
              (item) =>
                (item.registrationType ||
                  REGISTRATION_TYPES.ART) === section.type
            );

            return (
              <section
                className="public-registration-section"
                key={section.type}
              >
                {/* SECTION HEADER */}
                <div className="public-registration-section__header">
                  <h2 className="public-registration-section__title">
                    {section.title}
                  </h2>

                  <span className="public-registration-section__count">
                    {sectionItems.length} nội dung
                  </span>
                </div>

                {/* CARDS */}
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
      </div>
    </section>
  );
}