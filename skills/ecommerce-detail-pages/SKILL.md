---
name: ecommerce-detail-pages
description: Use when the user provides a product image and asks to generate ecommerce detail-page long images, product detail posters, Taobao/Tmall/JD detail images, or demo-ready product image sets. The workflow turns one product reference image into 3-5 differentiated long-form ecommerce visuals with copy, section planning, prompt strategy, visual QA, and packaged outputs.
---

# Ecommerce Detail Pages

## Goal

Generate polished ecommerce detail-page long images from a product reference image. The output should look like production-ready listing material, not generic AI art.

Use this skill when the user says things like:
- "给你一张产品图，生成几套详情图"
- "根据产品图片做电商详情页"
- "生成 5 张详情页长图"
- "做淘宝/天猫/京东详情页图"
- "录视频用的假数据/演示图"

## Inputs

Collect or infer these fields:
- Product image: required. Prefer a local file path or uploaded image.
- Product name: optional, infer when safe.
- Category: optional.
- Core selling points: optional. If absent, infer 4-6 plausible points from the image and category.
- Platform: default to Tmall/Taobao style unless the user specifies JD, Amazon, Xiaohongshu, Douyin, etc.
- Output count: default 5 long images.
- Mode:
  - `strict`: preserve the uploaded product as closely as possible.
  - `demo`: prioritize polished video-demo output; it is acceptable to prepare a matching demo upload reference from the final image set.

If the product identity matters and only text-to-image generation is available, state that strict fidelity requires an image-reference or image-to-image capable provider.

## Recommended Workflow

1. Inspect the product image.
   - Identify product type, color/material, visible structure, and likely usage scenes.
   - Note anything that must not change, such as shape, logo, color, button placement, nozzle shape, packaging, or screen.

2. Build a product brief.
   - Product name: concise and ecommerce-friendly.
   - Audience: who buys it.
   - Platform fit: what the listing should emphasize.
   - Selling points: 4-6 points grounded in product category and visible product.
   - Risk list: things the generator must avoid, especially wrong product shape, unrelated people, broken text, distorted hands, or excessive decorative clutter.

3. Plan 5 long images.
   Each image should be a complete long detail page with 5 content zones:
   - Hero: product beauty shot, headline, 3-4 key claims.
   - Feature 1: strongest functional benefit.
   - Feature 2: material, mechanism, performance, or data proof.
   - Scenario: real use case or comparison scene.
   - Trust: service, warranty, shipping, specs, or quality promise.

4. Make the 5 images visually different.
   Do not generate five copies with minor color changes. Vary:
   - layout rhythm: stacked bands, asymmetric cards, editorial sections, grid panels, dark premium scene, warm home scene.
   - camera angle: front, close-up, top-down, in-use, travel/storage.
   - environment: clean studio, home lifestyle, office/travel, material macro, service/spec section.
   - palette: cool clean, warm lifestyle, dark premium, platform-neutral, light technical.

5. Generate prompt packs.
   For each long image, prepare:
   - `visual_prompt`: layout, scenes, product placement, lighting, style, ratio.
   - `copy_prompt`: Chinese ecommerce copy and section titles.
   - `negative_prompt`: avoid unrelated products, mutated product shape, warped people, unreadable text, extra logos, watermarks, garbled Chinese.
   - `reference_instruction`: explicitly preserve product shape/color/details from the uploaded reference image.

6. Generate images.
   - Prefer image-reference or image-to-image models for `strict` mode.
   - Use text-to-image only when product fidelity is not critical or for `demo` mode.
   - For demo recording, a valid strategy is to generate excellent final images first, then crop or prepare a matching reference product input so the demo flow looks coherent.

7. Verify visually before returning.
   Check:
   - exactly 3-5 usable outputs, matching the requested count.
   - long image aspect, preferably around 800-1200 px wide and 1800-3200 px tall.
   - the product resembles the reference.
   - each image has different composition.
   - no distorted faces/hands unless people are necessary.
   - no SVG placeholders unless the user explicitly wants SVG.
   - no obvious broken Chinese text in important headlines.

8. Package the result.
   Return:
   - output image paths with previews if possible.
   - product name and form-fill copy for the app.
   - the 5-image storyboard summary.
   - any caveats about product fidelity or model limitations.

## Output Folder Convention

When working inside a project, save generated or curated images under:

```text
public/demo-results/detail/<product-slug>-detail-1.png
public/demo-results/detail/<product-slug>-detail-2.png
public/demo-results/detail/<product-slug>-detail-3.png
public/demo-results/detail/<product-slug>-detail-4.png
public/demo-results/detail/<product-slug>-detail-5.png
```

If also preparing a demo input reference, save it under:

```text
public/demo-inputs/<product-slug>-product-reference.png
```

## Quality Bar

The result should be suitable for a founder or developer to record a product demo video:
- first screen immediately shows a real product image workflow.
- generated thumbnails look credible at small size.
- preview images are visually rich enough to inspect.
- copy sounds like ecommerce listing copy, not feature documentation.
- the product is consistent enough that the demo does not feel fake or random.

For production use, raise the bar:
- use a provider that supports product reference image conditioning.
- avoid making claims that are not supplied by the user or visible from product context.
- keep platform rules in mind for text density, forbidden words, and exaggeration.
