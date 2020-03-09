#stage 1: build and deploy dev version of application
FROM node:latest as node
LABEL author="Johnny Lockhart"
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --dev

#stage 2: build and seed prosteges db
FROM postgres:latest as database

