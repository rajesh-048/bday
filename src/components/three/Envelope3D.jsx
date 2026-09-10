import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function EnvelopeModel({ isOpen, onOpen }) {
  const envRef = useRef();
  const flapRef = useRef();
  const letterRef = useRef();
  const openStartTime = useRef(null);

  useFrame((state) => {
    if (!envRef.current) return;

    if (!isOpen) {
      envRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1) * 0.18;
      envRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    }

    // Smooth flap + letter slide animation
    if (isOpen) {
      if (!openStartTime.current) openStartTime.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - openStartTime.current;

      // Flap opens over 0.5s
      if (flapRef.current) {
        const flapT = Math.min(elapsed / 0.5, 1);
        const ease = 1 - Math.pow(1 - flapT, 3);
        flapRef.current.rotation.x = ease * Math.PI * 0.85;
      }

      // Letter slides up after flap opens (delay 0.3s)
      if (letterRef.current) {
        const letterT = Math.max(0, Math.min((elapsed - 0.3) / 0.6, 1));
        const ease = 1 - Math.pow(1 - letterT, 3);
        letterRef.current.position.y = ease * 1.2;
      }
    }
  });

  return (
    <group ref={envRef} onClick={onOpen}>
      {/* Envelope Body */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[2.8, 1.8, 0.06]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.3} />
      </mesh>

      {/* Envelope inner shadow area */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.6, 1.6]} />
        <meshBasicMaterial color="#f9d5e5" side={THREE.FrontSide} />
      </mesh>

      {/* Flap (triangular fold) */}
      <group ref={flapRef} position={[0, 0.9, 0]}>
        <mesh rotation={[0, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={3}
              array={new Float32Array([-1.4, 0, 0.02, 1.4, 0, 0.02, 0, -1.0, 0.02])}
              itemSize={3}
            />
          </bufferGeometry>
          <meshStandardMaterial color="#ec4899" roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Wax seal heart */}
      {!isOpen && (
        <group position={[0, 0.15, 0.07]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#be123c" roughness={0.15} metalness={0.4} />
          </mesh>
          {/* Tiny H letter on seal */}
          <mesh position={[0, 0.035, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* Letter paper sliding out */}
      <group ref={letterRef} position={[0, 0, 0.02]}>
        <mesh>
          <planeGeometry args={[2.4, 1.5]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
        {/* Faint lines on paper */}
        {[-0.4, -0.15, 0.1, 0.35].map((y, i) => (
          <mesh key={i} position={[0, y, 0.001]}>
            <planeGeometry args={[2.0, 0.008]} />
            <meshBasicMaterial color="#e0d0d8" side={THREE.FrontSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function Envelope3D({ isOpen, onOpen }) {
  return (
    <div className="w-full h-64 md:h-80 relative">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-4, -3, 2]} intensity={0.6} color="#f472b6" />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <EnvelopeModel isOpen={isOpen} onOpen={onOpen} />
        </Float>
      </Canvas>
    </div>
  );
}
