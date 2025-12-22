#!/usr/bin/env bash

# Script robusto para generar manifest.json
# No falla con carpetas vacías ni con nombres raros

set -u

OUTPUT="manifest.json"

echo "{" > "$OUTPUT"
first=1

for dir in */; do
  # Ignorar carpetas no deseadas
  case "$dir" in
    .*/|assets/|_site/|.github/) continue ;;
  esac

  category="${dir%/}"

  # Buscar archivos válidos (si no hay, no falla)
  files=()
  while IFS= read -r f; do
    files+=("\"$f\"")
  done < <(find "$dir" -maxdepth 1 -type f \( -iname "*.pdf" -o -iname "*.html" \) -printf "%f\n" 2>/dev/null)

  # Si no hay archivos, saltar categoría
  [ "${#files[@]}" -eq 0 ] && continue

  # Separador JSON
  if [ "$first" -eq 0 ]; then
    echo "," >> "$OUTPUT"
  fi
  first=0

  echo "  \"$category\": [${files[*]}]" >> "$OUTPUT"
done

echo "" >> "$OUTPUT"
echo "}" >> "$OUTPUT"
./generate-index.sh
cat manifest.json
git add manifest.json
git commit -m "auto: regenerate manifest"
git push origin main

