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
 * Dữ liệu thật của BTC được tải bằng
 * loadSubmissions().
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
 * Dữ liệu được lấy trực tiếp từ Google Sheets
 * thông qua Apps Script.
 *
 * KHÔNG sử dụng cache BTC cho dữ liệu public.
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
   CLEAR CACHE
   ========================================================= */

/**
 * Chỉ xóa cache trình duyệt.
 *
 * Không xóa dữ liệu thật trên Google Sheets.
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
 *
 * Khi server cập nhật thành công,
 * tải lại toàn bộ dữ liệu BTC để UI
 * đồng bộ chính xác với Google Sheets.
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

  /**
   * Server đã cập nhật Google Sheet thành công.
   *
   * Tải lại dữ liệu thật để UI BTC
   * đồng bộ với backend.
   */
  return await loadSubmissions();
}