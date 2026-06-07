#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function runCli(args) {
  return spawnSync(process.execPath, [join(root, "bin/ec-image.js"), ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function validatePackageMetadata() {
  const packagePath = join(root, "package.json");
  assert.equal(existsSync(packagePath), true, "package.json should exist for npm usage");

  const pkg = readJson(packagePath);
  assert.equal(pkg.type, "module", "package should use ESM for the Node CLI");
  assert.equal(pkg.bin?.["ec-image"], "./bin/ec-image.js", "package should expose ec-image bin");
  assert.equal(pkg.scripts?.test, "node tests/validate_cli.js && node tests/validate_plugin.js");
}

function validateMainPlanGeneration() {
  const outDir = join(root, "tmp/cli-test-main");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const result = runCli([
    "main",
    "--input",
    "public/demo-results/main/watch-main-1.png",
    "--product-name",
    "男士机械腕表",
    "--category",
    "watch",
    "--platform",
    "taobao",
    "--count",
    "5",
    "--mode",
    "strict",
    "--out",
    outDir,
  ]);

  assert.equal(
    result.status,
    0,
    `CLI should succeed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`,
  );
  for (const expectedLine of [
    "[1/6] Parsed request",
    "[2/6] Checked reference image",
    "[3/6] Planned image types",
    "[4/6] Built planning package",
    "[5/6] Wrote files",
    "[6/6] Ready for Codex or image generation",
    "status: found",
    "ok brief.json",
    "ok main-image-plan.json",
    "ok prompts.json",
    "ok qa-checklist.json",
    "ok summary.md",
    "output:",
    "next: review summary.md",
    "brief.json",
    "main-image-plan.json",
    "prompts.json",
    "qa-checklist.json",
    "summary.md",
  ]) {
    assert.match(result.stdout, new RegExp(expectedLine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const name of [
    "brief.json",
    "main-image-plan.json",
    "prompts.json",
    "qa-checklist.json",
    "summary.md",
  ]) {
    assert.equal(existsSync(join(outDir, name)), true, `CLI should create ${name}`);
  }

  const brief = readJson(join(outDir, "brief.json"));
  assert.equal(brief.product_name, "男士机械腕表");
  assert.equal(brief.mode, "strict");

  const plan = readJson(join(outDir, "main-image-plan.json"));
  assert.deepEqual(
    plan.images.map((item) => item.image_type),
    ["white-background", "premium-studio", "lifestyle", "comparison", "social-cover"],
  );

  const prompts = readJson(join(outDir, "prompts.json"));
  assert.equal(prompts.prompts.length, 5);
  assert.match(prompts.prompts[0].reference_instruction, /preserve product/);

  const qa = readJson(join(outDir, "qa-checklist.json"));
  assert.match(qa.checks.join("\n"), /product remains the main subject/);
  assert.match(qa.checks.join("\n"), /white-background/);
  assert.match(qa.checks.join("\n"), /watermarks/);

  const summary = readFileSync(join(outDir, "summary.md"), "utf8");
  assert.match(summary, /男士机械腕表/);
  assert.match(summary, /white-background/);
  assert.match(summary, /prompts\.json/);
}

function validateErrorHandling() {
  const result = runCli([
    "main",
    "--input",
    "public/demo-results/main/missing.png",
    "--out",
    join(root, "tmp/cli-test-missing"),
  ]);

  assert.equal(result.status, 2, "missing input should exit with code 2");
  assert.match(result.stderr, /input image does not exist/);
}

validatePackageMetadata();
validateMainPlanGeneration();
validateErrorHandling();
console.log("cli validation passed");
