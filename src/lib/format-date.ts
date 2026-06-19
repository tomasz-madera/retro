const LOCALE = "pl-PL";
const TIME_ZONE = "Europe/Warsaw";

export function formatDateTime(value: Date | string): string {
  return new Date(value).toLocaleString(LOCALE, {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString(LOCALE, {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
