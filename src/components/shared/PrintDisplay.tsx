import React from "react";

export default function PrintDisplay({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        @media print {
          @page {
            margin: 0cm 2cm 2.5cm 2cm;
            size: A4;
          }
          
          .print-content {
            max-width: 100%;
          }
        }
      `}</style>
      <div className="print-content">{children}</div>
    </>
  );
}
