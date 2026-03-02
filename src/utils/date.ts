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

export function formatEventDateDDMMYY(eventDate: string) {
  const d = new Date(eventDate);

  if (Number.isNaN(d.getTime())) {
    return eventDate;
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

export function translateEnglishMonthToMalay(dateText: string) {
  const monthMap: Record<string, string> = {
    january: "Januari",
    february: "Februari",
    march: "Mac",
    april: "April",
    may: "Mei",
    june: "Jun",
    july: "Julai",
    august: "Ogos",
    september: "September",
    october: "Oktober",
    november: "November",
    december: "Disember",
  };

  return dateText.replace(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/gi,
    (match) => monthMap[match.toLowerCase()] ?? match,
  );
}
