#!/usr/bin/env bash
set -euo pipefail

echo "[CoruscantOS] Build de imagen postmarketOS (aarch64)..."
pmbootstrap init || true
pmbootstrap install --android-recovery-zip
pmbootstrap export
echo "[CoruscantOS] Build terminado."

