import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js?module';

// 画面サイズ
const width = window.innerWidth;
const height = window.innerHeight;

// シーン（3D空間）
const scene = new THREE.Scene();
scene.background = null;

// カメラ
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(0, 0, 20);

// レンダラー（描画装置）
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0xffffff, 0);
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("world").appendChild(renderer.domElement);

// マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

// ライト
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(10, 10, 10);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

// 中心の装飾付き球体（OZイメージ）
const sphereGeo = new THREE.SphereGeometry(4.6, 64, 64);
const sphereMat = new THREE.MeshPhysicalMaterial({
  color: 0xe7f6ff,
  metalness: 0.22,
  roughness: 0.18,
  transmission: 0.25,
  transparent: true,
  opacity: 0.96,
  emissive: 0xc3e7ff,
  emissiveIntensity: 0.38,
  clearcoat: 0.5,
  clearcoatRoughness: 0.1
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);

const ringMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xd8f0ff,
  emissiveIntensity: 0.35,
  metalness: 0.25,
  roughness: 0.25,
  transparent: true,
  opacity: 0.92
});
const accentMaterial = new THREE.MeshStandardMaterial({
  color: 0xaee2ff,
  emissive: 0x9ddcff,
  emissiveIntensity: 0.28,
  metalness: 0.18,
  roughness: 0.26,
  transparent: true,
  opacity: 0.88
});

const ring1 = new THREE.Mesh(new THREE.TorusGeometry(6.4, 0.22, 16, 120), ringMaterial);
ring1.rotation.x = Math.PI / 2;
const ring2 = new THREE.Mesh(new THREE.TorusGeometry(5.7, 0.18, 16, 120), accentMaterial);
ring2.rotation.y = Math.PI / 2;
ring2.rotation.x = 0.25;
const ring3 = new THREE.Mesh(new THREE.TorusGeometry(5.3, 0.2, 16, 120), ringMaterial);
ring3.rotation.z = Math.PI / 4;
const ring4 = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.14, 16, 120), accentMaterial);
ring4.rotation.x = Math.PI / 2;
ring4.rotation.y = 0.4;

const topDiskMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xf4f8ff,
  emissiveIntensity: 0.3,
  metalness: 0.15,
  roughness: 0.35,
  transparent: true,
  opacity: 0.9
});
const topDisk = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.18, 64), topDiskMaterial);
topDisk.rotation.x = Math.PI / 2;
topDisk.position.set(0, 5.4, 0);

const bottomDisk = new THREE.Mesh(new THREE.CylinderGeometry(7.4, 7.4, 0.16, 64), topDiskMaterial);
bottomDisk.rotation.x = Math.PI / 2;
bottomDisk.position.set(0, -1.5, 0);

const halo = new THREE.Mesh(new THREE.TorusGeometry(8.8, 0.08, 16, 120), ringMaterial);
halo.rotation.x = Math.PI / 2;
halo.position.set(0, -0.4, 0);

const accentOrb = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), new THREE.MeshStandardMaterial({
  color: 0xffeef8,
  emissive: 0xffe8f3,
  emissiveIntensity: 0.4,
  metalness: 0.16,
  roughness: 0.3,
  transparent: true,
  opacity: 0.96
}));
accentOrb.position.set(0, 6.6, 0);

const sphereGroup = new THREE.Group();
sphereGroup.add(sphere, ring1, ring2, ring3, ring4, topDisk, bottomDisk, halo, accentOrb);
scene.add(sphereGroup);

// アニメーション
function animate() {
  requestAnimationFrame(animate);

  sphereGroup.rotation.y += 0.002; // ゆっくり回転

  controls.update();
  renderer.render(scene, camera);
}
animate();

// 画面サイズ変更対応
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
