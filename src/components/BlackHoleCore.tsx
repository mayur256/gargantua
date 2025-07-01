import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import eventHorizonFrag from '../shaders/eventHorizon.frag?raw';

export const BlackHoleCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ camera, clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.elapsedTime;
      materialRef.current.uniforms.cameraPosition.value = camera.position;
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
    fragmentShader: eventHorizonFrag,
    uniforms: {
      time: { value: 0 },
      cameraPosition: { value: new THREE.Vector3() }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 32]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        {...shaderMaterial}
      />
    </mesh>
  );
};