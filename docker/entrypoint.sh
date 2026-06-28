#!/bin/sh

# Create the env-config.js file
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js

# Loop through all environment variables starting with ROBOLAB_
# and add them to the env-config.js file
env | grep -E '^ROBOLAB_' | while read -r line; do
  # Split the line by '=' to get key and value
  key=$(echo "$line" | cut -d '=' -f 1)
  value=$(echo "$line" | cut -d '=' -f 2-)

  # Append to the file
  echo "  $key: \"$value\"," >> /usr/share/nginx/html/env-config.js
done

echo "};" >> /usr/share/nginx/html/env-config.js

# Execute the CMD (Nginx)
exec "$@"
