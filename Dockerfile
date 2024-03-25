FROM node:20.11.1-alpine3.19 AS build_stage

WORKDIR /usr/src/app

COPY . .

RUN npm run build
RUN npm run postbuild

FROM node:20.11.1-alpine3.19 AS test_stage

WORKDIR /usr/src/app/tests

COPY --from=build_stage /usr/src/app/node_modules ./node_modules
COPY --from=build_stage /usr/src/app/src ./src
COPY --from=build_stage /usr/src/app/tests ./tests
COPY --from=build_stage package*.json ./

RUN npm test

FROM node:20.11.1-alpine3.19 AS prod_stage

WORKDIR /usr/src/app

COPY --from=build_stage /usr/src/app/node_modules ./node_modules
COPY --from=build_stage /usr/src/app/build ./build
COPY --from=build_stage package*.json ./

EXPOSE 3000

CMD ["npm", "run", "start:migrate:prod"]