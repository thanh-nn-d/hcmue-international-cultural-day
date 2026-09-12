import { mockPerformances } from "../data/mockPerformances";

const KEY = "hcmue-cultural-day-submissions-v1";

export const REGISTRATION_TYPES = {
  ART: "art-program",
  EXHIBITION: "exhibition-booth",
  ACTIVITY: "unit-activity"
};

function normalizeItem(item) {
  return {
    ...item,
    registrationType:
      item.registrationType || REGISTRATION_TYPES.ART
  };
}

export function getSubmissions() {
  try {
    const raw = localStorage.getItem(KEY);

    if (raw) {
      const items = JSON.parse(raw).map(normalizeItem);

      const existingIds = new Set(
        items.map((item) => item.id)
      );

      const missingMocks = mockPerformances
        .filter((item) => !existingIds.has(item.id))
        .map(normalizeItem);

      return [
        ...items,
        ...missingMocks
      ];
    }
  } catch {
    // Nếu localStorage bị lỗi hoặc dữ liệu không hợp lệ,
    // sử dụng dữ liệu mẫu.
  }

  return mockPerformances.map(normalizeItem);
}

export function saveSubmissions(items) {
  localStorage.setItem(
    KEY,
    JSON.stringify(
      items.map(normalizeItem)
    )
  );
}

export function addSubmission(submission) {
  const current = getSubmissions();

  const next = [
    submission,
    ...current.filter(
      (item) => !item.id.startsWith("demo-")
    )
  ];

  saveSubmissions(next);

  return submission;
}

export function updateSubmissionStatus(id, status) {
  const next = getSubmissions().map((item) =>
    item.id === id
      ? {
          ...item,
          status
        }
      : item
  );

  saveSubmissions(next);

  return next;
}

export function clearLocalSubmissions() {
  localStorage.removeItem(KEY);
}