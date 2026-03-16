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
            margin: 2cm 2cm 2.5cm 2cm;
            size: A4;
          }

          body {
            margin: 0 !important;
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
