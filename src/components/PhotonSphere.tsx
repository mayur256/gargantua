import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const PhotonSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.elapsedTime;
    }
  });

  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vPosition = position;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        float pulse = sin(time * 2.0) * 0.5 + 0.5;
        vec3 color = vec3(0.4, 0.6, 1.0) * pulse * 0.3;
        float alpha = pulse * 0.2;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      time: { value: 0 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.25, 32, 16]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        {...shaderMaterial}
      />
    </mesh>
  );
};