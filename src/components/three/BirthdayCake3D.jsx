import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Candle flame as a pair of cones + point light ── */
function Flame({ position, isLit, index = 0 }) {
  const flameRef = useRef();

  useFrame((state) => {
    if (!flameRef.current || !isLit) return;
    const t = state.clock.elapsedTime;
    flameRef.current.scale.y = 1 + Math.sin(t * 14 + index * 2) * 0.18;
    flameRef.current.scale.x = 1 + Math.cos(t * 11 + index * 3) * 0.12;
    flameRef.current.position.x = Math.sin(t * 8 + index) * 0.01;
  });

  if (!isLit) {
    return (
      <mesh position={[position[0], position[1] + 0.28, position[2]]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial color="#888888" transparent opacity={0.3} />
      </mesh>
    );
  }

  return (
    <group position={position} ref={flameRef}>
      {/* Outer flame */}
      <mesh position={[0, 0.22, 0]}>
        <coneGeometry args={[0.065, 0.24, 8]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.9} />
      </mesh>
      {/* Inner bright core */}
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.03, 0.15, 8]} />
        <meshBasicMaterial color="#ffee00" />
      </mesh>
      <pointLight position={[0, 0.22, 0]} intensity={1.2} color="#ffaa00" distance={1.8} decay={2} />
    </group>
  );
}

function CakeModel({ isLit, onBlow }) {
  const cakeRef = useRef();

  useFrame((state, delta) => {
    if (!cakeRef.current) return;
    cakeRef.current.rotation.y += delta * 0.2;
  });

  const candlePositions = [
    [0, 1.15, 0],
    [-0.55, 1.15, 0.3],
    [0.55, 1.15, 0.3],
    [-0.35, 1.15, -0.45],
    [0.35, 1.15, -0.45],
  ];

  // Frosting drip positions
  const dripAngles = useMemo(() => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2), []);

  return (
    <group ref={cakeRef} onClick={onBlow}>
      {/* Plate */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[2, 2.1, 0.08, 24]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.05} metalness={0.95} />
      </mesh>

      {/* Bottom cake layer */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[1.6, 1.65, 0.9, 24]} />
        <meshStandardMaterial color="#e8a0b8" roughness={0.35} />
      </mesh>
      {/* Bottom frosting ring */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[1.62, 0.06, 8, 24]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.15} />
      </mesh>

      {/* Top cake layer */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.15, 1.2, 0.8, 24]} />
        <meshStandardMaterial color="#b88fd4" roughness={0.3} />
      </mesh>
      {/* Top frosting cap */}
      <mesh position={[0, 0.91, 0]}>
        <cylinderGeometry args={[1.17, 1.17, 0.04, 24]} />
        <meshStandardMaterial color="#fff5f9" roughness={0.1} />
      </mesh>

      {/* Frosting drips on top layer */}
      {dripAngles.map((angle, i) => {
        const x = Math.cos(angle) * 1.16;
        const z = Math.sin(angle) * 1.16;
        const dripH = 0.1 + Math.random() * 0.15;
        return (
          <mesh key={`drip-${i}`} position={[x, 0.85 - dripH / 2, z]}>
            <capsuleGeometry args={[0.04, dripH, 4, 6]} />
            <meshStandardMaterial color="#fff0f5" roughness={0.15} />
          </mesh>
        );
      })}

      {/* Small decorative roses/berries between layers */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh key={`berry-${i}`} position={[Math.cos(angle) * 1.3, 0.15, Math.sin(angle) * 1.3]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#e74c6f' : '#fbbf24'} roughness={0.2} />
        </mesh>
      ))}

      {/* Candles + Flames */}
      {candlePositions.map((pos, idx) => (
        <group key={idx}>
          <mesh position={pos}>
            <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#ff6eb4' : '#fbbf24'} roughness={0.2} />
          </mesh>
          {/* Candle wick */}
          <mesh position={[pos[0], pos[1] + 0.23, pos[2]]}>
            <cylinderGeometry args={[0.006, 0.006, 0.04, 4]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          <Flame position={pos} isLit={isLit} index={idx} />
        </group>
      ))}
    </group>
  );
}

export default function BirthdayCake3D({ isLit, onBlow }) {
  return (
    <div className="w-full h-80 md:h-[400px] relative">
      <Canvas
        camera={{ position: [0, 2.5, 4.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={isLit ? 0.35 : 0.15} />
        <directionalLight position={[5, 8, 5]} intensity={1} />
        <pointLight position={[-4, 4, -3]} intensity={0.6} color="#c084fc" />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
          <CakeModel isLit={isLit} onBlow={onBlow} />
        </Float>
      </Canvas>
    </div>
  );
}
