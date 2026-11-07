"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CAMERA_PRESETS,
  CAREER_MAP_PINS,
  CORRIDOR_ROADS,
  DISTRICT_LABELS,
  MANGGAHAN_FLOODWAY_CENTERLINE,
  MARIKINA_RIVER_CENTERLINE,
  PASIG_RIVER_CENTERLINE,
  SKYLINE_MASSINGS,
  SLAB_BOUNDS,
  computeFrameDeltaSeconds,
  getTrajectorySampleIndices,
  isWaterChannelAtSlab,
  projectLatLngToSlab,
  type CareerMapPin,
  type CareerPinBarId,
  type MapPresetId,
} from "../data/metroManilaMapData";

type Theme = "light" | "dark";

export interface CareerMap3DProps {
  activeBarId: string;
  hoveredBarId?: CareerPinBarId | null;
  theme: Theme;
  reduceMotion: boolean;
  onSelectPin: (barId: CareerPinBarId) => void;
  onHoverPin?: (barId: CareerPinBarId | null) => void;
  onUserActivity?: () => void;
}

interface ThemePalette {
  slabTop: number;
  slabSide: number;
  slabPlinth: number;
  slabBorder: number;
  water: number;
  waterBank: number;
  waterRipple: number;
  dotBase: number;
  dotUrban: number;
  roadHighway: number;
  roadArterial: number;
  roadCbd: number;
  buildingFill: number;
  buildingEdge: number;
  heroFill: number;
  heroEdge: number;
  heroActiveFill: number;
  heroActiveEdge: number;
  stem: number;
  stemActive: number;
  arc: number;
  arcDash: number;
  labelText: string;
  ambientIntensity: number;
  keyLightIntensity: number;
  rimLightIntensity: number;
}

const DARK_PALETTE: ThemePalette = {
  slabTop: 0x0c0c0c,
  slabSide: 0x171717,
  slabPlinth: 0x050505,
  slabBorder: 0x3b3b3b,
  water: 0x030303,
  waterBank: 0x363636,
  waterRipple: 0x222222,
  dotBase: 0x2a2a2a,
  dotUrban: 0x5c5c5c,
  roadHighway: 0x727272,
  roadArterial: 0x4a4a4a,
  roadCbd: 0x303030,
  buildingFill: 0x1a1a1a,
  buildingEdge: 0x424242,
  heroFill: 0x4a4a4a,
  heroEdge: 0xb5b5b5,
  heroActiveFill: 0xf5f5f5,
  heroActiveEdge: 0xffffff,
  stem: 0x828282,
  stemActive: 0xffffff,
  arc: 0x686868,
  arcDash: 0xeaeaea,
  labelText: "rgba(255, 255, 255, 0.42)",
  ambientIntensity: 1.35,
  keyLightIntensity: 1.85,
  rimLightIntensity: 0.95,
};

const LIGHT_PALETTE: ThemePalette = {
  slabTop: 0xf5f5f5,
  slabSide: 0xdfdfdf,
  slabPlinth: 0xc8c8c8,
  slabBorder: 0xa6a6a6,
  water: 0xd0d0d0,
  waterBank: 0x9e9e9e,
  waterRipple: 0xbababa,
  dotBase: 0xcacaca,
  dotUrban: 0x888888,
  roadHighway: 0x7a7a7a,
  roadArterial: 0xa2a2a2,
  roadCbd: 0xc2c2c2,
  buildingFill: 0xe6e6e6,
  buildingEdge: 0xaeaeae,
  heroFill: 0x8a8a8a,
  heroEdge: 0x323232,
  heroActiveFill: 0x121212,
  heroActiveEdge: 0x000000,
  stem: 0x626262,
  stemActive: 0x000000,
  arc: 0x767676,
  arcDash: 0x141414,
  labelText: "rgba(0, 0, 0, 0.44)",
  ambientIntensity: 1.75,
  keyLightIntensity: 1.45,
  rimLightIntensity: 0.7,
};

function isInsideRoundedSlab(x: number, z: number, margin = 0.25): boolean {
  const halfW = SLAB_BOUNDS.width * 0.5 - margin;
  const halfD = SLAB_BOUNDS.depth * 0.5 - margin;
  const r = 0.42;
  const qx = Math.abs(x) - (halfW - r);
  const qz = Math.abs(z) - (halfD - r);
  const outX = Math.max(qx, 0);
  const outZ = Math.max(qz, 0);
  return outX * outX + outZ * outZ <= r * r && Math.abs(x) <= halfW && Math.abs(z) <= halfD;
}

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width * 0.5;
  const y = -height * 0.5;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

/**
 * Builds a smooth flat ribbon geometry along a sequence of (lat, lng) points on the slab.
 */
function buildRibbonGeometry(
  pointsLatLng: Array<[number, number]>,
  halfWidth: number,
  yOffset: number,
  archOverWater = false,
): THREE.BufferGeometry {
  const rawPts = pointsLatLng.map(([lat, lng]) => {
    const p = projectLatLngToSlab(lat, lng);
    return new THREE.Vector3(p.x, yOffset, p.z);
  });

  const curve = new THREE.CatmullRomCurve3(rawPts, false, "centripetal", 0.35);
  const divisions = Math.max(24, pointsLatLng.length * 14);
  const sampled = curve.getPoints(divisions);

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  let validCount = 0;
  for (let i = 0; i < sampled.length; i++) {
    const curr = sampled[i];
    if (!isInsideRoundedSlab(curr.x, curr.z, 0.08)) continue;

    const prev = sampled[Math.max(0, i - 1)];
    const next = sampled[Math.min(sampled.length - 1, i + 1)];
    const dirX = next.x - prev.x;
    const dirZ = next.z - prev.z;
    const len = Math.hypot(dirX, dirZ) || 1;
    const nx = -dirZ / len;
    const nz = dirX / len;

    let y = yOffset;
    if (archOverWater && isWaterChannelAtSlab(curr.x, curr.z)) {
      y += 0.045;
    }

    positions.push(curr.x + nx * halfWidth, y, curr.z + nz * halfWidth);
    positions.push(curr.x - nx * halfWidth, y, curr.z - nz * halfWidth);

    const v = i / (sampled.length - 1);
    uvs.push(0, v, 1, v);

    if (validCount > 0) {
      const base = (validCount - 1) * 2;
      // Counter-clockwise winding when viewed from +Y so top faces render cleanly
      indices.push(base, base + 2, base + 1);
      indices.push(base + 1, base + 2, base + 3);
    }
    validCount++;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createTextPlaneTexture(text: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "600 28px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "6px";
    ctx.fillText(text, canvas.width * 0.5, canvas.height * 0.5);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function getCameraFramingForPin(pin: CareerMapPin): {
  position: [number, number, number];
  target: [number, number, number];
} {
  const p = projectLatLngToSlab(pin.lat, pin.lng);
  if (pin.barId === "college") {
    return {
      position: [p.x + 0.85, 4.15, p.z + 4.85],
      target: [p.x - 0.1, 0.65, p.z],
    };
  }
  if (pin.barId === "denso") {
    return {
      position: [p.x + 1.15, 4.45, p.z + 5.05],
      target: [p.x, 0.88, p.z],
    };
  }
  if (pin.barId === "phoenix") {
    return {
      position: [p.x + 1.85, 4.65, p.z + 4.95],
      target: [p.x - 0.12, 0.85, p.z - 0.58],
    };
  }
  // luxasia (Three/NEO)
  return {
    position: [p.x + 1.65, 4.55, p.z + 5.05],
    target: [p.x + 0.06, 0.95, p.z + 0.42],
  };
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}

function ResetViewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function MapPinVectorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

export default function CareerMap3D({
  activeBarId,
  hoveredBarId = null,
  theme,
  reduceMotion,
  onSelectPin,
  onHoverPin,
  onUserActivity,
}: CareerMap3DProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const pinDomRefs = useRef<Record<CareerPinBarId, HTMLButtonElement | null>>({
    college: null,
    denso: null,
    phoenix: null,
    luxasia: null,
  });

  const [webglSupported, setWebglSupported] = useState(true);
  const [activePreset, setActivePreset] = useState<MapPresetId>("corridor");
  const [hoveredPinId, setHoveredPinId] = useState<CareerPinBarId | null>(null);

  const effectiveHoverId = hoveredBarId ?? hoveredPinId;

  const selectedPin = useMemo(
    () => CAREER_MAP_PINS.find((pin) => pin.barId === activeBarId) ?? null,
    [activeBarId],
  );

  const hoveredPin = useMemo(
    () => (effectiveHoverId ? CAREER_MAP_PINS.find((pin) => pin.barId === effectiveHoverId) ?? null : null),
    [effectiveHoverId],
  );

  const onUserActivityRef = useRef(onUserActivity);
  onUserActivityRef.current = onUserActivity;

  const onHoverPinRef = useRef(onHoverPin);
  onHoverPinRef.current = onHoverPin;

  function updateHoverPin(nextId: CareerPinBarId | null) {
    setHoveredPinId((prev) => (prev === nextId ? prev : nextId));
    onHoverPinRef.current?.(nextId);
    if (nextId !== null) {
      onUserActivityRef.current?.();
    }
  }

  const updateHoverPinRef = useRef(updateHoverPin);
  updateHoverPinRef.current = updateHoverPin;

  // Mutable scene controller refs for theme updates, selection updates, and camera tweens
  const sceneCtrlRef = useRef<{
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    tween: {
      active: boolean;
      startPos: THREE.Vector3;
      endPos: THREE.Vector3;
      startTarget: THREE.Vector3;
      endTarget: THREE.Vector3;
      progress: number;
      duration: number;
    };
    applyTheme: (mode: Theme) => void;
    applyActivePin: (pinId: CareerPinBarId | null, hoverId: CareerPinBarId | null) => void;
    requestRender: () => void;
  } | null>(null);

  const reduceMotionRef = useRef(reduceMotion);
  reduceMotionRef.current = reduceMotion;

  function focusPinCamera(barId: CareerPinBarId) {
    const ctrl = sceneCtrlRef.current;
    const matchedPin = CAREER_MAP_PINS.find((p) => p.barId === barId);
    if (!ctrl || !matchedPin) return;
    const framing = getCameraFramingForPin(matchedPin);
    const scaledPos = getAspectScaledPosition(framing.position, framing.target, ctrl.camera.aspect);
    setActivePreset(matchedPin.preset);
    ctrl.tween.startPos.copy(ctrl.camera.position);
    ctrl.tween.startTarget.copy(ctrl.controls.target);
    ctrl.tween.endPos.set(...scaledPos);
    ctrl.tween.endTarget.set(...framing.target);
    ctrl.tween.duration = 0.78;
    ctrl.tween.progress = 0;
    ctrl.tween.active = true;
  }

  function handlePinActivate(barId: CareerPinBarId) {
    onUserActivityRef.current?.();
    focusPinCamera(barId);
    onSelectPin(barId);
  }

  const handlePinActivateRef = useRef(handlePinActivate);
  handlePinActivateRef.current = handlePinActivate;

  // Build Three.js scene once on mount
  useEffect(() => {
    const stageEl = stageRef.current;
    const hostEl = canvasHostRef.current;
    if (!stageEl || !hostEl) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    hostEl.innerHTML = "";
    hostEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const initialPreset = CAMERA_PRESETS.corridor;
    const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 120);
    camera.position.set(...initialPreset.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initialPreset.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    controls.minDistance = 3.4;
    controls.maxDistance = 20.5;
    controls.minPolarAngle = Math.PI * 0.14;
    controls.maxPolarAngle = Math.PI * 0.43;
    controls.rotateSpeed = 0.72;
    controls.zoomSpeed = 0.85;

    const tween = {
      active: false,
      startPos: new THREE.Vector3(),
      endPos: new THREE.Vector3(),
      startTarget: new THREE.Vector3(),
      endTarget: new THREE.Vector3(),
      progress: 1,
      duration: 0.75,
    };

    const cancelTween = () => {
      tween.active = false;
      onUserActivityRef.current?.();
    };
    controls.addEventListener("start", cancelTween);

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, DARK_PALETTE.ambientIntensity);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, DARK_PALETTE.keyLightIntensity);
    keyLight.position.set(8.5, 14.0, 9.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, DARK_PALETTE.rimLightIntensity);
    rimLight.position.set(-10.0, 8.0, -9.0);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Floating Beveled Architectural Maquette Slab
    const slabShape = createRoundedRectShape(SLAB_BOUNDS.width, SLAB_BOUNDS.depth, 0.46);
    const slabGeom = track(
      new THREE.ExtrudeGeometry(slabShape, {
        depth: SLAB_BOUNDS.thickness,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 3,
        curveSegments: 16,
      }),
    );
    slabGeom.rotateX(Math.PI / 2);
    // Shift down by bevelThickness (0.04) so the top deck plane sits cleanly at y = 0.000
    slabGeom.translate(0, -0.04, 0);

    const slabTopMat = track(
      new THREE.MeshStandardMaterial({
        color: DARK_PALETTE.slabTop,
        roughness: 0.92,
        metalness: 0.05,
      }),
    );
    const slabSideMat = track(
      new THREE.MeshStandardMaterial({
        color: DARK_PALETTE.slabSide,
        roughness: 0.78,
        metalness: 0.08,
      }),
    );
    const slabMesh = new THREE.Mesh(slabGeom, [slabTopMat, slabSideMat]);
    rootGroup.add(slabMesh);

    // Lower Plinth Shadow Base + Architectural Outline Frame
    const plinthShape = createRoundedRectShape(SLAB_BOUNDS.width + 0.24, SLAB_BOUNDS.depth + 0.24, 0.54);
    const plinthGeom = track(
      new THREE.ExtrudeGeometry(plinthShape, {
        depth: 0.1,
        bevelEnabled: false,
        curveSegments: 16,
      }),
    );
    plinthGeom.rotateX(Math.PI / 2);
    plinthGeom.translate(0, -SLAB_BOUNDS.thickness - 0.02, 0);
    const plinthMat = track(
      new THREE.MeshStandardMaterial({
        color: DARK_PALETTE.slabPlinth,
        roughness: 0.95,
        metalness: 0.02,
      }),
    );
    const plinthMesh = new THREE.Mesh(plinthGeom, plinthMat);
    rootGroup.add(plinthMesh);

    const borderPts = plinthShape.getPoints(64).map((pt) => new THREE.Vector3(pt.x, 0.006, -pt.y));
    borderPts.push(borderPts[0].clone());
    const slabBorderGeom = track(new THREE.BufferGeometry().setFromPoints(borderPts));
    const slabBorderMat = track(new THREE.LineBasicMaterial({ color: DARK_PALETTE.slabBorder }));
    const slabBorderLine = new THREE.Line(slabBorderGeom, slabBorderMat);
    rootGroup.add(slabBorderLine);

    // 2. Recessed Pasig River, Marikina River & Manggahan Floodway
    const riverBankMat = track(
      new THREE.MeshStandardMaterial({
        color: DARK_PALETTE.waterBank,
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
    );
    const riverWaterMat = track(
      new THREE.MeshStandardMaterial({
        color: DARK_PALETTE.water,
        roughness: 0.2,
        metalness: 0.32,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
    );
    const riverRippleMat = track(
      new THREE.MeshBasicMaterial({
        color: DARK_PALETTE.waterRipple,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -3,
      }),
    );

    const waterways: Array<{ pts: Array<[number, number]>; width: number }> = [
      { pts: PASIG_RIVER_CENTERLINE, width: 0.24 },
      { pts: MARIKINA_RIVER_CENTERLINE, width: 0.17 },
      { pts: MANGGAHAN_FLOODWAY_CENTERLINE, width: 0.18 },
    ];

    for (const waterway of waterways) {
      const bankGeom = track(buildRibbonGeometry(waterway.pts, waterway.width + 0.045, 0.004));
      const waterGeom = track(buildRibbonGeometry(waterway.pts, waterway.width, 0.008));
      const rippleGeom = track(buildRibbonGeometry(waterway.pts, waterway.width * 0.16, 0.011));
      rootGroup.add(new THREE.Mesh(bankGeom, riverBankMat));
      rootGroup.add(new THREE.Mesh(waterGeom, riverWaterMat));
      rootGroup.add(new THREE.Mesh(rippleGeom, riverRippleMat));
    }

    // 3. Modern "Dot-Dot" Metro Manila Terrain Matrix (InstancedMesh)
    const dotPositions: Array<{ x: number; z: number; urbanWeight: number }> = [];
    const pinSlabCoords = CAREER_MAP_PINS.map((p) => projectLatLngToSlab(p.lat, p.lng));
    const step = 0.2;
    for (let x = -SLAB_BOUNDS.width * 0.5 + 0.34; x <= SLAB_BOUNDS.width * 0.5 - 0.34; x += step) {
      for (let z = -SLAB_BOUNDS.depth * 0.5 + 0.34; z <= SLAB_BOUNDS.depth * 0.5 - 0.34; z += step) {
        if (!isInsideRoundedSlab(x, z, 0.3)) continue;
        if (isWaterChannelAtSlab(x, z)) continue;

        let minPinDist = Infinity;
        for (const pc of pinSlabCoords) {
          const d = Math.hypot(x - pc.x, z - pc.z);
          if (d < minPinDist) minPinDist = d;
        }
        const urbanWeight = Math.max(0, Math.min(1, 1 - minPinDist / 3.2));
        dotPositions.push({ x, z, urbanWeight });
      }
    }

    const dotGeom = track(new THREE.CylinderGeometry(0.024, 0.024, 0.012, 8));
    const dotMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
    );
    const dotInstanced = new THREE.InstancedMesh(dotGeom, dotMat, dotPositions.length);
    const dummyMatrix = new THREE.Matrix4();
    const dummyScale = new THREE.Vector3();
    const dummyPos = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();

    dotPositions.forEach((d, idx) => {
      const s = 0.85 + d.urbanWeight * 0.52;
      dummyPos.set(d.x, 0.008, d.z);
      dummyScale.set(s, 1, s);
      dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
      dotInstanced.setMatrixAt(idx, dummyMatrix);
    });
    dotInstanced.instanceMatrix.needsUpdate = true;
    rootGroup.add(dotInstanced);

    const updateDotColors = (palette: ThemePalette) => {
      const baseCol = new THREE.Color(palette.dotBase);
      const urbanCol = new THREE.Color(palette.dotUrban);
      const tempCol = new THREE.Color();
      dotPositions.forEach((d, idx) => {
        tempCol.copy(baseCol).lerp(urbanCol, d.urbanWeight * 0.85);
        dotInstanced.setColorAt(idx, tempCol);
      });
      if (dotInstanced.instanceColor) {
        dotInstanced.instanceColor.needsUpdate = true;
      }
    };
    updateDotColors(DARK_PALETTE);

    // 4. Metro Manila Road Network & Bridges
    const roadHighwayMat = track(
      new THREE.MeshBasicMaterial({
        color: DARK_PALETTE.roadHighway,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -4,
      }),
    );
    const roadArterialMat = track(
      new THREE.MeshBasicMaterial({
        color: DARK_PALETTE.roadArterial,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -4,
      }),
    );
    const roadCbdMat = track(
      new THREE.MeshBasicMaterial({
        color: DARK_PALETTE.roadCbd,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -4,
      }),
    );

    for (const seg of CORRIDOR_ROADS) {
      const halfWidth =
        seg.tier === "highway"
          ? 0.052
          : seg.tier === "bridge"
            ? 0.046
            : seg.tier === "arterial"
              ? 0.032
              : 0.02;
      const yOff = seg.tier === "highway" || seg.tier === "bridge" ? 0.016 : 0.014;
      const geom = track(
        buildRibbonGeometry(
          seg.points,
          halfWidth,
          yOff,
          seg.tier === "highway" || seg.tier === "bridge" || seg.tier === "arterial",
        ),
      );
      const mat =
        seg.tier === "highway" || seg.tier === "bridge"
          ? roadHighwayMat
          : seg.tier === "arterial"
            ? roadArterialMat
            : roadCbdMat;
      rootGroup.add(new THREE.Mesh(geom, mat));
    }

    // 5. Surrounding Urban Skyline Massings (BGC, Ortigas, Mandaluyong, Makati, Pasig)
    const buildingFillMat = track(
      new THREE.MeshStandardMaterial({
        color: DARK_PALETTE.buildingFill,
        roughness: 0.72,
        metalness: 0.1,
      }),
    );
    const buildingEdgeMat = track(
      new THREE.LineBasicMaterial({
        color: DARK_PALETTE.buildingEdge,
        transparent: true,
        opacity: 0.75,
      }),
    );

    const skylineGroup = new THREE.Group();
    rootGroup.add(skylineGroup);

    const unitBox = track(new THREE.BoxGeometry(1, 1, 1));
    for (const b of SKYLINE_MASSINGS) {
      const p = projectLatLngToSlab(b.lat, b.lng);
      if (!isInsideRoundedSlab(p.x, p.z, 0.35)) continue;

      const mesh = new THREE.Mesh(unitBox, buildingFillMat);
      mesh.scale.set(b.width, b.height, b.depth);
      mesh.position.set(p.x, b.height * 0.5 + 0.012, p.z);
      mesh.rotation.y = b.rotationY ?? (b.district === "bgc" ? 0.08 : -0.05);
      skylineGroup.add(mesh);

      const boxForEdges = track(new THREE.BoxGeometry(b.width, b.height, b.depth));
      const edgesGeom = track(new THREE.EdgesGeometry(boxForEdges));
      const edges = new THREE.LineSegments(edgesGeom, buildingEdgeMat);
      edges.position.copy(mesh.position);
      edges.rotation.copy(mesh.rotation);
      skylineGroup.add(edges);
    }

    // 6. Hero Career Buildings + Stems + Hitboxes + Selection Halos
    interface HeroNode {
      pin: CareerMapPin;
      meshes: THREE.Mesh[];
      edges: THREE.LineSegments[];
      fillMat: THREE.MeshStandardMaterial;
      edgeMat: THREE.LineBasicMaterial;
      stemMat: THREE.LineBasicMaterial;
      haloMesh: THREE.Mesh;
      haloMat: THREE.MeshBasicMaterial;
      anchorWorld: THREE.Vector3;
      roofWorld: THREE.Vector3;
      hitbox: THREE.Mesh;
    }

    const heroNodes: Record<CareerPinBarId, HeroNode> = {} as Record<CareerPinBarId, HeroNode>;
    const hitboxes: THREE.Mesh[] = [];
    const hitboxMat = track(new THREE.MeshBasicMaterial({ visible: false }));
    const haloRingGeom = track(new THREE.RingGeometry(0.24, 0.32, 36));
    haloRingGeom.rotateX(-Math.PI / 2);

    for (const pin of CAREER_MAP_PINS) {
      const p = projectLatLngToSlab(pin.lat, pin.lng);
      const fillMat = track(
        new THREE.MeshStandardMaterial({
          color: DARK_PALETTE.heroFill,
          roughness: 0.42,
          metalness: 0.18,
        }),
      );
      const edgeMat = track(new THREE.LineBasicMaterial({ color: DARK_PALETTE.heroEdge }));
      const stemMat = track(new THREE.LineBasicMaterial({ color: DARK_PALETTE.stem }));
      const haloMat = track(
        new THREE.MeshBasicMaterial({
          color: DARK_PALETTE.heroActiveEdge,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
        }),
      );

      const meshes: THREE.Mesh[] = [];
      const edges: THREE.LineSegments[] = [];
      const [fw, fd] = pin.towerFootprint;
      const h = pin.towerHeight;

      const addBlock = (w: number, bh: number, d: number, ox: number, oy: number, oz: number) => {
        const bg = track(new THREE.BoxGeometry(w, bh, d));
        const m = new THREE.Mesh(bg, fillMat);
        m.position.set(p.x + ox, oy + bh * 0.5 + 0.015, p.z + oz);
        rootGroup.add(m);
        meshes.push(m);

        const eg = track(new THREE.EdgesGeometry(bg));
        const el = new THREE.LineSegments(eg, edgeMat);
        el.position.copy(m.position);
        rootGroup.add(el);
        edges.push(el);
      };

      if (pin.barId === "college") {
        // RTU Pasig Campus: Stepped academic complex with courtyard wings
        addBlock(fw * 1.15, h * 0.36, fd * 1.15, 0, 0, 0);
        addBlock(fw * 0.82, h * 0.64, fd * 0.46, 0, h * 0.36, -fd * 0.24);
        addBlock(fw * 0.32, h * 0.48, fd * 0.52, -fw * 0.26, h * 0.36, fd * 0.18);
        addBlock(fw * 0.32, h * 0.48, fd * 0.52, fw * 0.26, h * 0.36, fd * 0.18);
      } else {
        // High-rise CBD architecture: podium + main shaft + crown setback
        addBlock(fw * 1.24, h * 0.16, fd * 1.24, 0, 0, 0);
        addBlock(fw, h * 0.72, fd, 0, h * 0.16, 0);
        addBlock(fw * 0.72, h * 0.12, fd * 0.72, 0, h * 0.88, 0);
      }

      const roofWorld = new THREE.Vector3(p.x, h + 0.04, p.z);
      const elbowWorld = new THREE.Vector3(
        p.x + pin.stemOffset[0] * 0.55,
        h + pin.stemExtraHeight * 0.62,
        p.z + pin.stemOffset[1] * 0.55,
      );
      const anchorWorld = new THREE.Vector3(
        p.x + pin.stemOffset[0],
        h + pin.stemExtraHeight,
        p.z + pin.stemOffset[1],
      );

      const stemGeom = track(new THREE.BufferGeometry().setFromPoints([roofWorld, elbowWorld, anchorWorld]));
      const stemLine = new THREE.Line(stemGeom, stemMat);
      rootGroup.add(stemLine);

      const haloMesh = new THREE.Mesh(haloRingGeom, haloMat);
      haloMesh.position.set(p.x, 0.022, p.z);
      rootGroup.add(haloMesh);

      const hbGeom = track(new THREE.BoxGeometry(Math.max(0.45, fw * 2.1), h + 0.5, Math.max(0.45, fd * 2.1)));
      const hitbox = new THREE.Mesh(hbGeom, hitboxMat);
      hitbox.position.set(p.x, h * 0.5 + 0.2, p.z);
      hitbox.userData.barId = pin.barId;
      rootGroup.add(hitbox);
      hitboxes.push(hitbox);

      heroNodes[pin.barId] = {
        pin,
        meshes,
        edges,
        fillMat,
        edgeMat,
        stemMat,
        haloMesh,
        haloMat,
        anchorWorld,
        roofWorld,
        hitbox,
      };
    }

    // 7. 3D Career Trajectory Arcs (01 RTU -> 02 Hanston -> 03 Udenna -> 04 Three/NEO)
    const arcPointsAll: THREE.Vector3[] = [];
    for (let i = 0; i < CAREER_MAP_PINS.length - 1; i++) {
      const fromNode = heroNodes[CAREER_MAP_PINS[i].barId];
      const toNode = heroNodes[CAREER_MAP_PINS[i + 1].barId];
      const dist = fromNode.roofWorld.distanceTo(toNode.roofWorld);
      const mid = fromNode.roofWorld.clone().lerp(toNode.roofWorld, 0.5);
      mid.y = Math.max(fromNode.roofWorld.y, toNode.roofWorld.y) + Math.min(1.65, 0.45 + dist * 0.16);

      const segCurve = new THREE.QuadraticBezierCurve3(fromNode.roofWorld, mid, toNode.roofWorld);
      const pts = segCurve.getPoints(36);
      if (i > 0) pts.shift();
      arcPointsAll.push(...pts);
    }

    const arcGeom = track(new THREE.BufferGeometry().setFromPoints(arcPointsAll));
    const arcDashMat = track(
      new THREE.LineDashedMaterial({
        color: DARK_PALETTE.arcDash,
        dashSize: 0.18,
        gapSize: 0.11,
        transparent: true,
        opacity: 0.9,
      }),
    );
    const arcLine = new THREE.Line(arcGeom, arcDashMat);
    arcLine.computeLineDistances();
    rootGroup.add(arcLine);

    const pulseSphereGeom = track(new THREE.SphereGeometry(0.044, 12, 12));
    const pulseSphereMat = track(new THREE.MeshBasicMaterial({ color: DARK_PALETTE.heroActiveEdge }));
    const pulseSphere = new THREE.Mesh(pulseSphereGeom, pulseSphereMat);
    rootGroup.add(pulseSphere);

    // 8. Engraved Surface District Labels
    const labelMeshes: Array<{ mesh: THREE.Mesh; text: string; mat: THREE.MeshBasicMaterial; tex: THREE.CanvasTexture }> = [];
    const labelPlaneGeom = track(new THREE.PlaneGeometry(2.55, 0.48));
    labelPlaneGeom.rotateX(-Math.PI / 2);

    for (const dl of DISTRICT_LABELS) {
      const p = projectLatLngToSlab(dl.lat, dl.lng);
      const tex = track(createTextPlaneTexture(dl.text, DARK_PALETTE.labelText));
      const mat = track(
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          depthWrite: false,
        }),
      );
      const mesh = new THREE.Mesh(labelPlaneGeom, mat);
      mesh.position.set(p.x, 0.02, p.z);
      rootGroup.add(mesh);
      labelMeshes.push({ mesh, text: dl.text, mat, tex });
    }

    // Theme updater
    let currentPinId: CareerPinBarId | null = null;
    let currentHoverId: CareerPinBarId | null = null;
    let currentTheme: Theme = "dark";

    const syncHeroMaterials = () => {
      const palette = currentTheme === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
      for (const pin of CAREER_MAP_PINS) {
        const node = heroNodes[pin.barId];
        const isHovered = pin.barId === currentHoverId;
        const isActive =
          currentHoverId !== null
            ? isHovered
            : pin.barId === currentPinId || (currentPinId === null && pin.status === "current");

        node.fillMat.color.setHex(isActive ? palette.heroActiveFill : palette.heroFill);
        node.edgeMat.color.setHex(isActive ? palette.heroActiveEdge : palette.heroEdge);
        node.stemMat.color.setHex(isActive ? palette.stemActive : palette.stem);
        node.haloMat.color.setHex(palette.heroActiveEdge);
        node.haloMesh.visible = isActive || pin.barId === currentPinId || pin.status === "current";
        node.haloMat.opacity = isActive ? 0.94 : 0.3;
      }
    };

    const applyTheme = (mode: Theme) => {
      currentTheme = mode;
      const palette = mode === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
      slabTopMat.color.setHex(palette.slabTop);
      slabSideMat.color.setHex(palette.slabSide);
      plinthMat.color.setHex(palette.slabPlinth);
      slabBorderMat.color.setHex(palette.slabBorder);
      riverBankMat.color.setHex(palette.waterBank);
      riverWaterMat.color.setHex(palette.water);
      riverRippleMat.color.setHex(palette.waterRipple);
      roadHighwayMat.color.setHex(palette.roadHighway);
      roadArterialMat.color.setHex(palette.roadArterial);
      roadCbdMat.color.setHex(palette.roadCbd);
      buildingFillMat.color.setHex(palette.buildingFill);
      buildingEdgeMat.color.setHex(palette.buildingEdge);
      arcDashMat.color.setHex(palette.arcDash);
      pulseSphereMat.color.setHex(palette.heroActiveEdge);

      ambientLight.intensity = palette.ambientIntensity;
      keyLight.intensity = palette.keyLightIntensity;
      rimLight.intensity = palette.rimLightIntensity;

      updateDotColors(palette);

      for (const item of labelMeshes) {
        const nextTex = createTextPlaneTexture(item.text, palette.labelText);
        item.mat.map?.dispose();
        item.mat.map = nextTex;
        item.mat.needsUpdate = true;
      }

      syncHeroMaterials();
    };

    const applyActivePin = (pinId: CareerPinBarId | null, hoverId: CareerPinBarId | null) => {
      currentPinId = pinId;
      currentHoverId = hoverId;
      syncHeroMaterials();
    };

    // Raycasting for pointer hover & click on 3D towers
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const getHitPinId = (clientX: number, clientY: number): CareerPinBarId | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitboxes, false);
      if (hits.length > 0) {
        return (hits[0].object.userData.barId as CareerPinBarId) ?? null;
      }
      return null;
    };

    const handlePointerDown = (ev: PointerEvent) => {
      pointerDownPos = { x: ev.clientX, y: ev.clientY };
      onUserActivityRef.current?.();
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (ev.pointerType === "touch") return;
      const hitId = getHitPinId(ev.clientX, ev.clientY);
      renderer.domElement.style.cursor = hitId ? "pointer" : "grab";
      updateHoverPinRef.current(hitId);
    };

    const handlePointerLeave = () => {
      renderer.domElement.style.cursor = "grab";
      updateHoverPinRef.current(null);
    };

    const handlePointerUp = (ev: PointerEvent) => {
      const moved = Math.hypot(ev.clientX - pointerDownPos.x, ev.clientY - pointerDownPos.y);
      if (moved > 6) return;
      const hitId = getHitPinId(ev.clientX, ev.clientY);
      if (hitId) {
        handlePinActivateRef.current(hitId);
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);

    // Resize & visibility management
    let stageWidth = 1;
    let stageHeight = 1;
    const handleResize = () => {
      const rect = stageEl.getBoundingClientRect();
      stageWidth = Math.max(1, rect.width);
      stageHeight = Math.max(1, rect.height);
      camera.aspect = stageWidth / stageHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(stageWidth, stageHeight, false);
    };
    handleResize();
    const initScaled = getAspectScaledPosition(
      initialPreset.position,
      initialPreset.target,
      camera.aspect,
      true,
    );
    camera.position.set(...initScaled);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(stageEl);

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(stageEl);

    // Animation loop + projected HTML pin coordinates
    const projVec = new THREE.Vector3();
    let rafId = 0;
    let prevTime: number | null = null;
    let elapsed = 0;

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      const dt = computeFrameDeltaSeconds(now, prevTime);
      prevTime = now;

      if (!isVisible) return;

      if (tween.active) {
        if (reduceMotionRef.current) {
          tween.progress = 1;
        } else {
          tween.progress = Math.min(1, tween.progress + dt / tween.duration);
        }
        // Smooth cubic ease-out
        const ease = 1 - Math.pow(1 - tween.progress, 3);
        camera.position.lerpVectors(tween.startPos, tween.endPos, ease);
        controls.target.lerpVectors(tween.startTarget, tween.endTarget, ease);
        if (tween.progress >= 1) {
          tween.active = false;
        }
      }

      controls.update();

      if (!reduceMotionRef.current && arcPointsAll.length >= 2) {
        elapsed += dt;
        const { index, nextIndex, alpha } = getTrajectorySampleIndices(
          elapsed * 0.16,
          arcPointsAll.length,
        );
        pulseSphere.position.lerpVectors(arcPointsAll[index], arcPointsAll[nextIndex], alpha);
        pulseSphere.visible = true;

        const currentHero = heroNodes.luxasia;
        const pulseScale = 1 + Math.sin(elapsed * 3.1) * 0.12;
        currentHero.haloMesh.scale.set(pulseScale, 1, pulseScale);
      } else {
        pulseSphere.visible = false;
        heroNodes.luxasia.haloMesh.scale.set(1, 1, 1);
      }

      renderer.render(scene, camera);

      // Project 3D anchor points onto crisp DOM pin buttons
      for (const pin of CAREER_MAP_PINS) {
        const btn = pinDomRefs.current[pin.barId];
        if (!btn) continue;
        const node = heroNodes[pin.barId];
        projVec.copy(node.anchorWorld).project(camera);

        const inFront = projVec.z >= -1 && projVec.z <= 1;
        const px = (projVec.x * 0.5 + 0.5) * stageWidth;
        const py = (-projVec.y * 0.5 + 0.5) * stageHeight;
        const withinPad = px > -24 && px < stageWidth + 24 && py > -24 && py < stageHeight + 24;

        if (inFront && withinPad) {
          const padX = Math.min(58, stageWidth * 0.16);
          const clampedX = Math.max(padX, Math.min(stageWidth - padX, px));
          const clampedY = Math.max(36, Math.min(stageHeight - 14, py));
          btn.style.opacity = "1";
          btn.style.pointerEvents = "auto";
          btn.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -100%)`;
        } else {
          btn.style.opacity = "0";
          btn.style.pointerEvents = "none";
        }
      }
    };

    rafId = window.requestAnimationFrame(tick);

    sceneCtrlRef.current = {
      camera,
      controls,
      tween,
      applyTheme,
      applyActivePin,
      requestRender: () => renderer.render(scene, camera),
    };

    return () => {
      window.cancelAnimationFrame(rafId);
      controls.removeEventListener("start", cancelTween);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      controls.dispose();
      for (const item of labelMeshes) {
        item.mat.map?.dispose();
      }
      for (const d of disposables) {
        d.dispose();
      }
      renderer.dispose();
      sceneCtrlRef.current = null;
    };
  }, []);

  // Sync theme changes dynamically
  useEffect(() => {
    sceneCtrlRef.current?.applyTheme(theme);
  }, [theme]);

  // Sync active/hovered pin material states dynamically
  useEffect(() => {
    sceneCtrlRef.current?.applyActivePin(selectedPin?.barId ?? null, effectiveHoverId);
  }, [selectedPin, effectiveHoverId]);

  function getAspectScaledPosition(
    pos: [number, number, number],
    target: [number, number, number],
    aspect: number,
    isCorridor = false,
  ): [number, number, number] {
    const scale = isCorridor
      ? Math.max(1, Math.min(1.92, 1.48 / Math.max(0.55, aspect)))
      : Math.max(1, Math.min(1.36, 1.18 / Math.max(0.6, aspect)));
    return [
      target[0] + (pos[0] - target[0]) * scale,
      target[1] + (pos[1] - target[1]) * scale,
      target[2] + (pos[2] - target[2]) * scale,
    ];
  }

  const prevBarIdRef = useRef(activeBarId);

  // Sync camera fly-to when activeBarId changes from Career Graph / Story / Pin click
  useEffect(() => {
    if (prevBarIdRef.current === activeBarId) return;
    prevBarIdRef.current = activeBarId;

    const ctrl = sceneCtrlRef.current;
    if (!ctrl) return;

    const matchedPin = CAREER_MAP_PINS.find((p) => p.barId === activeBarId);
    if (matchedPin) {
      const framing = getCameraFramingForPin(matchedPin);
      const scaledPos = getAspectScaledPosition(framing.position, framing.target, ctrl.camera.aspect);
      setActivePreset(matchedPin.preset);
      ctrl.tween.startPos.copy(ctrl.camera.position);
      ctrl.tween.startTarget.copy(ctrl.controls.target);
      ctrl.tween.endPos.set(...scaledPos);
      ctrl.tween.endTarget.set(...framing.target);
      ctrl.tween.duration = 0.78;
      ctrl.tween.progress = 0;
      ctrl.tween.active = true;
    } else {
      // e.g. "full-time-target" -> pull back to Full Corridor overview
      const corridor = CAMERA_PRESETS.corridor;
      const scaledPos = getAspectScaledPosition(corridor.position, corridor.target, ctrl.camera.aspect, true);
      setActivePreset("corridor");
      ctrl.tween.startPos.copy(ctrl.camera.position);
      ctrl.tween.startTarget.copy(ctrl.controls.target);
      ctrl.tween.endPos.set(...scaledPos);
      ctrl.tween.endTarget.set(...corridor.target);
      ctrl.tween.duration = 0.78;
      ctrl.tween.progress = 0;
      ctrl.tween.active = true;
    }
  }, [activeBarId]);

  function flyToPreset(presetId: MapPresetId) {
    onUserActivityRef.current?.();
    setActivePreset(presetId);
    const ctrl = sceneCtrlRef.current;
    if (!ctrl) return;
    const preset = CAMERA_PRESETS[presetId];
    const scaledPos = getAspectScaledPosition(
      preset.position,
      preset.target,
      ctrl.camera.aspect,
      presetId === "corridor",
    );
    ctrl.tween.startPos.copy(ctrl.camera.position);
    ctrl.tween.startTarget.copy(ctrl.controls.target);
    ctrl.tween.endPos.set(...scaledPos);
    ctrl.tween.endTarget.set(...preset.target);
    ctrl.tween.duration = 0.78;
    ctrl.tween.progress = 0;
    ctrl.tween.active = true;
  }

  function stepZoom(factor: number) {
    onUserActivityRef.current?.();
    const ctrl = sceneCtrlRef.current;
    if (!ctrl) return;
    const offset = ctrl.camera.position.clone().sub(ctrl.controls.target);
    const currentDist = offset.length();
    const nextDist = Math.max(3.4, Math.min(20.5, currentDist * factor));
    offset.setLength(nextDist);

    ctrl.tween.startPos.copy(ctrl.camera.position);
    ctrl.tween.startTarget.copy(ctrl.controls.target);
    ctrl.tween.endPos.copy(ctrl.controls.target).add(offset);
    ctrl.tween.endTarget.copy(ctrl.controls.target);
    ctrl.tween.progress = 0;
    ctrl.tween.duration = 0.35;
    ctrl.tween.active = true;
  }

  return (
    <div className="career-map-embed" role="region" aria-label="Interactive 3D Metro Manila career corridor map">
      {/* Emphasized Career Milestone Bar: Hover to preview experience, Click to fly 3D camera */}
      <div className="career-map__milestones" role="group" aria-label="Career milestone locations">
        <button
          type="button"
          className={`career-map__milestone-btn career-map__milestone-btn--all ${activePreset === "corridor" ? "is-active" : ""}`}
          aria-pressed={activePreset === "corridor"}
          onClick={() => flyToPreset("corridor")}
        >
          <span>ALL CORRIDOR</span>
        </button>

        {CAREER_MAP_PINS.map((pin) => {
          const isSelected = selectedPin?.barId === pin.barId && activePreset !== "corridor";
          const isPinned = selectedPin?.barId === pin.barId;
          const isHovered = effectiveHoverId === pin.barId;
          const isCurrent = pin.status === "current";
          return (
            <button
              key={pin.barId}
              type="button"
              className={`career-map__milestone-btn ${isSelected ? "is-active" : ""} ${isPinned ? "is-pinned" : ""} ${isHovered ? "is-hovered" : ""} ${isCurrent ? "is-current" : ""}`}
              aria-pressed={isPinned}
              onMouseEnter={() => updateHoverPin(pin.barId)}
              onMouseLeave={() => updateHoverPin(null)}
              onFocus={() => updateHoverPin(pin.barId)}
              onBlur={() => updateHoverPin(null)}
              onClick={() => handlePinActivate(pin.barId)}
            >
              <span className="career-map__milestone-idx">{pin.indexLabel}</span>
              <strong className="career-map__milestone-name">{pin.pillLabel}</strong>
              {isCurrent ? <span className="career-map__pin-live" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      <div className="career-map__body">
        <div ref={stageRef} className="career-map__stage">
          {webglSupported ? (
            <>
              <div ref={canvasHostRef} className="career-map__canvas-host" />

              {/* Projected 3D Pin Anchor Buttons */}
              <div className="career-map__pins-layer" role="tablist" aria-label="Career location pins">
                {CAREER_MAP_PINS.map((pin) => {
                  const isSelected = selectedPin?.barId === pin.barId;
                  const isHovered = effectiveHoverId === pin.barId;
                  const isCurrent = pin.status === "current";
                  return (
                    <button
                      key={pin.barId}
                      ref={(el) => {
                        pinDomRefs.current[pin.barId] = el;
                      }}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-label={`${pin.indexLabel} ${pin.shortLabel}: ${pin.building}, ${pin.district}`}
                      className={`career-map__pin ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""} ${isCurrent ? "is-current" : ""}`}
                      onMouseEnter={() => updateHoverPin(pin.barId)}
                      onMouseLeave={() => updateHoverPin(null)}
                      onFocus={() => updateHoverPin(pin.barId)}
                      onBlur={() => updateHoverPin(null)}
                      onClick={() => handlePinActivate(pin.barId)}
                    >
                      <span className="career-map__pin-index">{pin.indexLabel}</span>
                      <span className="career-map__pin-label">{pin.pillLabel}</span>
                      {isCurrent ? <span className="career-map__pin-live" aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>

              {/* Minimal Camera Controls (Zoom + Reset) */}
              <div className="career-map__controls" role="group" aria-label="3D camera controls">
                <button
                  type="button"
                  className="career-map__ctrl-btn"
                  aria-label="Zoom in 3D map"
                  title="Zoom in"
                  onClick={() => stepZoom(0.76)}
                >
                  <PlusIcon />
                </button>
                <button
                  type="button"
                  className="career-map__ctrl-btn"
                  aria-label="Zoom out 3D map"
                  title="Zoom out"
                  onClick={() => stepZoom(1.28)}
                >
                  <MinusIcon />
                </button>
                <button
                  type="button"
                  className="career-map__ctrl-btn"
                  aria-label="Reset 3D map view"
                  title="Reset view"
                  onClick={() => flyToPreset("corridor")}
                >
                  <ResetViewIcon />
                </button>
              </div>
            </>
          ) : (
            /* Graceful Monochrome Dot-Map Fallback if WebGL is unavailable */
            <div className="career-map__fallback">
              <p className="small-label">METRO MANILA CAREER CORRIDOR</p>
              <div className="career-map__fallback-pins">
                {CAREER_MAP_PINS.map((pin) => {
                  const isSelected = selectedPin?.barId === pin.barId;
                  return (
                    <button
                      key={pin.barId}
                      type="button"
                      className={`career-map__milestone-btn ${isSelected ? "is-active" : ""}`}
                      onMouseEnter={() => updateHoverPin(pin.barId)}
                      onMouseLeave={() => updateHoverPin(null)}
                      onClick={() => handlePinActivate(pin.barId)}
                    >
                      <span className="career-map__milestone-idx">{pin.indexLabel}</span>
                      <strong className="career-map__milestone-name">
                        {pin.building} ({pin.district})
                      </strong>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rich Hover Experience Card OR Minimal Active Location Card */}
        {hoveredPin ? (
          <div className="career-map__exp-popover" role="status" aria-live="polite">
            <div className="career-map__exp-top">
              <span className="career-map__hud-badge">
                <MapPinVectorIcon />
                <span>
                  STAGE {hoveredPin.indexLabel} · {hoveredPin.period}
                </span>
              </span>
              <span className="career-map__hud-district">{hoveredPin.district}</span>
            </div>

            <div className="career-map__exp-heading">
              <strong className="career-map__exp-role">{hoveredPin.role}</strong>
              <span className="career-map__exp-org">
                {hoveredPin.organization} — {hoveredPin.building}
              </span>
            </div>

            <div className="career-map__exp-metric">{hoveredPin.metricBadge}</div>

            <p className="career-map__exp-summary">{hoveredPin.experienceSummary}</p>

            <div className="career-map__exp-footer">
              <div className="career-map__exp-tools">
                {hoveredPin.tools.slice(0, 4).map((tool) => (
                  <span key={tool} className="career-map__exp-chip">
                    {tool}
                  </span>
                ))}
              </div>
              <span className="career-map__exp-cta">Click to zoom 3D</span>
            </div>
          </div>
        ) : (
          <div className="career-map__hud-card" aria-live="polite">
            {selectedPin ? (
              <>
                <div className="career-map__hud-top">
                  <span className="career-map__hud-badge">
                    <MapPinVectorIcon />
                    <span>PIN {selectedPin.indexLabel}</span>
                  </span>
                  <span className="career-map__hud-district">{selectedPin.district}</span>
                </div>
                <strong className="career-map__hud-building">{selectedPin.building}</strong>
                <span className="career-map__hud-org">
                  {selectedPin.organization} · {selectedPin.role}
                </span>
              </>
            ) : (
              <>
                <div className="career-map__hud-top">
                  <span className="career-map__hud-badge">
                    <MapPinVectorIcon />
                    <span>CORRIDOR VIEW</span>
                  </span>
                  <span className="career-map__hud-district">Metro Manila</span>
                </div>
                <strong className="career-map__hud-building">Pasig · Ortigas Center · BGC</strong>
                <span className="career-map__hud-org">
                  Hover any milestone above to preview experience
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="career-map__footer">
        <span className="career-map__hint">Pasig → Ortigas Center → BGC Corridor</span>
        <span className="career-map__hint">Hover milestone for experience · Click to fly · Drag to orbit</span>
      </div>
    </div>
  );
}
