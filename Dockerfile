FROM node:18-bullseye-slim

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the client and server directories to the container
COPY . .

RUN mkdir -p /app/storage/gallery && \
	mkdir -p /app/storage/selfies

ENV NODE_ENV=production

RUN npm run build
ENTRYPOINT npm start:server