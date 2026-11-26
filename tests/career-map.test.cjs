const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const ts = require("typescript");

function loadTsModule(relativePath) {
  const file = path.resolve(__dirname, "..", relativePath);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const mod = { exports: {} };
  const requireFromFile = createRequire(file);
  new Function("require", "module", "exports", code)(requireFromFile, mod, mod.exports);
  return mod.exports;
}

test("CAREER_MAP_PINS projects accurately onto the Metro Manila corridor slab", () => {
  const mapData = loadTsModule("app/data/metroManilaMapData.ts");
  const { CAREER_MAP_PINS, SLAB_BOUNDS, projectLatLngToSlab, isWaterChannelAtSlab } = mapData;

  assert.deepEqual(
    CAREER_MAP_PINS.map((p) => p.barId),
    ["college", "denso", "phoenix", "luxasia"],
  );

  const projected = Object.fromEntries(
    CAREER_MAP_PINS.map((p) => [p.barId, projectLatLngToSlab(p.lat, p.lng)]),
  );

  for (const [id, pt] of Object.entries(projected)) {
    assert.ok(
      Math.abs(pt.x) < SLAB_BOUNDS.width * 0.5 - 0.5,
      `${id} x (${pt.x}) should sit cleanly inside slab width`,
    );
    assert.ok(
      Math.abs(pt.z) < SLAB_BOUNDS.depth * 0.5 - 0.5,
      `${id} z (${pt.z}) should sit cleanly inside slab depth`,
    );
    assert.equal(
      isWaterChannelAtSlab(pt.x, pt.z),
      false,
      `${id} must sit on land, not inside a carved river channel`,
    );
  }

  // Geographic sanity checks (-z is North, +z is South, -x is West, +x is East)
  assert.ok(projected.denso.z < 0, "Hanston Square (Ortigas) should be in the northern half (-z)");
  assert.ok(projected.phoenix.z > 0, "Udenna Tower (BGC) should be in the southern half (+z)");
  assert.ok(projected.luxasia.z > 0, "Three/NEO (BGC) should be in the southern half (+z)");
  assert.ok(projected.college.x > projected.denso.x, "RTU Pasig should be east (+x) of Ortigas");

  //Pasig River should carve through Guadalupe & Kalayaan Bridge coordinates
  const kalayaanBridge = projectLatLngToSlab(14.5663, 121.0549);
  assert.equal(isWaterChannelAtSlab(kalayaanBridge.x, kalayaanBridge.z), true);
});

test("West BGC towers (Udenna Tower & Three/NEO) have a realistic multi-block gap and staggered stems", () => {
  const { CAREER_MAP_PINS, SKYLINE_MASSINGS, projectLatLngToSlab } = loadTsModule(
    "app/data/metroManilaMapData.ts",
  );
  const phoenix = CAREER_MAP_PINS.find((p) => p.barId === "phoenix");
  const luxasia = CAREER_MAP_PINS.find((p) => p.barId === "luxasia");

  const p1 = projectLatLngToSlab(phoenix.lat, phoenix.lng);
  const p2 = projectLatLngToSlab(luxasia.lat, luxasia.lng);
  const centerDist = Math.hypot(p1.x - p2.x, p1.z - p2.z);
  const minClearance = (phoenix.towerFootprint[0] + luxasia.towerFootprint[0]) * 0.5;

  assert.ok(
    centerDist > minClearance,
    `BGC tower centers (${centerDist.toFixed(3)}) must exceed footprint half-width sum (${minClearance.toFixed(3)})`,
  );
  assert.ok(
    centerDist >= 1.0,
    `Udenna Tower & Three/NEO should have a clear multi-block BGC gap >= 1.0 slab units (got ${centerDist.toFixed(3)})`,
  );

  // Midpoint between Phoenix and LUXASIA should remain clear of tall filler massings
  const midX = (p1.x + p2.x) * 0.5;
  const midZ = (p1.z + p2.z) * 0.5;
  for (const b of SKYLINE_MASSINGS) {
    const bp = projectLatLngToSlab(b.lat, b.lng);
    const distToGapMid = Math.hypot(bp.x - midX, bp.z - midZ);
    assert.ok(
      distToGapMid > 0.32,
      `Skyline massing at (${b.lat}, ${b.lng}) is too close (${distToGapMid.toFixed(3)}) to the Phoenix-LUXASIA gap`,
    );
  }

  // Opposite-quadrant stem offsets prevent projected DOM badges from colliding in overview camera
  assert.ok(phoenix.stemOffset[0] * luxasia.stemOffset[0] < 0, "BGC stem X offsets should diverge");
  assert.ok(phoenix.stemOffset[1] * luxasia.stemOffset[1] < 0, "BGC stem Z offsets should diverge");
});

test("Emphasized milestone pills and hover experience metadata are complete and privacy-safe", () => {
  const { CAREER_MAP_PINS } = loadTsModule("app/data/metroManilaMapData.ts");
  assert.deepEqual(
    CAREER_MAP_PINS.map((p) => p.pillLabel),
    ["RTU PASIG", "DENSO TEN", "PHOENIX", "LUXASIA"],
  );

  const forbiddenPatterns = [
    /17\s+San\s+Miguel/i,
    /21st\s+Floor/i,
    /Rizal\s+Dr/i,
    /4th\s+Ave/i,
    /3rd\s+Ave/i,
    /30th\s+St/i,
  ];

  for (const pin of CAREER_MAP_PINS) {
    assert.ok(pin.metricBadge && pin.metricBadge.length > 4, `${pin.barId} must have metricBadge`);
    assert.ok(
      pin.experienceSummary && pin.experienceSummary.length > 20,
      `${pin.barId} must have experienceSummary`,
    );
    assert.ok(Array.isArray(pin.tools) && pin.tools.length >= 3, `${pin.barId} must list tools`);

    const publicText = [
      pin.shortLabel,
      pin.pillLabel,
      pin.building,
      pin.district,
      pin.organization,
      pin.role,
      pin.metricBadge,
      pin.experienceSummary,
      pin.tools.join(" "),
    ].join(" | ");

    for (const pattern of forbiddenPatterns) {
      assert.equal(
        pattern.test(publicText),
        false,
        `Public pin text "${publicText}" must not expose street/floor pattern ${pattern}`,
      );
    }
  }

  const chatRouteSrc = fs.readFileSync(
    path.resolve(__dirname, "..", "app/api/chat/route.ts"),
    "utf8",
  );
  for (const pattern of forbiddenPatterns) {
    assert.equal(
      pattern.test(chatRouteSrc),
      false,
      `Bop AI route.ts must not expose street/floor pattern ${pattern}`,
    );
  }
});


test("rAF timestamp clamping and trajectory sampling never yield negative or out-of-bounds indices", () => {
  const { computeFrameDeltaSeconds, getTrajectorySampleIndices } = loadTsModule(
    "app/data/metroManilaMapData.ts",
  );

  // When first rAF VSync timestamp precedes performance.now(), dt must clamp to 0 (never negative)
  assert.equal(computeFrameDeltaSeconds(1042.1, null), 0);
  assert.equal(computeFrameDeltaSeconds(1042.1, 1050.4), 0);
  assert.equal(computeFrameDeltaSeconds(2000, 1000), 0.05);

  for (const progress of [-1.25, -0.0013, 0, 0.5, 0.999999, 1, 4.75, NaN]) {
    const sample = getTrajectorySampleIndices(progress, 109);
    assert.ok(sample.index >= 0 && sample.index < 109);
    assert.ok(sample.nextIndex >= 0 && sample.nextIndex < 109);
    assert.ok(sample.alpha >= 0 && sample.alpha <= 1);
  }
});

test("CAREER_GRAPH_STAGES has 5 strictly ascending privacy-safe stages and morph helpers converge cleanly", () => {
  const {
    CAREER_GRAPH_STAGES,
    CAREER_MAP_PINS,
    computeMorphProgress,
    getStageMorphState,
    projectLatLngToSlab,
  } = loadTsModule("app/data/metroManilaMapData.ts");

  assert.deepEqual(
    CAREER_GRAPH_STAGES.map((s) => s.id),
    ["college", "denso", "phoenix", "luxasia", "full-time-target"],
  );

  for (let i = 1; i < CAREER_GRAPH_STAGES.length; i++) {
    assert.ok(
      CAREER_GRAPH_STAGES[i].graphHeight > CAREER_GRAPH_STAGES[i - 1].graphHeight,
      `Stage ${CAREER_GRAPH_STAGES[i].id} graphHeight must exceed ${CAREER_GRAPH_STAGES[i - 1].id}`,
    );
  }

  const forbiddenPatterns = [
    /17\s+San\s+Miguel/i,
    /21st\s+Floor/i,
    /Rizal\s+Dr/i,
    /4th\s+Ave/i,
    /3rd\s+Ave/i,
    /30th\s+St/i,
  ];
  for (const stage of CAREER_GRAPH_STAGES) {
    assert.ok(stage.image.startsWith("/assets/images/"), `${stage.id} must have served /assets/images path`);
    const summaryText = `${stage.building} | ${stage.district} | ${stage.experienceSummary}`;
    for (const pattern of forbiddenPatterns) {
      assert.equal(pattern.test(summaryText), false);
    }
  }

  // computeMorphProgress monotonic convergence & clamping
  assert.equal(computeMorphProgress(0, 1, -0.5, 0.85), 0);
  const midMorph = computeMorphProgress(0, 1, 0.425, 0.85);
  assert.ok(midMorph > 0.49 && midMorph < 0.51);
  assert.equal(computeMorphProgress(midMorph, 1, 2.0, 0.85), 1);
  assert.equal(computeMorphProgress(1, 0, 2.0, 0.85), 0);

  // morph = 0 -> ascending row at graphPos, all 5 visible
  for (const stage of CAREER_GRAPH_STAGES) {
    const s0 = getStageMorphState(stage.id, 0);
    assert.equal(s0.visibleInMode, true);
    assert.equal(s0.x, stage.graphPos[0]);
    assert.equal(s0.z, stage.graphPos[1]);
    assert.equal(s0.graphScaleY, 1);
  }

  // morph = 0.5 -> bounded midpoint
  const midLux = getStageMorphState("luxasia", 0.5);
  const luxPin = CAREER_MAP_PINS.find((p) => p.barId === "luxasia");
  const luxSlab = projectLatLngToSlab(luxPin.lat, luxPin.lng);
  assert.ok(Number.isFinite(midLux.x) && Number.isFinite(midLux.z));
  assert.ok(Math.abs(midLux.x - (CAREER_GRAPH_STAGES[3].graphPos[0] + luxSlab.x) * 0.5) < 1e-6);

  // morph = 1 -> 4 real-world Metro Manila coords with BGC gap intact, target hidden
  const p1 = getStageMorphState("phoenix", 1);
  const l1 = getStageMorphState("luxasia", 1);
  assert.ok(Math.hypot(p1.x - l1.x, p1.z - l1.z) >= 1.0);
  const targetAtMap = getStageMorphState("full-time-target", 1);
  assert.equal(targetAtMap.visibleInMode, false);
  assert.equal(targetAtMap.opacity, 0);
});
