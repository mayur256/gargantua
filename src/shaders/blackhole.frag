varying vec2 vUv;
uniform sampler2D uSpaceTexture;
uniform vec2 uResolution;

#define MAX_ITERATIONS 256
#define STEP_SIZE 0.1

const vec3 camPos = vec3(0.0, 0.0, -10.0);
const vec3 blackholePos = vec3(0.0, 0.0, 0.0);

vec4 raytrace(vec3 rayDir, vec3 rayPos) {
    float h2 = pow(length(cross(rayPos, rayDir)), 2.0);

    // Simple stub ray march: advance the ray for MAX_ITERATIONS
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        float dist = length(rayPos - blackholePos);
        rayDir += -1.5 * h2 * rayPos / pow(pow(dist, 2.0), 2.5) * STEP_SIZE;
        rayPos += rayDir * STEP_SIZE;
    }

    // Return the sampled space texture based on final ray direction
    // This is a placeholder. You likely want to warp the coordinates here.
    vec2 texCoord = 0.5 + 0.5 * rayDir.xy;  // map from [-1,1] to [0,1]
    return texture2D(uSpaceTexture, texCoord);
}

void main() {
    vec2 uv = (vUv - 0.5) * 2.0 * vec2(uResolution.x / uResolution.y, 1.0);
    vec3 rayDir = normalize(vec3(uv, 1.0));
    vec3 rayPos = camPos;

    vec4 color = raytrace(rayDir, rayPos);
    gl_FragColor = color;
}
