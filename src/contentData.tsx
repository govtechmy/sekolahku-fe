import {
  UserGroupIcon,
  JataNegaraIcon,
  UserIcon,
} from "@govtechmy/myds-react/icon";

export const siaranSocialLinks = [
  {
    platform: "hyperlink",
    href: "#",
    ariaLabel: "Siaran link",
  },
  {
    platform: "email",
    href: "#",
    ariaLabel: "Email link",
  },
  {
    platform: "facebook",
    href: "#",
    ariaLabel: "Facebook link",
  },
  {
    platform: "twitter",
    href: "#",
    ariaLabel: "Twitter link",
  },
];

export const footerSocialLinks = [
  {
    platform: "facebook",
    href: "#",
    ariaLabel: "Facebook link",
  },
  {
    platform: "twitter",
    href: "#",
    ariaLabel: "Twitter link",
  },
  {
    platform: "instagram",
    href: "#",
    ariaLabel: "Instagram link",
  },
  {
    platform: "youtube",
    href: "#",
    ariaLabel: "Youtube link",
  },
];

export const NEGERI_LIST = [
  "JOHOR",
  "KEDAH",
  "KELANTAN",
  "MELAKA",
  "NEGERI_SEMBILAN",
  "PAHANG",
  "PERAK",
  "PERLIS",
  "PULAU_PINANG",
  "SABAH",
  "SARAWAK",
  "SELANGOR",
  "TERENGGANU",
  "WILAYAH_PERSEKUTUAN_KUALA_LUMPUR",
  "WILAYAH_PERSEKUTUAN_LABUAN",
  "WILAYAH_PERSEKUTUAN_PUTRAJAYA",
];

export const JENIS_LIST = ["SK", "K9"];

// Statistics data for different years
export const statisticYearlyData = {
  2020: {
    spm: { daily: 500, total: "250,000" },
    stem: { daily: 150, total: "60,000" },
    koku: { daily: 8, total: "280,000" },
  },
  2021: {
    spm: { daily: 600, total: "275,000" },
    stem: { daily: 180, total: "65,000" },
    koku: { daily: 9, total: "295,000" },
  },
  2022: {
    spm: { daily: 680, total: "295,000" },
    stem: { daily: 210, total: "72,000" },
    koku: { daily: 10, total: "305,000" },
  },
  2023: {
    spm: { daily: 733, total: "313,352" },
    stem: { daily: 231, total: "78,828" },
    koku: { daily: 11, total: "313,352" },
  },
};

export const dataItemLinks = [
  {
    icon: <JataNegaraIcon />,
    name: "SAPS NKRA",
    link: "https://sapsnkra.moe.gov.my/",
  },
  {
    icon: <JataNegaraIcon />,
    name: "APDM",
    link: "https://splkpm.moe.gov.my/",
  },
  {
    icon: <JataNegaraIcon />,
    name: "e-Operasi",
    link: "https://eoperasii.my/",
  },
  {
    icon: <JataNegaraIcon />,
    name: "e-GTukar",
    link: "https://epgo.moe.gov.my/menu/maklumat_perlu.cfm",
  },
  {
    icon: <JataNegaraIcon />,
    name: "SPL-KPM",
    link: "https://eoperasi.moe.gov.my/",
  },
  {
    icon: <JataNegaraIcon />,
    name: "EMIS",
    link: "https://emisonline.moe.gov.my/",
  },
  {
    icon: <JataNegaraIcon />,
    name: "DELIMa",
    link: "https://delima.moe-dl.edu.my/",
  },
];

// SekolahDetails-Data to Fetch
export const dataSekolahJumlah = [
  { label: "PELAJAR", value: "1", amount: "4,065", icon: <UserGroupIcon /> },
  { label: "GURU", value: "2", amount: "4,065", icon: <UserIcon /> },
];

export const notableMalaysians = [
  // Arts
  {
    name: "Michelle Yeoh",
    field: "Arts",
    note: "Internationally acclaimed actress",
  },
  {
    name: "P. Ramlee",
    field: "Arts",
    note: "Iconic actor, director, and musician",
  },
  {
    name: "Siti Nurhaliza",
    field: "Arts",
    note: "Award-winning singer and songwriter",
  },
];
