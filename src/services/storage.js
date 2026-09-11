import { mockPerformances } from "../data/mockPerformances";

const KEY = "hcmue-cultural-day-submissions-v1";

export function getSubmissions() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore malformed local storage and fall back to demo data.
  }
  return mockPerformances;
}

export function saveSubmissions(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addSubmission(submission) {
  const current = getSubmissions();
  const next = [submission, ...current.filter((item) => !item.id.startsWith("demo-"))];
  saveSubmissions(next);
  return submission;
}

export function updateSubmissionStatus(id, status) {
  const next = getSubmissions().map((item) =>
    item.id === id ? { ...item, status } : item
  );
  saveSubmissions(next);
  return next;
}

export function clearLocalSubmissions() {
  localStorage.removeItem(KEY);
}
