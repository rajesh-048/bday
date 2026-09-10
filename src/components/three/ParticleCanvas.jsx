import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Lightweight star-particle field (GPU Points, no geometry per star) ── */
function StarParticles({ count = 150 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#ff6eb4'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#fbbf24'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.03;

    // Twinkle: oscillate opacity
    const mat = pointsRef.current.material;
    mat.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Floating hearts using flat billboarded planes (10× cheaper than extruded meshes) ── */
function FloatingHearts({ count = 8 }) {
  const groupRef = useRef();

  const heartsData = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 6 - 3,
      scale: Math.random() * 0.35 + 0.2,
      speed: Math.random() * 0.6 + 0.4,
      phase: Math.random() * Math.PI * 2,
    })),
  [count]);

  // Create a simple heart-shaped SVG texture once
  const heartTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 64, 64);
    ctx.fillStyle = '#ff6eb4';
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(32, 56);
    ctx.bezierCurveTo(8, 40, 0, 20, 16, 10);
    ctx.bezierCurveTo(24, 4, 32, 12, 32, 20);
    ctx.bezierCurveTo(32, 12, 40, 4, 48, 10);
    ctx.bezierCurveTo(64, 20, 56, 40, 32, 56);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const d = heartsData[i];
      child.position.y = d.y + Math.sin(state.clock.elapsedTime * d.speed + d.phase) * 0.4;
      child.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + d.phase) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {heartsData.map((d, i) => (
        <sprite key={i} position={[d.x, d.y, d.z]} scale={[d.scale, d.scale, 1]}>
          <spriteMaterial map={heartTexture} transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  );
}

export default function ParticleCanvas({ showHearts = true }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 1.5]}           /* cap device pixel ratio for perf */
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <StarParticles count={120} />
        {showHearts && <FloatingHearts count={6} />}
      </Canvas>
    </div>
  );
}
