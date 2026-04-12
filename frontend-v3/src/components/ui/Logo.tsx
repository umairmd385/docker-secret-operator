import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo = ({ className = "", size = 32 }: LogoProps) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <Image
      src="/logo.png"
      alt="Docker Secret Operator Logo"
      width={size}
      height={size}
      className="object-contain filter drop-shadow-[0_0_8px_rgba(0,230,192,0.3)]"
      priority
    />
  </div>
);
