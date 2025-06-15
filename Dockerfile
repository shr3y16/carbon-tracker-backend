FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json prisma ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
RUN npm ci --omit=dev
CMD ["node", "dist/server.js"]
