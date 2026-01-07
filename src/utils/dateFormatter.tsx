export const formatDate = (dateString: string, lang?: string): string => {
  const date = new Date(dateString);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const monthsMalay = [
    "JAN",
    "FEB",
    "MAC",
    "APR",
    "MEI",
    "JUN",
    "JUL",
    "OGO",
    "SEP",
    "OKT",
    "NOV",
    "DIS",
  ];
  const day = date.getDate();
  const month =
    lang === "ms" ? monthsMalay[date.getMonth()] : months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
