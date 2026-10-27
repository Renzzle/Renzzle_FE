#!/bin/bash
set -euo pipefail

# Xcode uses ACTION=install when archiving. Regular builds need no symbols here.
if [[ "${ACTION:-}" != "install" || "${PLATFORM_NAME:-}" != "iphoneos" ]]; then
  exit 0
fi

symbols_dir="${SRCROOT}/dSYMs"
frameworks_dir="${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}"

for framework in React ReactNativeDependencies hermesvm; do
  binary="${frameworks_dir}/${framework}.framework/${framework}"
  dsym="${symbols_dir}/${framework}.framework.dSYM"
  dwarf="${dsym}/Contents/Resources/DWARF/${framework}"

  if [[ ! -f "$binary" ]]; then
    echo "error: Framework binary not found: $binary. Run Copy Framework dSYMs after [CP] Embed Pods Frameworks."
    exit 1
  fi

  if [[ ! -f "$dwarf" ]]; then
    echo "error: Missing $dwarf. Download the matching Release dSYM; see ${symbols_dir}/README.md."
    exit 1
  fi

  binary_uuids="$(xcrun dwarfdump --uuid "$binary" | awk '/^UUID:/ {print $2, $3}')"
  dsym_uuids="$(xcrun dwarfdump --uuid "$dwarf" | awk '/^UUID:/ {print $2, $3}')"

  if [[ -z "$binary_uuids" || -z "$dsym_uuids" ]]; then
    echo "error: Could not read UUIDs for ${framework}."
    exit 1
  fi

  # Require every architecture in the embedded binary to have matching symbols.
  while IFS= read -r uuid; do
    if ! printf '%s\n' "$dsym_uuids" | grep -Fqx -- "$uuid"; then
      echo "error: ${framework} dSYM UUID mismatch. Required: $uuid. Available: $dsym_uuids."
      echo "error: Replace $dsym with symbols for the installed framework version; see ${symbols_dir}/README.md."
      exit 1
    fi
  done <<< "$binary_uuids"

  mkdir -p "${DWARF_DSYM_FOLDER_PATH}"
  ditto "$dsym" "${DWARF_DSYM_FOLDER_PATH}/${framework}.framework.dSYM"
  echo "note: Copied ${framework}.framework.dSYM (UUID verified)."
done
