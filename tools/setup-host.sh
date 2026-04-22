#!/usr/bin/env bash
set -euo pipefail

echo "[CoruscantOS] Instalando dependencias para build en Linux..."
sudo apt-get update
sudo apt-get install -y git python3 python3-pip qemu-system-arm qemu-system-aarch64

if ! command -v pmbootstrap >/dev/null 2>&1; then
  pip3 install --user pmbootstrap
fi

echo "[CoruscantOS] Host listo."

