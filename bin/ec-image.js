#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const defaultMainTypes = [
  "white-background",
  "premium-studio",
  "lifestyle",
  "comparison",
  "social-cover",
];

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function slugify(value) {
  const cleaned = [...value.trim()]
    .map((char) => (/[\p{Letter}\p{Number}]/u.test(char) ? char.toLowerCase() : "-"))
    .join("");
  const slug = cleaned.split("-").filter(Boolean).join("-");
  return slug || "product";
}

function resolveImageTypes(count) {
  if (count <= defaultMainTypes.length) {
    return defaultMainTypes.slice(0, count);
  }

  return Array.from({ length: count }, (_, index) => {
    return defaultMainTypes[index % defaultMainTypes.length];
  });
}

function purposeFor(imageType, platform) {
  const purposes = {
    "white-background": `${platform} primary clean listing image`,
    "premium-studio": "premium studio product beauty shot",
    lifestyle: "product-led usage scenario image",
    comparison: "multi-angle, SKU, or detail comparison image",
    "social-cover": "mobile-first social commerce cover image",
  };
  return purposes[imageType];
}

function visualPrompt(productName, platform, imageType) {
  const shared =
    `Create a ${platform} ecommerce main image for ${productName}. ` +
    "Use the provided product reference image as the source of truth. ";
  const details = {
    "white-background":
      "Center a single product on a clean white background with soft natural shadow, no text, no props.",
    "premium-studio":
      "Use refined studio lighting, controlled highlights, premium material detail, and a clean commercial composition.",
    lifestyle:
      "Place the product in a believable use scene while keeping it dominant, sharp, and unobstructed.",
    comparison: "Create a clean multi-angle or detail comparison layout without unverifiable claims.",
    "social-cover":
      "Create a mobile-first social commerce cover with product dominance, concise headline space, and strong thumbnail impact.",
  };
  return shared + details[imageType];
}

function copyPrompt(imageType) {
  if (imageType === "white-background") {
    return "no text";
  }
  if (imageType === "social-cover") {
    return "optional short headline only, no unverifiable claims";
  }
  return "minimal ecommerce copy only when useful";
}

function buildBrief(options, imageTypes) {
  const template = loadJson(join(root, "scripts/main_image_brief_template.json"));
  return {
    ...template,
    product_name: options.productName || "Unnamed product",
    category: options.category || "",
    platform: options.platform,
    mode: options.mode,
    output_count: options.count,
    input_image: options.input,
    main_image_types: imageTypes,
  };
}

function buildPlan(options, imageTypes) {
  const presets = Object.fromEntries(
    loadJson(join(root, "assets/main-image-presets.json")).presets.map((preset) => [
      preset.id,
      preset,
    ]),
  );
  const productName = options.productName || "the product";
  return {
    product_name: productName,
    platform: options.platform,
    mode: options.mode,
    images: imageTypes.map((imageType, index) => {
      const preset = presets[imageType];
      return {
        index: index + 1,
        image_type: imageType,
        purpose: purposeFor(imageType, options.platform),
        ratio: preset.ratio || "1:1",
        layout: preset.layout,
        output_path: `${slugify(productName)}-main-${index + 1}.png`,
      };
    }),
  };
}

function buildPrompts(options, imageTypes) {
  const productName = options.productName || "the product";
  return {
    product_name: productName,
    prompts: imageTypes.map((imageType, index) => ({
      index: index + 1,
      image_type: imageType,
      visual_prompt: visualPrompt(productName, options.platform, imageType),
      copy_prompt: copyPrompt(imageType),
      negative_prompt:
        "avoid mutated product shape, extra logos, unrelated products, unreadable text, " +
        "watermarks, distorted hands, clutter, fake claims, and low-resolution output",
      reference_instruction:
        "preserve product shape, color, material, visible details, and key structure from " +
        "the provided reference image",
    })),
  };
}

function buildQa(options, imageTypes) {
  return {
    product_name: options.productName || "the product",
    checks: [
      `exactly ${options.count} usable main images are planned`,
      "product remains the main subject in every image",
      "product shape, color, material, and key visible details match the reference",
      "white-background images contain no text, props, borders, badges, or watermarks",
      "lifestyle images do not hide the product behind hands, sleeves, or props",
      "each image type has a distinct purpose rather than a simple background color change",
      "no fake logos, unreadable text, unsupported claims, distorted people, or watermarks",
      "outputs are suitable for marketplace thumbnail review before production use",
    ],
    image_types: imageTypes,
  };
}

function buildSummary(options, imageTypes) {
  const productName = options.productName || "Unnamed product";
  const rows = imageTypes.map((imageType) => `- \`${imageType}\``).join("\n");
  return `# Ecommerce Main Image Plan

Product: ${productName}
Platform: ${options.platform}
Mode: ${options.mode}
Input image: \`${options.input}\`

## Planned Image Types

${rows}

## Generated Files

- \`brief.json\`
- \`main-image-plan.json\`
- \`prompts.json\`
- \`qa-checklist.json\`
- \`summary.md\`

This CLI creates a local planning package only. It does not call image APIs or generate final images.
`;
}

function parseMainArgs(argv) {
  const options = {
    productName: "",
    category: "",
    platform: "taobao",
    count: 5,
    mode: "strict",
    out: "output/main-image-plan",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const nextValue = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a value`);
      }
      index += 1;
      return value;
    };

    switch (arg) {
      case "--input":
        options.input = nextValue();
        break;
      case "--product-name":
        options.productName = nextValue();
        break;
      case "--category":
        options.category = nextValue();
        break;
      case "--platform":
        options.platform = nextValue();
        break;
      case "--count":
        options.count = Number.parseInt(nextValue(), 10);
        break;
      case "--mode":
        options.mode = nextValue();
        break;
      case "--out":
        options.out = nextValue();
        break;
      case "--help":
      case "-h":
        printHelp();
        return { help: true };
      default:
        throw new Error(`unknown argument: ${arg}`);
    }
  }

  return options;
}

function validateOptions(options) {
  if (!options.input) {
    throw new Error("--input is required");
  }
  if (!Number.isInteger(options.count) || options.count < 1 || options.count > 6) {
    throw new Error("--count must be between 1 and 6");
  }
  if (!["strict", "demo"].includes(options.mode)) {
    throw new Error("--mode must be strict or demo");
  }
  if (!existsSync(resolve(root, options.input))) {
    const displayPath = options.input;
    const error = new Error(`input image does not exist: ${displayPath}`);
    error.exitCode = 2;
    throw error;
  }
}

function logStep(step, message, details = []) {
  console.log(`[${step}/6] ${message}`);
  for (const detail of details) {
    console.log(`      ${detail}`);
  }
}

function runMain(argv) {
  const options = parseMainArgs(argv);
  if (options.help) {
    return 0;
  }

  logStep(1, "Parsed request", [
    `product: ${options.productName || "Unnamed product"}`,
    `platform: ${options.platform}`,
    `mode: ${options.mode}`,
    `count: ${options.count}`,
  ]);

  validateOptions(options);
  const inputPath = resolve(root, options.input);
  logStep(2, "Checked reference image", [`input: ${inputPath}`, "status: found"]);

  const imageTypes = resolveImageTypes(options.count);
  logStep(3, "Planned image types", imageTypes.map((type, index) => `${index + 1}. ${type}`));

  const outDir = resolve(root, options.out);
  mkdirSync(outDir, { recursive: true });

  const files = [
    ["brief.json", buildBrief(options, imageTypes), "json"],
    ["main-image-plan.json", buildPlan(options, imageTypes), "json"],
    ["prompts.json", buildPrompts(options, imageTypes), "json"],
    ["qa-checklist.json", buildQa(options, imageTypes), "json"],
    ["summary.md", buildSummary(options, imageTypes), "text"],
  ];
  logStep(4, "Built planning package", [
    "brief, image plan, prompt packs, QA checklist, and summary are ready",
  ]);

  for (const [name, content, type] of files) {
    const path = join(outDir, name);
    if (type === "json") {
      writeJson(path, content);
    } else {
      writeFileSync(path, content, "utf8");
    }
  }
  logStep(5, "Wrote files", files.map(([name]) => `ok ${name}`));

  logStep(6, "Ready for Codex or image generation", [
    `output: ${outDir}`,
    "files: brief.json, main-image-plan.json, prompts.json, qa-checklist.json, summary.md",
    "next: review summary.md, then use prompts.json with your image generation workflow",
  ]);
  return 0;
}

function printHelp() {
  console.log(`Usage:
  ec-image main --input <path> [options]

Options:
  --input <path>          Path to the product reference image
  --product-name <name>   Product name
  --category <category>   Product category
  --platform <platform>   Target platform, default: taobao
  --count <number>        Number of main images to plan, 1-6, default: 5
  --mode <mode>           strict or demo, default: strict
  --out <dir>             Output directory, default: output/main-image-plan
`);
}

function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;
  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return 0;
  }
  if (command !== "main") {
    throw new Error(`unknown command: ${command}`);
  }
  return runMain(rest);
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(error.message);
  process.exitCode = error.exitCode || 2;
}
