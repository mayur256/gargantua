import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlackHoleCore } from './BlackHoleCore';
import { AccretionDisk } from './AccretionDisk';
import { Suspense } from 'react';

export const Gargantua3D = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas
        camera={{ 
          position: [0, 5, 10], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          toneMapping: 2, // ACESFilmicToneMapping
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          
          {/* Environment */}
          <Environment preset="night" />
          
          {/* Black Hole Components */}
          <BlackHoleCore />
          <AccretionDisk />
          
          {/* Camera Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            dampingFactor={0.05}
            enableDamping={true}
          />
          
          {/* Post-processing */}
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};