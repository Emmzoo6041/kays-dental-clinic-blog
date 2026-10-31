/**
 * "Two balls meet" hero scene — a dentist ball and a patient ball roll along a
 * glowing green track and meet in the middle. Plain three.js, no React, so it can
 * be mounted from any component and tested on its own.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type SmileSceneOptions = {
  dark?: boolean;
  /** Render the final frame only (prefers-reduced-motion). */
  still?: boolean;
  /** Called once the two balls have met. */
  onMeet?: () => void;
  /** Testing: don't start the animation loop; drive it with renderAt(). */
  manual?: boolean;
};

export type SmileScene = {
  setDark: (dark: boolean) => void;
  setActive: (active: boolean) => void;
  /** Render one frame at a given time in seconds (used for testing / stills). */
  renderAt: (seconds: number) => void;
  dispose: () => void;
};

// ---- dimensions (scene units) ----
const BALL_R = 0.78;
const WALL_T = 0.34;          // wall + floor thickness of the channel
const INNER_HALF = BALL_R + 0.08; // half of the inner channel width
const OUTER_HALF = INNER_HALF + WALL_T;
const WALL_H = 0.95;
const BALL_Y = WALL_T + BALL_R;

const ROLL_START = 0.35;  // s — when the balls start rolling
const ROLL_DUR = 3.1;     // s
const CAM_DUR = 6.5;      // s — camera push-in

const PALETTE = {
  light: { floor: "#ECE8DF", pits: "rgba(80,70,55,", ambientSky: "#fff8ec", ambientGround: "#d9d2c3", ambient: 0.26, sun: 8.5 },
  dark:  { floor: "#26332a", pits: "rgba(0,0,0,",     ambientSky: "#9fb8a6", ambientGround: "#0d1a10", ambient: 0.22, sun: 3.2 },
};

// ---------------------------------------------------------------------------
// Procedural textures
// ---------------------------------------------------------------------------

function concreteTexture(base: string, pits: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 1024, 1024);
  // fine grain
  const img = g.getImageData(0, 0, 1024, 1024);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  // soft mottling
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 1024, y = Math.random() * 1024, r = 60 + Math.random() * 160;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, `${pits}0.035)`);
    grd.addColorStop(1, `${pits}0)`);
    g.fillStyle = grd;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // small air-hole pits like poured concrete
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 1024, y = Math.random() * 1024, r = Math.random() * 2.4 + 0.5;
    g.fillStyle = `${pits}${0.12 + Math.random() * 0.22})`;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 2);
  t.anisotropy = 4;
  return t;
}

/** Window-blind light pattern projected by the sun spotlight. */
function blindsTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 512, 512);
  g.filter = "blur(5px)";
  g.fillStyle = "#fff";
  // three wide window panes split by soft mullions
  const panes = [[30, 120], [190, 95], [330, 110]];
  for (const [x, w] of panes) g.fillRect(x, -20, w, 552);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** White ball skin with a green ring and tooth emblem facing +Z. */
function dentistBallTexture() {
  const W = 2048, H = 1024;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fbfaf6";
  g.fillRect(0, 0, W, H);
  // equirect: 1 rad ≈ W / 2π px both ways. +Z sits at u = 0.25.
  const cx = W * 0.25, cy = H * 0.5, rad = W / (2 * Math.PI);
  g.strokeStyle = "#2E7D42";
  g.lineWidth = rad * 0.075;
  g.beginPath(); g.arc(cx, cy, rad * 0.62, 0, Math.PI * 2); g.stroke();

  const s = rad * 0.78;
  g.save();
  g.translate(cx, cy + s * 0.04);
  g.scale(s, s);
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
  g.fillStyle = "#2E7D42";
  g.fill();
  // small gold sparkle
  g.fillStyle = "#E6B800";
  g.beginPath(); g.arc(0.2, -0.3, 0.07, 0, Math.PI * 2); g.fill();
  g.restore();

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Glow along the inside of the channel: warm gold, brightest in the middle. */
function glowTexture() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 16;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 1024, 0);
  grd.addColorStop(0, "#5a3a00");
  grd.addColorStop(0.3, "#ffb52e");
  grd.addColorStop(0.5, "#ffd45c");
  grd.addColorStop(0.7, "#ffb52e");
  grd.addColorStop(1, "#5a3a00");
  g.fillStyle = grd;
  g.fillRect(0, 0, 1024, 16);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

function trackCurve() {
  // A wide "U" lying flat on the floor, opening away from the camera (−Z).
  const pts = [
    [-9.5, -9], [-7.4, -5.6], [-6.1, -1.8], [-5.0, 1.0], [-3.2, 2.35],
    [0, 2.6], [3.2, 2.35], [5.0, 1.0], [6.1, -1.8], [7.4, -5.6], [9.5, -9],
  ].map(([x, z]) => new THREE.Vector3(x, 0, z));
  return new THREE.CatmullRomCurve3(pts, false, "centripetal");
}

/**
 * Sweep a 2D profile segment (side offset, height) → (side offset, height) along the
 * curve, producing a smooth ribbon. Several ribbons make up the U-shaped channel.
 */
function ribbon(curve: THREE.CatmullRomCurve3, a: [number, number], b: [number, number], segs = 360) {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const p = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    const side = new THREE.Vector3().crossVectors(tan, up).normalize();
    for (const [o, h] of [a, b]) {
      pos.push(p.x + side.x * o, h, p.z + side.z * o);
    }
    uv.push(t, 0, t, 1);
  }
  for (let i = 0; i < segs; i++) {
    const k = i * 2;
    idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

function buildTrack(curve: THREE.CatmullRomCurve3) {
  const group = new THREE.Group();
  const wallMat = new THREE.MeshPhysicalMaterial({
    color: "#1c5f31", roughness: 0.28, metalness: 0.0,
    clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.5, sheenColor: new THREE.Color("#8fe0a8"),
    side: THREE.DoubleSide,
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: "#6b4a12", emissive: "#ffffff", emissiveMap: glowTexture(), emissiveIntensity: 0.32,
    roughness: 0.4, side: THREE.DoubleSide,
  });
  const innerWallMat = new THREE.MeshStandardMaterial({
    color: "#24683a", emissive: "#ffb52e", emissiveIntensity: 0.05, roughness: 0.3, side: THREE.DoubleSide,
  });

  const O = OUTER_HALF, I = INNER_HALF, H = WALL_H, T = WALL_T;
  // outer walls, tops, inner walls (both sides), floor
  const parts: [[number, number], [number, number], THREE.Material][] = [
    [[-O, 0], [-O, H], wallMat],
    [[-O, H], [-I, H], wallMat],
    [[-I, H], [-I, T], innerWallMat],
    [[-I, T], [I, T], glowMat],
    [[I, T], [I, H], innerWallMat],
    [[I, H], [O, H], wallMat],
    [[O, H], [O, 0], wallMat],
  ];
  for (const [a, b, m] of parts) {
    const mesh = new THREE.Mesh(ribbon(curve, a, b), m);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  return group;
}

// ---------------------------------------------------------------------------
// Motion helpers
// ---------------------------------------------------------------------------

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Precompute physically-correct rolling orientations along the path, integrating
 * backwards from the end so the ball finishes with its emblem facing `faceDir`.
 */
function rollTable(curve: THREE.CatmullRomCurve3, u0: number, u1: number, faceDir: THREE.Vector3, steps = 500) {
  const L = curve.getLength();
  const up = new THREE.Vector3(0, 1, 0);
  const qs: THREE.Quaternion[] = new Array(steps + 1);
  qs[steps] = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), faceDir.clone().normalize());
  const dir = Math.sign(u1 - u0);
  for (let i = steps - 1; i >= 0; i--) {
    const ua = u0 + ((u1 - u0) * i) / steps;
    const ub = u0 + ((u1 - u0) * (i + 1)) / steps;
    const travel = curve.getTangentAt((ua + ub) / 2).multiplyScalar(dir);
    const axis = new THREE.Vector3().crossVectors(up, travel).normalize();
    const ds = Math.abs(ub - ua) * L;
    const back = new THREE.Quaternion().setFromAxisAngle(axis, -ds / BALL_R);
    qs[i] = back.multiply(qs[i + 1].clone());
  }
  return (k: number) => qs[Math.round(clamp01(k) * steps)];
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

export function createSmileScene(canvas: HTMLCanvasElement, opts: SmileSceneOptions = {}): SmileScene {
  const isSmall = Math.min(window.innerWidth, window.innerHeight) < 640;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.3;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

  // ---- floor ----
  let dark = !!opts.dark;
  const floorMat = new THREE.MeshStandardMaterial({ roughness: 0.96, metalness: 0 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // ---- lights ----
  const hemi = new THREE.HemisphereLight();
  scene.add(hemi);
  const sun = new THREE.SpotLight("#fff1d6", 3.4, 0, 0.42, 0.25, 0);
  sun.position.set(-14, 26, -10);
  sun.target.position.set(1, 0, 1.5);
  sun.map = blindsTexture();
  sun.castShadow = true;
  sun.shadow.mapSize.set(isSmall ? 1024 : 2048, isSmall ? 1024 : 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.radius = 6;
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 60;
  scene.add(sun, sun.target);
  // warm bounce from the glowing channel
  const glow = new THREE.PointLight("#ffbf47", 2.5, 9, 1.6);
  glow.position.set(0, 1.3, 2.6);
  scene.add(glow);

  function applyPalette() {
    const p = dark ? PALETTE.dark : PALETTE.light;
    floorMat.map?.dispose();
    floorMat.map = concreteTexture(p.floor, p.pits);
    floorMat.needsUpdate = true;
    scene.background = new THREE.Color(p.floor);
    hemi.color.set(p.ambientSky);
    hemi.groundColor.set(p.ambientGround);
    hemi.intensity = p.ambient;
    sun.intensity = p.sun;
  }
  applyPalette();

  // ---- track ----
  const curve = trackCurve();
  scene.add(buildTrack(curve));

  // where along the curve the balls meet (they touch at the middle)
  const L = curve.getLength();
  const meetGap = BALL_R / L; // curve-param distance of one radius
  const uDentistEnd = 0.5 - meetGap * 1.02;
  const uPatientEnd = 0.5 + meetGap * 1.02;
  const uDentistStart = 0.01;
  const uPatientStart = 0.99;

  // ---- dentist ball ----
  const dentist = new THREE.Mesh(
    new THREE.SphereGeometry(BALL_R, 96, 64),
    new THREE.MeshPhysicalMaterial({ map: dentistBallTexture(), roughness: 0.38, clearcoat: 0.9, clearcoatRoughness: 0.12 })
  );
  dentist.castShadow = true;
  scene.add(dentist);

  // ---- patient ball: clear glass with a pearl inside ----
  const patient = new THREE.Group();
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(BALL_R, 96, 64),
    new THREE.MeshPhysicalMaterial({
      color: "#ffffff", roughness: 0.02, metalness: 0, transmission: 1, thickness: 0.9, ior: 1.52,
      clearcoat: 1, clearcoatRoughness: 0.03, attenuationColor: new THREE.Color("#e9fff1"), attenuationDistance: 3,
      envMapIntensity: 2.2, specularIntensity: 1,
    })
  );
  glass.castShadow = true;
  const pearl = new THREE.Mesh(
    new THREE.SphereGeometry(BALL_R * 0.4, 64, 48),
    new THREE.MeshPhysicalMaterial({ color: "#dfe6e1", metalness: 0.75, roughness: 0.18, clearcoat: 1, envMapIntensity: 1.6 })
  );
  patient.add(glass, pearl);
  scene.add(patient);

  // ---- camera framing (responsive) ----
  const lookAt = new THREE.Vector3();
  const camFrom = new THREE.Vector3();
  const camTo = new THREE.Vector3();
  let faceDir = new THREE.Vector3(0, 1, 0);
  let dentistRoll: (k: number) => THREE.Quaternion = () => new THREE.Quaternion();

  function frame() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    const aspect = w / h;
    camera.aspect = aspect;
    // Show ~15 units across on wide screens; on phones crop in on the meeting point.
    const span = aspect > 1 ? 12.6 : 6.6;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const dist = span / 2 / Math.tan(hFov / 2);
    // Look slightly "above" the track so it sits in the lower part of the frame, text above.
    lookAt.set(0, 0, aspect > 1 ? 0.0 : -1.1);
    const tilt = THREE.MathUtils.degToRad(aspect > 1 ? 66 : 70); // down from horizontal
    const dir = new THREE.Vector3(0, Math.sin(tilt), Math.cos(tilt));
    camTo.copy(lookAt).addScaledVector(dir, dist);
    camFrom.copy(lookAt).addScaledVector(dir, dist * 1.22).add(new THREE.Vector3(0, 0, 0.6));
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);

    // dentist ball should end with its tooth facing the camera
    const meetPoint = curve.getPointAt(uDentistEnd).setY(BALL_Y);
    faceDir = camTo.clone().sub(meetPoint).normalize();
    dentistRoll = rollTable(curve, uDentistStart, uDentistEnd, faceDir);
  }
  frame();

  // ---- animation ----
  let t0 = performance.now();
  let met = false;
  let active = true;
  let raf = 0;

  function place(time: number) {
    const k = opts.still ? 1 : easeOutQuart(clamp01((time - ROLL_START) / ROLL_DUR));
    const ud = uDentistStart + (uDentistEnd - uDentistStart) * k;
    const up = uPatientStart + (uPatientEnd - uPatientStart) * k;
    dentist.position.copy(curve.getPointAt(ud)).setY(BALL_Y);
    dentist.quaternion.copy(dentistRoll(k));
    patient.position.copy(curve.getPointAt(up)).setY(BALL_Y);
    if (!met && k >= 0.999) { met = true; opts.onMeet?.(); }

    const c = opts.still ? 1 : easeInOutCubic(clamp01(time / CAM_DUR));
    camera.position.lerpVectors(camFrom, camTo, c);
    camera.lookAt(lookAt);

    // slow drift of the window light keeps the scene alive after the intro
    const drift = Math.sin(time * 0.12) * 0.8;
    sun.target.position.set(1 + drift, 0, 1.5 + drift * 0.4);
  }

  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    if (!active) return;
    place((now - t0) / 1000);
    renderer.render(scene, camera);
  }

  if (opts.still) {
    place(99);
    renderer.render(scene, camera);
    opts.onMeet?.();
  } else if (!opts.manual) {
    raf = requestAnimationFrame(loop);
  }

  const ro = new ResizeObserver(() => {
    frame();
    if (opts.still) { place(99); renderer.render(scene, camera); }
  });
  ro.observe(canvas);

  return {
    setDark(d) {
      if (d === dark) return;
      dark = d;
      applyPalette();
      if (opts.still) renderer.render(scene, camera);
    },
    setActive(a) {
      active = a;
    },
    renderAt(seconds) {
      place(seconds);
      renderer.render(scene, camera);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((mm) => {
          Object.values(mm).forEach((v) => { if (v instanceof THREE.Texture) v.dispose(); });
          mm.dispose();
        });
      });
      sun.map?.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

/** True if the browser can render WebGL. */
export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
