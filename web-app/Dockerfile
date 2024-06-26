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

# Command to wait for the database to be ready and then run Prisma migrate and generate
CMD ["sh", "-c", "until nc -z mysql-db 3306; do echo 'Waiting for MySQL...'; sleep 1; done; echo 'MySQL is up - running Prisma migrate and generate'; npx prisma migrate dev --name init; npx prisma generate; npm run backend:docker"]
