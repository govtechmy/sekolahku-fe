import type { ReactNode } from "react";

interface InfoRowProps {
  icon: ReactNode;
  text: string;
}

/**
 * Reusable info row component for displaying school contact information
 */
export const InfoRow = ({ icon, text }: InfoRowProps) => {
  if (!text) return null;

  return (
    <div className="flex items-center gap-1.5 self-stretch pb-4">
      <div className="text-txt-primary">{icon}</div>
      <div className="text-txt-black-500 text-body-lg font-medium">{text}</div>
    </div>
  );
};
