varying vec2 vUv;
uniform sampler2D uSpaceTexture;
uniform vec2 uResolution;

#define MAX_ITERATIONS 256
#define STEP_SIZE 0.1
#define PI 3.1415926535897932384626433832795
#define TAU 6.283185307179586476925286766559

const vec3 camPos = vec3(0.0, 2.0, -10.0);
const vec3 blackholePos = vec3(0.0, 0.0, 0.0);
float innerDiskRadius = 2.0;
float outerDiskRadius = 5.0;
float diskTwist = 10.0;
float flowRate = 0.6;

float hash(float n) { 
    return fract(sin(n) * 753.5453123); 
}

float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 157.0 + 113.0 * p.z;

    return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
        mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
        mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
}

// compute fractal brownian motion for matter and gas
float fbm(vec3 pos, const int numOctaves, const float iterScale, const float detail, const float weight) {
    float mul = weight;
    float add = 1.0 - 0.5 * mul;
    float t = noise(pos) * mul + add;

    for (int i = 1; i < numOctaves; ++i) {
          pos *= iterScale;
          mul = exp2(log2(weight) - float(i) / detail);
          add = 1.0 - 0.5 * mul;
          t *= noise(pos) * mul + add;
    }
      
    return t;
}

vec4 raytrace(vec3 rayDir, vec3 rayPos) {
    float h2 = pow(length(cross(rayPos, rayDir)), 2.0);

    // Simple stub ray march: advance the ray for MAX_ITERATIONS
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        float dist = length(rayPos - blackholePos);
        // If the ray is inside the black hole, return black
        if (dist < 1.0) {
            return vec4(0, 0, 0, 1);
        }
        rayDir += -1.5 * h2 * rayPos / pow(pow(dist, 2.0), 2.5) * STEP_SIZE;
        vec3 steppedRayPos = rayPos + rayDir * STEP_SIZE;
        
        
        if (dist > innerDiskRadius && dist < outerDiskRadius && rayPos.y * steppedRayPos.y < pow(STEP_SIZE, 3.0)) {
            // calculate flow of the matter around the black hole
            vec3 shiftVector = 0.6 * cross(normalize(steppedRayPos), vec3(0.0, 1.0, 0.0));
            // calculate velocity as a dot product of the shiftVector and ray direction
            float velocity = dot(rayDir, shiftVector);
            // calculate doppler shift
            float dopplerShift = sqrt((1.0 - velocity) / (1.0 + velocity));

            // compute gravitational shift of the matter and light
            float gravitationalShift = sqrt((1.0 - 2.0 / dist) / (1.0 - 2.0 / length(camPos)));

            //  calculate the density of the disk at the ray’s position:
            float diskDensity = 1.0 - length(steppedRayPos / vec3(outerDiskRadius, 1.0, outerDiskRadius));

            // add non-uniformity to accretion disk
            float deltaDiskRadius = outerDiskRadius - innerDiskRadius;
            float diskDist = dist - innerDiskRadius;

            vec3 uvw = vec3(
            (atan(steppedRayPos.z, abs(steppedRayPos.x)) / TAU) - (diskTwist / sqrt(dist)), 
            pow(diskDist / deltaDiskRadius, 2.0) + ((flowRate / TAU) / deltaDiskRadius), 
            steppedRayPos.y * 0.5 + 0.5
            ) / 2.0;

            // using fbm to calculate denisty variation for disk
            float densityVariation = fbm(2.0 * uvw, 5, 2.0, 1.0, 1.0);

            // account for the inner radius of the disk
            diskDensity *= smoothstep(innerDiskRadius, innerDiskRadius + 1.0, dist);
            // set it inversely proportional to distance
            diskDensity *= inversesqrt(dist) * densityVariation; 

            // calculate the optical depth, which scales with the step size
            float opticalDepth = STEP_SIZE * 50.0 * diskDensity;

            vec3 baseColor = mix(vec3(1.0, 0.6, 0.3), vec3(1.0, 0.3, 0.0), diskDensity);

            // simple glow that decays with distance from disk and black hole
            float glowFalloff = smoothstep(outerDiskRadius, innerDiskRadius, dist);
            float glowIntensity = diskDensity * glowFalloff * 0.6; // tune this

            vec3 finalColor = baseColor * dopplerShift * gravitationalShift * opticalDepth;
            finalColor += baseColor * glowIntensity; // add soft glow

            // finally determine luminance
            return vec4(finalColor, 1.0);
        }

        // rayPos += rayDir * STEP_SIZE;
        rayPos = steppedRayPos;
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
