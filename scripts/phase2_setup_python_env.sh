#!/usr/bin/env bash
# Phase 2: Create Python venv and install training dependencies.
# Run manually: bash scripts/phase2_setup_python_env.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

python3 -m venv training/.venv
# shellcheck source=/dev/null
source training/.venv/bin/activate

pip install --upgrade pip
pip install numpy pandas scikit-learn pydantic

echo "Environment ready:"
python --version
echo "Installed packages:"
pip list | head -20
