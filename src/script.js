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
scene.add(camera);
scene.add(center);

// White directional light at half intensity shining from the top.
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(0, 0, 1);
scene.add(directionalLight1);

var sphere_geometry = new THREE.SphereGeometry(1, 100, 100);
var cover = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true }); // var material = new THREE.MeshNormalMaterial();
var sphere = new THREE.Mesh(sphere_geometry, cover);
center.add(sphere);

// Electron 1
var shape = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const edges = new THREE.EdgesGeometry(shape);
const electron1 = new THREE.LineSegments(
	edges,
	new THREE.LineBasicMaterial({ color: 0xff0000 })
);
center.add(electron1);

// Electron 2
var e2shape = new THREE.IcosahedronGeometry(0.2, 1);
const e2edges = new THREE.EdgesGeometry(e2shape);
const electron2 = new THREE.LineSegments(
	e2edges,
	new THREE.LineBasicMaterial({ color: 0x0000ff })
);
center.add(electron2);

// Electron 3
var e3shape = new THREE.ConeGeometry(0.2, 0.3, 3);
const e3edges = new THREE.EdgesGeometry(e3shape);
const electron3 = new THREE.LineSegments(
	e3edges,
	new THREE.LineBasicMaterial({ color: 0x00ff00 })
);
center.add(electron3);

var clock = new THREE.Clock();

var update = function () {
	var time = performance.now() * 0.001;
	var t = clock.getElapsedTime();
	var t_offset = 1.3 + clock.getElapsedTime();

	electron1.position.x = Math.sin(3 * t) * -0.9;
	electron1.position.y = Math.sin(3 * t) * 1;
	electron1.position.z = Math.cos(3 * t) * 1.5;
	electron1.rotation.x += 0.002;
	electron1.rotation.y += 0.002;
	electron1.rotation.z += 0.002;

	electron2.position.x = Math.cos(3 * t) * 0.7;
	electron2.position.y = Math.cos(3 * t) * 1.2;
	electron2.position.z = Math.sin(3 * t) * 1.5;
	electron2.rotation.x += 0.002;
	electron2.rotation.y += 0.002;
	electron2.rotation.z += 0.002;

	electron3.position.x = Math.sin(3 * t_offset) * 1.4;
	electron3.position.y = Math.sin(3 * t_offset) * 0;
	electron3.position.z = Math.cos(3 * t_offset) * 1.5;
	electron3.rotation.x += 0.002;
	electron3.rotation.y += 0.002;
	electron3.rotation.z += 0.002;

	center.rotation.x += 0.002;
	center.rotation.y += 0.002;

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

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

requestAnimationFrame(animate);
