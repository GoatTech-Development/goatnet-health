# Use a smaller base image for the build stage
FROM node:20.14.0-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Use a smaller base image for the runtime stage
FROM node:20.14.0-alpine

WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/index.ts ./index.ts
COPY --from=build /usr/src/app/services ./services
COPY --from=build /usr/src/app/backendConfig.js ./backendConfig.ts
COPY --from=build /usr/src/app/package.json ./

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
