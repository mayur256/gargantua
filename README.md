# Gargantua Black Hole Visualization

An interactive, scientifically inspired visualization of the Gargantua black hole from Interstellar, featuring both 2D shader-based and 3D physically-accurate simulations built with React, TypeScript, Three.js, and custom GLSL shaders.

## Features

### 2D Shader Simulation
- **Gravitational Lensing**: Simulates light bending around the black hole
- **Event Horizon**: Accurate representation of the point of no return
- **Accretion Disk**: Animated rotating disk with temperature gradients
- **Interactive Annotations**: Hover over white dots to learn about different regions
- **Tooltips**: Detailed scientific explanations for each component

### 3D Physical Model
- **Realistic 3D Geometry**: Spherical event horizon with proper depth
- **Vertical Disk Warping**: Gravitational lensing effects on accretion disk
- **Photon Sphere**: Pulsing glow at 1.5x Schwarzschild radius
- **Doppler Shifting**: Red/blue color variations on disk rotation
- **Bloom Effects**: HDR rendering with realistic light emission
- **Orbit Controls**: Interactive camera with smooth damping
- **Dynamic Controls**: Adjust lensing strength, opacity, and rotation

### Shared Features
- **View Toggle**: Switch between 2D and 3D representations
- **Real-time Animation**: Physics-based time evolution
- **Responsive Design**: Fullscreen rendering with window adaptation

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm dev
```

3. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── components/
│   # 2D Components
│   ├── BlackHole.tsx              # Basic 2D shader component
│   ├── BlackHoleWithAnnotations.tsx # 2D with tooltips
│   ├── GargantuaVisualization.tsx # Complete 2D visualization
│   ├── Controls.tsx               # 2D UI controls
│   # 3D Components
│   ├── Gargantua3D.tsx           # Basic 3D scene
│   ├── Gargantua3DComplete.tsx   # Complete 3D visualization
│   ├── BlackHoleCore.tsx         # 3D event horizon sphere
│   ├── AccretionDisk.tsx         # 3D warped accretion disk
│   ├── PhotonSphere.tsx          # 3D photon sphere glow
│   ├── Controls3D.tsx            # 3D UI controls
│   └── ViewToggle.tsx            # 2D/3D view switcher
├── hooks/
│   └── useBlackHole.ts           # Custom hook for state management
├── shaders/
│   # 2D Shaders
│   ├── blackhole.vert            # 2D vertex shader
│   ├── blackhole.frag            # 2D fragment shader
│   # 3D Shaders
│   ├── accretionDisk.vert        # 3D disk vertex shader
│   ├── accretionDisk.frag        # 3D disk fragment shader
│   └── eventHorizon.frag         # 3D event horizon shader
├── App.tsx                       # Root component with view switching
└── main.tsx                     # Entry point
```

## Physics Implementation

### 2D Shader Physics
- **Schwarzschild Metric**: Simplified gravitational lensing
- **Keplerian Rotation**: Realistic accretion disk dynamics
- **Temperature Gradients**: Color-coded disk temperature
- **Spacetime Distortion**: Light ray bending approximation

### 3D Model Physics
- **Gravitational Warping**: Vertex displacement for disk curvature
- **Relativistic Effects**: Doppler shifting and time dilation
- **Light Transport**: Bloom and emission for realistic radiation
- **Interactive Lensing**: Real-time adjustable gravitational strength

## Usage

### 2D Mode
- Fullscreen shader-based simulation
- Interactive annotations with hover tooltips
- Controls for animation speed and visibility

### 3D Mode
- Orbit around the black hole with mouse controls
- Zoom in/out with scroll wheel
- Adjust gravitational lensing strength
- Control disk opacity and rotation speed

## Dependencies

- React 19.1.0
- Three.js 0.177.0
- @react-three/fiber 9.1.4 (React Three.js renderer)
- @react-three/drei 10.4.2 (Three.js helpers)
- @react-three/postprocessing 3.0.4 (Post-processing effects)
- three-stdlib 2.36.0 (Three.js utilities)
- react-tooltip 5.29.1
- TypeScript 5.8.3
- Vite 7.0.0

## License

MIT