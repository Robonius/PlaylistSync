# Base image
FROM oven/bun:alpine AS base
WORKDIR /app

# Dependencies layer
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Development environment
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["bun", "run", "dev"]

# Build layer
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production runner
FROM base AS prod
ENV NODE_ENV=production

# Next.js standalone mode output
# Note: standalone folder includes node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

# Add custom entrypoint for runtime env vars
COPY docker/entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["bun", "server.js"]
