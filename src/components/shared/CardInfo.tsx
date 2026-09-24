export type InfoRowProps = {
  label: string;
  value: React.ReactNode;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    // Renders 3 grid cells (label, colon, value); the parent supplies the
    // grid (see FACT_GRID in SchoolInfoWindow) so labels and colons line up across rows.
    <div className="contents text-body-sm">
      <span className="text-txt-black-500 font-normal">{label}</span>
      <span className="text-txt-black-500 font-normal">:</span>
      <span className="text-txt-black-900 font-semibold">{value}</span>
    </div>
  );
}

export type InfoIconRowProps = {
  icon: React.ReactNode;
  value: React.ReactNode;
};

export function InfoIconRow({ icon, value }: InfoIconRowProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="text-txt-primary">{icon}</div>
      <span className="text-txt-black-500 text-body-xs font-medium">
        {value}
      </span>
    </div>
  );
}
