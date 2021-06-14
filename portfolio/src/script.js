import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { noise } from "./perlin";

var renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("canvas"),
	antialias: true,
});
// renderer.setClearColor(0x7b7b7b);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 5;
camera.position.x = -1;


var center = new THREE.Object3D();
scene.add(center);

var sphere_geometry = new THREE.SphereGeometry(1, 128, 128);
var material = new THREE.MeshNormalMaterial();
// material.color = new THREE.Color(0x49ef4);
var sphere = new THREE.Mesh(sphere_geometry, material);
center.add(sphere);
center.add(camera);

// Electron 1
var shape = new THREE.SphereGeometry(0.2, 128, 128);
var cover = new THREE.MeshNormalMaterial();
var electron1 = new THREE.Mesh(shape, cover);
center.add(electron1);

// Electron 2
var shape = new THREE.SphereGeometry(0.2, 128, 128);
var cover = new THREE.MeshNormalMaterial();
var electron2 = new THREE.Mesh(shape, cover);
center.add(electron2);

// Electron 3
var shape = new THREE.SphereGeometry(0.2, 128, 128);
var cover = new THREE.MeshNormalMaterial();
var electron3 = new THREE.Mesh(shape, cover);
center.add(electron3);

var clock = new THREE.Clock();

var update = function () {
	var time = performance.now() * 0.001;
	var t = clock.getElapsedTime();
	var t_offset = 1.3 + clock.getElapsedTime();

	electron1.position.x = Math.sin(3 * t) * -1;
	electron1.position.y = Math.sin(3 * t) * 1;
	electron1.position.z = Math.cos(3 * t) * 1.5;

	electron2.position.x = Math.cos(3* t) * 1;
	electron2.position.y = Math.cos(3 * t) * 1;
	electron2.position.z = Math.sin(3 * t) * 1;

	electron3.position.x = Math.sin(3 * t_offset) * 1.4;
	electron3.position.y = Math.sin(3 * t_offset) * 0;
	electron3.position.z = Math.cos(3 * t_offset) * 1.4;

	var k = 1;
	const positions = sphere.geometry.attributes.position.array;
	for (let i = 0; i < positions.length; i++) {
		const p = new THREE.Vector3(
			positions[i * 3],
			positions[i * 3 + 1],
			positions[i * 3 + 2]
		);
		p.normalize().multiplyScalar(
			1 + 0.3 * noise.perlin3(p.x * k + time, p.y * k, p.z * k)
		);
		positions[i * 3] = p.x;
		positions[i * 3 + 1] = p.y;
		positions[i * 3 + 2] = p.z;
	}
	sphere.geometry.attributes.position.needsUpdate = true;
	sphere.geometry.computeVertexNormals();
};

function animate() {
	sphere.rotation.x += 0.001;
	sphere.rotation.y += 0.001;

	update();
	renderer.clear();
	renderer.render(scene, camera);

	requestAnimationFrame(animate);
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

requestAnimationFrame(animate);


// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "dat.gui";

// const gui = new dat.GUI();

// const settings = {
//   speed: 0.2,
//   density: 1.5,
//   strength: 0.2,
//   frequency: 3.0,
//   amplitude: 6.0,
//   intensity: 1.0,
// };
// const folder1 = gui.addFolder('Noise');
// const folder2 = gui.addFolder('Rotation');
// const folder3 = gui.addFolder('Color');
// folder1.add(settings, 'speed', 0.1, 1, 0.01);
// folder1.add(settings, 'density', 0, 10, 0.01);
// folder1.add(settings, 'strength', 0, 2, 0.01);
// folder2.add(settings, 'frequency', 0, 10, 0.1);
// folder2.add(settings, 'amplitude', 0, 10, 0.1);
// folder3.add(settings, 'intensity', 0, 10, 0.1);

// const noise = `
 

//   vec3 mod289(vec3 x)
//   {
//     return x - floor(x * (1.0 / 289.0)) * 289.0;
//   }

//   vec4 mod289(vec4 x)
//   {
//     return x - floor(x * (1.0 / 289.0)) * 289.0;
//   }

//   vec4 permute(vec4 x)
//   {
//     return mod289(((x*34.0)+1.0)*x);
//   }

//   vec4 taylorInvSqrt(vec4 r)
//   {
//     return 1.79284291400159 - 0.85373472095314 * r;
//   }

//   vec3 fade(vec3 t) {
//     return t*t*t*(t*(t*6.0-15.0)+10.0);
//   }

//   // Classic Perlin noise, periodic variant
//   float pnoise(vec3 P, vec3 rep)
//   {
//     vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
//     vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
//     Pi0 = mod289(Pi0);
//     Pi1 = mod289(Pi1);
//     vec3 Pf0 = fract(P); // Fractional part for interpolation
//     vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
//     vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
//     vec4 iy = vec4(Pi0.yy, Pi1.yy);
//     vec4 iz0 = Pi0.zzzz;
//     vec4 iz1 = Pi1.zzzz;

//     vec4 ixy = permute(permute(ix) + iy);
//     vec4 ixy0 = permute(ixy + iz0);
//     vec4 ixy1 = permute(ixy + iz1);

//     vec4 gx0 = ixy0 * (1.0 / 7.0);
//     vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
//     gx0 = fract(gx0);
//     vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
//     vec4 sz0 = step(gz0, vec4(0.0));
//     gx0 -= sz0 * (step(0.0, gx0) - 0.5);
//     gy0 -= sz0 * (step(0.0, gy0) - 0.5);

//     vec4 gx1 = ixy1 * (1.0 / 7.0);
//     vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
//     gx1 = fract(gx1);
//     vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
//     vec4 sz1 = step(gz1, vec4(0.0));
//     gx1 -= sz1 * (step(0.0, gx1) - 0.5);
//     gy1 -= sz1 * (step(0.0, gy1) - 0.5);

//     vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
//     vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
//     vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
//     vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
//     vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
//     vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
//     vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
//     vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

//     vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
//     g000 *= norm0.x;
//     g010 *= norm0.y;
//     g100 *= norm0.z;
//     g110 *= norm0.w;
//     vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
//     g001 *= norm1.x;
//     g011 *= norm1.y;
//     g101 *= norm1.z;
//     g111 *= norm1.w;

//     float n000 = dot(g000, Pf0);
//     float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
//     float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
//     float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
//     float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
//     float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
//     float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
//     float n111 = dot(g111, Pf1);

//     vec3 fade_xyz = fade(Pf0);
//     vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
//     vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
//     float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
//     return 2.2 * n_xyz;
//   }
// `;

// const rotation = `
//   mat3 rotation3dY(float angle) {
//     float s = sin(angle);
//     float c = cos(angle);

//     return mat3(
//       c, 0.0, -s,
//       0.0, 1.0, 0.0,
//       s, 0.0, c
//     );
//   }
  
//   vec3 rotateY(vec3 v, float angle) {
//     return rotation3dY(angle) * v;
//   }  
// `;

// const vertexShader = `  
//   varying vec2 vUv;
//   varying float vDistort;
  
//   uniform float uTime;
//   uniform float uSpeed;
//   uniform float uNoiseDensity;
//   uniform float uNoiseStrength;
//   uniform float uFrequency;
//   uniform float uAmplitude;
  
//   ${noise}
  
//   ${rotation}
  
//   void main() {
//     vUv = uv;
    
//     float t = uTime * uSpeed;
//     float distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;

//     vec3 pos = position + (normal * distortion);
//     float angle = sin(uv.y * uFrequency + t) * uAmplitude;
//     pos = rotateY(pos, angle);    
    
//     vDistort = distortion;

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
//   }  
// `;

// const fragmentShader = `
//   varying vec2 vUv;
//   varying float vDistort;
  
//   uniform float uTime;
//   uniform float uIntensity;
  
//   vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
//     return a + a * sin(6.28318 * (c * t + d));
//   }     
  
//   void main() {
//     float distort = vDistort * uIntensity;
    
//     vec3 brightness = vec3(1.5, 1.5, 1.5);
//     vec3 contrast = vec3(1, 1, 1);
//     vec3 oscilation = vec3(1.0, 1.0, 1.0);
//     vec3 phase = vec3(0.9, 0.6, 0.5);
  
//     vec3 color = cosPalette(distort, brightness, contrast, oscilation, phase);
    
//     gl_FragColor = vec4(color, 1.0);
//   }  
// `;

// class Scene {
//   constructor() {
//     this.renderer = new THREE.WebGLRenderer({ antialias: true });
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//     this.renderer.setClearColor('#000', 1);
    
//     this.camera = new THREE.PerspectiveCamera(
//       45,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     this.camera.position.set(0, 4, 7);    
    
//     this.scene = new THREE.Scene();
    
//     this.clock = new THREE.Clock();
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
//     this.init();
//     this.animate();    
//   }
  
//   init() {
//     this.addCanvas();
//     this.addElements();
//     this.addEvents();
//   } 
  
//   addCanvas() {
//     const canvas = this.renderer.domElement;
//     canvas.classList.add('webgl');
//     document.body.appendChild(canvas);
//   }  
  
//   addElements() {
//     const geometry = new THREE.IcosahedronBufferGeometry(1, 64);
//     const material = new THREE.ShaderMaterial({
//       vertexShader,
//       fragmentShader,
//       uniforms: {
//         uTime: { value: 0 },
//         uSpeed: { value: settings.speed },
//         uNoiseDensity: { value: settings.density },
//         uNoiseStrength: { value: settings.strength },
//         uFrequency: { value: settings.frequency },
//         uAmplitude: { value: settings.amplitude },
//         uIntensity: { value: settings.intensity },
//       },
//       // wireframe: true,
//     });
//     this.mesh = new THREE.Mesh(geometry, material);
//     this.scene.add(this.mesh);
//   }
  
//   addEvents() {
//     window.addEventListener('resize', this.resize.bind(this));
//   }  
  
//   resize() {
//     let width = window.innerWidth;
//     let height = window.innerHeight;

//     this.camera.aspect = width / height;
//     this.renderer.setSize(width, height);

//     this.camera.updateProjectionMatrix();
//   }
  
//   animate() {
//     requestAnimationFrame(this.animate.bind(this));
//     this.render();
//   }
  
//   render() {
//     this.controls.update();
    
//     // Update uniforms
//     this.mesh.material.uniforms.uTime.value = this.clock.getElapsedTime();
//     this.mesh.material.uniforms.uSpeed.value = settings.speed;    
//     this.mesh.material.uniforms.uNoiseDensity.value = settings.density;
//     this.mesh.material.uniforms.uNoiseStrength.value = settings.strength;
//     this.mesh.material.uniforms.uFrequency.value = settings.frequency;
//     this.mesh.material.uniforms.uAmplitude.value = settings.amplitude;
//     this.mesh.material.uniforms.uIntensity.value = settings.intensity;

//     this.renderer.render(this.scene, this.camera);
//   }  
// }

// new Scene();