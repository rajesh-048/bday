import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function GiftBoxModel({ isOpened, onOpen }) {
  const boxRef = useRef();
  const lidRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const lidStartTime = useRef(null);

  useFrame((state, delta) => {
    if (!boxRef.current) return;

    if (!isOpened) {
      // Gentle floating rotation
      boxRef.current.rotation.y += delta * 0.35;
      boxRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    }

    // Pulsing glow effect when hovered
    if (glowRef.current) {
      const intensity = hovered ? 3 + Math.sin(state.clock.elapsedTime * 4) * 1.5 : 1.5;
      glowRef.current.intensity = intensity;
    }

    // Smooth lid opening animation
    if (lidRef.current && isOpened) {
      if (!lidStartTime.current) lidStartTime.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - lidStartTime.current;
      const t = Math.min(elapsed / 0.8, 1); // 0.8s animation
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic

      lidRef.current.position.y = 0.3 + ease * 3.5;
      lidRef.current.rotation.x = ease * -1.2;
      lidRef.current.rotation.z = ease * 0.6;
      lidRef.current.scale.setScalar(1 - ease * 0.3);
    }
  });

  return (
    <group
      ref={boxRef}
      onClick={onOpen}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      {/* Box body */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[2.2, 1.6, 2.2]} />
        <meshStandardMaterial color="#7b2cbf" roughness={0.25} metalness={0.6} emissive="#3a0d6b" emissiveIntensity={0.3} />
      </mesh>

      {/* Vertical ribbon */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[2.24, 1.64, 0.35]} />
        <meshStandardMaterial color="#ff6eb4" roughness={0.15} metalness={0.7} emissive="#ff1493" emissiveIntensity={0.15} />
      </mesh>
      {/* Horizontal ribbon */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.35, 1.64, 2.24]} />
        <meshStandardMaterial color="#ff6eb4" roughness={0.15} metalness={0.7} emissive="#ff1493" emissiveIntensity={0.15} />
      </mesh>

      {/* Small decorative gems on the box sides */}
      {[[-1.12, -0.3, 0], [1.12, -0.3, 0], [0, -0.3, 1.12], [0, -0.3, -1.12]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#ff8c00" emissiveIntensity={0.5} roughness={0.1} metalness={0.9} />
        </mesh>
      ))}

      {/* Lid */}
      <group ref={lidRef} position={[0, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[2.4, 0.45, 2.4]} />
          <meshStandardMaterial color="#9333ea" roughness={0.2} metalness={0.55} />
        </mesh>
        {/* Lid ribbons */}
        <mesh><boxGeometry args={[2.44, 0.47, 0.37]} /><meshStandardMaterial color="#ff6eb4" roughness={0.15} metalness={0.7} /></mesh>
        <mesh><boxGeometry args={[0.37, 0.47, 2.44]} /><meshStandardMaterial color="#ff6eb4" roughness={0.15} metalness={0.7} /></mesh>
        {/* Bow loops */}
        <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.3, 0.08, 8, 24]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} emissive="#ff8c00" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <torusGeometry args={[0.3, 0.08, 8, 24]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} emissive="#ff8c00" emissiveIntensity={0.3} />
        </mesh>
        {/* Center knot */}
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.05} metalness={1} emissive="#ffcc00" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Glow when opened */}
      {isOpened && <pointLight position={[0, 0, 0]} intensity={12} color="#ff6eb4" distance={6} decay={2} />}

      {/* Hover glow */}
      <pointLight ref={glowRef} position={[0, 1.5, 0]} intensity={1.5} color="#c084fc" distance={4} decay={2} />
    </group>
  );
}

export default function GiftBox3D({ isOpened, onOpen }) {
  return (
    <div className="w-full h-72 md:h-96 relative">
      <Canvas
        camera={{ position: [0, 1.5, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-5, 3, -5]} intensity={1} color="#c084fc" />
        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
          <GiftBoxModel isOpened={isOpened} onOpen={onOpen} />
        </Float>
      </Canvas>
    </div>
  );
}
