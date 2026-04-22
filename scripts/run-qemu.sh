#!/usr/bin/env bash
set -euo pipefail

KERNEL_IMAGE="${1:-./artifacts/Image}"
DISK_IMAGE="${2:-./artifacts/rootfs.img}"

echo "[CoruscantOS] Lanzando QEMU ARM64..."
qemu-system-aarch64 \
  -machine virt \
  -cpu cortex-a57 \
  -m 2048 \
  -smp 4 \
  -kernel "${KERNEL_IMAGE}" \
  -drive if=none,file="${DISK_IMAGE}",format=raw,id=hd0 \
  -device virtio-blk-device,drive=hd0 \
  -nographic

