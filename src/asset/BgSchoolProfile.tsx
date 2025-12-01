interface BgSchoolProfileProps {
  className?: string;
}

export default function BgSchoolProfile({ className }: BgSchoolProfileProps) {
  return (
    <svg
      width="1440"
      height="408"
      viewBox="0 0 1440 408"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <g clipPath="url(#clip0_4_71)">
        <mask id="path-1-inside-1_4_71" fill="white">
          <path d="M0 0H1440V408H0V0Z" />
        </mask>

        <path d="M0 0H1440V408H0V0Z" fill="url(#paint0_radial_4_71)" />

        <g clipPath="url(#clip1_4_71)">
          <path
            d="M1690.98 -1063.75C2112.22 -1063.75 2453.71 -722.269 2453.71 -301.023C2453.71 120.222 2112.22 461.709 1690.98 461.709C1269.73 461.709 928.245 120.222 928.245 -301.023C928.245 -722.268 1269.73 -1063.75 1690.98 -1063.75Z"
            fill="#F2F8FF"
          />
          <path
            d="M1690.98 -1063.75C2112.22 -1063.75 2453.71 -722.269 2453.71 -301.023C2453.71 120.222 2112.22 461.709 1690.98 461.709C1269.73 461.709 928.245 120.222 928.245 -301.023C928.245 -722.268 1269.73 -1063.75 1690.98 -1063.75Z"
            stroke="#FBFDFF"
            strokeWidth="61.5107"
          />
          <path
            d="M1075.87 -301.024C1075.87 -640.738 1351.26 -916.13 1690.98 -916.13C2030.69 -916.13 2306.08 -640.738 2306.08 -301.024C2306.08 38.6903 2030.69 314.083 1690.98 314.083C1351.26 314.083 1075.87 38.6903 1075.87 -301.024Z"
            fill="#DBEAFE"
          />
        </g>
      </g>

      <defs>
        <radialGradient
          id="paint0_radial_4_71"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(720 0) rotate(90) scale(377.579 1463.69)"
        >
          <stop stopColor="#E0EDFF" />
          <stop offset="0.55" stopColor="#FAFCFF" />
          <stop offset="1" stopColor="white" />
        </radialGradient>

        <clipPath id="clip0_4_71">
          <path d="M0 0H1440V408H0V0Z" fill="white" />
        </clipPath>

        <clipPath id="clip1_4_71">
          <rect width="1920" height="520" fill="white" transform="translate(-240 -56)" />
        </clipPath>
      </defs>
    </svg>
  );
}
