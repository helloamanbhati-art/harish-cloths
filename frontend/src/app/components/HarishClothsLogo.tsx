interface HarishClothsLogoProps {
  className?: string;
  alt?: string;
}

export function HarishClothsLogo({
  className = "h-10 md:h-12 w-auto",
  alt = "Harish Clothing",
}: HarishClothsLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 450"
      className={className}
      aria-label={alt}
      role="img"
    >
      {/* Background - transparent to integrate cleanly into navbar */}
      <rect width="100%" height="100%" fill="none" />

      {/* HARISH */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* H */}
        <path d="M120 110 L120 300" />
        <path d="M160 90 L165 305" />
        <path d="M95 210 L185 210" />

        {/* A */}
        <path d="M205 255 L235 150 L265 255" />
        <path d="M220 210 L250 210" />

        {/* R */}
        <path d="M285 150 L285 255" />
        <path d="M285 150 Q340 145 335 185" />
        <path d="M335 185 Q330 215 285 215" />
        <path d="M305 215 L345 255" />

        {/* I */}
        <path d="M375 150 L375 255" />

        {/* S */}
        <path d="M445 160 Q390 145 395 185 Q400 205 455 210 Q505 215 500 245 Q490 275 430 255" />

        {/* H */}
        <path d="M545 150 L545 255" />
        <path d="M585 135 L580 270" />
        <path d="M520 205 L610 205" />
      </g>

      {/* CLOTHING */}
      <text
        x="450"
        y="340"
        fill="currentColor"
        fontSize="38"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="8"
        textAnchor="middle"
      >
        CLOTHING
      </text>
    </svg>
  );
}
