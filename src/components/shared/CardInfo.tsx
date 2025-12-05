export type InfoRowProps = {
  label: string;
  value: string;
};

export  function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-txt-black-500 text-body-xs font-normal">{label}</div>
      <div className="text-body-sm text-txt-black-900">{value}</div>
    </div>
  );
}

export type InfoIconRowProps = {
  icon: React.ReactNode;
  value: string;
};

export function InfoIconRow({ icon, value }: InfoIconRowProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="text-txt-primary">{icon}</div>
      <span className="text-txt-black-500 text-body-xs font-medium">{value}</span>
    </div>
  );
}