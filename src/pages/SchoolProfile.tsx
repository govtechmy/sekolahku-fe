import { CheckCircleFillIcon, CrossFillIcon, EmailIcon, GovtOfficeIcon, PhoneIcon, PinIcon, PrinterIcon, UserGroupIcon, UserIcon } from "@govtechmy/myds-react/icon";
import Hero from "../components/shared/Hero";

export default function SchoolProfile() {
  
  return (
    // <div className="px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px]">
    <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
      <Hero
        small={true}
        background={
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/utama/sekolahku-2.png')", // Background image
            }}
          />
        }
        content={
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full px-6 md:px-12">
            {/* LEFT CONTENT */}
            <div className="max-w-xl pt-10 md:pt-0 text-center md:text-left">
              <div className="text-txt-primary font-semibold gap-6 pb-6">NAMA SEKOLAH</div>
              <div className="text-txt-black-900 text-heading-md max-md:text-heading-sm font-semibold gap-7 pb-7 max-w-[495px]">Maktab Sultan Abu Bakar (English College)</div>
              <div className="text-txt-primary font-semibold">JENIS SEKOLAH 
                <span className="text-txt-black-500 font-medium"> : SMK </span>
              </div>
            </div>
            {/* RIGHT LOGO */}
            <div className="mt-8 md:mt-0 flex justify-center text-center">
              <img
                src="/utama/image-159.png"
                alt="School Logo"
                width={260}
                height={260}
                className="object-contain drop-shadow-xl max-md:w-1/2"
              />
            </div>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 mt-0 md:px-12 max-md:px-0"> {/* p-8 */}
        {[
          { label: "PELAJAR", value: "1", amount:"4,065", icon: <UserGroupIcon/> },
          { label: "GURU", value: "2", amount:"4,065", icon: <UserIcon/> }
        ].map((item, idx) => (
          <div key={idx} className="border-t-0 border-[1px] outline-otl-gray-200 gap-0.5 mt-0">
            <div className="flex w-[640px] px-[109px] py-12 max-sm:px-4 max-sm:w-[85px] max-md:px-6 max-md:w-[173px] max-lg:px-[60px] max-lg:w-[320px] max-xl:w-[480px] items-start gap-[18px] shrink-0">
              <div className="flex w-[42px] h-[42px] justify-center items-center gap-x-[10px] gap-y-[10px] shrink-0 bg-primary-50 rounded-full bg-blue-50">
                <div className="text-txt-primary font-semibold">{item.icon}</div>
              </div>
              <div className="flex flex-col items-start gap-1 flex-1">
                <p className="text-txt-primary text-center text-sm max-md:text-xs font-semibold leading-tight tracking-widest uppercase">
                  {item.label}
                </p>
                <div className="self-stretch text-txt-black-900 text-heading-lg max-md:text-heading-sm font-semibold">
                  {item.amount}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="pt-[84px] pb-[32px] px-[109px] max-md:pt-[48px] max-md:px-[28px]">
        <div className="text-heading-sm text-txt-black-900 font-semibold pb-12">Mengenai Sekolah</div>
          <div className="shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              {[
                { value:"1", label: "Maktab Sultan Abu Bakar (English College)", icon: <GovtOfficeIcon width={24} height={24}/>},
                { value:"2", label: "07-222 2651", icon: <PhoneIcon width={24} height={24}/>},
                { value:"3", label: "07-222 2651", icon: <PrinterIcon width={24} height={24}/>},
                { value:"4", label: "english.college@moe.gov.my", icon: <EmailIcon width={24} height={24}/>},
                { value:"5", label: "Jalan Sungai Chat, Sri Gelam, 80100 Johor Bahru, Johor Darul Ta'zim", icon: <PinIcon width={24} height={24}/>}
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-1.5 self-stretch pb-4">
                    <div className="text-txt-primary">{item.icon}</div>
                    <div className="text-txt-black-500 text-body-lg font-medium">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <img
                src="/utama/school-outline.png"
                alt="schoole-image"
                // className="w-2/8 h-2/8"
              />
            </div>
          </div>
      </div>

      {/* School Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 px-9"> {/* p-8 */}
        {[
          { label: "KOD SEKOLAH", value: "JEB1001" },
          { label: "NEGERI", value: "Johor" },
          { label: "PPD", value: "PPD Johor Bahru" },
          { label: "PARLIMEN", value: "Pulai" },
          { label: "BANTUAN", value: "SBK" },
          { label: "BIL SESI", value: "2 Sesi | Pagi & Petang" },
          { label: "PRASEKOLAH", value: "", icon:"cross"},
          { label: "Integrasi", value: "", icon:"checked"}
        ].map((item, idx) => (
          <div key={idx} className="border-[1px] outline-otl-gray-200 gap-0.5">
            <div className="py-8 px-2.5 rounded-xl shadow text-center">
              <div className="text-txt-primary uppercase pb-2">{item.label}</div>
              {item.value && <div className="text-txt-black-500">{item.value}</div>}
              {item.icon=="cross" && <div className="text-txt-danger flex items-center justify-center"><CrossFillIcon/></div>}
              {item.icon=="checked" && <div className="text-txt-success flex items-center justify-center"><CheckCircleFillIcon/></div>}
            </div>
          </div>
        ))}
      </div>

      {/* Nearby Schools */}
      <div className="py-[84px] px-[109px] max-md:px-[28px] max-md:py-[48px]">
        <div className="text-heading-sm text-txt-black-900 font-semibold pb-12">Sekolah Berdekatan</div> {/* text-xl font-bold mb-4 gap-[48px] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {label: "Sekolah Menengah Kebangsaan Dato Jaafar", value: "001", adress: "Johor Bharu"},
            {label: "Sekolah Menengah Kebangsaan Aminuddin Baki", value: "002", adress: "Pulai, Johor Bharu"},
            {label: "Sekolah Menengah Kebangsaan Saint Joseph", value: "003", adress: "Johor Bharu"},
          ].map((i) => (
            <div key={i.value} className="bg-white rounded-2xl shadow overflow-hidden border-[1px] outline-otl-gray-200">
              <img
                // src={`/school${i}.jpg`}
                src="/utama/image-160.png"
                alt="Nearby School"
                className="w-full h-40 object-cover"
              />
              <div className="p-4.5">
                <h3 className="text-txt-black-900 font-medium">{i.label}</h3>
                <p className="text-gray-600 text-sm">{i.adress}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
