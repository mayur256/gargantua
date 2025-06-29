import { useState } from 'react';

interface ControlsProps {
  onToggleAnnotations?: (visible: boolean) => void;
  onSpeedChange?: (speed: number) => void;
}

export const Controls = ({ onToggleAnnotations, onSpeedChange }: ControlsProps) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [speed, setSpeed] = useState(1);

  const handleAnnotationToggle = () => {
    const newValue = !showAnnotations;
    setShowAnnotations(newValue);
    onToggleAnnotations?.(newValue);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    onSpeedChange?.(newSpeed);
  };

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
      minWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Controls</h3>
      
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showAnnotations}
            onChange={handleAnnotationToggle}
            style={{ marginRight: '8px' }}
          />
          Show Annotations
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>
          Animation Speed: {speed.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '16px' }}>
        <p>Hover over the white dots to learn about different regions of the black hole.</p>
      </div>
    </div>
  );
};