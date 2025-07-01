uniform float time;
uniform vec3 cameraPosition;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - abs(dot(viewDirection, vNormal));
    
    // Subtle rim lighting for event horizon
    float rim = pow(fresnel, 2.0) * 0.1;
    vec3 rimColor = vec3(0.2, 0.1, 0.4);
    
    // Almost pure black with slight rim
    vec3 color = rimColor * rim;
    
    gl_FragColor = vec4(color, 1.0);
}