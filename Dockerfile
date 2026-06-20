FROM node:24.12.0-alpine as base
WORKDIR /app
RUN npm install -g @angular/cli@21.2.16

COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/bungie-api/package.json ./packages/bungie-api/

RUN npm ci

COPY . .

RUN npm run build:client

FROM base AS backend-dev
EXPOSE 7777
CMD ["npm", "run", "dev:backend"]

FROM base AS frontend-dev
EXPOSE 4200
CMD ["npm", "run", "start", "-w", "@tier-5/frontend", "--", "--host", "0.0.0.0"]