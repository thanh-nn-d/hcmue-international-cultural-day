import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import PerformanceCard from "./PerformanceCard";

export default function PerformanceCarousel({ items }) {
  const ref = useRef(null);

  const scroll = (direction) => {
    ref.current?.scrollBy({
      left: direction * 360,
      behavior: "smooth"
    });
  };

  if (!items.length) {
    return <div className="empty-state">Chưa có tiết mục được công khai.</div>;
  }

  return (
    <div className="carousel-wrap">
      <button className="carousel-btn left" onClick={() => scroll(-1)} aria-label="Trước">
        <ChevronLeft />
      </button>
      <div className="performance-carousel" ref={ref}>
        {items.map((item) => <PerformanceCard key={item.id} item={item} />)}
      </div>
      <button className="carousel-btn right" onClick={() => scroll(1)} aria-label="Sau">
        <ChevronRight />
      </button>
    </div>
  );
}
