export function SMJewellerLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gold luxury gradient */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#D4AF37", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#F4C430", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Circular emblem */}
      <g transform="translate(45, 45)">
     
      </g>

      {/* Main Brand Name */}
      <text
        x="95"
        y="50"
        fontFamily="'Brush Script MT', 'Lucida Handwriting', cursive"
        fontSize="42"
        fontWeight="400"
        fill="currentColor"
        letterSpacing="-0.5"
        fontStyle="italic"
      >
        SM
      </text>

      {/* Subtitle */}
      <g>
        <text
          x="95"
          y="71"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize="16"
          fontWeight="500"
          fill="currentColor"
          letterSpacing="4"
          opacity="0.8"
        >
          J E W E L L E R
        </text>

        {/* Elegant underline */}
        <line
          x1="95"
          y1="75"
          x2="210"
          y2="75"
          stroke="url(#goldGradient)"
          strokeWidth="1.2"
          opacity="0.7"
        />
      </g>

      {/* Decorative luxury dots */}
      <circle cx="220" cy="71" r="1.5" fill="url(#goldGradient)" />
      <circle cx="228" cy="71" r="1.5" fill="url(#goldGradient)" />
      <circle cx="236" cy="71" r="1.5" fill="url(#goldGradient)" />
    </svg>
  );
}


// export function HarishClothsLogo({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 320 90"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={className}
//     >
//       <defs>
//         {/* Orange gradient for the smile arrow - Amazon inspired */}
//         <linearGradient id="smileGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="0%" style={{ stopColor: '#FF9900', stopOpacity: 1 }} />
//           <stop offset="100%" style={{ stopColor: '#FFB84D', stopOpacity: 1 }} />
//         </linearGradient>
//       </defs>
      
//       {/* Circular emblem on the left */}
//       <g transform="translate(45, 45)">
//         {/* Simple lowercase h monogram - clean strokes */}
        
//         {/* Left vertical stem of h (tall) */}
//         <line
//           x1="-12"
//           y1="-18"
//           x2="-12"
//           y2="8"
//           stroke="currentColor"
//           strokeWidth="4.5"
//           strokeLinecap="round"
//         />
        
//         {/* Curved hump/arch of h */}
//         <path
//           d="M -12 -4 Q -12 -10, -4 -10 Q 4 -10, 8 -6 Q 12 -2, 12 4 L 12 8"
//           stroke="currentColor"
//           strokeWidth="4.5"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
        
//         {/* C as SMILE ARROW - Amazon style with orange color! */}
//         <path
//           d="M -26 20 Q 0 38, 26 20"
//           stroke="url(#smileGradient)"
//           strokeWidth="4.5"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
        
//         {/* Arrow point at the right end - orange */}
//         <path
//           d="M 26 20 L 21 16 M 26 20 L 22 24"
//           stroke="url(#smileGradient)"
//           strokeWidth="4"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </g>
      
//       {/* Main text "Harish" - Instagram script style */}
//       <text
//         x="90"
//         y="50"
//         fontFamily="'Brush Script MT', 'Lucida Handwriting', 'Apple Chancery', cursive, system-ui"
//         fontSize="44"
//         fontWeight="400"
//         fill="currentColor"
//         letterSpacing="-0.5"
//         fontStyle="italic"
//       >
//         Harish
//       </text>
      
//       {/* Subtitle "Cloths" with elegant styling */}
//       <g>
//         {/* "Cloths" text - elegant serif */}
//         <text
//           x="90"
//           y="71"
//           fontFamily="'Georgia', 'Times New Roman', serif, system-ui"
//           fontSize="16"
//           fontWeight="400"
//           fill="currentColor"
//           letterSpacing="3.5"
//           opacity="0.75"
//         >
//           C L O T H S
//         </text>
        
//         {/* Underline accent */}
//         <line
//           x1="90"
//           y1="74"
//           x2="168"
//           y2="74"
//           stroke="currentColor"
//           strokeWidth="1"
//           opacity="0.4"
//         />
//       </g>
      
//       {/* Decorative dots - refined detail */}
//       <circle cx="172" cy="71" r="1.2" fill="currentColor" opacity="0.4" />
//       <circle cx="178" cy="71" r="1.2" fill="currentColor" opacity="0.4" />
//       <circle cx="184" cy="71" r="1.2" fill="currentColor" opacity="0.4" />
//     </svg>
//   );
// }