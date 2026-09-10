import React from 'react';

export default function GlassCard({ children, className = '', glow = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-3xl p-6 md:p-8 transition-all duration-300
        ${glow ? 'glass-card-glow' : 'glass-card'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
