// Dữ liệu mẫu CHỈ dùng để test giao diện local.

// Khi kết nối Google Sheets, có thể tắt dữ liệu mẫu trong localStorage hoặc thay service.

export const mockPerformances = [
  // =========================================================
  // 01. CHƯƠNG TRÌNH NGHỆ THUẬT
  // =========================================================

  {
    id: "demo-01",
    registrationType: "art-program",
    unit: "Dữ liệu mẫu",
    title: "Tiết mục mẫu 01",
    culture: "Thông tin văn hóa sẽ được cập nhật",
    meaning: "Nội dung và ý nghĩa tiết mục sẽ được cập nhật.",
    people: 0,
    duration: 0,
    demoVideo: "",
    backgroundMusic: "",
    technical: "Thông tin kỹ thuật sẽ được cập nhật.",
    commitment: "Đang chờ xác nhận",
    status: "approved",
    thumbnail: null
  },

  {
    id: "demo-02",
    registrationType: "art-program",
    unit: "Dữ liệu mẫu",
    title: "Tiết mục mẫu 02",
    culture: "Thông tin văn hóa sẽ được cập nhật",
    meaning: "Nội dung và ý nghĩa tiết mục sẽ được cập nhật.",
    people: 0,
    duration: 0,
    demoVideo: "",
    backgroundMusic: "",
    technical: "Thông tin kỹ thuật sẽ được cập nhật.",
    commitment: "Đang chờ xác nhận",
    status: "approved",
    thumbnail: null
  },

  {
    id: "demo-03",
    registrationType: "art-program",
    unit: "Dữ liệu mẫu",
    title: "Tiết mục mẫu 03",
    culture: "Thông tin văn hóa sẽ được cập nhật",
    meaning: "Nội dung và ý nghĩa tiết mục sẽ được cập nhật.",
    people: 0,
    duration: 0,
    demoVideo: "",
    backgroundMusic: "",
    technical: "Thông tin kỹ thuật sẽ được cập nhật.",
    commitment: "Đang chờ xác nhận",
    status: "approved",
    thumbnail: null
  },

  // =========================================================
  // 02. GIAN HÀNG TRIỂN LÃM
  // =========================================================

  {
    id: "demo-exhibition-01",
    registrationType: "exhibition-booth",
    status: "approved",

    unit: "Khoa Tiếng Nhật",

    exhibitionContent:
      "Không gian giới thiệu văn hóa Nhật Bản với các nội dung về trang phục truyền thống, ẩm thực, nghệ thuật gấp giấy và một số nét văn hóa đặc trưng.",

    completionTime:
      "Hoàn thiện trước ngày diễn ra chương trình 01 tuần",

    contact: "Nguyễn Minh Anh - Cố vấn gian hàng",

    layout:
      "Trang trí theo phong cách Nhật Bản, sử dụng tông màu đỏ - trắng, kết hợp hoa văn truyền thống và khu vực trưng bày sản phẩm.",

    commitment: "Đồng ý xác nhận"
  },

  // =========================================================
  // 03. HOẠT ĐỘNG CỦA ĐƠN VỊ
  // =========================================================

  {
    id: "demo-activity-01",
    registrationType: "unit-activity",
    status: "approved",

    unit: "Khoa Tiếng Anh",

    contact: "Trần Minh Khôi - Cán bộ phụ trách",

    commitment: "Đồng ý xác nhận",

    activities: [
      {
        id: "demo-activity-01-1",
        name: "Góc trải nghiệm văn hóa các nước nói tiếng Anh",
        content:
          "Tổ chức hoạt động tương tác giới thiệu văn hóa, ngôn ngữ và một số trò chơi tìm hiểu về các quốc gia nói tiếng Anh."
      }
    ]
  }
];