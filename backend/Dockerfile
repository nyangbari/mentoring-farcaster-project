FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package manifest and lockfile (if present)
COPY package.json pnpm-lock.yaml* ./

# Enable corepack and prepare pnpm, fall back to installing pnpm globally if corepack not available
RUN corepack enable || true && corepack prepare pnpm@latest --activate || npm i -g pnpm

# Install dependencies. If a pnpm lockfile exists, use `--frozen-lockfile` to ensure reproducible installs.
RUN pnpm install --frozen-lockfile || pnpm install

# Copy rest of the source
COPY . .

# Build and expose
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "run", "start:prod"]