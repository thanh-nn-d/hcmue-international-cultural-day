import { useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  UploadCloud,
  Link as LinkIcon,
  Send,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  addArtRegistration,
  addExhibitionRegistration,
  addActivityRegistration
} from "../services/supabaseStorage";

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

const emptyActivity = () => ({
  name: "",
  content: ""
});

const REGISTRATION_TYPES = {
  ART: "art-program",
  EXHIBITION: "exhibition-booth",
  ACTIVITY: "unit-activity"
};

function RegistrationChoice({ onSelect }) {
  const choices = [
    {
      type: REGISTRATION_TYPES.ART,
      title: "Chương trình nghệ thuật",
      description:
        "Đăng ký các tiết mục biểu diễn, giao lưu và giới thiệu nét đẹp văn hóa của các quốc gia, vùng miền."
    },
    {
      type: REGISTRATION_TYPES.EXHIBITION,
      title: "Gian hàng triển lãm",
      description:
        "Đăng ký gian hàng và nội dung triển lãm, giới thiệu văn hóa, hình ảnh, sản phẩm hoặc hoạt động trải nghiệm."
    },
    {
      type: REGISTRATION_TYPES.ACTIVITY,
      title: "Hoạt động của đơn vị",
      description:
        "Đăng ký các hoạt động do đơn vị tổ chức trong khuôn khổ Ngày hội giao lưu văn hóa quốc tế."
    }
  ];

  return (
    <section className="page-section">
      <div className="container form-container">
        <div className="page-title">
          <h1 className="registration-choice-page-title">
            Đăng ký tham gia Ngày hội
          </h1>
          <p>
            Vui lòng lựa chọn nội dung đăng ký phù hợp với hoạt động của đơn vị.
          </p>
        </div>

        <div className="registration-choice-grid">
          {choices.map((choice) => (
            <button
              key={choice.type}
              type="button"
              className="registration-choice-card registration-choice-card-new"
              onClick={() => onSelect(choice.type)}
            >
              <div>
                <h2 className="registration-choice-title">
                  {choice.title}
                </h2>
                <p className="registration-choice-description">
                  {choice.description}
                </p>
              </div>

              <span className="registration-choice-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegistrationPage({ type, onBack }) {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  if (type === REGISTRATION_TYPES.ART) {
    return (
      <ArtProgramForm
        submitted={submitted}
        setSubmitted={setSubmitted}
        onBack={onBack}
        navigate={navigate}
      />
    );
  }

  if (type === REGISTRATION_TYPES.EXHIBITION) {
    return (
      <ExhibitionForm
        submitted={submitted}
        setSubmitted={setSubmitted}
        onBack={onBack}
      />
    );
  }

  return (
    <UnitActivityForm
      submitted={submitted}
      setSubmitted={setSubmitted}
      onBack={onBack}
    />
  );
}

function FormBackButton({ onBack }) {
  return (
    <button
      type="button"
      className="form-back-button"
      onClick={onBack}
    >
      <ArrowLeft size={17} /> Quay lại lựa chọn nội dung
    </button>
  );
}


/* =========================================================
   CHƯƠNG TRÌNH NGHỆ THUẬT
   ========================================================= */

function ArtProgramForm({
  submitted,
  setSubmitted,
  onBack,
  navigate
}) {
  const [form, setForm] = useState({
    unit: "",
    contact: "",
    phone: "",
    commitment: "",
    participantFile: null,
    budgetFile: null,
    performances: [emptyPerformance()]
  });

  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));

  const updatePerformance = (
    index,
    key,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      performances: prev.performances.map(
        (p, i) =>
          i === index
            ? {
                ...p,
                [key]: value
              }
            : p
      )
    }));
  };

  const addPerformance = () => {
    setForm((prev) => ({
      ...prev,
      performances: [
        ...prev.performances,
        emptyPerformance()
      ]
    }));
  };

  const removePerformance = (index) => {
    if (form.performances.length === 1) return;

    setForm((prev) => ({
      ...prev,
      performances:
        prev.performances.filter(
          (_, i) => i !== index
        )
    }));
  };

  const canSubmit = useMemo(() => {
    return (
      form.unit &&
      form.contact &&
      form.phone &&
      form.commitment &&
      form.participantFile &&
      form.budgetFile &&
      form.performances.every(
        (p) =>
          p.title &&
          p.culture &&
          p.meaning &&
          p.people &&
          p.duration &&
          p.demoVideo &&
          p.backgroundMusic &&
          p.technical
      )
    );
  }, [form]);

  const submit = async (e) => {
    e.preventDefault();

    /*
     * Chặn submit nếu:
     * - Form chưa đủ dữ liệu
     * - Đang có một request khác
     */
    if (!canSubmit || submitting) return;

    setSubmitting(true);

    try {
      await addArtRegistration({
        unit: form.unit,
        contact: form.contact,
        phone: form.phone,
        commitment: form.commitment,
        participantFile: form.participantFile,
        budgetFile: form.budgetFile,
        performances: form.performances
      });

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Lỗi gửi đăng ký chương trình nghệ thuật:",
        error
      );

      alert(
        error?.message ||
          "Không thể gửi đăng ký. Vui lòng thử lại."
      );

      /*
       * Cho phép gửi lại nếu request thất bại.
       */
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="page-section">
        <div className="container narrow">
          <div className="success-card">
            <div className="success-icon">✓</div>

            <h1>Đăng ký thành công</h1>

            <p>
              Thông tin đăng ký đã được gửi đến Ban Tổ chức
              và đang chờ xét duyệt.
            </p>

            <div className="success-actions">
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate("/cac-tiet-muc")
                }
              >
                Xem danh sách tiết mục
              </button>

              <button
                className="btn btn-outline"
                onClick={onBack}
              >
                Đăng ký nội dung khác
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container form-container">
        <FormBackButton onBack={onBack} />

        <div className="page-title">
          <span className="eyebrow">
            01 · CHƯƠNG TRÌNH NGHỆ THUẬT
          </span>

          <h1>
            Đăng ký chương trình nghệ thuật
          </h1>

          <p>
            Vui lòng cung cấp đầy đủ thông tin để Ban Tổ
            chức tổng hợp và bố trí chương trình.
          </p>
        </div>

        <form
          className="registration-form"
          onSubmit={submit}
        >
          {/* =================================================
              01. THÔNG TIN ĐƠN VỊ
              ================================================= */}

          <div className="form-section">
            <div className="form-section-title">
              <span>01</span>

              <div>
                <h2>Thông tin đơn vị</h2>

                <p>
                  Thông tin liên hệ của đơn vị đăng ký.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>
                  Đơn vị đăng ký <b>*</b>
                </span>

                <select
                  value={form.unit}
                  onChange={(e) =>
                    update(
                      "unit",
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Chọn đơn vị
                  </option>

                  {units.map((unit) => (
                    <option key={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>
                  Người phụ trách - Chức vụ{" "}
                  <b>*</b>
                </span>

                <input
                  value={form.contact}
                  onChange={(e) =>
                    update(
                      "contact",
                      e.target.value
                    )
                  }
                  placeholder="Nhập họ tên và chức vụ"
                  required
                />
              </label>

              <label className="field">
                <span>
                  Số điện thoại <b>*</b>
                </span>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    update(
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder="Nhập số điện thoại"
                  required
                />
              </label>
            </div>
          </div>


          {/* =================================================
              02. CHƯƠNG TRÌNH NGHỆ THUẬT
              ================================================= */}

          <div className="form-section">
            <div className="form-section-title">
              <span>02</span>

              <div>
                <h2>
                  Thông tin chương trình nghệ thuật
                </h2>

                <p>
                  Mỗi tiết mục được nhập theo thứ tự
                  biểu diễn.
                </p>
              </div>
            </div>

            {form.performances.map(
              (performance, index) => (
                <div
                  className="performance-form-card"
                  key={index}
                >
                  <div className="performance-form-head">
                    <div>
                      <strong>
                        Tiết mục {index + 1}
                      </strong>

                      <span>
                        Thứ tự biểu diễn
                      </span>
                    </div>

                    {form.performances.length >
                      1 && (
                      <button
                        type="button"
                        className="icon-danger"
                        onClick={() =>
                          removePerformance(index)
                        }
                        title="Xóa tiết mục"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="form-grid">
                    <label className="field full">
                      <span>
                        Tên tiết mục <b>*</b>
                      </span>

                      <input
                        value={
                          performance.title
                        }
                        onChange={(e) =>
                          updatePerformance(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Nhập tên tiết mục"
                        required
                      />
                    </label>

                    <label className="field full">
                      <span>
                        Quốc gia / nền văn hóa đại diện{" "}
                        <b>*</b>
                      </span>

                      <textarea
                        value={
                          performance.culture
                        }
                        onChange={(e) =>
                          updatePerformance(
                            index,
                            "culture",
                            e.target.value
                          )
                        }
                        placeholder="Đại diện cho quốc gia/nền văn hóa..."
                        rows="2"
                        required
                      />
                    </label>

                    <label className="field full">
                      <span>
                        Nội dung, ý nghĩa tiết mục{" "}
                        <b>*</b>
                      </span>

                      <textarea
                        value={
                          performance.meaning
                        }
                        onChange={(e) =>
                          updatePerformance(
                            index,
                            "meaning",
                            e.target.value
                          )
                        }
                        placeholder="Mô tả ngắn gọn nội dung và ý nghĩa..."
                        rows="3"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>
                        Số lượng người <b>*</b>
                      </span>

                      <input
                        type="number"
                        min="1"
                        value={
                          performance.people
                        }
                        onChange={(e) =>
                          updatePerformance(
                            index,
                            "people",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: 10"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>
                        Thời lượng biểu diễn (phút){" "}
                        <b>*</b>
                      </span>

                      <input
                        type="number"
                        min="1"
                        value={
                          performance.duration
                        }
                        onChange={(e) =>
                          updatePerformance(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: 5"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>
                        <LinkIcon size={15} /> Link
                        video demo <b>*</b>
                      </span>

                      <input
                        type="url"
                        value={
                          performance.demoVideo
                        }
                        onChange={(e) =>
                          updatePerformance(
                            index,
                            "demoVideo",
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                        required
                      />
                    </label>

                    <label className="field">
                      <span>
                        <LinkIcon size={15} /> Link
                        nhạc nền <b>*</b>
                      </span>

                      <input
                        type="url"
                        value={
                          performance.backgroundMusic
                        }
                        onChange={(e) =>
                          updatePerformance(
                            index,
                            "backgroundMusic",
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                        required
                      />
                    </label>

                    <label className="field full">
                      <span>
                        Yêu cầu kỹ thuật <b>*</b>
                      </span>

                      <textarea
                        value={
                          performance.technical
                        }
                        onChange={(e) =>
                          updatePerformance(
                            index,
                            "technical",
                            e.target.value
                          )
                        }
                        placeholder="Ghi có/không và nội dung yêu cầu. Ví dụ: số lượng micro, micro đeo..."
                        rows="3"
                        required
                      />
                    </label>
                  </div>
                </div>
              )
            )}

            <button
              type="button"
              className="add-performance"
              onClick={addPerformance}
              disabled={submitting}
            >
              <Plus size={18} /> Thêm tiết mục
            </button>
          </div>


          {/* =================================================
              03. FILE + CAM KẾT
              ================================================= */}

          <div className="form-section">
            <div className="form-section-title">
              <span>03</span>

              <div>
                <h2>
                  Danh sách tham gia &amp; Dự trù kinh phí
                </h2>

                <p>
                  Vui lòng upload đầy đủ danh sách thành
                  viên và file dự trù kinh phí.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <label className="upload-box">
                <input
                  type="file"
                  accept=".xlsx,.xls,.doc,.docx,.pdf,.csv"
                  onChange={(e) =>
                    update(
                      "participantFile",
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  required
                  disabled={submitting}
                />

                <UploadCloud size={27} />

                <strong>
                  {form.participantFile
                    ? form.participantFile.name
                    : "Upload danh sách tham gia"}
                </strong>

                <span>
                  Excel, Word, PDF hoặc CSV
                </span>
              </label>

              <label className="upload-box">
                <input
                  type="file"
                  accept=".xlsx,.xls,.doc,.docx,.pdf,.csv"
                  onChange={(e) =>
                    update(
                      "budgetFile",
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  required
                  disabled={submitting}
                />

                <UploadCloud size={27} />

                <strong>
                  {form.budgetFile
                    ? form.budgetFile.name
                    : "Upload dự trù kinh phí"}
                </strong>

                <span>
                  Excel, Word, PDF hoặc CSV
                </span>
              </label>
            </div>

            <label className="commitment-confirmation">
              <input
                type="checkbox"
                checked={
                  form.commitment ===
                  "Đồng ý xác nhận"
                }
                onChange={(e) =>
                  update(
                    "commitment",
                    e.target.checked
                      ? "Đồng ý xác nhận"
                      : ""
                  )
                }
                required
                disabled={submitting}
              />

              <span>
                Tôi xác nhận các thông tin đã cung cấp
                là đầy đủ, chính xác và cam kết tham gia
                chương trình theo nội dung đăng ký.{" "}
                <b>*</b>
              </span>
            </label>
          </div>


          {/* =================================================
              SUBMIT
              ================================================= */}

          <div className="form-submit">
            <p>
              <b>*</b> Trường thông tin bắt buộc
            </p>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={
                !canSubmit ||
                submitting
              }
            >
              <Send size={18} />

              {submitting
                ? "ĐANG GỬI..."
                : "GỬI ĐĂNG KÝ"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}


/* =========================================================
   GIAN HÀNG TRIỂN LÃM
   ========================================================= */

function ExhibitionForm({
  submitted,
  setSubmitted,
  onBack
}) {
  const [form, setForm] = useState({
    unit: "",
    content: "",
    completionTime: "",
    contact: "",
    layout: "",
    commitment: ""
  });

  const [submitting, setSubmitting] =
    useState(false);

  const update = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));

  const canSubmit = useMemo(
    () =>
      form.unit &&
      form.content &&
      form.completionTime &&
      form.contact &&
      form.commitment,
    [form]
  );

  const submit = async (e) => {
    e.preventDefault();

    if (!canSubmit || submitting) return;

    setSubmitting(true);

    try {
      await addExhibitionRegistration({
        unit: form.unit,
        contact: form.contact,
        completionTime:
          form.completionTime,
        layout: form.layout,
        exhibitionContent:
          form.content,
        commitment:
          form.commitment
      });

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Lỗi gửi đăng ký gian hàng triển lãm:",
        error
      );

      alert(
        error?.message ||
          "Không thể gửi đăng ký. Vui lòng thử lại."
      );

      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SimpleSuccess
        title="Đăng ký gian hàng triển lãm thành công"
        onBack={onBack}
      />
    );
  }

  return (
    <section className="page-section">
      <div className="container form-container">
        <FormBackButton onBack={onBack} />

        <div className="page-title">
          <span className="eyebrow">
            02 · GIAN HÀNG TRIỂN LÃM
          </span>

          <h1>
            Đăng ký gian hàng triển lãm
          </h1>

          <p>
            Cung cấp thông tin để Ban Tổ chức tổng hợp
            nội dung và hỗ trợ bố trí gian hàng.
          </p>
        </div>

        <form
          className="registration-form"
          onSubmit={submit}
        >
          <div className="form-section">
            <div className="form-section-title">
              <span>01</span>

              <div>
                <h2>Thông tin gian hàng</h2>

                <p>
                  Thông tin cơ bản của nội dung triển lãm.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>
                  Đơn vị đăng ký <b>*</b>
                </span>

                <select
                  value={form.unit}
                  onChange={(e) =>
                    update(
                      "unit",
                      e.target.value
                    )
                  }
                  required
                  disabled={submitting}
                >
                  <option value="">
                    Chọn đơn vị
                  </option>

                  {units.map((unit) => (
                    <option key={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>
                  Thời gian hoàn thiện <b>*</b>
                </span>

                <input
                  value={
                    form.completionTime
                  }
                  onChange={(e) =>
                    update(
                      "completionTime",
                      e.target.value
                    )
                  }
                  placeholder="Ví dụ: Hoàn thiện trước 25/10/2026"
                  required
                  disabled={submitting}
                />
              </label>

              <label className="field full">
                <span>
                  Nhân sự phụ trách - SĐT{" "}
                  <b>*</b>
                </span>

                <input
                  value={form.contact}
                  onChange={(e) =>
                    update(
                      "contact",
                      e.target.value
                    )
                  }
                  placeholder="Nhập họ tên và số điện thoại"
                  required
                  disabled={submitting}
                />
              </label>

              <label className="field full">
                <span>
                  Nội dung triển lãm <b>*</b>
                </span>

                <textarea
                  value={form.content}
                  onChange={(e) =>
                    update(
                      "content",
                      e.target.value
                    )
                  }
                  placeholder="Mô tả nội dung, chủ đề và các hoạt động tại gian hàng..."
                  rows="5"
                  required
                  disabled={submitting}
                />
              </label>

              <label className="field full">
                <span>
                  Bố cục trang trí (nếu có)
                </span>

                <textarea
                  value={form.layout}
                  onChange={(e) =>
                    update(
                      "layout",
                      e.target.value
                    )
                  }
                  placeholder="Mô tả ý tưởng bố cục, trang trí hoặc yêu cầu không gian..."
                  rows="4"
                  disabled={submitting}
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <span>02</span>

              <div>
                <h2>
                  Xác nhận tham gia
                </h2>

                <p>
                  Xác nhận thông tin trước khi gửi đăng ký.
                </p>
              </div>
            </div>

            <CommitmentConfirmation
              checked={
                form.commitment ===
                "Đồng ý xác nhận"
              }
              onChange={(checked) =>
                update(
                  "commitment",
                  checked
                    ? "Đồng ý xác nhận"
                    : ""
                )
              }
              disabled={submitting}
            />
          </div>

          <SubmitButton
            disabled={
              !canSubmit ||
              submitting
            }
            submitting={submitting}
          />
        </form>
      </div>
    </section>
  );
}


/* =========================================================
   HOẠT ĐỘNG CỦA ĐƠN VỊ
   ========================================================= */

function UnitActivityForm({
  submitted,
  setSubmitted,
  onBack
}) {
  const [form, setForm] = useState({
    unit: "",
    contact: "",
    commitment: "",
    activities: [emptyActivity()]
  });

  const [submitting, setSubmitting] =
    useState(false);

  const update = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));

  const updateActivity = (
    index,
    key,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      activities:
        prev.activities.map(
          (activity, i) =>
            i === index
              ? {
                  ...activity,
                  [key]: value
                }
              : activity
        )
    }));
  };

  const addActivity = () => {
    setForm((prev) => ({
      ...prev,
      activities: [
        ...prev.activities,
        emptyActivity()
      ]
    }));
  };

  const removeActivity = (index) => {
    if (form.activities.length === 1) return;

    setForm((prev) => ({
      ...prev,
      activities:
        prev.activities.filter(
          (_, i) => i !== index
        )
    }));
  };

  const canSubmit = useMemo(
    () =>
      form.unit &&
      form.contact &&
      form.commitment &&
      form.activities.every(
        (activity) =>
          activity.name &&
          activity.content
      ),
    [form]
  );

  const submit = async (e) => {
    e.preventDefault();

    if (!canSubmit || submitting) return;

    setSubmitting(true);

    try {
      await addActivityRegistration({
        unit: form.unit,
        contact: form.contact,
        commitment:
          form.commitment,
        activities:
          form.activities
      });

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Lỗi gửi đăng ký hoạt động của đơn vị:",
        error
      );

      alert(
        error?.message ||
          "Không thể gửi đăng ký. Vui lòng thử lại."
      );

      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SimpleSuccess
        title="Đăng ký hoạt động của đơn vị thành công"
        onBack={onBack}
      />
    );
  }

  return (
    <section className="page-section">
      <div className="container form-container">
        <FormBackButton onBack={onBack} />

        <div className="page-title">
          <span className="eyebrow">
            03 · HOẠT ĐỘNG CỦA ĐƠN VỊ
          </span>

          <h1>
            Đăng ký hoạt động của đơn vị
          </h1>

          <p>
            Đăng ký các hoạt động dự kiến thực hiện
            trong khuôn khổ Ngày hội.
          </p>
        </div>

        <form
          className="registration-form"
          onSubmit={submit}
        >
          <div className="form-section">
            <div className="form-section-title">
              <span>01</span>

              <div>
                <h2>Thông tin đơn vị</h2>

                <p>
                  Thông tin liên hệ của đơn vị đăng ký.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>
                  Đơn vị đăng ký <b>*</b>
                </span>

                <select
                  value={form.unit}
                  onChange={(e) =>
                    update(
                      "unit",
                      e.target.value
                    )
                  }
                  required
                  disabled={submitting}
                >
                  <option value="">
                    Chọn đơn vị
                  </option>

                  {units.map((unit) => (
                    <option key={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>
                  Nhân sự phụ trách - SĐT{" "}
                  <b>*</b>
                </span>

                <input
                  value={form.contact}
                  onChange={(e) =>
                    update(
                      "contact",
                      e.target.value
                    )
                  }
                  placeholder="Nhập họ tên và số điện thoại"
                  required
                  disabled={submitting}
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <span>02</span>

              <div>
                <h2>
                  Thông tin hoạt động
                </h2>

                <p>
                  Có thể đăng ký nhiều hoạt động của cùng
                  một đơn vị.
                </p>
              </div>
            </div>

            {form.activities.map(
              (activity, index) => (
                <div
                  className="performance-form-card"
                  key={index}
                >
                  <div className="performance-form-head">
                    <div>
                      <strong>
                        Hoạt động {index + 1}
                      </strong>

                      <span>
                        Nội dung đăng ký
                      </span>
                    </div>

                    {form.activities.length >
                      1 && (
                      <button
                        type="button"
                        className="icon-danger"
                        onClick={() =>
                          removeActivity(index)
                        }
                        title="Xóa hoạt động"
                        disabled={submitting}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="form-grid">
                    <label className="field full">
                      <span>
                        Tên hoạt động <b>*</b>
                      </span>

                      <input
                        value={
                          activity.name
                        }
                        onChange={(e) =>
                          updateActivity(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Nhập tên hoạt động"
                        required
                        disabled={submitting}
                      />
                    </label>

                    <label className="field full">
                      <span>
                        Nội dung thực hiện{" "}
                        <b>*</b>
                      </span>

                      <textarea
                        value={
                          activity.content
                        }
                        onChange={(e) =>
                          updateActivity(
                            index,
                            "content",
                            e.target.value
                          )
                        }
                        placeholder="Mô tả nội dung và cách thức thực hiện hoạt động..."
                        rows="5"
                        required
                        disabled={submitting}
                      />
                    </label>
                  </div>
                </div>
              )
            )}

            <button
              type="button"
              className="add-performance"
              onClick={addActivity}
              disabled={submitting}
            >
              <Plus size={18} /> Thêm hoạt động
            </button>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <span>03</span>

              <div>
                <h2>
                  Xác nhận tham gia
                </h2>

                <p>
                  Xác nhận thông tin trước khi gửi đăng ký.
                </p>
              </div>
            </div>

            <CommitmentConfirmation
              checked={
                form.commitment ===
                "Đồng ý xác nhận"
              }
              onChange={(checked) =>
                update(
                  "commitment",
                  checked
                    ? "Đồng ý xác nhận"
                    : ""
                )
              }
              disabled={submitting}
            />
          </div>

          <SubmitButton
            disabled={
              !canSubmit ||
              submitting
            }
            submitting={submitting}
          />
        </form>
      </div>
    </section>
  );
}


/* =========================================================
   CHECKBOX CAM KẾT
   ========================================================= */

function CommitmentConfirmation({
  checked,
  onChange,
  disabled = false
}) {
  return (
    <label className="commitment-confirmation">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
        required
        disabled={disabled}
      />

      <span>
        Tôi xác nhận các thông tin đã cung cấp là đầy đủ,
        chính xác và cam kết tham gia chương trình theo
        nội dung đăng ký. <b>*</b>
      </span>
    </label>
  );
}


/* =========================================================
   SUBMIT BUTTON
   ========================================================= */

function SubmitButton({
  disabled,
  submitting = false
}) {
  return (
    <div className="form-submit">
      <p>
        <b>*</b> Trường thông tin bắt buộc
      </p>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={disabled}
      >
        <Send size={18} />

        {submitting
          ? "ĐANG GỬI..."
          : "GỬI ĐĂNG KÝ"}
      </button>
    </div>
  );
}


/* =========================================================
   SUCCESS
   ========================================================= */

function SimpleSuccess({
  title,
  onBack
}) {
  return (
    <section className="page-section">
      <div className="container narrow">
        <div className="success-card">
          <div className="success-icon">
            ✓
          </div>

          <h1>{title}</h1>

          <p>
            Thông tin đăng ký đã được gửi đến Ban Tổ chức
            và đang chờ xét duyệt.
          </p>

          <div className="success-actions">
            <button
              className="btn btn-primary"
              onClick={onBack}
            >
              Đăng ký nội dung khác
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   PAGE
   ========================================================= */

export default function Registration() {
  const [selectedType, setSelectedType] =
    useState(null);

  if (!selectedType) {
    return (
      <RegistrationChoice
        onSelect={setSelectedType}
      />
    );
  }

  return (
    <RegistrationPage
      type={selectedType}
      onBack={() =>
        setSelectedType(null)
      }
    />
  );
}