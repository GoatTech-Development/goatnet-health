FROM node:14-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:14-alpine

WORKDIR /usr/src/app

# Copy only the built application and the necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./

EXPOSE 3000

CMD [ "npm", "start" ]
