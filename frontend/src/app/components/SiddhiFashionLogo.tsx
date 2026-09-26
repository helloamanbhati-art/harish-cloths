interface SiddhiFashionLogoProps {
  className?: string;
  alt?: string;
}

export function SiddhiFashionLogo({
  className = "h-10 md:h-12 w-auto",
  alt = "Siddhi Fashion Retail",
}: SiddhiFashionLogoProps) {
  return (
    <img
      src="/siddhi-fashion-logo.png"
      alt={alt}
      className={className}
    />
  );
}
