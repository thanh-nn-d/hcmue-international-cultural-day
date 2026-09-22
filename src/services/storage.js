const APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL || "";

export const REGISTRATION_TYPES = {
  ART: "art-program",
  EXHIBITION: "exhibition-booth",
  ACTIVITY: "unit-activity",
};

const CACHE_KEY = "hicd-admin-submissions-v1";

/* =========================================================
   LOCAL CACHE
========================================================= */

function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);

    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCache(items) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(items)
    );
  } catch {
    // Ignore cache errors.
  }
}

/* =========================================================
   ADMIN DATA
========================================================= */

/**
 * Giữ API cũ để các page hiện tại
 * không bị crash.
 *
 * Dữ liệu thật được tải bằng loadSubmissions().
 */
export function getSubmissions() {
  return getCache();
}

/**
 * Lấy toàn bộ hồ sơ đăng ký cho BTC
 * từ Google Sheets thông qua Apps Script.
 *
 * Bao gồm:
 * - pending
 * - approved
 * - rejected
 */
export async function loadSubmissions() {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      "Thiếu VITE_APPS_SCRIPT_URL trong .env.local"
    );
  }

  const response = await fetch(
    `${APPS_SCRIPT_URL}?action=admin`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể tải dữ liệu BTC (${response.status})`
    );
  }

  const payload = await response.json();

  if (!payload.success) {
    throw new Error(
      payload.error ||
        payload.message ||
        "API BTC trả về lỗi."
    );
  }

  const items = Array.isArray(payload.data)
    ? payload.data
    : [];

  setCache(items);

  return items;
}

/* =========================================================
   PUBLIC DATA
========================================================= */

/**
 * Lấy các nội dung đã được BTC duyệt
 * để hiển thị công khai trên
 * "Khám phá Ngày hội".
 *
 * API:
 * ?action=public
 *
 * Chỉ nhận dữ liệu public từ Apps Script.
 */
export async function loadPublicSubmissions() {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      "Thiếu VITE_APPS_SCRIPT_URL trong .env.local"
    );
  }

  const response = await fetch(
    `${APPS_SCRIPT_URL}?action=public`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể tải nội dung Ngày hội (${response.status})`
    );
  }

  const payload = await response.json();

  if (!payload.success) {
    throw new Error(
      payload.error ||
        payload.message ||
        "API public trả về lỗi."
    );
  }

  return Array.isArray(payload.data)
    ? payload.data
    : [];
}

/* =========================================================
   CLEAR LOCAL CACHE
========================================================= */

/**
 * Chỉ xóa cache trình duyệt.
 *
 * KHÔNG xóa dữ liệu trong Google Sheets.
 * KHÔNG xóa file trong Google Drive.
 */
export function clearLocalSubmissions() {
  localStorage.removeItem(CACHE_KEY);
}

/* =========================================================
   UPDATE STATUS
========================================================= */

/**
 * Cập nhật trạng thái hồ sơ trên Google Sheets.
 *
 * status:
 * - pending
 * - approved
 * - rejected
 */
export async function updateSubmissionStatus(
  id,
  status,
  rejectionReason = ""
) {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      "Thiếu VITE_APPS_SCRIPT_URL trong .env.local"
    );
  }

  if (!id) {
    throw new Error("Thiếu mã đăng ký.");
  }

  if (!status) {
    throw new Error("Thiếu trạng thái đăng ký.");
  }

  const response = await fetch(
    APPS_SCRIPT_URL,
    {
      method: "POST",
      body: JSON.stringify({
        action: "updateStatus",
        registrationId: id,
        status,
        rejectionReason,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể cập nhật trạng thái (${response.status})`
    );
  }

  const payload = await response.json();

  if (!payload.success) {
    throw new Error(
      payload.error ||
        payload.message ||
        "Không thể cập nhật trạng thái."
    );
  }

  /*
   * Server đã cập nhật Google Sheet thành công.
   * Tải lại dữ liệu thật để UI BTC đồng bộ
   * chính xác với backend.
   */
  return await loadSubmissions();
}

/* =========================================================
   SUBMIT REGISTRATIONS
========================================================= */

/**
 * Chuyển File từ trình duyệt thành payload JSON
 * để Apps Script có thể decode và lưu vào Google Drive.
 */
async function fileToPayload(file) {
  if (!file) return null;

  const dataUrl = await new Promise(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () =>
        resolve(reader.result);

      reader.onerror = () =>
        reject(
          new Error(
            `Không thể đọc file: ${file.name}`
          )
        );

      reader.readAsDataURL(file);
    }
  );

  const data =
    String(dataUrl).split(",")[1] || "";

  return {
    name: file.name,
    mimeType:
      file.type ||
      "application/octet-stream",
    data,
  };
}

/**
 * Gửi payload đăng ký tới Apps Script.
 */
async function postRegistration(payload) {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      "Thiếu VITE_APPS_SCRIPT_URL. Vui lòng kiểm tra cấu hình website."
    );
  }

  const response = await fetch(
    APPS_SCRIPT_URL,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Không thể gửi đăng ký (${response.status}). Vui lòng thử lại.`
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Phản hồi từ Apps Script không hợp lệ. Vui lòng thử lại."
    );
  }

  if (!result.success) {
    throw new Error(
      result.error ||
        result.message ||
        "Apps Script không thể xử lý đăng ký."
    );
  }

  return result.data;
}

/* =========================================================
   ART PROGRAM
========================================================= */

/**
 * Gửi đăng ký chương trình nghệ thuật.
 *
 * Bao gồm:
 * - Thông tin đơn vị
 * - Người phụ trách
 * - Số điện thoại
 * - Cam kết
 * - Danh sách tham gia
 * - Dự trù kinh phí
 * - Danh sách tiết mục
 */
export async function addArtRegistration({
  unit,
  contact,
  phone,
  commitment,
  participantFile,
  budgetFile,
  performances,
}) {
  if (!unit) {
    throw new Error(
      "Vui lòng chọn đơn vị."
    );
  }

  if (!contact) {
    throw new Error(
      "Vui lòng nhập người phụ trách."
    );
  }

  if (!phone) {
    throw new Error(
      "Vui lòng nhập số điện thoại."
    );
  }

  if (!commitment) {
    throw new Error(
      "Vui lòng xác nhận cam kết."
    );
  }

  if (
    !Array.isArray(performances) ||
    performances.length === 0
  ) {
    throw new Error(
      "Vui lòng thêm ít nhất một tiết mục."
    );
  }

  if (!participantFile) {
    throw new Error(
      "Vui lòng upload danh sách tham gia."
    );
  }

  if (!budgetFile) {
    throw new Error(
      "Vui lòng upload dự trù kinh phí."
    );
  }

  /*
   * Chuyển hai file thành Base64 song song
   * trước khi gửi sang Apps Script.
   */
  const [
    participantFilePayload,
    budgetFilePayload,
  ] = await Promise.all([
    fileToPayload(participantFile),
    fileToPayload(budgetFile),
  ]);

  return postRegistration({
    action: "submitArt",

    unit,
    contact,
    phone,
    commitment,

    participantFile:
      participantFilePayload,

    budgetFile:
      budgetFilePayload,

    performances,
  });
}

/* =========================================================
   EXHIBITION BOOTH
========================================================= */

/**
 * Gửi đăng ký gian hàng triển lãm.
 */
export async function addExhibitionRegistration({
  unit,
  contact,
  completionTime,
  layout,
  exhibitionContent,
  commitment,
}) {
  if (!unit) {
    throw new Error(
      "Vui lòng chọn đơn vị."
    );
  }

  if (!contact) {
    throw new Error(
      "Vui lòng nhập người phụ trách."
    );
  }

  if (!completionTime) {
    throw new Error(
      "Vui lòng nhập thời gian hoàn thành."
    );
  }

  if (!exhibitionContent) {
    throw new Error(
      "Vui lòng nhập nội dung triển lãm."
    );
  }

  if (!commitment) {
    throw new Error(
      "Vui lòng xác nhận cam kết."
    );
  }

  return postRegistration({
    action: "submitExhibition",

    unit,
    contact,

    completionTime,

    layout,

    exhibitionContent,

    commitment,
  });
}

/* =========================================================
   UNIT ACTIVITY
========================================================= */

/**
 * Gửi đăng ký hoạt động của đơn vị.
 */
export async function addActivityRegistration({
  unit,
  contact,
  commitment,
  activities,
}) {
  if (!unit) {
    throw new Error(
      "Vui lòng chọn đơn vị."
    );
  }

  if (!contact) {
    throw new Error(
      "Vui lòng nhập người phụ trách."
    );
  }

  if (!commitment) {
    throw new Error(
      "Vui lòng xác nhận cam kết."
    );
  }

  if (
    !Array.isArray(activities) ||
    activities.length === 0
  ) {
    throw new Error(
      "Vui lòng thêm ít nhất một hoạt động."
    );
  }

  return postRegistration({
    action: "submitActivity",

    unit,
    contact,
    commitment,

    activities,
  });
}