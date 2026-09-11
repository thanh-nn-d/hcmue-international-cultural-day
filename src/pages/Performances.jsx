import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import PerformanceCard from "../components/PerformanceCard";
import { getSubmissions } from "../services/storage";

export default function Performances() {
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState("all");
  const items = getSubmissions().filter((item) => item.status === "approved");
  const units = [...new Set(items.map((item) => item.unit))];

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = `${item.title} ${item.unit} ${item.culture}`.toLowerCase().includes(query.toLowerCase());
      const matchesUnit = unit === "all" || item.unit === unit;
      return matchesQuery && matchesUnit;
    });
  }, [items, query, unit]);

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-title">
          <span className="eyebrow">CÁC TIẾT MỤC</span>
          <h1>Các tiết mục tham gia</h1>
          <p>Cùng khám phá các sắc màu văn hóa sẽ xuất hiện trong ngày hội nhé!</p>
        </div>

        <div className="filter-bar">
          <div className="search-box">
            <Search size={19} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm tên tiết mục, đơn vị..." />
          </div>
          <div className="select-box">
            <SlidersHorizontal size={18} />
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="all">Tất cả đơn vị</option>
              {units.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
        </div>

        {filtered.length ? (
          <div className="performance-grid">
            {filtered.map((item) => <PerformanceCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="empty-state">Không tìm thấy tiết mục phù hợp.</div>
        )}
      </div>
    </section>
  );
}
