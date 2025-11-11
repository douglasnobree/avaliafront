import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 120, height = 120, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width, height }}>
        <Image
          src="/logo.svg"
          alt="Avalia Irriga Logo"
          width={width}
          height={height}
          priority
          className="object-contain"
          style={{ 
            filter: 'invert(70%) sepia(98%) saturate(1500%) hue-rotate(0deg) brightness(95%) contrast(105%)'
          }}
        />
      </div>
    </div>
  );
}
