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
