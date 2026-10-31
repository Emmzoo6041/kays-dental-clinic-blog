/**
 * Simple looping hero scene: a coin with the tooth emblem rolls around a soft, tilted
 * ring forever. Transparent background so the page colour shows through.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type LoopScene = {
  setDark: (dark: boolean) => void;
  setActive: (active: boolean) => void;
  dispose: () => void;
};

const RING_OUT = 2.2;
const RING_IN = 1.18;
const RING_H = 0.3;
const COIN_R = 0.64;
const COIN_T = 0.14;
const PATH_R = (RING_OUT + RING_IN) / 2;
const LAP_SECONDS = 4.2;
const LEAN = THREE.MathUtils.degToRad(14);

/** Coin face: green disc with a raised white tooth. Also used as the bump map. */
function coinFace() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#2E7D42";
  g.fillRect(0, 0, 512, 512);
  // inner ring
  g.strokeStyle = "rgba(255,255,255,0.55)";
  g.lineWidth = 10;
  g.beginPath(); g.arc(256, 256, 206, 0, Math.PI * 2); g.stroke();
  // tooth
  g.save();
  g.translate(256, 262);
  g.scale(230, 230);
  g.beginPath();
  g.moveTo(-0.42, -0.3);
  g.bezierCurveTo(-0.46, -0.62, -0.08, -0.62, 0, -0.46);
  g.bezierCurveTo(0.08, -0.62, 0.46, -0.62, 0.42, -0.3);
  g.bezierCurveTo(0.4, -0.05, 0.36, 0.1, 0.3, 0.45);
  g.bezierCurveTo(0.27, 0.6, 0.14, 0.58, 0.12, 0.42);
  g.bezierCurveTo(0.09, 0.2, 0.05, 0.12, 0, 0.12);
  g.bezierCurveTo(-0.05, 0.12, -0.09, 0.2, -0.12, 0.42);
  g.bezierCurveTo(-0.14, 0.58, -0.27, 0.6, -0.3, 0.45);
  g.bezierCurveTo(-0.36, 0.1, -0.4, -0.05, -0.42, -0.3);
  g.closePath();
  g.fillStyle = "#f6fbf7";
  g.fill();
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Flat ring with rounded edges, made by spinning a rounded-rectangle profile. */
function ringGeometry() {
  const r = RING_H / 2;
  const pts: THREE.Vector2[] = [];
  const arc = (cx: number, cy: number, a0: number, a1: number) => {
    for (let i = 0; i <= 10; i++) {
      const a = a0 + ((a1 - a0) * i) / 10;
      pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  };
  // inner edge (bottom → top), then outer edge (top → bottom)
  arc(RING_IN + r, r, -Math.PI / 2, -Math.PI * 1.5);
  arc(RING_OUT - r, r, Math.PI / 2, -Math.PI / 2);
  pts.push(pts[0].clone());
  return new THREE.LatheGeometry(pts, 160);
}

export function createLoopScene(canvas: HTMLCanvasElement, opts: { dark?: boolean; still?: boolean } = {}): LoopScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  // ~38° above the ring, so it reads as a soft oval like the reference
  camera.position.set(0, 6.4, 8.1);
  camera.lookAt(0, -0.15, 0);

  // ---- lights ----
  const hemi = new THREE.HemisphereLight("#ffffff", "#cfe3d5", 0.75);
  const key = new THREE.DirectionalLight("#ffffff", 1.6);
  key.position.set(-3, 9, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 8;
  key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 25 });
  scene.add(hemi, key);

  // ---- ring ----
  const ringMat = new THREE.MeshPhysicalMaterial({
    color: "#a9dbb7", roughness: 0.22, metalness: 0.05,
    clearcoat: 1, clearcoatRoughness: 0.15,
    iridescence: 0.25, iridescenceIOR: 1.3,
    sheen: 0.5, sheenColor: new THREE.Color("#eafff0"),
  });
  const ring = new THREE.Mesh(ringGeometry(), ringMat);
  ring.receiveShadow = true;
  ring.castShadow = true;
  scene.add(ring);

  // soft shadow under the ring
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.002;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---- coin ----
  const face = coinFace();
  const faceMat = new THREE.MeshPhysicalMaterial({
    map: face, bumpMap: face, bumpScale: 2.5, roughness: 0.3, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.1,
  });
  const rimMat = new THREE.MeshPhysicalMaterial({ color: "#23663a", roughness: 0.25, metalness: 0.6, clearcoat: 1 });
  const coinMesh = new THREE.Mesh(new THREE.CylinderGeometry(COIN_R, COIN_R, COIN_T, 72, 1), [rimMat, faceMat, faceMat]);
  coinMesh.rotation.z = Math.PI / 2; // cylinder axis → local X (points out from the ring centre)
  coinMesh.castShadow = true;

  // travel (yaw) → lean around the contact point → roll about the coin's own axis
  const travel = new THREE.Group();
  const lean = new THREE.Group();
  const spin = new THREE.Group();
  spin.position.y = COIN_R;
  spin.add(coinMesh);
  lean.add(spin);
  lean.position.y = RING_H;
  travel.add(lean);
  scene.add(travel);
  lean.rotation.z = LEAN;

  function place(seconds: number) {
    const theta = (seconds / LAP_SECONDS) * Math.PI * 2;
    travel.position.set(Math.cos(theta) * PATH_R, 0, Math.sin(theta) * PATH_R);
    travel.rotation.y = -theta;
    spin.rotation.x = (PATH_R * theta) / COIN_R;
    // tiny bob so it feels like it's really rolling
    lean.rotation.z = LEAN + Math.sin(theta * 3) * 0.025;
  }

  function setDark(dark: boolean) {
    ringMat.color.set(dark ? "#7fc293" : "#a9dbb7");
    hemi.intensity = dark ? 0.55 : 0.75;
    hemi.groundColor.set(dark ? "#203327" : "#cfe3d5");
    (ground.material as THREE.ShadowMaterial).opacity = dark ? 0.3 : 0.12;
    if (opts.still) render();
  }
  setDark(!!opts.dark);

  function resize() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole ring in view whatever the box shape
    camera.fov = w / h < 1.15 ? 26 * (1.15 / (w / h)) : 26;
    camera.updateProjectionMatrix();
  }
  const render = () => renderer.render(scene, camera);
  resize();

  let active = true;
  let raf = 0;
  const t0 = performance.now();
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!active) return;
    place((now - t0) / 1000);
    render();
  };
  if (opts.still) { place(LAP_SECONDS * 0.18); render(); } else raf = requestAnimationFrame(loop);

  const ro = new ResizeObserver(() => { resize(); if (opts.still) render(); });
  ro.observe(canvas);

  return {
    setDark,
    setActive(a) { active = a; },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      face.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
