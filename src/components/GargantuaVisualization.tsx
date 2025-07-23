import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Tooltip } from 'react-tooltip';
// import { Controls } from './Controls';
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
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    canvasMesh: THREE.Mesh;
    startTime: number;
  }>(null);

  const [showAnnotations] = useState(false);
  const [animationSpeed] = useState(1);

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

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Calculate canvas dimensions to fit screen
    const degToRad = (deg: number) => (deg * Math.PI) / 180;
    const fovRadians = degToRad(camera.fov);
    const yFov = camera.position.z * Math.tan(fovRadians / 2) * 2;
    
    // Create a 2D plane for our shader
    const canvasGeometry = new THREE.PlaneGeometry(yFov * camera.aspect, yFov);
    const spaceTexture = new THREE.TextureLoader().load("./space_8k.jpg", () =>
      renderer.render(scene, camera)
    );
    
    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSpaceTexture: {
          value: spaceTexture,
        },
        uResolution: {
          value: new THREE.Vector2(width, height),
        }
      }
    });
    
    // Create mesh and add to scene
    const canvasMesh = new THREE.Mesh(canvasGeometry, material);
    scene.add(canvasMesh);

    const startTime = Date.now();
    sceneRef.current = { scene, camera, renderer, material, canvasMesh, startTime };
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;

      // const elapsed = ((Date.now() - sceneRef.current.startTime) / 1000) * animationSpeed;
      // sceneRef.current.material.uniforms.iTime.value = elapsed;

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
      
      // Update camera aspect ratio
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      
      // Recalculate canvas dimensions
      const degToRad = (deg: number) => (deg * Math.PI) / 180;
      const fovRadians = degToRad(sceneRef.current.camera.fov);
      const yFov = sceneRef.current.camera.position.z * Math.tan(fovRadians / 2) * 2;
      
      // Update canvas mesh scale
      sceneRef.current.canvasMesh.scale.set(
        yFov * sceneRef.current.camera.aspect,
        yFov,
        1
      );
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        mountRef.current?.removeChild(sceneRef.current.renderer.domElement);
        sceneRef.current.renderer.dispose();
        sceneRef.current.canvasMesh.geometry.dispose();
        sceneRef.current.material.dispose();
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
      {/* <Controls
        onToggleAnnotations={setShowAnnotations}
        onSpeedChange={setAnimationSpeed}
      /> */}

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