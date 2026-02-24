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
    .toLocaleTimeString("ms-MY", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
}

export function formatFullEventDate(eventDate: string) {
  const d = new Date(eventDate);
  return d.toLocaleDateString("ms-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
