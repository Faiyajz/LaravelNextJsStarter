#!/usr/bin/env bash
set -euo pipefail

MIN_COVERAGE="${MIN_COVERAGE:-10}"

report="$(./vendor/bin/phpunit --coverage-text --coverage-filter app --colors=never)"
echo "$report"

percent="$(echo "$report" | awk '/Lines:/ {print $2}' | tr -d '%')"

if [[ -z "$percent" ]]; then
  echo "Coverage summary not found in PHPUnit output."
  exit 1
fi

python - <<PY
min_value = float("${MIN_COVERAGE}")
actual = float("${percent}")
if actual < min_value:
    raise SystemExit(f"Coverage {actual:.2f}% is below minimum {min_value:.2f}%")
print(f"Coverage {actual:.2f}% meets minimum {min_value:.2f}%")
PY
