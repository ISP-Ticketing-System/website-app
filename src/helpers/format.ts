export function dateFormat(date?: string) {
  const dateObj = date ? new Date(date) : new Date();

  const formatted = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(dateObj);

  return formatted;
}
