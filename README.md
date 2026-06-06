# Ecommerce Detail Page Generator

Codex plugin for turning one product reference image into multiple ecommerce detail-page long images.

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
