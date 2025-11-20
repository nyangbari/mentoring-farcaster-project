FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package manifest and lockfile
COPY package.json pnpm-lock.yaml* ./

# Enable corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install all dependencies (including devDependencies) for building
RUN pnpm install --frozen-lockfile

# Copy app source and build
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Set production env
ENV NODE_ENV=production

# Copy package manifest and lockfile to install only production deps
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --frozen-lockfile

# Copy build output from builder
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]