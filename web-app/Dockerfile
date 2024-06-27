# Use an official Node runtime as the base image
FROM node:20-alpine

# Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app

# Install netcat and bash
RUN apk add --no-cache netcat-openbsd bash

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy prisma schema to the working directory
COPY prisma/schema.prisma ./prisma/

# Install any needed packages specified in package.json
RUN npm install

# Install the Prisma CLI
RUN npm install -g prisma

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Default command (this can be overridden in Docker Compose files)
CMD ["node", "dockerBackendDev.js"]
