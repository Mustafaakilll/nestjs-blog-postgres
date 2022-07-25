FROM node:14-alpine
WORKDIR /app
ADD package.json ./
ADD yarn.lock ./
RUN yarn install
COPY . ./
COPY src ./src
RUN yarn build
