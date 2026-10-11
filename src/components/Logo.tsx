interface LogoProps {
  className?: string;
  isLightBg?: boolean;
}

export default function Logo({ className = 'w-9 h-9' }: LogoProps) {
  return (
    <img
      src="/images/pushkara-mitra-logo.png"
      alt="Pushkara Mitra"
      className={`${className} object-contain`}
    />
  );
}