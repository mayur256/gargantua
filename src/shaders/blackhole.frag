varying vec2 vUv;
uniform sampler2D uSpaceTexture;
uniform vec2 uResolution;
  
void main() {
    gl_FragColor = texture2D(uSpaceTexture, vUv);
}