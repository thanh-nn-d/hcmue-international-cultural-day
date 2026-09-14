const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "xlsx",
  "xls",
  "doc",
  "docx",
  "pdf",
  "csv"
];

export const REGISTRATION_TYPES = {
  ART: "art-program",
  EXHIBITION: "exhibition-booth",
  ACTIVITY: "unit-activity"
};


/* =========================================================
   KIỂM TRA API URL
   ========================================================= */

function ensureApiUrl() {
  if (!API_URL) {
    throw new Error(
      "Thiếu VITE_APPS_SCRIPT_URL trong .env.local"
    );
  }

  return API_URL;
}


/* =========================================================
   CHUYỂN FILE → BASE64
   ========================================================= */

function fileToBase64(file) {
  return new Promise((resolve, reject) => {

    if (!file) {
      reject(
        new Error("Không có file.")
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      reject(
        new Error(
          `File "${file.name}" vượt quá giới hạn 10 MB.`
        )
      );
      return;
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !ALLOWED_EXTENSIONS.includes(
        extension
      )
    ) {
      reject(
        new Error(
          `Định dạng file "${extension}" không được hỗ trợ.`
        )
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {

      try {

        const result =
          String(reader.result);

        const base64 =
          result.split(",")[1];

        resolve({
          name: file.name,
          mimeType:
            file.type ||
            "application/octet-stream",
          data: base64
        });

      } catch (error) {

        reject(error);
      }
    };

    reader.onerror = () => {

      reject(
        new Error(
          `Không thể đọc file "${file.name}".`
        )
      );
    };

    reader.readAsDataURL(file);
  });
}


/* =========================================================
   GỌI APPS SCRIPT
   ========================================================= */

async function postToAppsScript(
  payload
) {

  const url =
    ensureApiUrl();

  const response =
    await fetch(
      url,
      {
        method: "POST",

        /*
         * Không set Content-Type application/json
         * để tránh browser tạo preflight CORS.
         *
         * Apps Script vẫn đọc được
         * e.postData.contents.
         */
        body: JSON.stringify(payload)
      }
    );

  if (!response.ok) {

    throw new Error(
      `Apps Script trả về HTTP ${response.status}.`
    );
  }

  const result =
    await response.json();

  if (!result.success) {

    throw new Error(
      result.error ||
      "Apps Script xử lý đăng ký thất bại."
    );
  }

  return result.data;
}


/* =========================================================
   CHƯƠNG TRÌNH NGHỆ THUẬT
   ========================================================= */

export async function addArtRegistration({
  unit,
  contact,
  phone,
  commitment,
  participantFile,
  budgetFile,
  performances
}) {

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

  if (
    !Array.isArray(performances) ||
    performances.length === 0
  ) {
    throw new Error(
      "Phải có ít nhất một tiết mục."
    );
  }


  /*
   * Chuyển hai file thành base64.
   */
  const participantFileData =
    await fileToBase64(
      participantFile
    );

  const budgetFileData =
    await fileToBase64(
      budgetFile
    );


  /*
   * Gửi toàn bộ dữ liệu sang Apps Script.
   */
  return postToAppsScript({

    action:
      "submitArt",

    unit,

    contact,

    phone,

    commitment,

    participantFile:
      participantFileData,

    budgetFile:
      budgetFileData,

    performances
  });
}


/* =========================================================
   GIAN HÀNG TRIỂN LÃM
   ========================================================= */

export async function addExhibitionRegistration({
  unit,
  contact,
  completionTime,
  layout,
  exhibitionContent,
  commitment
}) {

  return postToAppsScript({

    action:
      "submitExhibition",

    unit,

    contact,

    completionTime,

    layout,

    exhibitionContent,

    commitment
  });
}


/* =========================================================
   HOẠT ĐỘNG CỦA ĐƠN VỊ
   ========================================================= */

export async function addActivityRegistration({
  unit,
  contact,
  commitment,
  activities
}) {

  if (
    !Array.isArray(activities) ||
    activities.length === 0
  ) {
    throw new Error(
      "Phải có ít nhất một hoạt động."
    );
  }


  return postToAppsScript({

    action:
      "submitActivity",

    unit,

    contact,

    commitment,

    activities
  });
}


/* =========================================================
   LẤY NỘI DUNG ĐÃ DUYỆT
   ========================================================= */

export async function getPublicSubmissions() {

  const url =
    ensureApiUrl();


  const response =
    await fetch(
      `${url}?action=public`
    );


  if (!response.ok) {

    throw new Error(
      `Apps Script trả về HTTP ${response.status}.`
    );
  }


  const result =
    await response.json();


  if (!result.success) {

    throw new Error(
      result.error ||
      "Không thể lấy dữ liệu công khai."
    );
  }


  return result.data || [];
}