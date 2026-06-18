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

// iPhone 向けレスポンシブ設定（主要モデルの幅に合わせる）
const responsiveConfig = {
  breakpoints: {
    se: 320,      // iPhone SE (1/2)
    iphone: 375,  // iPhone 6/7/8/12 mini-ish
    pro: 390,     // iPhone 12/13/14
    plus: 428     // iPhone Plus / Max
  },
  settings: {
    se: {
      sphereScale: 0.22,
      cameraZ: 34,
      ringScale: 0.48,
      topDiskScale: 0.5
    },
    iphone: {
      sphereScale: 0.30,
      cameraZ: 30,
      ringScale: 0.56,
      topDiskScale: 0.6
    },
    pro: {
      sphereScale: 0.44,
      cameraZ: 24,
      ringScale: 0.74,
      topDiskScale: 0.78
    },
    plus: {
      sphereScale: 0.66,
      cameraZ: 21,
      ringScale: 0.88,
      topDiskScale: 0.92
    },
    large: {
      sphereScale: 0.95,
      cameraZ: 20,
      ringScale: 1.0,
      topDiskScale: 1.0
    }
  }
};

function updateResponsiveLayout() {
  const w = window.innerWidth;
  let mode = 'large';
  if (w <= responsiveConfig.breakpoints.se) mode = 'se';
  else if (w <= responsiveConfig.breakpoints.iphone) mode = 'iphone';
  else if (w <= responsiveConfig.breakpoints.pro) mode = 'pro';
  else if (w <= responsiveConfig.breakpoints.plus) mode = 'plus';

  const cfg = responsiveConfig.settings[mode];

  // 球体全体のスケール
  sphereGroup.scale.set(cfg.sphereScale, cfg.sphereScale, cfg.sphereScale);

  // カメラ位置の調整
  camera.position.set(0, 0, cfg.cameraZ);
  camera.updateProjectionMatrix();

  // リングのスケールを個別に調整
  [ring1, ring2, ring3, ring4].forEach(r => r.scale.set(cfg.ringScale, cfg.ringScale, cfg.ringScale));

  // トップとアクセントのスケール
  topDisk.scale.set(cfg.topDiskScale, cfg.topDiskScale, cfg.topDiskScale);
  accentOrb.scale.set(cfg.topDiskScale, cfg.topDiskScale, cfg.topDiskScale);
}

// 初期レイアウト適用
updateResponsiveLayout();

// --- Speech bubble DOM overlay ---
const speech = document.createElement('div');
speech.className = 'speech';
document.body.appendChild(speech);

// 日本時間に基づいて吹き出し文を更新
function updateSpeechTextByJapanTime() {
  try {
    const now = new Date();
    const hourStr = new Intl.DateTimeFormat('ja-JP', { hour: 'numeric', hour12: false, timeZone: 'Asia/Tokyo' }).format(now);
    const hour = parseInt(hourStr, 10);
    // デフォルトを夜の挨拶にして、時間帯ごとに上書きする
    let msg = 'こんばんは。OZへようこそ！';
    // 03:00〜10:59 を「おはようございます」にする
    if (hour >= 3 && hour < 11) {
      msg = 'おはようございます。OZへようこそ！';
    } else if (hour >= 11 && hour < 15) {
      // 11:00〜14:59 を「こんにちは」にする
      msg = 'こんにちは。OZへようこそ！';
    }
    speech.textContent = msg;
  } catch (e) {
    speech.textContent = 'こんにちは、OZへようこそ！';
  }
}

// 初期設定と定期更新（1分ごと）
updateSpeechTextByJapanTime();
setInterval(updateSpeechTextByJapanTime, 60 * 1000);

const _vec = new THREE.Vector3();
const _pos = new THREE.Vector3();

function updateSpeechPosition() {
  // ローカルの吹き出し基準位置（球体の上）
  const localY = sphere.geometry.parameters.radius || 4.6;
  _pos.set(0, localY + 0.8, 0); // 少し上にオフセット
  // ローカル座標をワールドに変換
  sphereGroup.localToWorld(_pos);
  // カメラ投影座標へ
  _vec.copy(_pos).project(camera);
  const x = (_vec.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-_vec.y * 0.5 + 0.5) * window.innerHeight;
  // 表示位置を更新
  speech.style.left = `${x}px`;
  speech.style.top = `${y}px`;
}


// アニメーション
function animate() {
  requestAnimationFrame(animate);

  sphereGroup.rotation.y += 0.002; // ゆっくり回転
  controls.update();
  updateSpeechPosition();
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
  // レスポンシブレイアウトを再適用
  updateResponsiveLayout();
  // 吹き出し位置も再計算
  updateSpeechPosition();
});
