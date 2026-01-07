function getDayAndDateMonth(eventDate: string) {
  const d = new Date(eventDate);

  const day = d.toLocaleDateString("en-MY", { weekday: "long" });
  const dateMonth = d.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
  });

  return { day, dateMonth };
}

export function formatEventDay(eventDate: string) {
  return getDayAndDateMonth(eventDate).day;
}

export function formatEventDateMonth(eventDate: string) {
  return getDayAndDateMonth(eventDate).dateMonth;
}

// get time in HH:MM format in 12-hour clock
export function formatEventTime(eventDate: string) {
  const d = new Date(eventDate);
  return d
    .toLocaleTimeString("en-MY", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
}

export function formatFullEventDate(eventDate: string) {
  const d = new Date(eventDate);
  return d.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const formatDateToISO = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};