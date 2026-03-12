import React, { useEffect, useRef } from 'react';

export default function PrintHeader({ children }: { children: React.ReactNode }) {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePageNumbers = () => {
      if (footerRef.current) {
        const pageNumberSpan = footerRef.current.querySelector('.page-number');
        const totalPagesSpan = footerRef.current.querySelector('.total-pages');
        
        if (pageNumberSpan) {
          pageNumberSpan.textContent = '1';
        }
        if (totalPagesSpan) {
          const contentHeight = document.querySelector('.print-content')?.scrollHeight || 0;
          const pageHeight = 1122; 
          const totalPages = Math.ceil(contentHeight / pageHeight);
          totalPagesSpan.textContent = totalPages > 0 ? String(totalPages) : '1';
        }
      }
    };

    updatePageNumbers();
    window.addEventListener('beforeprint', updatePageNumbers);
    
    const printMediaQuery = window.matchMedia('print');
    printMediaQuery.addListener(updatePageNumbers);

    return () => {
      window.removeEventListener('beforeprint', updatePageNumbers);
      printMediaQuery.removeListener(updatePageNumbers);
    };
  }, []);

  return (
    <>
      <style>{`
        @media print {
          @page {
            margin-bottom: 2.5cm;
            size: A4;
          }
          
          .print-content {
            padding-bottom: 3cm;
          }
          
          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            border-top: 1px solid #d1d5db;
            background-color: white;
            padding: 1rem 5rem 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            color: #6b7280;
            z-index: 9999;
          }
        }
        
        @media screen {
          .print-footer {
            display: none;
          }
        }
      `}</style>
      
      <div className="print-content">
        {children}
      </div>
      
      <div className="print-footer" ref={footerRef}>
        <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <img src="/JataNegara.svg" alt="Jata Negara" style={{ width: '1rem' }} /> 
          SekolahKu
        </p>
        <p>
          Mukasurat <span className="page-number">1</span> / <span className="total-pages">1</span>
        </p>
      </div>
    </>
  );
}
