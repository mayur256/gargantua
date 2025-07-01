import { useState } from 'react';

interface Controls3DProps {
  onLensStrengthChange?: (strength: number) => void;
  onDiskOpacityChange?: (opacity: number) => void;
  onRotationSpeedChange?: (speed: number) => void;
}

export const Controls3D = ({ 
  onLensStrengthChange, 
  onDiskOpacityChange,
  onRotationSpeedChange 
}: Controls3DProps) => {
  const [lensStrength, setLensStrength] = useState(2.0);
  const [diskOpacity, setDiskOpacity] = useState(0.8);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '16px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      minWidth: '220px'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>3D Controls</h3>
      
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>
          Gravitational Lensing: {lensStrength.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={lensStrength}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setLensStrength(value);
            onLensStrengthChange?.(value);
          }}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>
          Disk Opacity: {diskOpacity.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={diskOpacity}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setDiskOpacity(value);
            onDiskOpacityChange?.(value);
          }}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>
          Rotation Speed: {rotationSpeed.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={rotationSpeed}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setRotationSpeed(value);
            onRotationSpeedChange?.(value);
          }}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '16px' }}>
        <p>Use mouse to orbit around the black hole</p>
        <p>Scroll to zoom in/out</p>
      </div>
    </div>
  );
};