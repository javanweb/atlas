import React from 'react';

interface Forza3DSphereProps {
  size?: number; // size in px
  className?: string;
}

export const Forza3DSphere: React.FC<Forza3DSphereProps> = ({ size = 76, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 1. Soft Ambient Glowing Background Shadow */}
      <div
        className="absolute rounded-full pointer-events-none blur-2xl opacity-60 animate-pulse"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.45) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 75%)',
        }}
      />

      {/* 2. Soft Drop Shadow Beneath Sphere */}
      <div
        className="absolute rounded-full pointer-events-none blur-md"
        style={{
          width: size * 0.85,
          height: size * 0.25,
          bottom: -size * 0.12,
          background: 'radial-gradient(ellipse at center, rgba(30, 20, 10, 0.4) 0%, transparent 70%)',
        }}
      />

      {/* 3. The 3D Sphere Body with Realistic Spherical Lighting */}
      <div
        className="rounded-full relative cursor-pointer transition-transform duration-500 hover:scale-105 active:scale-95"
        style={{
          width: size,
          height: size,
          background: 'radial-gradient(circle at 35% 28%, #FED7AA 0%, #FB923C 22%, #EA580C 52%, #C2410C 78%, #7C2D12 100%)',
          boxShadow: `
            0 20px 35px -8px rgba(194, 65, 12, 0.45),
            inset -6px -6px 14px rgba(67, 20, 7, 0.8),
            inset 6px 6px 14px rgba(254, 215, 170, 0.85)
          `,
        }}
      >
        {/* Primary Specular Highlight Reflection (Curved light on upper-left) */}
        <div
          className="absolute rounded-full bg-white/80 blur-[0.8px] pointer-events-none"
          style={{
            top: size * 0.12,
            left: size * 0.16,
            width: size * 0.26,
            height: size * 0.15,
            transform: 'rotate(-28deg)',
          }}
        />

        {/* Secondary Soft Rim Light (Glow at bottom-right) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            bottom: size * 0.08,
            right: size * 0.14,
            width: size * 0.35,
            height: size * 0.2,
            background: 'radial-gradient(ellipse, rgba(253, 186, 116, 0.4) 0%, transparent 80%)',
            transform: 'rotate(25deg)',
          }}
        />
      </div>
    </div>
  );
};
