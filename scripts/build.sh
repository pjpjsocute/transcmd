#!/bin/bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
temp_dir="$(mktemp -d)"
trap 'rm -rf "$temp_dir"' EXIT

cd "$project_dir"
zip -q -r "$temp_dir/TransCmd.alfredworkflow" \
    README.md package.json info.plist icon.png run-node.sh \
    xt.js dt.js xh.js cl.js zh.js tr.js src
mv "$temp_dir/TransCmd.alfredworkflow" dist/TransCmd.alfredworkflow

echo "Built dist/TransCmd.alfredworkflow"
