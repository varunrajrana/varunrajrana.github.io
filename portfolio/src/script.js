import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {noise} from './perlin'

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

var sphere_geometry = new THREE.SphereGeometry(1, 128, 128);
var material = new THREE.MeshNormalMaterial();
material.color = new THREE.Color(0x49ef4);
var sphere = new THREE.Mesh(sphere_geometry, material);
scene.add(sphere);

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 10, 10);

spotLight.castShadow = true;
scene.add(spotLight);

const controls = new OrbitControls(camera, renderer.domElement);

var update = function () {
	var time = performance.now() * 0.001;
	
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
	sphere.rotation.x += 0.01;
	sphere.rotation.y += 0.01;
	
	update();
	renderer.clear();
	renderer.render(scene, camera);

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
