"use client";

import React, { useEffect, useRef, useState } from "react";

interface DSO3DFooterLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function DSO3DFooterLogo({
  width = 600,
  height = 300,
  className = "",
}: DSO3DFooterLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientY - rect.top) / rect.height - 0.5;
      const y = (e.clientX - rect.left) / rect.width - 0.5;
      setRotation({ x: x * 20, y: y * 20 });
    };

    let animationId: NodeJS.Timeout;
    const autoRotate = () => {
      setRotation((prev) => ({
        x: prev.x + (Math.sin(Date.now() * 0.0003) * 2 - prev.x) * 0.05,
        y: (prev.y + 1) % 360,
      }));
      animationId = setTimeout(autoRotate, 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    autoRotate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(animationId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b from-[#0a0f16] via-[#0f1420] to-[#000000] ${className}`}
      style={{
        minHeight: `${height}px`,
        perspective: "1000px",
      }}
    >
      {/* Ambient glow layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(0,255,209,0.15) 0%, transparent 60%)`,
        }}
      />

      {/* 3D Text Container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Background glow layers */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute"
            style={{
              fontSize: "180px",
              fontWeight: "900",
              letterSpacing: "-0.02em",
              color: "#00FFD1",
              opacity: 0.1 + i * 0.05,
              filter: `blur(${2 + i * 3}px)`,
              transform: `translateZ(${-20 + i * 10}px)`,
              textShadow: `0 0 ${30 + i * 20}px rgba(0,255,209,0.4)`,
            }}
          >
            DSO
          </div>
        ))}

        {/* Main text - metallic effect */}
        <div
          style={{
            fontSize: "180px",
            fontWeight: "900",
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #00FFD1 0%, #00d4ff 50%, #00FFD1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 15px rgba(0,255,209,0.6)) drop-shadow(0 10px 40px rgba(0,0,0,0.8))",
            textShadow: `
              0 1px 0 rgba(0, 255, 209, 0.1),
              0 2px 0 rgba(0, 255, 209, 0.1),
              0 3px 0 rgba(0, 255, 209, 0.1),
              0 4px 0 rgba(0, 255, 209, 0.05),
              0 5px 0 rgba(0, 255, 209, 0.05),
              0 15px 40px rgba(0, 0, 0, 0.8)
            `,
            transform: "translateZ(40px)",
            fontFamily: "'Arial', 'Helvetica', sans-serif",
          }}
        >
          DSO
        </div>

        {/* Front glow */}
        <div
          className="absolute"
          style={{
            fontSize: "180px",
            fontWeight: "900",
            letterSpacing: "-0.02em",
            color: "#00FFD1",
            opacity: 0.3,
            filter: "blur(1px)",
            transform: "translateZ(50px)",
            textShadow: `0 0 20px rgba(0,255,209,0.8)`,
          }}
        >
          DSO
        </div>
      </div>

      {/* Bottom shadow/reflection */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "400px",
          height: "100px",
          background: "radial-gradient(ellipse at center, rgba(0,255,209,0.1) 0%, transparent 70%)",
          filter: "blur(20px)",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
