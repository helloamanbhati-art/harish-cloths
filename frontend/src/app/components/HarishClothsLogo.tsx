interface HarishClothsLogoProps {
  className?: string;
  alt?: string;
}

export function HarishClothsLogo({
  className = "h-10 md:h-12 w-auto",
  alt = "Siddhi Fashion Retail",
}: HarishClothsLogoProps) {
  return (
    <img
      src="/siddhi-fashion-logo.png"
      alt={alt}
      className={className}
    />
  );
}
