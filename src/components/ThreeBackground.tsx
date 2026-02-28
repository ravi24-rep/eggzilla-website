import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';

function Particles({ count = 500 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FFD700"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  const isMobile = useIsMobile();
  
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Particles count={isMobile ? 150 : 500} />
      </Canvas>
    </div>
  );
}
