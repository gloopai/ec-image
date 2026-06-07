#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DEFAULT_MAIN_TYPES = [
    "white-background",
    "premium-studio",
    "lifestyle",
    "comparison",
    "social-cover",
]


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def slugify(value: str) -> str:
    cleaned = "".join(ch.lower() if ch.isalnum() else "-" for ch in value.strip())
    cleaned = "-".join(part for part in cleaned.split("-") if part)
    return cleaned or "product"


def resolve_image_types(count: int) -> list[str]:
    if count <= len(DEFAULT_MAIN_TYPES):
        return DEFAULT_MAIN_TYPES[:count]
    return [DEFAULT_MAIN_TYPES[index % len(DEFAULT_MAIN_TYPES)] for index in range(count)]


def build_brief(args: argparse.Namespace, image_types: list[str]) -> dict:
    template = load_json(ROOT / "scripts/main_image_brief_template.json")
    return {
        **template,
        "product_name": args.product_name or "Unnamed product",
        "category": args.category or "",
        "platform": args.platform,
        "mode": args.mode,
        "output_count": args.count,
        "input_image": args.input,
        "main_image_types": image_types,
    }


def build_plan(args: argparse.Namespace, image_types: list[str]) -> dict:
    presets = {
        preset["id"]: preset for preset in load_json(ROOT / "assets/main-image-presets.json")["presets"]
    }
    product_name = args.product_name or "the product"
    images = []
    for index, image_type in enumerate(image_types, start=1):
        preset = presets[image_type]
        images.append(
            {
                "index": index,
                "image_type": image_type,
                "purpose": purpose_for(image_type, args.platform),
                "ratio": preset.get("ratio", "1:1"),
                "layout": preset["layout"],
                "output_path": f"{slugify(product_name)}-main-{index}.png",
            }
        )
    return {
        "product_name": product_name,
        "platform": args.platform,
        "mode": args.mode,
        "images": images,
    }


def purpose_for(image_type: str, platform: str) -> str:
    purposes = {
        "white-background": f"{platform} primary clean listing image",
        "premium-studio": "premium studio product beauty shot",
        "lifestyle": "product-led usage scenario image",
        "comparison": "multi-angle, SKU, or detail comparison image",
        "social-cover": "mobile-first social commerce cover image",
    }
    return purposes[image_type]


def build_prompts(args: argparse.Namespace, image_types: list[str]) -> dict:
    product_name = args.product_name or "the product"
    prompts = []
    for index, image_type in enumerate(image_types, start=1):
        prompts.append(
            {
                "index": index,
                "image_type": image_type,
                "visual_prompt": visual_prompt(product_name, args.platform, image_type),
                "copy_prompt": copy_prompt(image_type),
                "negative_prompt": (
                    "avoid mutated product shape, extra logos, unrelated products, unreadable text, "
                    "watermarks, distorted hands, clutter, fake claims, and low-resolution output"
                ),
                "reference_instruction": (
                    "preserve product shape, color, material, visible details, and key structure from "
                    "the provided reference image"
                ),
            }
        )
    return {"product_name": product_name, "prompts": prompts}


def visual_prompt(product_name: str, platform: str, image_type: str) -> str:
    shared = (
        f"Create a {platform} ecommerce main image for {product_name}. "
        "Use the provided product reference image as the source of truth. "
    )
    details = {
        "white-background": "Center a single product on a clean white background with soft natural shadow, no text, no props.",
        "premium-studio": "Use refined studio lighting, controlled highlights, premium material detail, and a clean commercial composition.",
        "lifestyle": "Place the product in a believable use scene while keeping it dominant, sharp, and unobstructed.",
        "comparison": "Create a clean multi-angle or detail comparison layout without unverifiable claims.",
        "social-cover": "Create a mobile-first social commerce cover with product dominance, concise headline space, and strong thumbnail impact.",
    }
    return shared + details[image_type]


def copy_prompt(image_type: str) -> str:
    if image_type == "white-background":
        return "no text"
    if image_type == "social-cover":
        return "optional short headline only, no unverifiable claims"
    return "minimal ecommerce copy only when useful"


def build_qa(args: argparse.Namespace, image_types: list[str]) -> dict:
    return {
        "product_name": args.product_name or "the product",
        "checks": [
            f"exactly {args.count} usable main images are planned",
            "product remains the main subject in every image",
            "product shape, color, material, and key visible details match the reference",
            "white-background images contain no text, props, borders, badges, or watermarks",
            "lifestyle images do not hide the product behind hands, sleeves, or props",
            "each image type has a distinct purpose rather than a simple background color change",
            "no fake logos, unreadable text, unsupported claims, distorted people, or watermarks",
            "outputs are suitable for marketplace thumbnail review before production use",
        ],
        "image_types": image_types,
    }


def build_summary(args: argparse.Namespace, image_types: list[str]) -> str:
    product_name = args.product_name or "Unnamed product"
    rows = "\n".join(f"- `{image_type}`" for image_type in image_types)
    return f"""# Ecommerce Main Image Plan

Product: {product_name}
Platform: {args.platform}
Mode: {args.mode}
Input image: `{args.input}`

## Planned Image Types

{rows}

## Generated Files

- `brief.json`
- `main-image-plan.json`
- `prompts.json`
- `qa-checklist.json`
- `summary.md`

This CLI creates a local planning package only. It does not call image APIs or generate final images.
"""


def run_main(args: argparse.Namespace) -> int:
    input_path = Path(args.input).expanduser()
    if not input_path.exists():
        print(f"input image does not exist: {args.input}", file=sys.stderr)
        return 2
    if args.count < 1 or args.count > 6:
        print("--count must be between 1 and 6", file=sys.stderr)
        return 2

    image_types = resolve_image_types(args.count)
    out_dir = Path(args.out).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)

    write_json(out_dir / "brief.json", build_brief(args, image_types))
    write_json(out_dir / "main-image-plan.json", build_plan(args, image_types))
    write_json(out_dir / "prompts.json", build_prompts(args, image_types))
    write_json(out_dir / "qa-checklist.json", build_qa(args, image_types))
    (out_dir / "summary.md").write_text(build_summary(args, image_types), encoding="utf-8")

    print(f"Wrote ecommerce main image plan to {out_dir}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="ec-image",
        description="Local ecommerce image planning CLI. No image API calls.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    main_parser = subparsers.add_parser("main", help="Create a product main-image planning package")
    main_parser.add_argument("--input", required=True, help="Path to the product reference image")
    main_parser.add_argument("--product-name", default="", help="Product name")
    main_parser.add_argument("--category", default="", help="Product category")
    main_parser.add_argument("--platform", default="taobao", help="Target platform")
    main_parser.add_argument("--count", type=int, default=5, help="Number of main images to plan, 1-6")
    main_parser.add_argument(
        "--mode",
        choices=["strict", "demo"],
        default="strict",
        help="strict preserves the product; demo prioritizes polished demo material",
    )
    main_parser.add_argument("--out", default="output/main-image-plan", help="Output directory")
    main_parser.set_defaults(func=run_main)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    raise SystemExit(args.func(args))
