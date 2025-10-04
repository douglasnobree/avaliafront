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
            filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(98%) contrast(119%)'
          }}
        />
      </div>
    </div>
  );
}
