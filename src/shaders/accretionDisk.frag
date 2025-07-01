uniform float time;
uniform vec3 diskColor;
uniform float opacity;

varying vec2 vUv;
varying vec3 vPosition;
varying float vDistortion;

void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // Radial falloff
    float radialMask = 1.0 - smoothstep(0.3, 0.5, dist);
    radialMask *= smoothstep(0.1, 0.2, dist);
    
    // Rotation and spiral pattern
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float spiral = sin(angle * 8.0 + dist * 20.0 - time * 2.0) * 0.5 + 0.5;
    
    // Temperature gradient (hotter closer to center)
    float temperature = 1.0 / (dist + 0.1);
    vec3 hotColor = vec3(1.0, 0.8, 0.4);
    vec3 coolColor = vec3(1.0, 0.4, 0.1);
    vec3 finalColor = mix(coolColor, hotColor, temperature * 0.5);
    
    // Doppler shift simulation
    float dopplerShift = sin(angle + time) * 0.3;
    finalColor.r += dopplerShift;
    finalColor.b -= dopplerShift * 0.5;
    
    // Combine effects
    float alpha = radialMask * spiral * opacity * (1.0 + vDistortion);
    
    gl_FragColor = vec4(finalColor * diskColor, alpha);
}