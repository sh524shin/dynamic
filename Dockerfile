# Build Stage (Not run on 1GB RAM server, but on GitHub Actions)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage (Run on 1GB RAM OCI server)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY server.js ./
EXPOSE 80
CMD ["node", "server.js"]
