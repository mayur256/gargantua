import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Tooltip } from 'react-tooltip';
import { Controls } from './Controls';
import vertexShader from '../shaders/blackhole.vert?raw';
import fragmentShader from '../shaders/blackhole.frag?raw';

interface Annotation {
  id: string;
  position: { x: number; y: number };
  title: string;
  description: string;
}

export const GargantuaVisualization = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    startTime: number;
  }>(null);

  const [showAnnotations, setShowAnnotations] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const annotations: Annotation[] = [
    {
      id: 'event-horizon',
      position: { x: 50, y: 50 },
      title: 'Event Horizon',
      description: 'The boundary beyond which nothing can escape the black hole\'s gravitational pull. Located at the Schwarzschild radius (Rs = 2GM/c²).'
    },
    {
      id: 'photon-sphere',
      position: { x: 42, y: 42 },
      title: 'Photon Sphere',
      description: 'The spherical region where photons can orbit the black hole. Located at 1.5 times the Schwarzschild radius (1.5Rs).'
    },
    {
      id: 'accretion-disk',
      position: { x: 35, y: 65 },
      title: 'Accretion Disk',
      description: 'Hot, rotating disk of matter spiraling into the black hole. Material heats up due to friction, glowing at millions of degrees.'
    },
    {
      id: 'gravitational-lensing',
      position: { x: 25, y: 25 },
      title: 'Gravitational Lensing',
      description: 'The bending of light rays due to the black hole\'s intense gravitational field, creating the characteristic distortion effect.'
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Fullscreen quad geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -1, -1, 0,
       1, -1, 0,
       1,  1, 0,
      -1, -1, 0,
       1,  1, 0,
      -1,  1, 0
    ]);
    const uvs = new Float32Array([
      0, 0,
      1, 0,
      1, 1,
      0, 0,
      1, 1,
      0, 1
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    
    // Shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = Date.now();
    sceneRef.current = { scene, camera, renderer, material, startTime };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      const elapsed = ((Date.now() - sceneRef.current.startTime) / 1000) * animationSpeed;
      sceneRef.current.material.uniforms.iTime.value = elapsed;
      
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      sceneRef.current.renderer.setSize(width, height);
      sceneRef.current.material.uniforms.iResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        mountRef.current?.removeChild(sceneRef.current.renderer.domElement);
        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, [animationSpeed]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          background: '#000'
        }} 
      />
      
      {/* Controls */}
      <Controls 
        onToggleAnnotations={setShowAnnotations}
        onSpeedChange={setAnimationSpeed}
      />

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        zIndex: 100
      }}>
        Gargantua Black Hole
      </div>
      
      {/* Annotation overlays */}
      {showAnnotations && annotations.map((annotation) => (
        <div
          key={annotation.id}
          data-tooltip-id={annotation.id}
          data-tooltip-content={annotation.description}
          style={{
            position: 'absolute',
            left: `${annotation.position.x}%`,
            top: `${annotation.position.y}%`,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(255, 255, 255, 1)',
            cursor: 'pointer',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
          }}
        />
      ))}

      {/* Tooltips */}
      {annotations.map((annotation) => (
        <Tooltip
          key={`tooltip-${annotation.id}`}
          id={annotation.id}
          place="top"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '320px',
            fontSize: '14px',
            lineHeight: '1.5',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        />
      ))}

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
      `}</style>
    </div>
  );
};