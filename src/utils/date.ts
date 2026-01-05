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
