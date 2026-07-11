// Helpers for working with note descriptions that may be either rich-text
// HTML (new notes) or plain text (legacy notes created before rich text).

const HTML_TAG = /<[a-z][\s\S]*>/i;

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Convert legacy plain-text (with newlines) into simple paragraph HTML.
export function plainTextToHtml(text) {
  const escaped = escapeHtml(text);
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return paragraphs || "<p></p>";
}

// Normalize a stored description into HTML the editor/viewer can render.
export function normalizeContent(value) {
  if (!value) return "";
  return HTML_TAG.test(value) ? value : plainTextToHtml(value);
}

// Extract readable plain text from an HTML (or plain) description, for
// previews. Uses DOMParser so no scripts run and no resources are fetched.
export function getPlainText(value) {
  if (!value) return "";
  if (!/[<&]/.test(value)) return value;

  const spaced = value.replace(
    /<\/(p|div|h[1-6]|li|blockquote|pre|br)>/gi,
    "$& "
  );

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return spaced.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const doc = new DOMParser().parseFromString(spaced, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

// True when a description has no visible text (e.g. an empty "<p></p>").
export function isRichTextEmpty(value) {
  return getPlainText(value).trim().length === 0;
}
