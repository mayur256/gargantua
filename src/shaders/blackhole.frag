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
#define DISK_INNER 0.23
#define DISK_OUTER 0.5

// Color palette
vec3 diskColor = vec3(1.0, 0.3, 0.1);
vec3 hotSpotColor = vec3(1.0, 0.7, 0.4);
vec3 spaceColor = vec3(0.02, 0.02, 0.08);

// Smooth step function for better blending
float smootherstep(float edge0, float edge1, float x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

// Gravitational lensing approximation (improved)
vec2 gravitationalLens(vec2 coord, float mass) {
    float r = length(coord);
    if (r < EVENT_HORIZON) return coord;

    float lensStrength = mass / (r * r);
    float angle = atan(coord.y, coord.x);

    // Improved bend using singularity-aware power falloff
    float bendAngle = 0.1 / pow(r - EVENT_HORIZON + 0.01, 1.25);
    angle += bendAngle;

    return vec2(cos(angle), sin(angle)) * r;
}

// Accretion disk with rotation and temperature gradient
float accretionDisk(vec2 coord, float time) {
    float r = length(coord);
    if (r < DISK_INNER || r > DISK_OUTER) return 0.0;

    float angle = atan(coord.y, coord.x);
    float rotationSpeed = 1.0 / sqrt(r);
    float rotatedAngle = angle + time * rotationSpeed;

    float spiral = sin(rotatedAngle * 8.0 + r * 20.0) * 0.5 + 0.5;

    // Update radialFalloff inside accretionDisk()
    float outerFade = smootherstep(DISK_OUTER - 0.1, DISK_OUTER, r);
    float innerFade = smootherstep(DISK_INNER - 0.03, DISK_INNER + 0.02, r);
    float radialFalloff = innerFade * (1.0 - outerFade);

    float turbulence = sin(rotatedAngle * 12.0 + time * 2.0) * 0.3 + 0.7;

    return spiral * radialFalloff * turbulence;
}

// Event horizon (pure black)
float eventHorizon(vec2 coord) {
    float r = length(coord);
    return 1.0 - smootherstep(EVENT_HORIZON - 0.02, EVENT_HORIZON, r);
}

// Photon sphere glow (intensified)
float photonSphere(vec2 coord) {
    float r = length(coord);
    float glow = exp(-abs(r - PHOTON_SPHERE) * 40.0);
    return glow * 1.0;
}

// Direct front-facing accretion disk across X-axis
float horizontalDisk(vec2 coord) {
    // Limit to a narrow band around y = 0
    float y = coord.y;
    float band = exp(-pow(y * 20.0, 2.0)); // Gaussian profile, 1 at center, 0 outside

    float r = length(coord);
    float outerFade = smootherstep(DISK_OUTER - 0.1, DISK_OUTER, r);
    float innerFade = smootherstep(DISK_INNER - 0.03, DISK_INNER + 0.02, r);
    float radialFade = innerFade * (1.0 - outerFade);
    return band * radialFade;
}

void main() {
    // Normalize coordinates to [-1, 1]
    vec2 coord = (vUv - 0.5) * 2.0;
    coord.x *= iResolution.x / iResolution.y;

    float rCoord = length(coord);
    if (rCoord < EVENT_HORIZON) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // Apply gravitational lensing
    vec2 lensedCoord = gravitationalLens(coord, 0.8);

    // Rotate and flatten disk
    vec2 rotatedCoord = vec2(lensedCoord.x * 0.25, lensedCoord.y);

    // Disk above and below
    float diskAbove = accretionDisk(rotatedCoord, iTime);
    float diskBelow = accretionDisk(vec2(rotatedCoord.x, -rotatedCoord.y), iTime);
    float disk = max(diskAbove, diskBelow);

    // Direct horizontal (front) band of disk
    float midDisk = horizontalDisk(coord);
    disk = max(disk, midDisk);

    // ✅ Step 4: Far-side lensed halo
    vec2 lensedVerticalTop = vec2(rotatedCoord.y, rotatedCoord.x);
    vec2 lensedVerticalBottom = vec2(-rotatedCoord.y, rotatedCoord.x);
    float haloTop = accretionDisk(lensedVerticalTop, iTime);
    float haloBottom = accretionDisk(lensedVerticalBottom, iTime);
    float halo = max(haloTop, haloBottom);

    float totalDisk = max(disk, halo); // Combine all disk components

    // Accretion disk Doppler + temperature shading
    float r = length(rotatedCoord);
    float temperature = 1.0 / (r + 0.1);
    float angle = atan(rotatedCoord.y, rotatedCoord.x);
    float dopplerShift = 0.5 + 0.5 * (coord.x / DISK_OUTER); // from -1 to 1
    dopplerShift = clamp(dopplerShift, 0.0, 1.0);

    // Color blend and brightness ramp
    vec3 shiftedColor = mix(vec3(1.0, 0.2, 0.1), vec3(0.2, 0.6, 1.0), dopplerShift); // red to blue
    float brightness = mix(0.5, 1.8, dopplerShift);
    vec3 diskTempColor = shiftedColor * brightness;

    float photon = photonSphere(coord);

    // Combine all
    vec3 color = spaceColor;
    color = mix(color, diskTempColor, totalDisk * 0.8);
    color += vec3(0.4, 0.6, 1.0) * photon;

    gl_FragColor = vec4(color, 1.0);
}
