FROM node:17.4.0-slim

WORKDIR /www/frontend

COPY ./package.json ./yarn.lock /www/frontend/
RUN yarn install --frozen-lockfile

COPY . .
