# Ecommerce Image Generator

Codex plugin for turning one product reference image into ecommerce product main images and detail-page long images.

## Open Source Overview

Ecommerce Image Generator is an open-source Codex plugin template for building repeatable ecommerce image-generation workflows. It packages prompt strategy, product-brief extraction, visual planning, and QA guidance into reusable skills that can be adapted for different storefronts, product categories, and image providers.

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
- generate product main images for marketplace listings and social covers
- plan 3-5 differentiated ecommerce detail-page long images
- generate prompt packs for each visual direction
- run visual QA for product fidelity, composition, and demo readiness
- package output paths and copywriting for recording or production review

It is designed for Taobao, Tmall, JD, Amazon, Xiaohongshu, and Douyin-style product listing work, especially when a user wants to provide one product image and quickly generate several polished main-image or detail-page concepts.

## Plugin Structure

```text
.
├── .codex-plugin/plugin.json
├── package.json
├── bin/ec-image
├── bin/ec-image.js
├── skills/ecommerce-detail-pages/SKILL.md
├── skills/ecommerce-main-images/SKILL.md
├── assets/style-presets.json
├── assets/main-image-presets.json
├── scripts/detail_page_brief_template.json
├── scripts/main_image_brief_template.json
└── tests/
```

## Example Prompt

```text
根据这张产品图，生成 5 套电商详情页长图
```

```text
根据这张产品图，生成 5 张淘宝商品主图
```

## Using in Codex

1. Install or enable this plugin in Codex.
2. Start a Codex thread and attach or reference a product image.
3. Ask Codex to generate ecommerce product images. The skills are triggered by prompts such as:

```text
根据这张产品图，生成 5 套电商详情页长图
```

```text
用 demo 模式，根据这个产品图做淘宝详情页长图，输出 3 套不同风格
```

```text
保持产品外观严格一致，生成天猫风格详情页，并给出每张图的文案和 storyboard
```

```text
保持产品外观一致，生成 Amazon white-background 主图，1000x1000，不要文字
```

```text
用 demo 模式生成 3 张小红书风格产品封面主图
```

Codex will inspect the product image, infer a product brief when details are missing, plan differentiated main-image or long-page concepts, generate prompt packs, run visual QA, and return image paths plus copywriting notes.

For best results, provide:

- a clear product reference image
- product name or category, if known
- target platform, such as Taobao, Tmall, JD, Amazon, Douyin, or Xiaohongshu
- desired output count, usually 3-5
- mode: `strict` for product fidelity, or `demo` for polished demo material
- any claims, specs, or forbidden wording that should be included or avoided

Main images should be saved under:

```text
public/demo-results/main/
```

By convention, generated images should be saved under:

```text
public/demo-results/detail/
```

If a demo input reference is also prepared, it should be saved under:

```text
public/demo-inputs/
```

## Using the npm CLI

The repository also includes a zero-dependency Node.js CLI for generating structured planning files without calling any image API. From a cloned checkout, run:

```bash
node bin/ec-image.js main \
  --input public/demo-results/main/watch-main-1.png \
  --product-name "男士机械腕表" \
  --category watch \
  --platform taobao \
  --count 5 \
  --mode strict \
  --out output/watch-main-plan
```

For local development, you can also run the compatibility wrapper:

```bash
bin/ec-image main --input public/demo-results/main/watch-main-1.png
```

After publishing or linking the package, use the npm-style command:

```bash
npx ec-image main \
  --input ./product.jpg \
  --product-name "男士机械腕表" \
  --platform taobao \
  --count 5
```

The CLI writes:

```text
output/watch-main-plan/
├── brief.json
├── main-image-plan.json
├── prompts.json
├── qa-checklist.json
└── summary.md
```

This is intentionally provider-neutral. It creates product briefs, main-image plans, prompt packs, and QA checklists; it does not generate final images or require an API key. The CLI uses only Node.js standard library modules and has no npm runtime dependencies.

The command prints step-by-step progress so long-running Codex or terminal sessions do not look stalled:

```text
[1/6] Parsed request
[2/6] Checked reference image
      status: found
[3/6] Planned image types
[4/6] Built planning package
[5/6] Wrote files
      ok brief.json
      ok main-image-plan.json
      ok prompts.json
      ok qa-checklist.json
      ok summary.md
[6/6] Ready for Codex or image generation
      output: output/main-image-plan
      next: review summary.md, then use prompts.json with your image generation workflow
```

Run validation with:

```bash
npm test
```

## How It Works

The plugin contributes two Codex skills:

```text
skills/ecommerce-detail-pages/SKILL.md
skills/ecommerce-main-images/SKILL.md
```

When the skill is triggered, Codex follows a structured workflow:

- inspect the provided product reference
- infer or collect product metadata
- plan 3-5 differentiated long-page concepts
- prepare visual, copy, negative, and reference prompts
- generate or hand off image creation through the available model provider
- review outputs for product fidelity and ecommerce usability
- package the final image paths, copy, storyboard notes, and caveats

The JSON files under `assets/` and `scripts/` provide reusable defaults for style directions, main-image types, and product-brief structure. They are intended to be extended rather than treated as fixed runtime dependencies.

## Product Main Image Generation

Use the `ecommerce-main-images` skill when the user wants product main images, listing hero images, white-background product images, marketplace covers, SKU showcases, or social commerce product covers.

Common prompts:

```text
根据这张产品图，生成 5 张淘宝商品主图，包含白底图、场景图和高级棚拍图
```

```text
保持产品外观一致，生成 Amazon white-background 主图，1000x1000，不要文字
```

```text
用 demo 模式生成 3 张小红书风格产品封面主图
```

Supported main-image types:

- `white-background`: clean white or near-white listing image with no text
- `lifestyle`: product-led usage scene
- `premium-studio`: high-end studio product beauty shot
- `comparison`: multi-angle, SKU, size, or feature comparison image
- `social-cover`: Xiaohongshu/Douyin-style mobile cover

Main image outputs should use:

```text
public/demo-results/main/<product-slug>-main-1.png
```

## Detail Page Generation

Use the `ecommerce-detail-pages` skill when the user wants ecommerce detail-page long images, product detail posters, Taobao/Tmall/JD detail images, or demo-ready long-form image sets.

## Modes

- `strict`: preserve the uploaded product as closely as possible. Best with image-reference or image-to-image capable models.
- `demo`: prioritize polished demo output. Useful when preparing believable product videos or app demos.

## Quality Bar

Generated detail pages should:

- preserve the product shape, color, and key visible details
- keep product main images focused, clean, and recognizable at thumbnail size
- include five clear content zones per detail-page long image
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
