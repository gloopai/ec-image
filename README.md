# Ecommerce Detail Page Generator

Codex plugin for turning one product reference image into multiple ecommerce detail-page long images.

## Open Source Overview

Ecommerce Detail Page Generator is an open-source Codex plugin template for building repeatable ecommerce image-generation workflows. It packages prompt strategy, product-brief extraction, visual planning, and QA guidance into a reusable skill that can be adapted for different storefronts, product categories, and image providers.

The project is useful for:

- developers building Codex plugins or AI-assisted ecommerce tools
- founders preparing realistic product demos from limited product imagery
- designers exploring multiple listing-page directions from one reference image
- marketplace operators who need structured creative briefs before production

The repository intentionally keeps the workflow provider-neutral. You can use the skill with any image model or generation pipeline that Codex can access, while keeping the same planning, output, and review structure.

## What It Does

This plugin provides a reusable Codex skill for ecommerce image generation workflows:

- inspect a product reference image
- infer product category, selling points, and visual constraints
- plan 3-5 differentiated ecommerce detail-page long images
- generate prompt packs for each visual direction
- run visual QA for product fidelity, composition, and demo readiness
- package output paths and copywriting for recording or production review

It is designed for Taobao, Tmall, JD, Amazon-style product listing work, especially when a user wants to provide one product image and quickly generate several polished detail-page concepts.

## Plugin Structure

```text
.
├── .codex-plugin/plugin.json
├── skills/ecommerce-detail-pages/SKILL.md
├── assets/style-presets.json
└── scripts/detail_page_brief_template.json
```

## Example Prompt

```text
根据这张产品图，生成 5 套电商详情页长图
```

## Using in Codex

1. Install or enable this plugin in Codex.
2. Start a Codex thread and attach or reference a product image.
3. Ask Codex to generate ecommerce detail-page images. The skill is triggered by prompts such as:

```text
根据这张产品图，生成 5 套电商详情页长图
```

```text
用 demo 模式，根据这个产品图做淘宝详情页长图，输出 3 套不同风格
```

```text
保持产品外观严格一致，生成天猫风格详情页，并给出每张图的文案和 storyboard
```

Codex will inspect the product image, infer a product brief when details are missing, plan differentiated long-page concepts, generate prompt packs, run visual QA, and return image paths plus copywriting notes.

For best results, provide:

- a clear product reference image
- product name or category, if known
- target platform, such as Taobao, Tmall, JD, Amazon, Douyin, or Xiaohongshu
- desired output count, usually 3-5
- mode: `strict` for product fidelity, or `demo` for polished demo material
- any claims, specs, or forbidden wording that should be included or avoided

By convention, generated images should be saved under:

```text
public/demo-results/detail/
```

If a demo input reference is also prepared, it should be saved under:

```text
public/demo-inputs/
```

## How It Works

The plugin contributes one Codex skill:

```text
skills/ecommerce-detail-pages/SKILL.md
```

When the skill is triggered, Codex follows a structured workflow:

- inspect the provided product reference
- infer or collect product metadata
- plan 3-5 differentiated long-page concepts
- prepare visual, copy, negative, and reference prompts
- generate or hand off image creation through the available model provider
- review outputs for product fidelity and ecommerce usability
- package the final image paths, copy, storyboard notes, and caveats

The JSON files under `assets/` and `scripts/` provide reusable defaults for style directions and product-brief structure. They are intended to be extended rather than treated as fixed runtime dependencies.

## Modes

- `strict`: preserve the uploaded product as closely as possible. Best with image-reference or image-to-image capable models.
- `demo`: prioritize polished demo output. Useful when preparing believable product videos or app demos.

## Quality Bar

Generated detail pages should:

- preserve the product shape, color, and key visible details
- include five clear content zones per long image
- produce differentiated layouts rather than repeated variants
- avoid unrelated products, distorted people, broken Chinese text, and SVG placeholders
- return usable image paths plus product copy and storyboard notes

## Roadmap Ideas

- add more platform presets for JD, Amazon, Xiaohongshu, and Douyin
- add category-specific prompt packs for beauty, electronics, apparel, food, and home goods
- add scripts for validating output dimensions and naming conventions
- add examples with before/after product references and generated detail pages
- add provider-specific recipes for image-reference and image-to-image generation

## Contributing

Contributions are welcome. Useful changes include:

- improving the skill workflow or QA checklist
- adding style presets and category-specific examples
- tightening prompt language for better product fidelity
- adding scripts that make generated outputs easier to validate or package
- improving bilingual documentation

Please keep changes focused and include examples when they affect user-facing workflow behavior.

## License

Add a license file before publishing this repository publicly. If you want broad reuse, consider MIT or Apache-2.0. If you need stronger patent language, Apache-2.0 is usually the better default.
