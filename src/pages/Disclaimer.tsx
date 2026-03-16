interface DisclaimerProps {
  onAccept?: () => void;
}

export default function DisclaimerPage({ onAccept }: DisclaimerProps = {}) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center py-12 px-[18px] md:px-20 print:py-0">
      <div className="flex flex-col gap-6 max-w-[520px] max-h-[365px] bg-bg-white p-6 rounded-lg">
        <p className="text-2xl font-bold font-body"> Penafian </p>
        <p
          className="text-txt-black-500 text-body-lg"
          {...{ "splwpk-privacy-policy": "splwpk-privacy-policy" }}
        >
          Fungsi <i className="text-txt-black-700">Carian Sekolah</i> kini
          berada dalam fasa <i className="text-txt-black-700">Ujian Beta</i>.
          Kemungkinan terdapat beberapa pepijat atau isu teknikal.
          Penambahbaikan akan dilakukan dari semasa ke semasa.
        </p>
        {onAccept && (
          <button
            onClick={onAccept}
            className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Faham & Teruskan
          </button>
        )}
      </div>
    </div>
  );
}
