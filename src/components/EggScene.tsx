import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';

function Pan(props: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle pan movement
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      groupRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Pan Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 1.8, 0.4, 32]} />
        <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Pan Inner */}
      <mesh position={[0, 0.21, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 1.9, 0.01, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pan Handle */}
      <mesh position={[3, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 2.5, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.6} roughness={0.6} />
      </mesh>
      {/* Handle Hole */}
      <mesh position={[4.1, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.15, 0.05, 16, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.6} roughness={0.6} />
      </mesh>
    </group>
  );
}

function CookingFire() {
  const groupRef = useRef<THREE.Group>(null);
  const fireParticles = useMemo(() => {
    return [...Array(60)].map(() => {
      const r = Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      return {
        x: r * Math.cos(theta),
        z: r * Math.sin(theta),
        y: Math.random() * 0.3,
        speed: Math.random() * 0.04 + 0.02,
        maxY: Math.random() * 0.8 + 0.4,
        scale: Math.random() * 0.2 + 0.1,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      if (i >= fireParticles.length) return;
      const p = fireParticles[i];
      child.position.y += p.speed;
      if (child.position.y > p.maxY) {
        child.position.y = 0;
        child.position.x = p.x + Math.sin(t * 4 + p.phase) * 0.15;
        child.position.z = p.z + Math.cos(t * 4 + p.phase) * 0.15;
      }
      const flicker = 1 + Math.sin(t * 15 + p.phase) * 0.4;
      child.scale.setScalar(p.scale * flicker * Math.max(0.1, 1 - child.position.y / p.maxY));
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, (1 - child.position.y / p.maxY) * 0.9);
      const ratio = child.position.y / p.maxY;
      mat.color.setRGB(1, 0.3 + ratio * 0.5, ratio * 0.1);
    });
  });

  return (
    <group position={[0, 0.22, 0]}>
      <group ref={groupRef}>
        {fireParticles.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]} renderOrder={10}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshBasicMaterial
              color="#FF5500"
              transparent
              opacity={0.9}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      {/* Bright inner core glow */}
      <pointLight position={[0, 0.3, 0]} color="#FF6600" intensity={12} distance={6} />
      <pointLight position={[0, 0.1, 0]} color="#FFAA00" intensity={6} distance={4} />
      <pointLight position={[0, -0.2, 0]} color="#FF3300" intensity={4} distance={3} />
    </group>
  );
}

function Steam({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return [...Array(20)].map(() => ({
      x: (Math.random() - 0.5) * 2.5,
      y: Math.random() * 2,
      z: (Math.random() - 0.5) * 2.5,
      speed: Math.random() * 0.03 + 0.01,
      scale: Math.random() * 0.4 + 0.2,
    }));
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (active) {
          child.position.y += particles[i].speed;
          if (child.position.y > 2.5) {
            child.position.y = 0;
            child.position.x = (Math.random() - 0.5) * 2.5;
            child.position.z = (Math.random() - 0.5) * 2.5;
          }
          const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          material.opacity = Math.max(0, 1 - child.position.y / 2.5) * 0.4;
        } else {
          const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          material.opacity = THREE.MathUtils.lerp(material.opacity, 0, 0.1);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} scale={p.scale}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0} roughness={1} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function SizzlingOmelette(props: any) {
  const herbs = useMemo(() => {
    return [...Array(20)].map(() => {
      const r = Math.random() * 1.2;
      const theta = Math.random() * 2 * Math.PI;
      return {
        position: [r * Math.cos(theta), 0.08, r * Math.sin(theta)] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      };
    });
  }, []);

  return (
    <group {...props}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.15, 64]} />
        <MeshDistortMaterial
          color="#FFC107"
          speed={4}
          distort={0.15}
          radius={1}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Golden edges */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 0.1, 64]} />
        <MeshDistortMaterial
          color="#D2691E"
          speed={2}
          distort={0.2}
          radius={1}
          roughness={0.8}
        />
      </mesh>

      {/* Yolk 1 */}
      <mesh position={[-0.4, 0.05, 0.3]} scale={[1, 0.3, 1]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#FF8C00" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Yolk 2 */}
      <mesh position={[0.5, 0.05, -0.2]} scale={[1, 0.3, 1]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#FF8C00" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Herb sprinkles */}
      {herbs.map((herb, i) => (
        <mesh
          key={i}
          position={herb.position}
          rotation={herb.rotation}
        >
          <boxGeometry args={[0.04, 0.01, 0.06]} />
          <meshStandardMaterial color="#2E8B57" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function InteractiveCooking() {
  const topShellRef = useRef<THREE.Mesh>(null);
  const bottomShellRef = useRef<THREE.Mesh>(null);
  const omeletteRef = useRef<THREE.Group>(null);
  const yolkDropRef = useRef<THREE.Mesh>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);

  const isCrackedRef = useRef(false);
  const progressRef = useRef(0);
  const [steamActive, setSteamActive] = useState(false);
  const { raycaster, pointer, camera } = useThree();

  useFrame((state, delta) => {
    // Manual raycasting to detect hover
    if (hitboxRef.current) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(hitboxRef.current, false);
      const hovering = intersects.length > 0;

      if (hovering !== isCrackedRef.current) {
        isCrackedRef.current = hovering;
        setSteamActive(hovering);
      }
    }

    // Update progress between 0 (whole egg on pan) and 1 (cooked omelette)
    const targetProgress = isCrackedRef.current ? 1 : 0;
    // Speed up animation slightly
    const speed = isCrackedRef.current ? 1.5 : 2.5;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgress, delta * speed);
    const p = progressRef.current;

    // --- Phase 1: Fly Up (p: 0 to 0.3) ---
    // Maps p=0->0 to p=0.3->1
    const pFly = Math.min(Math.max(p / 0.3, 0), 1);
    // Smoothstep for flying
    const flyEaser = pFly * pFly * (3 - 2 * pFly);
    const flyHeight = 0.6 + flyEaser * 1.2; // Rises from 0.6 to 1.8

    // --- Phase 2: Hatch Open (p: 0.2 to 0.5) ---
    const pHatch = Math.min(Math.max((p - 0.2) / 0.3, 0), 1);
    const hatchEaser = pHatch * pHatch * (3 - 2 * pHatch);

    // --- Phase 3: Yolk Drop (p: 0.4 to 0.7) ---
    const pDrop = Math.min(Math.max((p - 0.4) / 0.3, 0), 1);
    // Accelerate downward like gravity
    const dropEaser = pDrop * pDrop;

    // --- Phase 4: Sizzle & Fade (p: 0.6 to 1.0) ---
    const pCook = Math.min(Math.max((p - 0.6) / 0.4, 0), 1);
    const cookEaser = pCook * pCook * (3 - 2 * pCook);

    // Apply Transformations

    // Top Shell: Flies up, hinges backward, fades out
    if (topShellRef.current) {
      topShellRef.current.position.y = flyHeight + hatchEaser * 0.3; // Hinges up slightly more
      topShellRef.current.position.z = -hatchEaser * 0.4; // Hinges back
      topShellRef.current.rotation.x = -hatchEaser * Math.PI * 0.4;

      const mat = topShellRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 1 - cookEaser; // Fades out in phase 4
    }

    // Bottom Shell: Flies up, wobbles, fades out
    if (bottomShellRef.current) {
      const wiggle = Math.sin(state.clock.getElapsedTime() * 20) * 0.05 * (1 - pDrop);
      bottomShellRef.current.position.y = flyHeight;
      bottomShellRef.current.position.x = wiggle;
      bottomShellRef.current.rotation.z = wiggle;

      const mat = bottomShellRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 1 - cookEaser;
    }

    // Falling Yolk Drop
    if (yolkDropRef.current) {
      // Starts inside flying egg, drops to pan (0.25)
      const startDropHeight = flyHeight;
      const panHeight = 0.25;
      yolkDropRef.current.position.y = THREE.MathUtils.lerp(startDropHeight, panHeight, dropEaser);

      // Scale: Starts small (hidden), scales up slightly while falling, squashes flat on pan
      let dropScale = 0;
      if (pHatch > 0 && pCook < 0.5) {
        dropScale = 0.4; // Base size
        if (dropEaser > 0.8) {
          // Squashing effect as it hits the pan
          yolkDropRef.current.scale.set(dropScale * 1.5, dropScale * 0.2, dropScale * 1.5);
        } else {
          // Falling shape (stretched)
          yolkDropRef.current.scale.set(dropScale, dropScale * 1.5, dropScale);
        }
      } else {
        yolkDropRef.current.scale.set(0, 0, 0);
      }

      // Opacity: Visible during drop, fades out as omelette fades in
      const mat = yolkDropRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = (pHatch > 0 && pCook < 0.5) ? 1 : 0;
    }

    // Sizzling Omelette: Scales up as cook phase progresses
    if (omeletteRef.current) {
      omeletteRef.current.scale.setScalar(cookEaser);
    }
  });

  return (
    <group>
      {/* Invisible hitbox for manual raycasting hover detection - kept at pan level to track mouse easily */}
      <mesh ref={hitboxRef} visible={false} position={[0, 0.6, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial />
      </mesh>

      {/* Top half of the egg */}
      <mesh
        ref={topShellRef}
        position={[0, 0.6, 0]}
        scale={[1, 1.3, 1]}
        castShadow
      >
        <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#FFF5E1"
          roughness={0.2}
          metalness={0.1}
          side={THREE.DoubleSide}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Bottom half of the egg */}
      <mesh
        ref={bottomShellRef}
        position={[0, 0.6, 0]}
        scale={[1, 1.3, 1]}
        castShadow
      >
        <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial
          color="#FFF5E1"
          roughness={0.2}
          metalness={0.1}
          side={THREE.DoubleSide}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Spilling Yolk Drop */}
      <mesh
        ref={yolkDropRef}
        position={[0, 0.6, 0]}
        scale={[0, 0, 0]}
        castShadow
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#FF8C00"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0}
        />
      </mesh>

      {/* The Omelette */}
      <group ref={omeletteRef} scale={[0, 0, 0]} position={[0, 0.25, 0]}>
        <SizzlingOmelette />
        <Steam active={steamActive} />
      </group>
    </group>
  );
}

export default function EggScene() {
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-md lg:max-w-lg mx-auto h-[28vh] min-h-[240px] sm:h-[22vh] sm:min-h-[200px] lg:h-[380px] cursor-grab active:cursor-grabbing flex items-center justify-center overflow-visible relative">
      <div className="absolute w-[130%] h-[160%] sm:w-[120%] sm:h-[140%]">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 4, isMobile ? 9 : 8]} fov={50} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={0.8}
            target={[isMobile ? 0.5 : 0, 0, 0]}
            makeDefault
          />
          <ambientLight intensity={0.5} color="#fff4e6" />
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} color="#ffedd5" castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffe4c4" />

          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={isMobile ? [-0.5, 0.5, 0] : [-1, 0.5, 0]} scale={isMobile ? 0.85 : 0.9}>
              <Pan />
              <CookingFire />
              <InteractiveCooking />
            </group>
          </Float>

          <Environment preset="city" />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={15} blur={2.5} far={4} />
        </Canvas>
      </div>
    </div>
  );
}
