import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function Logo({ size = 24, className = '', animated = false }: LogoProps) {
  const viewBox = '0 0 24 24';
  const strokeWidth = size > 48 ? 1.5 : 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-spin' : ''} ${className}`}
      style={{
        animationDuration: animated ? '8s' : undefined,
        animationIterationCount: animated ? 'infinite' : undefined,
      }}
    >
      {/* Rotating arrow (counterclockwise) */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        pathLength="100"
        strokeDasharray="75 100"
      />

      {/* Arrow head */}
      <path
        d="M 12 3 L 14 6 L 10 6 Z"
        fill="currentColor"
      />

      {/* Checkpoint marker at 12 o'clock */}
      <rect
        x="10.5"
        y="1.5"
        width="3"
        height="3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        rx="0.5"
      />
    </svg>
  );
}

export function LogoMark() {
  return (
    <Logo size={32} className="text-accent" />
  );
}

export function LogoWithText() {
  return (
    <div className="flex items-center gap-2">
      <Logo size={24} className="text-accent" />
      <span className="font-semibold text-foreground">DSO</span>
    </div>
  );
}
