#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function readText(path) {
  return readFileSync(join(root, path), "utf8");
}

function readJson(path) {
  return JSON.parse(readText(path));
}

function assertContains(text, expected, source) {
  assert.equal(
    text.includes(expected),
    true,
    `${source} is missing expected text: ${expected}`,
  );
}

function validateMainImageSkill() {
  const skill = readText("skills/ecommerce-main-images/SKILL.md");
  for (const term of [
    "ecommerce-main-images",
    "product main images",
    "white-background",
    "lifestyle",
    "premium-studio",
    "public/demo-results/main/",
    "visual QA",
  ]) {
    assertContains(skill, term, "skills/ecommerce-main-images/SKILL.md");
  }
}

function validateMainImageAssets() {
  const presets = readJson("assets/main-image-presets.json");
  const presetIds = new Set(presets.presets.map((preset) => preset.id));
  for (const expected of [
    "white-background",
    "lifestyle",
    "premium-studio",
    "comparison",
    "social-cover",
  ]) {
    assert.equal(presetIds.has(expected), true, `missing preset: ${expected}`);
  }

  const template = readJson("scripts/main_image_brief_template.json");
  assert.equal(template.output_count, 5);
  assert.equal("main_image_types" in template, true);
  assert.equal("target_dimensions" in template, true);
}

function validateManifestAndReadme() {
  const manifest = readJson(".codex-plugin/plugin.json");
  const capabilities = new Set(manifest.interface.capabilities);
  assert.equal(capabilities.has("main-image-generation"), true);
  assertContains(
    manifest.interface.longDescription,
    "main image",
    ".codex-plugin/plugin.json longDescription",
  );

  const readme = readText("README.md");
  for (const term of [
    "Product Main Image Generation",
    "skills/ecommerce-main-images/SKILL.md",
    "public/demo-results/main/",
    "Amazon white-background",
    "npx ec-image",
  ]) {
    assertContains(readme, term, "README.md");
  }
}

validateMainImageSkill();
validateMainImageAssets();
validateManifestAndReadme();
console.log("plugin validation passed");
