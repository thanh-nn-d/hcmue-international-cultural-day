# HCMUE International Cultural Day — V1

Website prototype for:
**Ngày hội giao lưu văn hóa quốc tế Chào mừng kỷ niệm 50 năm Ngày truyền thống Trường Đại học Sư phạm Thành phố Hồ Chí Minh (27/10/1976 - 27/10/2026)**

## 1. Chạy local

Yêu cầu Node.js + npm.

```bash
npm install
npm run dev
```

Sau đó mở địa chỉ Vite hiển thị trong terminal (thường là `http://localhost:5173`).

Build production:

```bash
npm run build
```

## 2. Các trang V1

- `/` — Trang chủ
- `/gioi-thieu` — Giới thiệu / thông tin chương trình
- `/dang-ky-tiet-muc` — Form đăng ký
- `/cac-tiet-muc` — Danh sách tiết mục public + tìm kiếm + lọc
- `/cac-tiet-muc/:id` — Chi tiết tiết mục
- `/admin` — Khu vực BTC demo local

## 3. Lưu ý về dữ liệu

V1 hiện **chưa kết nối Google Sheets/Google Drive**.

Form đang lưu dữ liệu bằng `localStorage` để có thể test toàn bộ flow local:
Đăng ký → Chờ duyệt → BTC duyệt → tiết mục xuất hiện public.

File upload hiện chỉ lưu **tên file** ở local. Bản tiếp theo sẽ kết nối upload thật lên Google Drive và lưu dữ liệu vào Google Sheets.

## 4. Dữ liệu mẫu

`src/data/mockPerformances.js` chứa dữ liệu mẫu để card có thể hiển thị ngay khi chạy local.

Đây là dữ liệu demo, **không phải dữ liệu chương trình thật**. Có thể xóa/tắt khi bắt đầu kết nối dữ liệu thật.

## 5. Nhận diện

V1 sử dụng các asset bạn đã cung cấp:

- `src/assets/logo-hcmue.png`
- `src/assets/building-a01.png`
- `src/assets/building-a02.png`
- `src/assets/vien-hcmue.png`

Logo biểu trưng 50 năm chính thức chưa được cung cấp ở thời điểm build V1 nên header hiện có một placeholder. Khi có logo chính thức, thay asset/component này.

## 6. Phần chưa chốt / để chỉnh ở vòng tiếp theo

- Logo biểu trưng 50 năm chính thức.
- Thời gian / địa điểm / đối tượng: hiện hiển thị `Bổ sung thông tin sau`.
- Thumbnail thật của từng tiết mục.
- Nội dung giới thiệu chính thức.
- Quy trình quyền truy cập Admin.
- Kết nối Google Sheets.
- Upload file danh sách thành viên lên Google Drive.
- Cách lấy thumbnail từ video demo (nếu BTC muốn).
- Tên chính thức của mục public danh sách tiết mục.
- Các chi tiết typography/spacing/màu sắc sau khi test thực tế.

## 7. Ghi chú

Không đưa thông tin liên hệ, danh sách thành viên hoặc link nhạc nền vào phần public. Những trường này thuộc dữ liệu BTC quản lý.
