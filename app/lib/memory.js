// app/lib/memory.js

let memoryData = {};

export function readMemory(key) {
  return memoryData[key] || null;
}

export function writeMemory(key, value) {
  memoryData[key] = value;
}
