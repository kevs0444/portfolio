import sharp from "sharp";

const frames = [
  {
    source: "C:/Users/marke/.codex/generated_images/01a04be1-0784-7922-8650-e1c1566abaae/exec-f1990ebd-8884-40ec-9d39-b48d1790cf12.png",
    output: "public/assets/images/kevs-ai-chibi-open.png",
  },
  {
    source: "C:/Users/marke/.codex/generated_images/01a04be1-0784-7922-8650-e1c1566abaae/exec-22e873b1-1629-4c60-b0af-46b454b937df.png",
    output: "public/assets/images/kevs-ai-chibi-blink.png",
  },
];

for (const frame of frames) {
  const { data, info } = await sharp(frame.source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const total = info.width * info.height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const isBackdrop = (index) => {
    const offset = index * 4;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    return Math.max(red, green, blue) - Math.min(red, green, blue) < 12 && Math.min(red, green, blue) > 218;
  };

  const enqueue = (index) => {
    if (index < 0 || index >= total || visited[index] || !isBackdrop(index)) return;
    visited[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < info.width; x += 1) {
    enqueue(x);
    enqueue((info.height - 1) * info.width + x);
  }
  for (let y = 0; y < info.height; y += 1) {
    enqueue(y * info.width);
    enqueue(y * info.width + info.width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % info.width;
    const y = Math.floor(index / info.width);
    if (x > 0) enqueue(index - 1);
    if (x + 1 < info.width) enqueue(index + 1);
    if (y > 0) enqueue(index - info.width);
    if (y + 1 < info.height) enqueue(index + info.width);
  }

  for (let index = 0; index < total; index += 1) {
    if (visited[index]) data[index * 4 + 3] = 0;
  }

  await sharp(data, { raw: info })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(640, 640, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(frame.output);
}
