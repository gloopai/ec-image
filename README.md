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
