# Gargantua Black Hole Visualization

An interactive, scientifically inspired visualization of the Gargantua black hole built with React, TypeScript, Three.js, and custom GLSL shaders.

## Features

- **Gravitational Lensing**: Simulates light bending around the black hole
- **Event Horizon**: Accurate representation of the point of no return
- **Accretion Disk**: Animated rotating disk with temperature gradients
- **Photon Sphere**: Glowing ring where photons orbit the black hole
- **Interactive Annotations**: Hover over white dots to learn about different regions
- **Tooltips**: Detailed scientific explanations for each component
- **Real-time Animation**: Time-based shader uniforms for dynamic effects
- **Responsive**: Fullscreen rendering that adapts to window resizing
- **Controls**: Toggle annotations and adjust animation speed

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
│   ├── BlackHole.tsx              # Basic Three.js component
│   ├── BlackHoleWithAnnotations.tsx # Component with tooltips
│   ├── GargantuaVisualization.tsx # Complete visualization
│   └── Controls.tsx               # UI controls
├── hooks/
│   └── useBlackHole.ts           # Custom hook for state management
├── shaders/
│   ├── blackhole.vert            # Vertex shader
│   └── blackhole.frag            # Fragment shader with physics
├── App.tsx                       # Root component
└── main.tsx                     # Entry point
```

## Shader Physics

The fragment shader implements:

- **Schwarzschild Metric**: Simplified gravitational lensing
- **Keplerian Rotation**: Realistic accretion disk dynamics
- **Temperature Gradients**: Color-coded disk temperature
- **Spacetime Distortion**: Light ray bending approximation

## Future Enhancements

### Planned Features
- Interactive annotations for event horizon, photon sphere, and accretion disk
- Hover-based tooltips with scientific explanations
- Kerr metric for rotating black hole effects
- Relativistic Doppler shift simulation
- Ray-casting for 3D annotations

### Technical Improvements
- Performance optimization for mobile devices
- HDR rendering pipeline
- Post-processing effects
- Advanced gravitational lensing algorithms

## Usage

The visualization runs automatically on load. The black hole rotates in real-time, showing:

- **Black Center**: Event horizon (point of no return)
- **Orange Glow**: Photon sphere where light orbits
- **Rotating Disk**: Hot accretion material spiraling inward
- **Lensing Effects**: Background distortion from gravity

## Dependencies

- React 19.1.0
- Three.js 0.177.0
- react-tooltip 5.29.1
- TypeScript 5.8.3
- Vite 7.0.0

## License

MIT