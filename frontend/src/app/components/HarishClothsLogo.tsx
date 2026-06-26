interface HarishClothsLogoProps {
  className?: string;
  alt?: string;
}

export function HarishClothsLogo({
  className = "h-10 md:h-12 w-auto",
  alt = "Harish Clothing",
}: HarishClothsLogoProps) {
  return (
    <img
      src="/harish-clothing-logo.png"
      alt={alt}
      className={`object-contain ${className}`}
    />
  );
}
