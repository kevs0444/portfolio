import fs from "node:fs/promises";

const outputDir = "C:/Users/marke/.codex/visualizations/2026/08/29/01a04be1-0784-7922-8650-e1c1566abaae";
const targets = await fetch("http://127.0.0.1:9224/json/list").then((response) => response.json());
const page = targets.find((target) => target.type === "page" && target.url.startsWith("http://127.0.0.1:3000"));
if (!page) throw new Error("Portfolio QA page was not found.");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let requestId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const callback = pending.get(message.id);
  if (!callback) return;
  pending.delete(message.id);
  if (message.error) callback.reject(new Error(message.error.message));
  else callback.resolve(message.result);
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++requestId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function prepare(width, height, mobile) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
  await send("Page.navigate", { url: "http://127.0.0.1:3000/" });
  await sleep(1800);
  await send("Runtime.evaluate", {
    expression: `
      document.documentElement.style.scrollBehavior = 'auto';
      document.querySelectorAll('[style]').forEach((element) => {
        if (element.style.opacity) element.style.setProperty('opacity', '1', 'important');
        if (element.style.transform) element.style.setProperty('transform', 'none', 'important');
      });
    `,
  });
}

async function capture(name, expression) {
  await send("Runtime.evaluate", { expression });
  await sleep(800);
  const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await fs.writeFile(`${outputDir}/${name}.png`, Buffer.from(result.data, "base64"));
}

await prepare(1440, 1000, false);
await capture("gear-final-desktop", `document.getElementById('gear')?.scrollIntoView({block:'start'})`);
await capture("contact-final-desktop", `document.getElementById('contact')?.scrollIntoView({block:'start'})`);
await send("Runtime.evaluate", {
  expression: `
    window.scrollTo(0, 0);
    [...document.querySelectorAll('button')]
      .filter((button) => button.textContent?.includes('Preview Resume'))
      .forEach((button) => button.click());
  `,
});
await sleep(800);
await capture("resume-final-desktop", `void 0`);

await prepare(390, 844, true);
await capture("projects-final-mobile", `document.getElementById('projects')?.scrollIntoView({block:'start'})`);
await capture("gear-final-mobile", `document.getElementById('gear')?.scrollIntoView({block:'start'})`);
await capture("contact-final-mobile", `document.getElementById('contact')?.scrollIntoView({block:'start'})`);
await send("Runtime.evaluate", {
  expression: `
    window.scrollTo(0, 0);
    [...document.querySelectorAll('button')]
      .filter((button) => button.textContent?.includes('Preview Resume'))
      .forEach((button) => button.click());
  `,
});
await sleep(800);
await capture("resume-final-mobile", `void 0`);

socket.close();
