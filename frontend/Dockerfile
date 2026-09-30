# syntax=docker/dockerfile:1

# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Install dependencies based on the lockfile
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app
# The standalone output creates a minimal server with all necessary files
RUN npm run build

# Stage 3: Production runtime
FROM node:22-alpine AS runner
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy the standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Change ownership to the non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the server
CMD ["node", "server.js"]
