import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def run_cli(args: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(
        [str(ROOT / "bin/ec-image"), *args],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )


def validate_main_plan_generation() -> None:
    out_dir = ROOT / "tmp/cli-test-main"
    if out_dir.exists():
        for child in out_dir.iterdir():
            child.unlink()
    else:
        out_dir.mkdir(parents=True)

    result = run_cli(
        [
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
            str(out_dir),
        ]
    )
    if result.returncode != 0:
        raise AssertionError(f"CLI failed:\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}")

    expected_files = [
        "brief.json",
        "main-image-plan.json",
        "prompts.json",
        "qa-checklist.json",
        "summary.md",
    ]
    missing = [name for name in expected_files if not (out_dir / name).exists()]
    if missing:
        raise AssertionError(f"CLI did not create expected files: {missing}")

    brief = read_json(out_dir / "brief.json")
    if brief["product_name"] != "男士机械腕表":
        raise AssertionError("brief.json should preserve product_name")
    if brief["mode"] != "strict":
        raise AssertionError("brief.json should preserve mode")

    plan = read_json(out_dir / "main-image-plan.json")
    image_types = [item["image_type"] for item in plan["images"]]
    if image_types != [
        "white-background",
        "premium-studio",
        "lifestyle",
        "comparison",
        "social-cover",
    ]:
        raise AssertionError(f"unexpected main image type order: {image_types}")

    prompts = read_json(out_dir / "prompts.json")
    if len(prompts["prompts"]) != 5:
        raise AssertionError("prompts.json should include 5 prompt packs")
    if "preserve product" not in prompts["prompts"][0]["reference_instruction"]:
        raise AssertionError("prompt pack should include reference preservation instruction")

    qa = read_json(out_dir / "qa-checklist.json")
    checks = "\n".join(qa["checks"])
    for expected in ["product remains the main subject", "white-background", "watermarks"]:
        if expected not in checks:
            raise AssertionError(f"qa-checklist.json is missing QA text: {expected}")

    summary = (out_dir / "summary.md").read_text(encoding="utf-8")
    for expected in ["男士机械腕表", "white-background", "prompts.json"]:
        if expected not in summary:
            raise AssertionError(f"summary.md is missing expected text: {expected}")


def main() -> None:
    validate_main_plan_generation()
    print("cli validation passed")


if __name__ == "__main__":
    main()
