import { useState } from 'react';
import { GargantuaVisualization } from './components/GargantuaVisualization';
import { Gargantua3DComplete } from './components/Gargantua3DComplete';
import { ViewToggle } from './components/ViewToggle';

function App() {
  const [currentView, setCurrentView] = useState<'2D' | '3D'>('3D');

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      {currentView === '2D' ? <GargantuaVisualization /> : <Gargantua3DComplete />}
    </div>
  );
}

export default App
