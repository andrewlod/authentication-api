ARG NODE_IMAGE=node:20.11.1-alpine3.19
FROM ${NODE_IMAGE} AS build_stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci --omit=dev
RUN npm run swagger-autogen
RUN npm run build
RUN npm run postbuild
RUN cp -r src/database/schemas build/database

FROM ${NODE_IMAGE} AS test_stage

WORKDIR /usr/src/tests

COPY jest.config.js tsconfig.json .eslintrc.json babel.config.js ./
COPY --from=build_stage /usr/src/app/node_modules ./node_modules
COPY --from=build_stage /usr/src/app/src ./src
COPY --from=build_stage /usr/src/app/tests ./tests
COPY --from=build_stage /usr/src/app/package*.json ./

RUN npm ci --include=dev
RUN npm test > test_results.txt

FROM ${NODE_IMAGE} AS prod_stage

WORKDIR /usr/src/app

COPY --from=test_stage /usr/src/tests/test_results.txt ./

COPY --from=build_stage /usr/src/app/node_modules ./node_modules
COPY --from=build_stage /usr/src/app/build ./build
COPY --from=build_stage /usr/src/app/package*.json ./

EXPOSE 3000

CMD [ "npm", "run", "start:migrate:prod" ]