FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
# If monorepo structure requires it, this might need adjustments, 
# but for standalone Node apps this is standard.
EXPOSE 3000
CMD ["node", "dist/index.js"]
