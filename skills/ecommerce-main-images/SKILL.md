---
name: ecommerce-main-images
description: Use when the user provides a product image and asks to generate ecommerce product main images, listing hero images, white-background product images, marketplace cover images, SKU showcase images, Amazon/Taobao/Tmall/JD main images, or social commerce product covers. The workflow turns one product reference image into 1-6 product-focused main image concepts with platform-aware composition, prompt strategy, visual QA, and packaged outputs.
---

# Ecommerce Main Images

## Goal

Generate polished ecommerce product main images from a product reference image. The output should look like marketplace-ready listing imagery, not a detail page, poster, or generic lifestyle ad.

Use this skill when the user says things like:
- "根据这张产品图生成商品主图"
- "做 5 张淘宝主图"
- "生成 Amazon white-background 主图"
- "给这个产品做小红书封面图"
- "保持产品一致，生成白底图和场景主图"

## Inputs

Collect or infer these fields:
- Product image: required. Prefer a local file path or uploaded image.
- Product name: optional, infer when safe.
- Category: optional.
- Platform: default to Taobao/Tmall unless the user specifies JD, Amazon, Xiaohongshu, Douyin, etc.
- Output count: default 5 main images.
- Main image types: default to a mixed set unless the user specifies one type.
- Mode:
  - `strict`: preserve the uploaded product as closely as possible.
  - `demo`: prioritize polished demo output while keeping the product believable.

If the user needs strict marketplace compliance or exact product identity, state that product fidelity requires an image-reference, image-to-image, or product-retouching capable provider.

## Main Image Types

Use these type names in plans and prompt packs:
- `white-background`: clean product cutout or studio render on white/light background, minimal or no text.
- `lifestyle`: product in a believable use scene, with the product still dominant.
- `premium-studio`: high-end studio lighting, material detail, clean shadows, premium composition.
- `comparison`: multi-angle, SKU, size, or feature comparison layout.
- `social-cover`: Xiaohongshu/Douyin-style cover with stronger mood, readable headline, and mobile-first framing.

## Recommended Workflow

1. Inspect the product image.
   - Identify product type, shape, color/material, logo/label position, controls, packaging, and visible accessories.
   - Note anything that must not change, such as silhouette, nozzle shape, screen shape, cap color, button placement, branding, or pack count.

2. Build a main-image brief.
   - Product name: concise and listing-friendly.
   - Category: inferred or supplied.
   - Platform fit: image ratio, text density, background constraints, and likely marketplace rules.
   - Visual priority: product dominance, product angle, background, shadow, prop limits, and text policy.
   - Risk list: wrong product shape, extra products, fake logos, over-decorated backgrounds, unreadable text, distorted hands, or non-compliant claims.

3. Plan 1-6 main images.
   Prefer a mixed set when the user asks for multiple images:
   - one `white-background` primary listing image.
   - one `premium-studio` product beauty image.
   - one `lifestyle` use-scene image.
   - one `comparison` or SKU/angle image when useful.
   - one `social-cover` image when the platform is Xiaohongshu/Douyin or the user wants a cover.

4. Keep main images product-first.
   - The product should be the clearest visual subject.
   - Avoid long copy blocks; ecommerce main images should be scannable at thumbnail size.
   - For Amazon white-background images, avoid text, props, badges, decorative borders, and non-white backgrounds.
   - For Taobao/Tmall/JD, allow concise sales copy only when the user requests it or the platform style benefits from it.

5. Generate prompt packs.
   For each main image, prepare:
   - `image_type`: one of the main image types.
   - `visual_prompt`: product placement, camera angle, background, lighting, ratio, and platform style.
   - `copy_prompt`: optional short headline or claim. Use "no text" when text should be avoided.
   - `negative_prompt`: avoid mutated product shape, extra logos, unrelated products, unreadable text, watermark, distorted people/hands, clutter, and forbidden claims.
   - `reference_instruction`: explicitly preserve product shape/color/material/visible details from the uploaded reference image.

6. Generate images.
   - Prefer image-reference or image-to-image models for `strict` mode.
   - Use text-to-image only for `demo` mode or when exact fidelity is not critical.
   - If a provider cannot preserve the product, return prompt packs and explain the fidelity limitation instead of overstating the result.

7. Run visual QA.
   Check:
   - exactly the requested number of usable outputs.
   - product resembles the reference and remains the main subject.
   - ratio matches the requested target, commonly 1:1 or 4:5.
   - each image has a meaningfully different purpose, not just a color variant.
   - no unrelated products, fake badges, broken Chinese text, distorted hands/faces, or watermarks.
   - `white-background` outputs are genuinely clean and text-free when intended.

8. Package the result.
   Return:
   - output image paths with previews if possible.
   - product name and platform form-fill copy.
   - the main-image plan with image types and intended use.
   - visual QA notes and caveats about product fidelity or provider limitations.

## Output Folder Convention

When working inside a project, save generated or curated images under:

```text
public/demo-results/main/<product-slug>-main-1.png
public/demo-results/main/<product-slug>-main-2.png
public/demo-results/main/<product-slug>-main-3.png
public/demo-results/main/<product-slug>-main-4.png
public/demo-results/main/<product-slug>-main-5.png
```

If also preparing a demo input reference, save it under:

```text
public/demo-inputs/<product-slug>-product-reference.png
```

## Quality Bar

The result should be suitable for listing-page review or demo recording:
- the product is recognizable at thumbnail size.
- composition is clean, direct, and platform-appropriate.
- white-background images avoid text and unrelated props.
- social cover images are still product-led, not generic lifestyle posters.
- claims are supplied by the user, visible from product context, or clearly marked as draft copy.

For production use, raise the bar:
- follow the target marketplace's current image rules.
- use a provider that supports product reference conditioning.
- verify product identity, packaging text, logos, and regulatory claims manually.
