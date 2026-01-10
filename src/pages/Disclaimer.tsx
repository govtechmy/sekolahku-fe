export default function DisclaimerPage() {
  return (
    <div className=" py-12 px-[18px] md:px-20 md:flex md:justify-center print:py-0">
      <div className="flex flex-col gap-6 max-w-[825px]">
        <p className="text-2xl font-bold font-body"> Penafian </p>
        <p
          className="text-sm"
          {...{ "splwpk-privacy-policy": "splwpk-privacy-policy" }}
        >
          Penafian: Maklumat yang terkandung dalam laman web ini adalah untuk
          tujuan maklumat sahaja.
        </p>
        <p>
          Kementerian Pendidikan Malaysia tidak bertanggungjawab terhadap
          sebarang kehilangan atau kerosakan yang dialami kerana menggunakan
          maklumat dalam portal ini.
        </p>
      </div>
    </div>
  );
}
