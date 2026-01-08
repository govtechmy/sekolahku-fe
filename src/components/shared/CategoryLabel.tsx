type CategoryLabelProps = {
  categoryName: string;
};

export default function CategoryLabel({ categoryName }: CategoryLabelProps) {
  const baseClass = "font-body text-sm font-semibold";
  let colorClass = ""; // default for any other category

  switch (categoryName) {
    case "Berita": {
      colorClass = "text-txt-primary";
      break;
    }
    case "Pengumuman": {
      colorClass = "text-txt-success";
      break;
    }
    default: {
      colorClass = "text-txt-warning";
      break;
    }
  }

  return <div className={`${colorClass} ${baseClass}`}>{categoryName}</div>;
}
