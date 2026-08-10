import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const requiredScripts = "src/cv/detectA4.js src/cv/warp.js src/ui/konvaLayer.js public/app.js".split(" ");
const indexPath = path.join(root, "public", "index.html");
const indexHtml = fs.readFileSync(indexPath, "utf8");

for (const scriptPath of requiredScripts) {
  const sourcePath = path.join(root, scriptPath);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source file: ${scriptPath}`);
  }
}

const referencedAssets = "../src/cv/detectA4.js ../src/cv/warp.js ../src/ui/konvaLayer.js app.js".split(" ");
for (const asset of referencedAssets) {
  if (!indexHtml.includes(`src=\"${asset}\"`)) {
    throw new Error(`Asset is not referenced by public/index.html: ${asset}`);
  }
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "contech-measure-"));
const distRoot = path.join(tempRoot, "dist");
fs.mkdirSync(distRoot, { recursive: true });
fs.cpSync(path.join(root, "public"), distRoot, { recursive: true });
fs.cpSync(path.join(root, "src"), path.join(distRoot, "src"), { recursive: true });

for (const asset of referencedAssets) {
  const relativeAsset = asset.startsWith("../") ? asset.slice(3) : asset;
  const deployedPath = path.join(distRoot, relativeAsset);
  if (!fs.existsSync(deployedPath)) {
    throw new Error(`Asset is missing from assembled site: ${relativeAsset}`);
  }
}

console.log("Site checks passed.");
