import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { BlackHoleCore } from './BlackHoleCore';
import { AccretionDisk } from './AccretionDisk';
import { PhotonSphere } from './PhotonSphere';
import { Controls3D } from './Controls3D';
import { Suspense, useState } from 'react';
import { ToneMappingMode } from 'postprocessing';

export const Gargantua3DComplete = () => {
  const [lensStrength, setLensStrength] = useState(2.0);
  const [diskOpacity, setDiskOpacity] = useState(0.8);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas
        camera={{ 
          position: [0, 8, 15], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          toneMapping: 2, // ACESFilmicToneMapping
          toneMappingExposure: 1.5
        }}
      >
        <Suspense fallback={null}>
          {/* Environment */}
          <color attach="background" args={['#000008']} />
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
          <Environment preset="night" />
          
          {/* Lighting */}
          <ambientLight intensity={0.05} />
          <pointLight position={[20, 20, 20]} intensity={0.3} color="#ffffff" />
          
          {/* Black Hole Components */}
          <BlackHoleCore />
          <PhotonSphere />
          <AccretionDisk 
            lensStrength={lensStrength}
            opacity={diskOpacity}
            rotationSpeed={rotationSpeed}
          />
          
          {/* Camera Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={100}
            dampingFactor={0.03}
            enableDamping={true}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
          />
          
          {/* Post-processing Effects */}
          <EffectComposer>
            <Bloom
              intensity={2.0}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.9}
              height={300}
              opacity={1.0}
            />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontSize: '28px',
        fontWeight: 'bold',
        textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
        zIndex: 100
      }}>
        Gargantua 3D
      </div>

      {/* Controls */}
      <Controls3D 
        onLensStrengthChange={setLensStrength}
        onDiskOpacityChange={setDiskOpacity}
        onRotationSpeedChange={setRotationSpeed}
      />

      {/* Info Panel */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '12px',
        borderRadius: '6px',
        color: 'white',
        fontSize: '12px',
        maxWidth: '300px',
        zIndex: 100
      }}>
        <p><strong>3D Black Hole Simulation</strong></p>
        <p>• Gravitational lensing warps the accretion disk vertically</p>
        <p>• Doppler shifting creates red/blue color variations</p>
        <p>• Bloom effects simulate intense radiation</p>
      </div>
    </div>
  );
};