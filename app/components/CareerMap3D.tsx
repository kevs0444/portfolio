"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CAMERA_PRESETS,
  CAREER_GRAPH_STAGES,
  CAREER_MAP_PINS,
  CORRIDOR_ROADS,
  DISTRICT_LABELS,
  GRAPH_CAMERA_PRESET,
  MANGGAHAN_FLOODWAY_CENTERLINE,
  MARIKINA_RIVER_CENTERLINE,
  PASIG_RIVER_CENTERLINE,
  SKYLINE_MASSINGS,
  SLAB_BOUNDS,
  computeFrameDeltaSeconds,
  computeMorphProgress,
  getGraphCameraFramingForStage,
  getStageMorphState,
  getTrajectorySampleIndices,
  isWaterChannelAtSlab,
  projectLatLngToSlab,
  type CareerGraphStage,
  type CareerMapPin,
  type CareerPinBarId,
  type CareerStageId,
  type MapPresetId,
} from "../data/metroManilaMapData";

type Theme = "light" | "dark";
export type CareerViewMode = "graph" | "map";

export interface CareerMap3DProps {
  viewMode: CareerViewMode;
  activeBarId: string;
  hoveredBarId?: CareerStageId | null;
  theme: Theme;
  reduceMotion: boolean;
  onSelectPin: (barId: CareerStageId) => void;
  onHoverPin?: (barId: CareerStageId | null) => void;
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
  graphGrid: number;
  graphBackdrop: number;
  graphPillarFill: number;
  graphPillarEdge: number;
  graphPillarCurrentFill: number;
  graphPillarActiveFill: number;
  graphPillarActiveEdge: number;
  graphTargetBg: string;
  graphTargetStripe: string;
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
  graphGrid: 0x242424,
  graphBackdrop: 0x2c2c2c,
  graphPillarFill: 0x363636,
  graphPillarEdge: 0x8c8c8c,
  graphPillarCurrentFill: 0xa6a6a6,
  graphPillarActiveFill: 0xf2f2f2,
  graphPillarActiveEdge: 0xffffff,
  graphTargetBg: "#171717",
  graphTargetStripe: "#3c3c3c",
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
  graphGrid: 0xd9d9d9,
  graphBackdrop: 0xc8c8c8,
  graphPillarFill: 0x9a9a9a,
  graphPillarEdge: 0x454545,
  graphPillarCurrentFill: 0x4e4e4e,
  graphPillarActiveFill: 0x141414,
  graphPillarActiveEdge: 0x000000,
  graphTargetBg: "#dcdcdc",
  graphTargetStripe: "#b4b4b4",
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

function createDiagonalStripeTexture(bgHex: string, stripeHex: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = stripeHex;
    ctx.lineWidth = 14;
    for (let offset = -128; offset <= 256; offset += 28) {
      ctx.beginPath();
      ctx.moveTo(offset, 0);
      ctx.lineTo(offset + 128, 128);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 3.2);
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

function GraphPillarVectorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20V14h3v6H4Z" />
      <path d="M10.5 20V9h3v11h-3Z" />
      <path d="M17 20V4h3v16h-3Z" />
    </svg>
  );
}

export default function CareerMap3D({
  viewMode,
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

  const graphPinDomRefs = useRef<Record<CareerStageId, HTMLButtonElement | null>>({
    college: null,
    denso: null,
    phoenix: null,
    luxasia: null,
    "full-time-target": null,
  });

  const [webglSupported, setWebglSupported] = useState(true);
  const [activePreset, setActivePreset] = useState<MapPresetId>("corridor");
  const [hoveredPinId, setHoveredPinId] = useState<CareerStageId | null>(null);
  const [graphFocusOverview, setGraphFocusOverview] = useState(true);

  const effectiveHoverId = hoveredBarId ?? hoveredPinId;

  const selectedStage = useMemo<CareerGraphStage | null>(
    () => CAREER_GRAPH_STAGES.find((stage) => stage.id === activeBarId) ?? null,
    [activeBarId],
  );

  const selectedMapPin = useMemo(
    () => CAREER_MAP_PINS.find((pin) => pin.barId === activeBarId) ?? null,
    [activeBarId],
  );

  const hoveredStage = useMemo<CareerGraphStage | null>(
    () => (effectiveHoverId ? CAREER_GRAPH_STAGES.find((stage) => stage.id === effectiveHoverId) ?? null : null),
    [effectiveHoverId],
  );

  const onUserActivityRef = useRef(onUserActivity);
  onUserActivityRef.current = onUserActivity;

  const onHoverPinRef = useRef(onHoverPin);
  onHoverPinRef.current = onHoverPin;

  function updateHoverPin(nextId: CareerStageId | null) {
    setHoveredPinId((prev) => (prev === nextId ? prev : nextId));
    onHoverPinRef.current?.(nextId);
    if (nextId !== null) {
      onUserActivityRef.current?.();
    }
  }

  const updateHoverPinRef = useRef(updateHoverPin);
  updateHoverPinRef.current = updateHoverPin;

  const viewModeRef = useRef<CareerViewMode>(viewMode);
  viewModeRef.current = viewMode;

  const reduceMotionRef = useRef(reduceMotion);
  reduceMotionRef.current = reduceMotion;

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
    setTargetMorph: (nextTarget: number, instant: boolean) => void;
    applyTheme: (mode: Theme) => void;
    applyActiveStage: (stageId: CareerStageId | null, hoverId: CareerStageId | null) => void;
    requestRender: () => void;
  } | null>(null);

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

  function startCameraTween(
    endPos: [number, number, number],
    endTarget: [number, number, number],
    duration = 0.78,
  ) {
    const ctrl = sceneCtrlRef.current;
    if (!ctrl) return;
    if (reduceMotionRef.current) {
      ctrl.camera.position.set(...endPos);
      ctrl.controls.target.set(...endTarget);
      ctrl.tween.active = false;
      ctrl.controls.update();
      return;
    }
    ctrl.tween.startPos.copy(ctrl.camera.position);
    ctrl.tween.startTarget.copy(ctrl.controls.target);
    ctrl.tween.endPos.set(...endPos);
    ctrl.tween.endTarget.set(...endTarget);
    ctrl.tween.duration = duration;
    ctrl.tween.progress = 0;
    ctrl.tween.active = true;
  }

  function focusStageCamera(stageId: CareerStageId) {
    const ctrl = sceneCtrlRef.current;
    if (!ctrl) return;

    if (viewModeRef.current === "graph") {
      const matchedStage = CAREER_GRAPH_STAGES.find((s) => s.id === stageId);
      if (!matchedStage) return;
      setGraphFocusOverview(false);
      const framing = getGraphCameraFramingForStage(matchedStage);
      const scaledPos = getAspectScaledPosition(framing.position, framing.target, ctrl.camera.aspect);
      startCameraTween(scaledPos, framing.target, 0.78);
      return;
    }

    const matchedPin = CAREER_MAP_PINS.find((p) => p.barId === stageId);
    if (!matchedPin) return;
    const framing = getCameraFramingForPin(matchedPin);
    const scaledPos = getAspectScaledPosition(framing.position, framing.target, ctrl.camera.aspect);
    setActivePreset(matchedPin.preset);
    startCameraTween(scaledPos, framing.target, 0.78);
  }

  function handlePinActivate(stageId: CareerStageId) {
    onUserActivityRef.current?.();
    focusStageCamera(stageId);
    onSelectPin(stageId);
  }

  const handlePinActivateRef = useRef(handlePinActivate);
  handlePinActivateRef.current = handlePinActivate;

  // Build unified Three.js scene once on mount
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

    const initialMode = viewModeRef.current;
    let currentMorph = initialMode === "map" ? 1 : 0;
    let targetMorph = currentMorph;

    const scene = new THREE.Scene();
    const initialPreset = initialMode === "map" ? CAMERA_PRESETS.corridor : GRAPH_CAMERA_PRESET;
    const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 120);
    camera.position.set(...initialPreset.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initialPreset.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    controls.minDistance = 3.2;
    controls.maxDistance = 22.0;
    controls.minPolarAngle = Math.PI * 0.12;
    controls.maxPolarAngle = Math.PI * 0.45;
    controls.rotateSpeed = 0.72;
    controls.zoomSpeed = 0.85;

    const tween = {
      active: false,
      startPos: new THREE.Vector3(),
      endPos: new THREE.Vector3(),
      startTarget: new THREE.Vector3(),
      endTarget: new THREE.Vector3(),
      progress: 1,
      duration: 0.78,
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

    // 1. Shared Floating Beveled Architectural Slab & Plinth
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
    rootGroup.add(new THREE.Mesh(plinthGeom, plinthMat));

    const borderPts = plinthShape.getPoints(64).map((pt) => new THREE.Vector3(pt.x, 0.006, -pt.y));
    borderPts.push(borderPts[0].clone());
    const slabBorderGeom = track(new THREE.BufferGeometry().setFromPoints(borderPts));
    const slabBorderMat = track(new THREE.LineBasicMaterial({ color: DARK_PALETTE.slabBorder }));
    rootGroup.add(new THREE.Line(slabBorderGeom, slabBorderMat));

    // =====================================================
    // LAYER A: METRO MANILA CONTEXT MAP GROUP
    // =====================================================
    const mapLayersGroup = new THREE.Group();
    rootGroup.add(mapLayersGroup);

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
      mapLayersGroup.add(new THREE.Mesh(bankGeom, riverBankMat));
      mapLayersGroup.add(new THREE.Mesh(waterGeom, riverWaterMat));
      mapLayersGroup.add(new THREE.Mesh(rippleGeom, riverRippleMat));
    }

    const dotPositions: Array<{ x: number; z: number; urbanWeight: number }> = [];
    const pinSlabCoords = CAREER_MAP_PINS.map((p) => projectLatLngToSlab(p.lat, p.lng));
    const dotStep = 0.2;
    for (let x = -SLAB_BOUNDS.width * 0.5 + 0.34; x <= SLAB_BOUNDS.width * 0.5 - 0.34; x += dotStep) {
      for (let z = -SLAB_BOUNDS.depth * 0.5 + 0.34; z <= SLAB_BOUNDS.depth * 0.5 - 0.34; z += dotStep) {
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
    const dotMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
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
    mapLayersGroup.add(dotInstanced);

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
        seg.tier === "highway" ? 0.052 : seg.tier === "bridge" ? 0.046 : seg.tier === "arterial" ? 0.032 : 0.02;
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
      mapLayersGroup.add(new THREE.Mesh(geom, mat));
    }

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
    mapLayersGroup.add(skylineGroup);
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

    const labelMeshes: Array<{ mesh: THREE.Mesh; text: string; mat: THREE.MeshBasicMaterial }> = [];
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
      mapLayersGroup.add(mesh);
      labelMeshes.push({ mesh, text: dl.text, mat });
    }

    // Map 3D trajectory arc between the 4 physical towers
    const mapArcPoints: THREE.Vector3[] = [];
    const pinWorldRoofs = CAREER_MAP_PINS.map((pin) => {
      const pt = projectLatLngToSlab(pin.lat, pin.lng);
      return new THREE.Vector3(pt.x, pin.towerHeight + 0.04, pt.z);
    });
    for (let i = 0; i < pinWorldRoofs.length - 1; i++) {
      const fromPt = pinWorldRoofs[i];
      const toPt = pinWorldRoofs[i + 1];
      const dist = fromPt.distanceTo(toPt);
      const mid = fromPt.clone().lerp(toPt, 0.5);
      mid.y = Math.max(fromPt.y, toPt.y) + Math.min(1.65, 0.45 + dist * 0.16);
      const segCurve = new THREE.QuadraticBezierCurve3(fromPt, mid, toPt);
      const pts = segCurve.getPoints(36);
      if (i > 0) pts.shift();
      mapArcPoints.push(...pts);
    }
    const mapArcGeom = track(new THREE.BufferGeometry().setFromPoints(mapArcPoints));
    const arcDashMat = track(
      new THREE.LineDashedMaterial({
        color: DARK_PALETTE.arcDash,
        dashSize: 0.18,
        gapSize: 0.11,
        transparent: true,
        opacity: 0.9,
      }),
    );
    const mapArcLine = new THREE.Line(mapArcGeom, arcDashMat);
    mapArcLine.computeLineDistances();
    mapLayersGroup.add(mapArcLine);

    const pulseSphereGeom = track(new THREE.SphereGeometry(0.05, 14, 14));
    const pulseSphereMat = track(new THREE.MeshBasicMaterial({ color: DARK_PALETTE.heroActiveEdge }));
    const mapPulseSphere = new THREE.Mesh(pulseSphereGeom, pulseSphereMat);
    mapLayersGroup.add(mapPulseSphere);

    // =====================================================
    // LAYER B: 3D CAREER GRAPH GRID, BACKDROP & ARC
    // =====================================================
    const graphLayersGroup = new THREE.Group();
    rootGroup.add(graphLayersGroup);

    const gridPts: THREE.Vector3[] = [];
    for (let gx = -6.6; gx <= 6.601; gx += 0.6) {
      gridPts.push(new THREE.Vector3(gx, 0.009, -4.0), new THREE.Vector3(gx, 0.009, 4.0));
    }
    for (let gz = -3.6; gz <= 3.601; gz += 0.6) {
      gridPts.push(new THREE.Vector3(-6.8, 0.009, gz), new THREE.Vector3(6.8, 0.009, gz));
    }
    const graphGridGeom = track(new THREE.BufferGeometry().setFromPoints(gridPts));
    const graphGridMat = track(
      new THREE.LineBasicMaterial({
        color: DARK_PALETTE.graphGrid,
        transparent: true,
        opacity: 0.85,
      }),
    );
    graphLayersGroup.add(new THREE.LineSegments(graphGridGeom, graphGridMat));

    // Horizontal elevation benchmark guide lines behind the 5 rising 3D columns
    const backdropPts: THREE.Vector3[] = [];
    for (const hLevel of [1.0, 2.0, 3.0, 4.0]) {
      backdropPts.push(new THREE.Vector3(-6.2, hLevel, -1.65), new THREE.Vector3(6.2, hLevel, -1.65));
    }
    for (const stage of CAREER_GRAPH_STAGES) {
      backdropPts.push(
        new THREE.Vector3(stage.graphPos[0], 0.02, -1.65),
        new THREE.Vector3(stage.graphPos[0], stage.graphHeight + 0.25, -1.65),
      );
    }
    const graphBackdropGeom = track(new THREE.BufferGeometry().setFromPoints(backdropPts));
    const graphBackdropMat = track(
      new THREE.LineBasicMaterial({
        color: DARK_PALETTE.graphBackdrop,
        transparent: true,
        opacity: 0.62,
      }),
    );
    graphLayersGroup.add(new THREE.LineSegments(graphBackdropGeom, graphBackdropMat));

    // 5-stage rising 3D trajectory arc connecting the 5 pillar crests
    const graphArcPoints: THREE.Vector3[] = [];
    for (let i = 0; i < CAREER_GRAPH_STAGES.length - 1; i++) {
      const a = CAREER_GRAPH_STAGES[i];
      const b = CAREER_GRAPH_STAGES[i + 1];
      const pA = new THREE.Vector3(a.graphPos[0], a.graphHeight + 0.12, a.graphPos[1]);
      const pB = new THREE.Vector3(b.graphPos[0], b.graphHeight + 0.12, b.graphPos[1]);
      const mid = pA.clone().lerp(pB, 0.5);
      mid.y += 0.48;
      const segCurve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
      const pts = segCurve.getPoints(32);
      if (i > 0) pts.shift();
      graphArcPoints.push(...pts);
    }
    const graphArcGeom = track(new THREE.BufferGeometry().setFromPoints(graphArcPoints));
    const graphArcLine = new THREE.Line(graphArcGeom, arcDashMat);
    graphArcLine.computeLineDistances();
    graphLayersGroup.add(graphArcLine);

    const graphPulseSphere = new THREE.Mesh(pulseSphereGeom, pulseSphereMat);
    graphLayersGroup.add(graphPulseSphere);

    // =====================================================
    // STAGE NODES (4 Morphing Stages + 5th Target Pillar)
    // =====================================================
    interface StageNode {
      stage: CareerGraphStage;
      pin: CareerMapPin | null;
      stageGroup: THREE.Group;
      graphSubGroup: THREE.Group;
      mapSubGroup: THREE.Group | null;
      graphMat: THREE.MeshStandardMaterial;
      graphEdgeMat: THREE.LineBasicMaterial;
      mapFillMat: THREE.MeshStandardMaterial | null;
      mapEdgeMat: THREE.LineBasicMaterial | null;
      stemMat: THREE.LineBasicMaterial | null;
      haloMesh: THREE.Mesh;
      haloMat: THREE.MeshBasicMaterial;
      targetStripeTex?: THREE.CanvasTexture;
      anchorLocalMap: THREE.Vector3;
      hoverLiftY: number;
      hitbox: THREE.Mesh;
    }

    const stageNodes: Record<CareerStageId, StageNode> = {} as Record<CareerStageId, StageNode>;
    const hitboxes: THREE.Mesh[] = [];
    const hitboxMat = track(new THREE.MeshBasicMaterial({ visible: false }));
    const mapHaloRingGeom = track(new THREE.RingGeometry(0.24, 0.32, 36));
    mapHaloRingGeom.rotateX(-Math.PI / 2);
    const graphHaloRingGeom = track(new THREE.RingGeometry(0.66, 0.76, 40));
    graphHaloRingGeom.rotateX(-Math.PI / 2);

    for (const stage of CAREER_GRAPH_STAGES) {
      const pin = CAREER_MAP_PINS.find((p) => p.barId === stage.id) ?? null;
      const stageGroup = new THREE.Group();
      rootGroup.add(stageGroup);

      // Graph sub-group (rising monochrome architectural pedestal + main column)
      const graphSubGroup = new THREE.Group();
      stageGroup.add(graphSubGroup);

      const isTarget = stage.id === "full-time-target";
      let targetStripeTex: THREE.CanvasTexture | undefined;
      if (isTarget) {
        targetStripeTex = track(
          createDiagonalStripeTexture(DARK_PALETTE.graphTargetBg, DARK_PALETTE.graphTargetStripe),
        );
      }

      const graphMat = track(
        new THREE.MeshStandardMaterial({
          color: isTarget
            ? 0xffffff
            : stage.status === "current"
              ? DARK_PALETTE.graphPillarCurrentFill
              : DARK_PALETTE.graphPillarFill,
          map: targetStripeTex ?? null,
          roughness: 0.42,
          metalness: 0.14,
          transparent: true,
          opacity: 1,
        }),
      );
      const graphEdgeMat = track(
        new THREE.LineBasicMaterial({
          color: DARK_PALETTE.graphPillarEdge,
          transparent: true,
          opacity: 0.92,
        }),
      );

      const [gw, gd] = stage.graphFootprint;
      const gh = stage.graphHeight;

      // Stepped architectural plinth under pillar
      const plinthBoxG = track(new THREE.BoxGeometry(gw * 1.16, 0.14, gd * 1.16));
      const plinthBoxM = new THREE.Mesh(plinthBoxG, graphMat);
      plinthBoxM.position.set(0, 0.085, 0);
      graphSubGroup.add(plinthBoxM);
      const plinthEdges = new THREE.LineSegments(track(new THREE.EdgesGeometry(plinthBoxG)), graphEdgeMat);
      plinthEdges.position.copy(plinthBoxM.position);
      graphSubGroup.add(plinthEdges);

      // Main rising column shaft
      const colH = gh - 0.14;
      const colGeom = track(new THREE.BoxGeometry(gw, colH, gd));
      const colMesh = new THREE.Mesh(colGeom, graphMat);
      colMesh.position.set(0, 0.155 + colH * 0.5, 0);
      graphSubGroup.add(colMesh);
      const colEdges = new THREE.LineSegments(track(new THREE.EdgesGeometry(colGeom)), graphEdgeMat);
      colEdges.position.copy(colMesh.position);
      graphSubGroup.add(colEdges);

      // Subtle setback crown cap on pillar crest
      const capGeom = track(new THREE.BoxGeometry(gw * 0.76, 0.08, gd * 0.76));
      const capMesh = new THREE.Mesh(capGeom, graphMat);
      capMesh.position.set(0, gh + 0.04, 0);
      graphSubGroup.add(capMesh);
      const capEdges = new THREE.LineSegments(track(new THREE.EdgesGeometry(capGeom)), graphEdgeMat);
      capEdges.position.copy(capMesh.position);
      graphSubGroup.add(capEdges);

      const haloMat = track(
        new THREE.MeshBasicMaterial({
          color: DARK_PALETTE.heroActiveEdge,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide,
        }),
      );
      const haloMesh = new THREE.Mesh(isTarget ? graphHaloRingGeom : mapHaloRingGeom, haloMat);
      haloMesh.position.set(0, 0.022, 0);
      stageGroup.add(haloMesh);

      // Map sub-group (for the 4 real-world Metro Manila buildings)
      let mapSubGroup: THREE.Group | null = null;
      let mapFillMat: THREE.MeshStandardMaterial | null = null;
      let mapEdgeMat: THREE.LineBasicMaterial | null = null;
      let stemMat: THREE.LineBasicMaterial | null = null;
      const anchorLocalMap = new THREE.Vector3(0, gh + 0.4, 0);

      if (pin) {
        mapSubGroup = new THREE.Group();
        stageGroup.add(mapSubGroup);

        mapFillMat = track(
          new THREE.MeshStandardMaterial({
            color: DARK_PALETTE.heroFill,
            roughness: 0.42,
            metalness: 0.18,
          }),
        );
        mapEdgeMat = track(new THREE.LineBasicMaterial({ color: DARK_PALETTE.heroEdge }));
        stemMat = track(new THREE.LineBasicMaterial({ color: DARK_PALETTE.stem }));

        const [fw, fd] = pin.towerFootprint;
        const mh = pin.towerHeight;

        const addMapBlock = (w: number, bh: number, d: number, ox: number, oy: number, oz: number) => {
          const bg = track(new THREE.BoxGeometry(w, bh, d));
          const m = new THREE.Mesh(bg, mapFillMat!);
          m.position.set(ox, oy + bh * 0.5 + 0.015, oz);
          mapSubGroup!.add(m);

          const eg = track(new THREE.EdgesGeometry(bg));
          const el = new THREE.LineSegments(eg, mapEdgeMat!);
          el.position.copy(m.position);
          mapSubGroup!.add(el);
        };

        if (pin.barId === "college") {
          addMapBlock(fw * 1.15, mh * 0.36, fd * 1.15, 0, 0, 0);
          addMapBlock(fw * 0.82, mh * 0.64, fd * 0.46, 0, mh * 0.36, -fd * 0.24);
          addMapBlock(fw * 0.32, mh * 0.48, fd * 0.52, -fw * 0.26, mh * 0.36, fd * 0.18);
          addMapBlock(fw * 0.32, mh * 0.48, fd * 0.52, fw * 0.26, mh * 0.36, fd * 0.18);
        } else {
          addMapBlock(fw * 1.24, mh * 0.16, fd * 1.24, 0, 0, 0);
          addMapBlock(fw, mh * 0.72, fd, 0, mh * 0.16, 0);
          addMapBlock(fw * 0.72, mh * 0.12, fd * 0.72, 0, mh * 0.88, 0);
        }

        const roofLocal = new THREE.Vector3(0, mh + 0.04, 0);
        const elbowLocal = new THREE.Vector3(
          pin.stemOffset[0] * 0.55,
          mh + pin.stemExtraHeight * 0.62,
          pin.stemOffset[1] * 0.55,
        );
        anchorLocalMap.set(pin.stemOffset[0], mh + pin.stemExtraHeight, pin.stemOffset[1]);
        const stemGeom = track(new THREE.BufferGeometry().setFromPoints([roofLocal, elbowLocal, anchorLocalMap]));
        mapSubGroup.add(new THREE.Line(stemGeom, stemMat));
      }

      const hbGeom = track(new THREE.BoxGeometry(1, 1, 1));
      const hitbox = new THREE.Mesh(hbGeom, hitboxMat);
      hitbox.userData.stageId = stage.id;
      stageGroup.add(hitbox);
      hitboxes.push(hitbox);

      stageNodes[stage.id] = {
        stage,
        pin,
        stageGroup,
        graphSubGroup,
        mapSubGroup,
        graphMat,
        graphEdgeMat,
        mapFillMat,
        mapEdgeMat,
        stemMat,
        haloMesh,
        haloMat,
        targetStripeTex,
        anchorLocalMap,
        hoverLiftY: 0,
        hitbox,
      };
    }

    // Theme & active/hover material synchronization
    let currentStageId: CareerStageId | null = null;
    let currentHoverId: CareerStageId | null = null;
    let currentTheme: Theme = "dark";

    const syncStageMaterials = () => {
      const palette = currentTheme === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
      for (const stage of CAREER_GRAPH_STAGES) {
        const node = stageNodes[stage.id];
        const isHovered = stage.id === currentHoverId;
        const isActive =
          currentHoverId !== null
            ? isHovered
            : stage.id === currentStageId || (currentStageId === null && stage.status === "current");

        // Graph pillar styling
        if (stage.id === "full-time-target") {
          node.graphMat.color.setHex(isActive ? 0xffffff : 0xd8d8d8);
        } else if (isActive) {
          node.graphMat.color.setHex(palette.graphPillarActiveFill);
        } else if (stage.status === "current") {
          node.graphMat.color.setHex(palette.graphPillarCurrentFill);
        } else {
          node.graphMat.color.setHex(palette.graphPillarFill);
        }
        node.graphEdgeMat.color.setHex(
          isActive ? palette.graphPillarActiveEdge : palette.graphPillarEdge,
        );

        // Map tower styling
        if (node.mapFillMat && node.mapEdgeMat && node.stemMat && node.pin) {
          node.mapFillMat.color.setHex(isActive ? palette.heroActiveFill : palette.heroFill);
          node.mapEdgeMat.color.setHex(isActive ? palette.heroActiveEdge : palette.heroEdge);
          node.stemMat.color.setHex(isActive ? palette.stemActive : palette.stem);
        }

        node.haloMat.color.setHex(palette.heroActiveEdge);
        node.haloMesh.visible =
          (stage.id !== "full-time-target" || currentMorph < 0.96) &&
          (isActive || stage.id === currentStageId || stage.status === "current");
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
      graphGridMat.color.setHex(palette.graphGrid);
      graphBackdropMat.color.setHex(palette.graphBackdrop);

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

      const targetNode = stageNodes["full-time-target"];
      if (targetNode) {
        const nextStripeTex = track(
          createDiagonalStripeTexture(palette.graphTargetBg, palette.graphTargetStripe),
        );
        targetNode.targetStripeTex?.dispose();
        targetNode.targetStripeTex = nextStripeTex;
        targetNode.graphMat.map = nextStripeTex;
        targetNode.graphMat.needsUpdate = true;
      }

      syncStageMaterials();
    };

    const applyActiveStage = (stageId: CareerStageId | null, hoverId: CareerStageId | null) => {
      currentStageId = stageId;
      currentHoverId = hoverId;
      syncStageMaterials();
    };

    const setTargetMorph = (nextTarget: number, instant: boolean) => {
      targetMorph = nextTarget;
      if (instant) {
        currentMorph = nextTarget;
      }
    };

    // Raycasting for 3D pillar / building hover & click
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const getHitStageId = (clientX: number, clientY: number): CareerStageId | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitboxes, false);
      for (const hit of hits) {
        const id = hit.object.userData.stageId as CareerStageId | undefined;
        if (!id) continue;
        if (currentMorph >= 0.5 && id === "full-time-target") continue;
        return id;
      }
      return null;
    };

    const handlePointerDown = (ev: PointerEvent) => {
      pointerDownPos = { x: ev.clientX, y: ev.clientY };
      onUserActivityRef.current?.();
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (ev.pointerType === "touch") return;
      const hitId = getHitStageId(ev.clientX, ev.clientY);
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
      const hitId = getHitStageId(ev.clientX, ev.clientY);
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

    const projVec = new THREE.Vector3();
    const projWorld = new THREE.Vector3();
    let rafId = 0;
    let prevTime: number | null = null;
    let elapsed = 0;

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      const dt = computeFrameDeltaSeconds(now, prevTime);
      const transitionDt =
        prevTime === null || !Number.isFinite(now) || !Number.isFinite(prevTime)
          ? 0
          : Math.max(0, Math.min(0.25, (now - prevTime) / 1000));
      prevTime = now;

      if (!isVisible) return;

      // Advance Graph <-> Map morph factor safely within [0, 1]
      currentMorph = computeMorphProgress(
        currentMorph,
        targetMorph,
        reduceMotionRef.current ? 10 : transitionDt,
        0.85,
      );
      const easeMorph = currentMorph * currentMorph * (3 - 2 * currentMorph);

      mapLayersGroup.visible = easeMorph > 0.015;
      mapLayersGroup.scale.y = Math.max(0.001, easeMorph);

      graphLayersGroup.visible = easeMorph < 0.985;
      graphLayersGroup.scale.y = Math.max(0.001, 1 - easeMorph);

      // Update 5 stage positions, hover lifts, sub-group scales, and hitboxes
      for (const stage of CAREER_GRAPH_STAGES) {
        const node = stageNodes[stage.id];
        const mState = getStageMorphState(stage.id, currentMorph);
        node.stageGroup.position.set(mState.x, 0, mState.z);
        node.stageGroup.visible = mState.visibleInMode;

        const targetLift =
          !reduceMotionRef.current && stage.id === currentHoverId ? (currentMorph < 0.5 ? 0.18 : 0.08) : 0;
        node.hoverLiftY += (targetLift - node.hoverLiftY) * Math.min(1, dt * 14);

        node.graphSubGroup.visible = currentMorph < 0.985 && mState.visibleInMode;
        node.graphSubGroup.scale.y = mState.graphScaleY;
        node.graphSubGroup.position.y = node.hoverLiftY;
        node.graphMat.opacity = mState.opacity;
        node.graphEdgeMat.opacity = 0.92 * mState.opacity;

        if (node.mapSubGroup && node.pin) {
          node.mapSubGroup.visible = easeMorph > 0.015;
          node.mapSubGroup.scale.y = mState.mapScaleY;
          node.mapSubGroup.position.y = currentMorph >= 0.5 ? node.hoverLiftY : 0;

          if (currentMorph < 0.5) {
            node.hitbox.scale.set(
              stage.graphFootprint[0] * 1.25,
              stage.graphHeight + 0.65,
              stage.graphFootprint[1] * 1.25,
            );
            node.hitbox.position.set(0, (stage.graphHeight + 0.65) * 0.5, 0);
          } else {
            const [fw, fd] = node.pin.towerFootprint;
            const mh = node.pin.towerHeight;
            node.hitbox.scale.set(Math.max(0.45, fw * 2.1), mh + 0.5, Math.max(0.45, fd * 2.1));
            node.hitbox.position.set(0, mh * 0.5 + 0.2, 0);
          }

          const haloScale =
            stage.id === "luxasia" && !reduceMotionRef.current ? 1 + Math.sin(elapsed * 3.1) * 0.12 : 1;
          const haloWidth = currentMorph < 0.5 ? 2.4 * haloScale : haloScale;
          node.haloMesh.scale.set(haloWidth, 1, haloWidth);
        } else {
          node.hitbox.scale.set(
            stage.graphFootprint[0] * 1.25,
            stage.graphHeight + 0.65,
            stage.graphFootprint[1] * 1.25,
          );
          node.hitbox.position.set(0, (stage.graphHeight + 0.65) * 0.5, 0);
        }
      }

      if (tween.active) {
        tween.progress = reduceMotionRef.current ? 1 : Math.min(1, tween.progress + transitionDt / tween.duration);
        const ease = 1 - Math.pow(1 - tween.progress, 3);
        camera.position.lerpVectors(tween.startPos, tween.endPos, ease);
        controls.target.lerpVectors(tween.startTarget, tween.endTarget, ease);
        if (tween.progress >= 1) {
          tween.active = false;
        }
      }

      controls.update();

      if (!reduceMotionRef.current) {
        elapsed += dt;
        if (mapArcPoints.length >= 2 && mapLayersGroup.visible) {
          const sample = getTrajectorySampleIndices(elapsed * 0.16, mapArcPoints.length);
          mapPulseSphere.position.lerpVectors(
            mapArcPoints[sample.index],
            mapArcPoints[sample.nextIndex],
            sample.alpha,
          );
          mapPulseSphere.visible = true;
        } else {
          mapPulseSphere.visible = false;
        }

        if (graphArcPoints.length >= 2 && graphLayersGroup.visible) {
          const sample = getTrajectorySampleIndices(elapsed * 0.18, graphArcPoints.length);
          graphPulseSphere.position.lerpVectors(
            graphArcPoints[sample.index],
            graphArcPoints[sample.nextIndex],
            sample.alpha,
          );
          graphPulseSphere.visible = true;
        } else {
          graphPulseSphere.visible = false;
        }
      } else {
        mapPulseSphere.visible = false;
        graphPulseSphere.visible = false;
      }

      renderer.render(scene, camera);

      // Project crisp HTML overlays for the active view mode
      for (const stage of CAREER_GRAPH_STAGES) {
        const node = stageNodes[stage.id];

        // Graph mode floating photo card projection (all 5 stages)
        const photoBtn = graphPinDomRefs.current[stage.id];
        if (photoBtn) {
          if (easeMorph < 0.45 && node.stageGroup.visible) {
            projWorld.set(
              node.stageGroup.position.x,
              stage.graphHeight + node.hoverLiftY + 0.24,
              node.stageGroup.position.z,
            );
            projVec.copy(projWorld).project(camera);
            const inFront = projVec.z >= -1 && projVec.z <= 1;
            const px = (projVec.x * 0.5 + 0.5) * stageWidth;
            const py = (-projVec.y * 0.5 + 0.5) * stageHeight;
            const withinPad = px > -36 && px < stageWidth + 36 && py > -36 && py < stageHeight + 36;
            if (inFront && withinPad) {
              const padX = Math.min(44, stageWidth * 0.12);
              const clampedX = Math.max(padX, Math.min(stageWidth - padX, px));
              const clampedY = Math.max(66, Math.min(stageHeight - 18, py));
              photoBtn.style.opacity = "1";
              photoBtn.style.pointerEvents = "auto";
              photoBtn.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -100%)`;
            } else {
              photoBtn.style.opacity = "0";
              photoBtn.style.pointerEvents = "none";
            }
          } else {
            photoBtn.style.opacity = "0";
            photoBtn.style.pointerEvents = "none";
          }
        }

        // Map mode location pin badge projection (4 physical stages)
        if (node.pin) {
          const mapBtn = pinDomRefs.current[node.pin.barId];
          if (mapBtn) {
            if (easeMorph >= 0.45) {
              projWorld.copy(node.anchorLocalMap).add(node.stageGroup.position);
              projVec.copy(projWorld).project(camera);
              const inFront = projVec.z >= -1 && projVec.z <= 1;
              const px = (projVec.x * 0.5 + 0.5) * stageWidth;
              const py = (-projVec.y * 0.5 + 0.5) * stageHeight;
              const withinPad = px > -24 && px < stageWidth + 24 && py > -24 && py < stageHeight + 24;
              if (inFront && withinPad) {
                const padX = Math.min(58, stageWidth * 0.16);
                const clampedX = Math.max(padX, Math.min(stageWidth - padX, px));
                const clampedY = Math.max(36, Math.min(stageHeight - 14, py));
                mapBtn.style.opacity = "1";
                mapBtn.style.pointerEvents = "auto";
                mapBtn.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -100%)`;
              } else {
                mapBtn.style.opacity = "0";
                mapBtn.style.pointerEvents = "none";
              }
            } else {
              mapBtn.style.opacity = "0";
              mapBtn.style.pointerEvents = "none";
            }
          }
        }
      }
    };

    rafId = window.requestAnimationFrame(tick);

    sceneCtrlRef.current = {
      camera,
      controls,
      tween,
      setTargetMorph,
      applyTheme,
      applyActiveStage,
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

  // Sync theme dynamically
  useEffect(() => {
    sceneCtrlRef.current?.applyTheme(theme);
  }, [theme]);

  // Sync active / hovered stage highlight dynamically
  useEffect(() => {
    sceneCtrlRef.current?.applyActiveStage(selectedStage?.id ?? null, effectiveHoverId);
  }, [selectedStage, effectiveHoverId]);

  // Morph smoothly & transition camera whenever viewMode changes
  const prevViewModeRef = useRef<CareerViewMode>(viewMode);
  useEffect(() => {
    if (prevViewModeRef.current === viewMode) return;
    prevViewModeRef.current = viewMode;
    const ctrl = sceneCtrlRef.current;
    if (!ctrl) return;

    const nextMorph = viewMode === "map" ? 1 : 0;
    ctrl.setTargetMorph(nextMorph, reduceMotionRef.current);

    if (viewMode === "graph") {
      setGraphFocusOverview(true);
      const scaledPos = getAspectScaledPosition(
        GRAPH_CAMERA_PRESET.position,
        GRAPH_CAMERA_PRESET.target,
        ctrl.camera.aspect,
        true,
      );
      startCameraTween(scaledPos, GRAPH_CAMERA_PRESET.target, 0.85);
    } else {
      setActivePreset("corridor");
      const corridor = CAMERA_PRESETS.corridor;
      const scaledPos = getAspectScaledPosition(
        corridor.position,
        corridor.target,
        ctrl.camera.aspect,
        true,
      );
      startCameraTween(scaledPos, corridor.target, 0.85);
    }
  }, [viewMode]);

  // Sync camera fly-to when activeBarId changes externally (e.g. Career Story Play/Next)
  const prevBarIdRef = useRef(activeBarId);
  useEffect(() => {
    if (prevBarIdRef.current === activeBarId) return;
    prevBarIdRef.current = activeBarId;

    const ctrl = sceneCtrlRef.current;
    if (!ctrl) return;

    if (viewModeRef.current === "graph") {
      const matchedStage = CAREER_GRAPH_STAGES.find((s) => s.id === activeBarId);
      if (matchedStage) {
        setGraphFocusOverview(false);
        const framing = getGraphCameraFramingForStage(matchedStage);
        const scaledPos = getAspectScaledPosition(framing.position, framing.target, ctrl.camera.aspect);
        startCameraTween(scaledPos, framing.target, 0.78);
      }
      return;
    }

    const matchedPin = CAREER_MAP_PINS.find((p) => p.barId === activeBarId);
    if (matchedPin) {
      const framing = getCameraFramingForPin(matchedPin);
      const scaledPos = getAspectScaledPosition(framing.position, framing.target, ctrl.camera.aspect);
      setActivePreset(matchedPin.preset);
      startCameraTween(scaledPos, framing.target, 0.78);
    } else {
      const corridor = CAMERA_PRESETS.corridor;
      const scaledPos = getAspectScaledPosition(corridor.position, corridor.target, ctrl.camera.aspect, true);
      setActivePreset("corridor");
      startCameraTween(scaledPos, corridor.target, 0.78);
    }
  }, [activeBarId]);

  function flyToOverview() {
    onUserActivityRef.current?.();
    const ctrl = sceneCtrlRef.current;
    if (!ctrl) return;
    if (viewMode === "graph") {
      setGraphFocusOverview(true);
      const scaledPos = getAspectScaledPosition(
        GRAPH_CAMERA_PRESET.position,
        GRAPH_CAMERA_PRESET.target,
        ctrl.camera.aspect,
        true,
      );
      startCameraTween(scaledPos, GRAPH_CAMERA_PRESET.target, 0.78);
      return;
    }
    setActivePreset("corridor");
    const corridor = CAMERA_PRESETS.corridor;
    const scaledPos = getAspectScaledPosition(corridor.position, corridor.target, ctrl.camera.aspect, true);
    startCameraTween(scaledPos, corridor.target, 0.78);
  }

  function stepZoom(factor: number) {
    onUserActivityRef.current?.();
    const ctrl = sceneCtrlRef.current;
    if (!ctrl) return;
    const offset = ctrl.camera.position.clone().sub(ctrl.controls.target);
    const currentDist = offset.length();
    const nextDist = Math.max(3.2, Math.min(22.0, currentDist * factor));
    offset.setLength(nextDist);
    const nextPos: [number, number, number] = [
      ctrl.controls.target.x + offset.x,
      ctrl.controls.target.y + offset.y,
      ctrl.controls.target.z + offset.z,
    ];
    startCameraTween(
      nextPos,
      [ctrl.controls.target.x, ctrl.controls.target.y, ctrl.controls.target.z],
      0.35,
    );
  }

  const topMilestones =
    viewMode === "graph"
      ? CAREER_GRAPH_STAGES
      : CAREER_MAP_PINS.map((pin) => CAREER_GRAPH_STAGES.find((s) => s.id === pin.barId)!);

  return (
    <div
      className="career-map-embed"
      role="region"
      aria-label={
        viewMode === "graph"
          ? "Interactive Three.js 3D career progression graph"
          : "Interactive Three.js 3D Metro Manila career corridor map"
      }
    >
      {/* Top Milestone Strip: Hover to preview experience, Click to focus 3D camera */}
      <div
        className={`career-map__milestones ${viewMode === "graph" ? "career-map__milestones--five" : ""}`}
        role="group"
        aria-label="Career milestone stages"
      >
        <button
          type="button"
          className={`career-map__milestone-btn career-map__milestone-btn--all ${
            viewMode === "graph" ? (graphFocusOverview ? "is-active" : "") : activePreset === "corridor" ? "is-active" : ""
          }`}
          aria-pressed={viewMode === "graph" ? graphFocusOverview : activePreset === "corridor"}
          onClick={flyToOverview}
        >
          <span>{viewMode === "graph" ? "ALL STAGES" : "ALL CORRIDOR"}</span>
        </button>

        {topMilestones.map((stage) => {
          const isOverview = viewMode === "graph" ? graphFocusOverview : activePreset === "corridor";
          const isSelected = selectedStage?.id === stage.id && !isOverview;
          const isPinned = selectedStage?.id === stage.id;
          const isHovered = effectiveHoverId === stage.id;
          const isCurrent = stage.status === "current";
          return (
            <button
              key={stage.id}
              type="button"
              className={`career-map__milestone-btn ${isSelected ? "is-active" : ""} ${isPinned ? "is-pinned" : ""} ${isHovered ? "is-hovered" : ""} ${isCurrent ? "is-current" : ""}`}
              aria-pressed={isPinned}
              onMouseEnter={() => updateHoverPin(stage.id)}
              onMouseLeave={() => updateHoverPin(null)}
              onFocus={() => updateHoverPin(stage.id)}
              onBlur={() => updateHoverPin(null)}
              onClick={() => handlePinActivate(stage.id)}
            >
              <span className="career-map__milestone-idx">{stage.indexLabel}</span>
              <strong className="career-map__milestone-name">{stage.pillLabel}</strong>
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

              {/* Graph Mode: Projected Floating Photo Cards Above 3D Pillars */}
              <div
                className="career-map__pins-layer"
                role="tablist"
                aria-label="3D Career Graph milestone pillars"
                aria-hidden={viewMode !== "graph"}
              >
                {CAREER_GRAPH_STAGES.map((stage) => {
                  const isSelected = selectedStage?.id === stage.id;
                  const isHovered = effectiveHoverId === stage.id;
                  const isCurrent = stage.status === "current";
                  const isTarget = stage.status === "target";
                  return (
                    <button
                      key={`graph-pin-${stage.id}`}
                      ref={(el) => {
                        graphPinDomRefs.current[stage.id] = el;
                      }}
                      type="button"
                      role="tab"
                      tabIndex={viewMode === "graph" ? 0 : -1}
                      aria-selected={isSelected}
                      aria-label={`${stage.indexLabel} ${stage.shortLabel}: ${stage.role}`}
                      className={`career-3d-photo-pin ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""} ${isCurrent ? "is-current" : ""} ${isTarget ? "is-target" : ""}`}
                      onMouseEnter={() => updateHoverPin(stage.id)}
                      onMouseLeave={() => updateHoverPin(null)}
                      onFocus={() => updateHoverPin(stage.id)}
                      onBlur={() => updateHoverPin(null)}
                      onClick={() => handlePinActivate(stage.id)}
                    >
                      <span className="career-3d-photo-pin__media">
                        <Image
                          src={stage.image}
                          alt={stage.shortLabel}
                          fill
                          sizes="56px"
                          quality={65}
                          style={stage.imagePosition ? { objectPosition: stage.imagePosition } : undefined}
                        />
                      </span>
                      <span className="career-3d-photo-pin__meta">
                        <span className="career-3d-photo-pin__idx">{stage.indexLabel}</span>
                        <span className="career-3d-photo-pin__label">{stage.pillLabel}</span>
                        {isCurrent ? <span className="career-map__pin-live" aria-hidden="true" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Map Mode: Projected Location Anchor Pins */}
              <div
                className="career-map__pins-layer"
                role="tablist"
                aria-label="Metro Manila career location pins"
                aria-hidden={viewMode !== "map"}
              >
                {CAREER_MAP_PINS.map((pin) => {
                  const isSelected = selectedMapPin?.barId === pin.barId;
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
                      tabIndex={viewMode === "map" ? 0 : -1}
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

              {/* Camera Controls (Zoom + Reset) */}
              <div className="career-map__controls" role="group" aria-label="3D camera controls">
                <button
                  type="button"
                  className="career-map__ctrl-btn"
                  aria-label="Zoom in 3D scene"
                  title="Zoom in"
                  onClick={() => stepZoom(0.76)}
                >
                  <PlusIcon />
                </button>
                <button
                  type="button"
                  className="career-map__ctrl-btn"
                  aria-label="Zoom out 3D scene"
                  title="Zoom out"
                  onClick={() => stepZoom(1.28)}
                >
                  <MinusIcon />
                </button>
                <button
                  type="button"
                  className="career-map__ctrl-btn"
                  aria-label="Reset 3D camera view"
                  title="Reset view"
                  onClick={flyToOverview}
                >
                  <ResetViewIcon />
                </button>
              </div>
            </>
          ) : (
            <div className="career-map__fallback">
              <p className="small-label">
                {viewMode === "graph" ? "CAREER PROGRESSION MILESTONES" : "METRO MANILA CAREER CORRIDOR"}
              </p>
              <div className="career-map__fallback-pins">
                {topMilestones.map((stage) => {
                  const isSelected = selectedStage?.id === stage.id;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      className={`career-map__milestone-btn ${isSelected ? "is-active" : ""}`}
                      onMouseEnter={() => updateHoverPin(stage.id)}
                      onMouseLeave={() => updateHoverPin(null)}
                      onClick={() => handlePinActivate(stage.id)}
                    >
                      <span className="career-map__milestone-idx">{stage.indexLabel}</span>
                      <strong className="career-map__milestone-name">
                        {stage.shortLabel} ({stage.district})
                      </strong>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rich Hover Experience Card OR Minimal Active HUD Card */}
        {hoveredStage ? (
          <div className="career-map__exp-popover" role="status" aria-live="polite">
            <div className="career-map__exp-top">
              <span className="career-map__hud-badge">
                {viewMode === "graph" ? <GraphPillarVectorIcon /> : <MapPinVectorIcon />}
                <span>
                  STAGE {hoveredStage.indexLabel} · {hoveredStage.period}
                </span>
              </span>
              <span className="career-map__hud-district">{hoveredStage.district}</span>
            </div>

            <div className="career-map__exp-heading">
              <strong className="career-map__exp-role">{hoveredStage.role}</strong>
              <span className="career-map__exp-org">
                {hoveredStage.organization} — {hoveredStage.building}
              </span>
            </div>

            <div className="career-map__exp-metric">{hoveredStage.metricBadge}</div>

            <p className="career-map__exp-summary">{hoveredStage.experienceSummary}</p>

            <div className="career-map__exp-footer">
              <div className="career-map__exp-tools">
                {hoveredStage.tools.slice(0, 4).map((tool) => (
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
            {viewMode === "graph" ? (
              selectedStage ? (
                <>
                  <div className="career-map__hud-top">
                    <span className="career-map__hud-badge">
                      <GraphPillarVectorIcon />
                      <span>STAGE {selectedStage.indexLabel}</span>
                    </span>
                    <span className="career-map__hud-district">{selectedStage.period}</span>
                  </div>
                  <strong className="career-map__hud-building">{selectedStage.role}</strong>
                  <span className="career-map__hud-org">
                    {selectedStage.organization} · {selectedStage.building}
                  </span>
                </>
              ) : (
                <>
                  <div className="career-map__hud-top">
                    <span className="career-map__hud-badge">
                      <GraphPillarVectorIcon />
                      <span>5-STAGE GRAPH</span>
                    </span>
                    <span className="career-map__hud-district">Three.js 3D</span>
                  </div>
                  <strong className="career-map__hud-building">College → Internships → Target Role</strong>
                  <span className="career-map__hud-org">
                    Hover any 3D pillar or photo card to preview experience
                  </span>
                </>
              )
            ) : selectedMapPin ? (
              <>
                <div className="career-map__hud-top">
                  <span className="career-map__hud-badge">
                    <MapPinVectorIcon />
                    <span>PIN {selectedMapPin.indexLabel}</span>
                  </span>
                  <span className="career-map__hud-district">{selectedMapPin.district}</span>
                </div>
                <strong className="career-map__hud-building">{selectedMapPin.building}</strong>
                <span className="career-map__hud-org">
                  {selectedMapPin.organization} · {selectedMapPin.role}
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
        <span className="career-map__hint">
          {viewMode === "graph"
            ? "College → Denso Ten → Phoenix → LUXASIA → Target Role"
            : "Pasig → Ortigas Center → BGC Corridor"}
        </span>
        <span className="career-map__hint">Hover pillar for experience · Click to focus · Drag to orbit</span>
      </div>
    </div>
  );
}
