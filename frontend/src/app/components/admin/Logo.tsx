export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background Circle */}
          <circle cx="20" cy="20" r="20" fill="url(#logoGradient)" />
          
          {/* Fabric/Cloth Icon */}
          <path
            d="M12 14C12 13.4477 12.4477 13 13 13H27C27.5523 13 28 13.4477 28 14V26C28 26.5523 27.5523 27 27 27H13C12.4477 27 12 26.5523 12 26V14Z"
            fill="white"
            fillOpacity="0.95"
          />
          
          {/* Fabric Pattern Lines */}
          <path
            d="M16 16L16 24M20 16L20 24M24 16L24 24"
            stroke="url(#logoGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Horizontal lines for weave effect */}
          <path
            d="M14 18L26 18M14 20L26 20M14 22L26 22"
            stroke="url(#logoGradient)"
            strokeWidth="1"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient
              id="logoGradient"
              x1="0"
              y1="0"
              x2="40"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight dark:text-white">
          H&S
        </span>
        <span className="text-xs text-muted-foreground leading-tight">
          Admin Panel
        </span>
      </div>
    </div>
  );
}