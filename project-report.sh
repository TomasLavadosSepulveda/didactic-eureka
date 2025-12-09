#!/usr/bin/env bash
# project-report.sh (personalizado para carpeta madre "filosofia-teologia_config")
# Genera un informe JSON del estado del proyecto.
# Uso:
#   chmod +x project-report.sh
#   ./project-report.sh
#   ./project-report.sh --gist       # además crea un gist privado (requiere gh autenticado)
#   ./project-report.sh /ruta/otra   # si prefieres especificar otra ruta
#
set -euo pipefail

DEFAULT_HINT="filosofia-teologia_config"
DO_GIST=0
ARG="${1:-}"
# if first param is --gist or empty, handle accordingly
if [[ "${ARG}" == "--gist" ]]; then
  DO_GIST=1
  ARG=""
elif [[ "${2:-}" == "--gist" ]]; then
  DO_GIST=1
fi

if [[ -n "${ARG:-}" && "${ARG}" != "--gist" ]]; then
  HINT="$ARG"
else
  HINT="$DEFAULT_HINT"
fi

cmd_exists() { command -v "$1" >/dev/null 2>&1; }
timestamp() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

resolve_project_root() {
  local hint="$1"

  # If path given and exists
  if [[ -n "$hint" && -d "$hint" ]]; then
    (cd "$hint" 2>/dev/null && pwd) || echo ""
    return
  fi

  # If inside a git repo, prefer repo root
  if cmd_exists git && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git rev-parse --show-toplevel 2>/dev/null || echo ""
    return
  fi

  # If hint is an absolute or relative path that does not exist, fail
  if [[ "$hint" == */* && ! -d "$hint" ]]; then
    echo ""
    return
  fi

  # Search ancestors from CWD for folder with that name
  local dir="$PWD"
  while [[ "$dir" != "/" && -n "$dir" ]]; do
    if [[ -d "$dir/$hint" ]]; then
      (cd "$dir/$hint" 2>/dev/null && pwd) || echo ""
      return
    fi
    if [[ "$(basename "$dir")" == "$hint" ]]; then
      (cd "$dir" 2>/dev/null && pwd) || echo ""
      return
    fi
    dir=$(dirname "$dir")
  done

  # Search under $HOME up to depth 4
  if [[ -n "${HOME:-}" ]]; then
    local found
    found=$(find "$HOME" -maxdepth 4 -type d -name "$hint" 2>/dev/null | head -n 1 || true)
    if [[ -n "$found" ]]; then
      (cd "$found" 2>/dev/null && pwd) || echo ""
      return
    fi
  fi

  # Also try common project locations
  for p in "$HOME/Projects" "$HOME/Proyectos" "$HOME/Sites" "$HOME/Documents" "/mnt" "/Volumes"; do
    if [[ -d "$p" ]]; then
      local f
      f=$(find "$p" -maxdepth 3 -type d -name "$hint" 2>/dev/null | head -n 1 || true)
      if [[ -n "$f" ]]; then
        (cd "$f" 2>/dev/null && pwd) || echo ""
        return
      fi
    fi
  done

  echo ""
}

PROJECT_ROOT="$(resolve_project_root "$HINT")"

if [[ -z "$PROJECT_ROOT" ]]; then
  echo "No pude ubicar la carpeta '$HINT'."
  echo "Puedes ejecutar: ./project-report.sh /ruta/a/tu/proyecto  o pasar el nombre correcto."
  exit 1
fi

echo "Generando informe desde: $PROJECT_ROOT"
OUT="project-report.json"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

jq -n --arg generated_at "$(timestamp)" '{ generated_at: $generated_at }' > "$OUT"

pushd "$PROJECT_ROOT" >/dev/null || exit 1

if cmd_exists git && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  GIT_REMOTE_URL="$(git remote get-url origin 2>/dev/null || echo "")"
  GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")"
  GIT_STATUS="$(git status --porcelain 2>/dev/null || echo "")"
  GIT_LAST_COMMIT="$(git log -1 --pretty=format:'%H|%an|%ae|%ad|%s' --date=iso 2>/dev/null || echo "")"

  # CORREGIDO jq
  GIT_BRANCHES="$(git for-each-ref --format='%(refname:short)' refs/heads/ \
    | jq -R -s -c 'split("\n") | .[:-1]')"

  # CORREGIDO jq
  FILES_LIST="$(git ls-files --exclude-standard | head -n 2000 \
    | jq -R -s -c 'split("\n") | .[:-1]')"
else
  GIT_REMOTE_URL=""; GIT_BRANCH=""; GIT_STATUS=""; GIT_LAST_COMMIT=""; GIT_BRANCHES="[]"; FILES_LIST="[]"
fi

DETECTED_FILES=()
for f in package.json pyproject.toml requirements.txt go.mod Gemfile config.toml config.yaml config.yml Dockerfile README.md index.html; do
  if [[ -f "$f" ]]; then
    DETECTED_FILES+=("$f")
  fi
done

# CORREGIDO jq
DETECTED_JSON="$(printf '%s\n' "${DETECTED_FILES[@]}" \
  | jq -R -s -c 'split("\n") | .[:-1]' 2>/dev/null || echo '[]')"

HUGO_PRESENT="false"; HUGO_VERSION=""
if cmd_exists hugo; then HUGO_PRESENT="true"; HUGO_VERSION="$(hugo version 2>/dev/null || "")"; fi

DU_TOTAL="$(du -sh . 2>/dev/null | awk '{print $1}' || echo "")"

# CORREGIDO jq
DU_TOP="$(du -sh * 2>/dev/null | sort -hr | head -n 20 \
  | jq -R -s -c 'split("\n") | .[:-1]' || echo '[]')"

# CORREGIDO jq
WORKFLOWS="$(test -d .github/workflows && find .github/workflows -maxdepth 2 -type f \( -name '*.yml' -o -name '*.yaml' \) -print 2>/dev/null \
  | sed 's|^\./||' \
  | jq -R -s -c 'split("\n") | .[:-1]' || echo '[]')"

HUGO_CONTENT_EXISTS="false"
if [[ -d "content" ]]; then HUGO_CONTENT_EXISTS="true"; fi

HUGO_THEME="[]"
if [[ -d "themes" ]]; then
  # CORREGIDO jq
  HUGO_THEME="$(ls -1 themes 2>/dev/null | head -n 20 \
    | jq -R -s -c 'split("\n") | .[:-1]' || echo '[]')"
fi

jq --arg top "$PROJECT_ROOT" \
   --arg cwd "$(pwd)" \
   --arg remote "$GIT_REMOTE_URL" \
   --arg branch "$GIT_BRANCH" \
   --arg status "$GIT_STATUS" \
   --arg last_commit "$GIT_LAST_COMMIT" \
   --argjson branches "$GIT_BRANCHES" \
   --argjson files "$FILES_LIST" \
   --argjson detected_files "$DETECTED_JSON" \
   --arg hugo_present "$HUGO_PRESENT" \
   --arg hugo_version "$HUGO_VERSION" \
   --arg hugo_content_exists "$HUGO_CONTENT_EXISTS" \
   --argjson hugo_themes "$HUGO_THEME" \
   --arg du_total "$DU_TOTAL" \
   --argjson du_top "$DU_TOP" \
   --argjson workflows "$WORKFLOWS" \
   '. + {
     project_root: $top,
     git: {
       cwd: $cwd,
       remote: $remote,
       branch: $branch,
       status_porcelain: $status,
       last_commit: $last_commit,
       branches: $branches,
       tracked_files_sample: $files
     },
     detected_project_files: $detected_files,
     hugo: {
       installed: ($hugo_present == "true"),
       version: $hugo_version,
       content_exists: ($hugo_content_exists == "true"),
       themes: $hugo_themes
     },
     disk: { total: $du_total, top_items: $du_top },
     workflows: $workflows
   }' "$OUT" > "$TMP/out.json" && mv "$TMP/out.json" "$OUT"

NODE_PRESENT="false"; NODE_VERSION=""
if cmd_exists node; then NODE_PRESENT="true"; NODE_VERSION="$(node --version)"; fi
DOCKER_PRESENT="false"; DOCKER_VERSION=""
if cmd_exists docker; then DOCKER_PRESENT="true"; DOCKER_VERSION="$(docker --version 2>/dev/null || "")"; fi
GH_PRESENT="false"; GH_USER=""
if cmd_exists gh; then GH_PRESENT="true"; GH_USER="$(gh api user --jq '.login' 2>/dev/null || "")"; fi

jq --arg node_present "$NODE_PRESENT" --arg node_version "$NODE_VERSION" \
   --arg docker_present "$DOCKER_PRESENT" --arg docker_version "$DOCKER_VERSION" \
   --arg gh_present "$GH_PRESENT" --arg gh_user "$GH_USER" \
   '. + {env: {node: {present: ($node_present == "true"), version: $node_version}, docker: {present: ($docker_present=="true"), version: $docker_version}, gh: {present: ($gh_present=="true"), user: $gh_user}}}' \
   "$OUT" > "$TMP/out2.json" && mv "$TMP/out2.json" "$OUT"

popd >/dev/null || true

echo "Informe generado en: $OUT"
echo
jq '{generated_at: .generated_at, project_root, git: .git, hugo: .hugo, disk: .disk, workflows: .workflows, detected_project_files: .detected_project_files}' "$OUT" | sed -n '1,200p'

if [[ "$DO_GIST" -eq 1 ]]; then
  if cmd_exists gh; then
    echo
    echo "Creando gist privado (requiere gh autenticado)..."
    gh gist create "$OUT" --private --filename "$OUT" --desc "Project report generated $(timestamp)" || { echo "gh gist falló."; exit 1; }
    echo "Gist creado. Copia el enlace que gh mostró y pégalo aquí para que lo revise."
  else
    echo "gh no está disponible o no está autenticado: no puedo crear el gist automáticamente."
  fi
fi

# end
