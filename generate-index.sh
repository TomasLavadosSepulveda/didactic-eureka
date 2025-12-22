#!/bin/bash

# Genera manifest.json automáticamente
# Escanea carpetas de primer nivel y sus archivos

echo "{" > manifest.json

first_category=true

for dir in */ ; do
  # ignorar carpetas ocultas o sistema
  [[ "$dir" == .* ]] && continue
  [[ "$dir" == "assets/" ]] && continue

  files=$(ls "$dir" | grep -E '\.(pdf|html)$' | sed 's/^/"/;s/$/"/' | paste -sd "," -)

  [[ -z "$files" ]] && continue

  if [ "$first_category" = false ]; then
    echo "," >> manifest.json
  fi

  category=$(basename "$dir")

  echo "  \"$category\": [$files]" >> manifest.json
  first_category=false
done

echo "}" >> manifest.json
