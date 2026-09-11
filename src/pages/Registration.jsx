import { useMemo, useState } from "react";
import { Plus, Trash2, UploadCloud, Link as LinkIcon, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addSubmission } from "../services/storage";

const units = [
  "Khoa Ngữ văn",
  "Khoa Tiếng Anh",
  "Khoa Tiếng Pháp",
  "Khoa Tiếng Nga",
  "Khoa Tiếng Trung",
  "Khoa Tiếng Nhật",
  "Khoa Tiếng Hàn Quốc"
];

const emptyPerformance = () => ({
  title: "",
  culture: "",
  meaning: "",
  people: "",
  duration: "",
  demoVideo: "",
  backgroundMusic: "",
  technical: ""
});

export default function Registration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    unit: "",
    contact: "",
    phone: "",
    commitment: "",
    participantFile: null,
    performances: [emptyPerformance()]
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updatePerformance = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      performances: prev.performances.map((p, i) => i === index ? { ...p, [key]: value } : p)
    }));
  };

  const addPerformance = () => {
    setForm((prev) => ({ ...prev, performances: [...prev.performances, emptyPerformance()] }));
  };

  const removePerformance = (index) => {
    if (form.performances.length === 1) return;
    setForm((prev) => ({ ...prev, performances: prev.performances.filter((_, i) => i !== index) }));
  };

  const canSubmit = useMemo(() => {
    return form.unit && form.contact && form.phone && form.commitment &&
      form.participantFile && form.performances.every((p) =>
        p.title && p.culture && p.meaning && p.people && p.duration &&
        p.demoVideo && p.backgroundMusic && p.technical
      );
  }, [form]);

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const stamp = Date.now();
    const submissions = form.performances.map((p, index) => ({
      id: `local-${stamp}-${index}`,
      ...p,
      unit: form.unit,
      contact: form.contact,
      phone: form.phone,
      commitment: form.commitment,
      participantFileName: form.participantFile?.name || "",
      status: "pending",
      createdAt: new Date().toISOString()
    }));

    submissions.forEach(addSubmission);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="page-section">
        <div className="container narrow">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h1>Đăng ký thành công</h1>
            <p>Thông tin đã được lưu ở chế độ local để bạn kiểm tra flow. Khi tích hợp Google Sheets/Drive, dữ liệu sẽ được gửi về hệ thống thật.</p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate("/cac-tiet-muc")}>Xem danh sách tiết mục</button>
              <button className="btn btn-outline" onClick={() => window.location.reload()}>Đăng ký thêm</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container form-container">
        <div className="page-title">
          <span className="eyebrow">ĐĂNG KÝ TIẾT MỤC</span>
          <h1>Đăng ký tiết mục văn nghệ</h1>
          <p>Vui lòng cung cấp đầy đủ thông tin để Ban Tổ chức tổng hợp và bố trí chương trình.</p>
        </div>

        <form className="registration-form" onSubmit={submit}>
          <div className="form-section">
            <div className="form-section-title"><span>01</span><div><h2>Thông tin đơn vị</h2><p>Thông tin liên hệ của đơn vị đăng ký.</p></div></div>
            <div className="form-grid">
              <label className="field">
                <span>Đơn vị đăng ký <b>*</b></span>
                <select value={form.unit} onChange={(e) => update("unit", e.target.value)} required>
                  <option value="">Chọn đơn vị</option>
                  {units.map((unit) => <option key={unit}>{unit}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Người phụ trách - Chức vụ <b>*</b></span>
                <input value={form.contact} onChange={(e) => update("contact", e.target.value)} placeholder="Nhập họ tên và chức vụ" required />
              </label>
              <label className="field">
                <span>Số điện thoại <b>*</b></span>
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Nhập số điện thoại" required />
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title"><span>02</span><div><h2>Thông tin tiết mục</h2><p>Mỗi tiết mục được nhập theo thứ tự biểu diễn.</p></div></div>

            {form.performances.map((performance, index) => (
              <div className="performance-form-card" key={index}>
                <div className="performance-form-head">
                  <div><strong>Tiết mục {index + 1}</strong><span>Thứ tự biểu diễn</span></div>
                  {form.performances.length > 1 && <button type="button" className="icon-danger" onClick={() => removePerformance(index)} title="Xóa tiết mục"><Trash2 size={18} /></button>}
                </div>

                <div className="form-grid">
                  <label className="field full">
                    <span>Tên tiết mục <b>*</b></span>
                    <input value={performance.title} onChange={(e) => updatePerformance(index, "title", e.target.value)} placeholder="Nhập tên tiết mục" required />
                  </label>
                  <label className="field full">
                    <span>Quốc gia / nền văn hóa đại diện <b>*</b></span>
                    <textarea value={performance.culture} onChange={(e) => updatePerformance(index, "culture", e.target.value)} placeholder="Đại diện cho quốc gia/nền văn hóa..." rows="2" required />
                  </label>
                  <label className="field full">
                    <span>Nội dung, ý nghĩa tiết mục <b>*</b></span>
                    <textarea value={performance.meaning} onChange={(e) => updatePerformance(index, "meaning", e.target.value)} placeholder="Mô tả ngắn gọn nội dung và ý nghĩa..." rows="3" required />
                  </label>
                  <label className="field">
                    <span>Số lượng người <b>*</b></span>
                    <input type="number" min="1" value={performance.people} onChange={(e) => updatePerformance(index, "people", e.target.value)} placeholder="Ví dụ: 10" required />
                  </label>
                  <label className="field">
                    <span>Thời lượng biểu diễn (phút) <b>*</b></span>
                    <input type="number" min="1" value={performance.duration} onChange={(e) => updatePerformance(index, "duration", e.target.value)} placeholder="Ví dụ: 5" required />
                  </label>
                  <label className="field">
                    <span><LinkIcon size={15} /> Link video demo <b>*</b></span>
                    <input type="url" value={performance.demoVideo} onChange={(e) => updatePerformance(index, "demoVideo", e.target.value)} placeholder="https://..." required />
                  </label>
                  <label className="field">
                    <span><LinkIcon size={15} /> Link nhạc nền <b>*</b></span>
                    <input type="url" value={performance.backgroundMusic} onChange={(e) => updatePerformance(index, "backgroundMusic", e.target.value)} placeholder="https://..." required />
                  </label>
                  <label className="field full">
                    <span>Yêu cầu kỹ thuật <b>*</b></span>
                    <textarea value={performance.technical} onChange={(e) => updatePerformance(index, "technical", e.target.value)} placeholder="Ghi có/không và nội dung yêu cầu. Ví dụ: số lượng micro, micro đeo..." rows="3" required />
                  </label>
                </div>
              </div>
            ))}

            <button type="button" className="add-performance" onClick={addPerformance}><Plus size={18} /> Thêm tiết mục</button>
          </div>

          <div className="form-section">
            <div className="form-section-title"><span>03</span><div><h2>Danh sách tham gia & xác nhận</h2><p>Danh sách thành viên được upload dưới dạng file.</p></div></div>

            <div className="form-grid">
              <label className="field">
                <span>Xác nhận cam kết tham gia <b>*</b></span>
                <select value={form.commitment} onChange={(e) => update("commitment", e.target.value)} required>
                  <option value="">Chọn mức xác nhận</option>
                  <option>Đảm bảo tham gia</option>
                  <option>Cần cân nhắc, sắp xếp</option>
                </select>
              </label>

              <label className="upload-box">
                <input type="file" accept=".xlsx,.xls,.doc,.docx,.pdf,.csv" onChange={(e) => update("participantFile", e.target.files?.[0] || null)} required />
                <UploadCloud size={27} />
                <strong>{form.participantFile ? form.participantFile.name : "Upload danh sách tham gia"}</strong>
                <span>Excel, Word, PDF hoặc CSV</span>
              </label>
            </div>
          </div>

          <div className="form-submit">
            <p><b>*</b> Trường thông tin bắt buộc</p>
            <button className="btn btn-primary" type="submit" disabled={!canSubmit}><Send size={18} /> GỬI ĐĂNG KÝ</button>
          </div>
        </form>
      </div>
    </section>
  );
}
