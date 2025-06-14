# Builder
FROM node:16-alpine AS builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY index.ts ./
COPY settings.ts ./
COPY interfaces interfaces
COPY services services
RUN npm run build

# Server
FROM node:16-alpine
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/app/dist /usr/app
CMD ["node", "index.js"]