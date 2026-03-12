import React from "react";

export default function PrintDisplay({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="print-content">{children}</div>
    </>
  );
}
