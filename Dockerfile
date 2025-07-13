FROM node:20-slim AS base

WORKDIR /app

FROM base AS deps

COPY package*.json ./
RUN npm install 
COPY . .

FROM base AS builder

COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner

WORKDIR /app

# Install Chromium in the runner stage
RUN apt-get update && apt-get install -y \
    chromium \
 && rm -rf /var/lib/apt/lists/*

# Set CHROME_PATH for chrome-launcher / Puppeteer
ENV CHROME_PATH=/usr/bin/chromium

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 8888

CMD ["node", "dist/server.js"]