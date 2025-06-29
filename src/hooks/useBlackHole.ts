import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface BlackHoleConfig {
  animationSpeed: number;
  showAnnotations: boolean;
}

export const useBlackHole = (config: BlackHoleConfig) => {
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    startTime: number;
  }>();

  const updateAnimationSpeed = (speed: number) => {
    if (sceneRef.current) {
      // Speed is applied in the animation loop
      // This could be extended to modify shader uniforms
    }
  };

  const getElapsedTime = () => {
    if (!sceneRef.current) return 0;
    return ((Date.now() - sceneRef.current.startTime) / 1000) * config.animationSpeed;
  };

  return {
    sceneRef,
    updateAnimationSpeed,
    getElapsedTime
  };
};