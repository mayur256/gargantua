import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import accretionVertShader from '../shaders/accretionDisk.vert?raw';
import accretionFragShader from '../shaders/accretionDisk.frag?raw';

interface AccretionDiskProps {
  lensStrength?: number;
  opacity?: number;
  rotationSpeed?: number;
}

export const AccretionDisk = ({ 
  lensStrength = 2.0, 
  opacity = 0.8, 
  rotationSpeed = 0.5 
}: AccretionDiskProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.elapsedTime;
      materialRef.current.uniforms.lensStrength.value = lensStrength;
      materialRef.current.uniforms.opacity.value = opacity;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * rotationSpeed;
    }
  });

  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: accretionVertShader,
    fragmentShader: accretionFragShader,
    uniforms: {
      time: { value: 0 },
      lensStrength: { value: 2.0 },
      diskColor: { value: new THREE.Vector3(1.0, 0.6, 0.2) },
      opacity: { value: 0.8 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });

  return (
    <group>
      {/* Main accretion disk */}
      <mesh ref={meshRef}>
        <ringGeometry args={[2.5, 8, 128, 32]} />
        <shaderMaterial
          ref={materialRef}
          attach="material"
          {...shaderMaterial}
        />
      </mesh>
      
      {/* Secondary warped disk for depth */}
      <mesh rotation={[Math.PI / 6, 0, 0]}>
        <ringGeometry args={[3, 7, 64, 16]} />
        <shaderMaterial
          attach="material"
          {...shaderMaterial}
          uniforms={{
            ...shaderMaterial.uniforms,
            opacity: { value: 0.3 },
            lensStrength: { value: 1.5 }
          }}
        />
      </mesh>
    </group>
  );
};