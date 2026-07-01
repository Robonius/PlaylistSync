#!/bin/sh

# Create the env-config.js file
# In Next.js standalone mode, the public folder is in the current directory
ENV_FILE="./public/env-config.js"

echo "window._env_ = {" > "$ENV_FILE"

# Loop through all environment variables starting with ROBOLAB_
# and add them to the env-config.js file
env | grep -E '^ROBOLAB_' | while read -r line; do
  # Split the line by '=' to get key and value
  key=$(echo "$line" | cut -d '=' -f 1)
  value=$(echo "$line" | cut -d '=' -f 2-)

  # Append to the file
  echo "  $key: \"$value\"," >> "$ENV_FILE"
done

echo "};" >> "$ENV_FILE"

# Execute the CMD
exec "$@"
