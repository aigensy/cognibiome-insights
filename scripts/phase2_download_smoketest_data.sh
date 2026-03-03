#!/usr/bin/env bash
# Phase 2: Download smoke-test public data for pipeline plumbing.
# Run manually: bash scripts/phase2_download_smoketest_data.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

mkdir -p training/data

curl -L -o training/data/HMP2_taxonomy.tsv \
  "https://raw.githubusercontent.com/biobakery/Maaslin2/refs/heads/master/inst/extdata/HMP2_taxonomy.tsv"
curl -L -o training/data/HMP2_metadata.tsv \
  "https://raw.githubusercontent.com/biobakery/Maaslin2/refs/heads/master/inst/extdata/HMP2_metadata.tsv"

echo "Downloaded. Contents of training/data:"
ls -lh training/data/HMP2_*.tsv
