# Use an official Node.js runtime as a parent image
FROM node:18

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

EXPOSE 3000

RUN npm run build
# Set the command to start the server
CMD npm start