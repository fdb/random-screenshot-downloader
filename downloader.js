const fs = require("fs");

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SCREENSHOT_RE = new RegExp(
  `<img class="no-click screenshot-image" src="(.*?)"`
);

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomUrl() {
  let url = "https://prnt.sc/";
  url += choice(LETTERS);
  url += choice(LETTERS);
  url += choice(NUMBERS);
  url += choice(NUMBERS);
  url += choice(NUMBERS);
  url += choice(NUMBERS);
  return url;
}

function arrayBufferToNodeBuffer(buffer) {
  const nodeBuffer = Buffer.alloc(buffer.byteLength);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < buffer.byteLength; ++i) {
    nodeBuffer[i] = view[i];
  }
  return nodeBuffer;
}

async function downloadAndSave() {
  const url = randomUrl();
  const res = await fetch(url);
  const text = await res.text();
  //   console.log(text);
  const match = text.match(SCREENSHOT_RE);
  if (match) {
    const url = match[1];
    console.log(url);
    const res = await fetch(url);
    const data = await res.arrayBuffer();
    const nodeBuffer = arrayBufferToNodeBuffer(data);
    const path = `./downloads/${url.split("/").pop()}`;
    // console.log(path);
    fs.writeFileSync(path, nodeBuffer);
  }
}

async function main() {
  for (;;) {
    try {
      await downloadAndSave();
    } catch (e) {
      console.log(e);
    }
  }
}

main();
