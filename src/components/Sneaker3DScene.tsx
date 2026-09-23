"use client";
import { useRef, Suspense, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import ErrorBoundary from "./ErrorBoundary";

// High quality but optimized model
const SNEAKER_MODEL_URL = "/shoe.glb";

function SneakerModel({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(SNEAKER_MODEL_URL);

  // Extract materials once to avoid traversal in useFrame
  const materials = useMemo(() => {
    const mats: THREE.MeshStandardMaterial[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        mats.push((child as THREE.Mesh).material as THREE.MeshStandardMaterial);
      }
    });
    return mats;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Smooth Rotation
    const targetY = (scrollProgress * Math.PI * 4) + t * 0.1;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.05;

    // Transition Logic
    const cleanColor = new THREE.Color("#ffffff");
    const dirtyColor = new THREE.Color("#4a3b2a");
    const factor = Math.min(Math.max(scrollProgress, 0), 1);
    
    for (let i = 0; i < materials.length; i++) {
      materials[i].color.lerpColors(dirtyColor, cleanColor, factor);
      materials[i].roughness = THREE.MathUtils.lerp(1.1, 0.3, factor);
    }
  });

  return (
    <group ref={groupRef} scale={11} position={[0, -0.6, 0]}>
      <primitive object={scene} rotation={[0, Math.PI / 2, 0]} />
      <Html position={[-1.2, 1.2, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ opacity: 1 - scrollProgress, color: '#ff5500', fontFamily: 'Bebas Neue', fontSize: '1.5rem', textShadow: '0 0 10px black' }}>SUCIO</div>
      </Html>
      <Html position={[1.2, 1.2, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ opacity: scrollProgress, color: '#ffffff', fontFamily: 'Bebas Neue', fontSize: '1.8rem', textShadow: '0 0 20px #ff5500' }}>LIMPIO ✨</div>
      </Html>
    </group>
  );
}

export default function Sneaker3DScene({ scrollProgress }: { scrollProgress: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="w-full h-full bg-black" />;

  return (
    <div className="w-full h-full relative bg-black rounded-2xl overflow-hidden">
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          {/* Studio-quality manual lighting — no external HDR needed */}
          <ambientLight intensity={3} />
          <directionalLight position={[5, 10, 5]} intensity={4} />
          <directionalLight position={[-5, 10, -5]} intensity={2} color="#ff5500" />
          <pointLight position={[0, 0, 8]} intensity={3} color="#ffffff" />
          <pointLight position={[8, 0, 0]} intensity={2} color="#ffe5d0" />
          <pointLight position={[-8, 0, 0]} intensity={2} color="#ff5500" />

          <Suspense fallback={
            <Html center>
              <div className="sneaker-loader" />
            </Html>
          }>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
              <SneakerModel scrollProgress={scrollProgress} />
            </Float>
          </Suspense>

          <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={10} blur={2.5} far={4.5} />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
