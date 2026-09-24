import { mkdir,copyFile,writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const dest=resolve("public/mediapipe");
await mkdir(`${dest}/wasm`,{recursive:true});
for(const file of ["vision_wasm_internal.js","vision_wasm_internal.wasm","vision_wasm_nosimd_internal.js","vision_wasm_nosimd_internal.wasm"]){await copyFile(resolve("node_modules/@mediapipe/tasks-vision/wasm",file),`${dest}/wasm/${file}`);}
const response=await fetch("https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite");
if(!response.ok)throw new Error(`Model download failed: ${response.status}`);
await writeFile(`${dest}/blaze_face_short_range.tflite`,Buffer.from(await response.arrayBuffer()));
console.log("MediaPipe WASM and face detector model prepared locally. No camera frames are uploaded.");
