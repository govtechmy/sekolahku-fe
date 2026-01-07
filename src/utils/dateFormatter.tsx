export const formatDate = (dateString: string, lang?: string): string => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthsMalay = [
    "Jan",
    "Feb",
    "Mac",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ogo",
    "Sep",
    "Okt",
    "Nov",
    "Dis",
  ];
  const day = date.getDate();
  const month =
    lang === "ms" ? monthsMalay[date.getMonth()] : months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
