uniform float time;
uniform float lensStrength;

varying vec2 vUv;
varying vec3 vPosition;
varying float vDistortion;

void main() {
    vUv = uv;
    
    vec3 pos = position;
    float radius = length(pos.xz);
    
    // Gravitational lensing - vertical warping
    float warpFactor = lensStrength / (radius + 0.1);
    pos.y += sin(radius * 3.0) * warpFactor * 0.3;
    
    // Additional curvature for realistic bending
    float curvature = 1.0 / (1.0 + radius * 2.0);
    pos.y += curvature * warpFactor * 0.5;
    
    vDistortion = warpFactor;
    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}