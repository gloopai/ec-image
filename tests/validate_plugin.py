import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_text(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def read_json(path: str) -> dict:
    return json.loads(read_text(path))


def assert_contains(text: str, expected: str, source: str) -> None:
    if expected not in text:
        raise AssertionError(f"{source} is missing expected text: {expected}")


def validate_main_image_skill() -> None:
    skill_path = ROOT / "skills/ecommerce-main-images/SKILL.md"
    if not skill_path.exists():
        raise AssertionError("Missing main image skill: skills/ecommerce-main-images/SKILL.md")

    skill = skill_path.read_text(encoding="utf-8")
    required_terms = [
        "ecommerce-main-images",
        "product main images",
        "white-background",
        "lifestyle",
        "premium-studio",
        "public/demo-results/main/",
        "visual QA",
    ]
    for term in required_terms:
        assert_contains(skill, term, str(skill_path))


def validate_main_image_assets() -> None:
    presets = read_json("assets/main-image-presets.json")
    preset_ids = {preset["id"] for preset in presets["presets"]}
    expected_ids = {
        "white-background",
        "lifestyle",
        "premium-studio",
        "comparison",
        "social-cover",
    }
    missing = expected_ids - preset_ids
    if missing:
        raise AssertionError(f"assets/main-image-presets.json is missing presets: {sorted(missing)}")

    template = read_json("scripts/main_image_brief_template.json")
    if template["output_count"] != 5:
        raise AssertionError("main image brief template should default output_count to 5")
    if "main_image_types" not in template:
        raise AssertionError("main image brief template should define main_image_types")
    if "target_dimensions" not in template:
        raise AssertionError("main image brief template should define target_dimensions")


def validate_manifest_and_readme() -> None:
    manifest = read_json(".codex-plugin/plugin.json")
    capabilities = set(manifest["interface"]["capabilities"])
    if "main-image-generation" not in capabilities:
        raise AssertionError("plugin manifest should include main-image-generation capability")
    assert_contains(
        manifest["interface"]["longDescription"],
        "main image",
        ".codex-plugin/plugin.json longDescription",
    )

    readme = read_text("README.md")
    for term in [
        "Product Main Image Generation",
        "skills/ecommerce-main-images/SKILL.md",
        "public/demo-results/main/",
        "Amazon white-background",
    ]:
        assert_contains(readme, term, "README.md")


def main() -> None:
    validate_main_image_skill()
    validate_main_image_assets()
    validate_manifest_and_readme()
    print("plugin validation passed")


if __name__ == "__main__":
    main()
