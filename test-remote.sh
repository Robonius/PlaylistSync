#!/bin/bash

# Configuration
IMAGE_NAME="ghcr.io/robonius/playlistsync:latest"
CONTAINER_NAME="playlistsync-test"
PORT=8080

echo "🚀 Starting Remote Image Test Workflow..."

# 1. Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating one from .env.example..."
    cp .env.example .env
    echo "Please edit .env with your actual API keys before continuing."
    [[ "$0" == "$BASH_SOURCE" ]] && (exit 1) || (return 1)
fi

# 2. Check Docker Authentication
echo "Checking Docker authentication for GHCR..."
if ! docker pull $IMAGE_NAME; then
    echo "❌ Failed to pull image. Are you authenticated with GHCR?"
    echo "Run: echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin"
    [[ "$0" == "$BASH_SOURCE" ]] && (exit 1) || (return 1)
fi

# 3. Cleanup existing container
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🧹 Cleaning up old container..."
    docker rm -f $CONTAINER_NAME
fi

# 4. Run container with environment variables
echo "🏃 Starting container on http://localhost:$PORT ..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:80 \
  --env-file .env \
  $IMAGE_NAME

echo "✅ Container is running!"
echo "Check logs with: docker logs -f $CONTAINER_NAME"
echo "Stop with: docker stop $CONTAINER_NAME"
