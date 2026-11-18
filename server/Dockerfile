# ==========================================
# JiraFlow Backend Dockerfile (Node.js)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Ensure uploads folder exists with proper permissions
RUN mkdir -p uploads && chown -R node:node /app

# Run as non-root user for security
USER node

# Expose API port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start production server
CMD ["node", "server.js"]
