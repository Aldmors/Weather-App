# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY front_weather_app/package*.json ./

# Install dependencies
RUN npm install

COPY . .