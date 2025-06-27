# Build stage
FROM node:23.11.0-slim AS build
WORKDIR /usr/app
COPY ./server/package*.json ./
RUN npm install --legacy-peer-deps
COPY ./server ./
COPY ./protos ./protos
RUN npm run build

# Production stage
FROM node:23.11.0-slim AS server-app
WORKDIR /usr/app
COPY --from=build /usr/app/dist ./dist
COPY --from=build /usr/app/package*.json ./
COPY --from=build /usr/app/protos ./protos
RUN npm install --only=production --legacy-peer-deps

EXPOSE 8000 50051
CMD ["npm", "run", "start:prod"] 
