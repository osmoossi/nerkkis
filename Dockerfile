FROM node:18-alpine

COPY package*.json ./
RUN npm set progress=false && npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENTRYPOINT ["node", "build/index.js"]
