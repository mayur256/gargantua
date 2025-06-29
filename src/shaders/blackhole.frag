precision highp float;

uniform float iTime;
uniform vec2 iResolution;

varying vec2 vUv;

#define PI 3.14159265359
#define TAU 6.28318530718

// Schwarzschild radius (event horizon)
#define EVENT_HORIZON 0.15
// Photon sphere
#define PHOTON_SPHERE 0.225
// Accretion disk inner/outer radius
#define DISK_INNER 0.3
#define DISK_OUTER 0.8

// Color palette
vec3 diskColor = vec3(1.0, 0.6, 0.2);
vec3 hotSpotColor = vec3(1.0, 0.9, 0.7);
vec3 spaceColor = vec3(0.02, 0.02, 0.08);

// Smooth step function for better blending
float smootherstep(float edge0, float edge1, float x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

// Gravitational lensing approximation
vec2 gravitationalLens(vec2 coord, float mass) {
    float r = length(coord);
    if (r < EVENT_HORIZON) return coord;
    
    float lensStrength = mass / (r * r);
    float angle = atan(coord.y, coord.x);
    
    // Bend light rays around the black hole
    float bendAngle = lensStrength * 0.5;
    angle += bendAngle;
    
    return vec2(cos(angle), sin(angle)) * r;
}

// Accretion disk with rotation and temperature gradient
float accretionDisk(vec2 coord, float time) {
    float r = length(coord);
    if (r < DISK_INNER || r > DISK_OUTER) return 0.0;
    
    float angle = atan(coord.y, coord.x);
    
    // Keplerian rotation (faster closer to center)
    float rotationSpeed = 1.0 / sqrt(r);
    float rotatedAngle = angle + time * rotationSpeed;
    
    // Spiral pattern
    float spiral = sin(rotatedAngle * 8.0 + r * 20.0) * 0.5 + 0.5;
    
    // Radial falloff
    float radialFalloff = smootherstep(DISK_INNER, DISK_INNER + 0.1, r) * 
                         (1.0 - smootherstep(DISK_OUTER - 0.2, DISK_OUTER, r));
    
    // Turbulence
    float turbulence = sin(rotatedAngle * 12.0 + time * 2.0) * 0.3 + 0.7;
    
    return spiral * radialFalloff * turbulence;
}

// Event horizon (pure black)
float eventHorizon(vec2 coord) {
    float r = length(coord);
    return 1.0 - smootherstep(EVENT_HORIZON - 0.02, EVENT_HORIZON, r);
}

// Photon sphere glow
float photonSphere(vec2 coord) {
    float r = length(coord);
    float glow = exp(-abs(r - PHOTON_SPHERE) * 20.0);
    return glow * 0.3;
}

void main() {
    // Normalize coordinates to [-1, 1]
    vec2 coord = (vUv - 0.5) * 2.0;
    coord.x *= iResolution.x / iResolution.y;
    
    // Apply gravitational lensing
    vec2 lensedCoord = gravitationalLens(coord, 0.8);
    
    // Calculate components
    float disk = accretionDisk(lensedCoord, iTime);
    float horizon = eventHorizon(coord);
    float photon = photonSphere(coord);
    
    // Temperature-based coloring for accretion disk
    float r = length(lensedCoord);
    float temperature = 1.0 / (r + 0.1); // Hotter closer to center
    vec3 diskTempColor = mix(diskColor, hotSpotColor, temperature * 0.5);
    
    // Combine all elements
    vec3 color = spaceColor;
    
    // Add accretion disk
    color = mix(color, diskTempColor, disk * 0.8);
    
    // Add photon sphere glow
    color += vec3(0.4, 0.6, 1.0) * photon;
    
    // Apply event horizon (black hole shadow)
    color = mix(color, vec3(0.0), horizon);
    
    // Add some stars in the background
    vec2 starCoord = coord * 10.0;
    float stars = step(0.98, sin(starCoord.x * 100.0) * sin(starCoord.y * 100.0));
    color += vec3(1.0) * stars * 0.3;
    
    gl_FragColor = vec4(color, 1.0);
}