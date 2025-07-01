interface ViewToggleProps {
  currentView: '2D' | '3D';
  onViewChange: (view: '2D' | '3D') => void;
}

export const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      display: 'flex',
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '25px',
      padding: '4px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <button
        onClick={() => onViewChange('2D')}
        style={{
          padding: '8px 16px',
          borderRadius: '20px',
          border: 'none',
          background: currentView === '2D' ? '#ffffff' : 'transparent',
          color: currentView === '2D' ? '#000' : '#fff',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
      >
        2D Shader
      </button>
      <button
        onClick={() => onViewChange('3D')}
        style={{
          padding: '8px 16px',
          borderRadius: '20px',
          border: 'none',
          background: currentView === '3D' ? '#ffffff' : 'transparent',
          color: currentView === '3D' ? '#000' : '#fff',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
      >
        3D Model
      </button>
    </div>
  );
};