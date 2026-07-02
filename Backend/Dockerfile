# Use Node.js 24.14.0 with Alpine Linux as the base image.
FROM node:24.14.0-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching.
COPY package*.json ./

# Install all project dependencies.
RUN npm install

# Copy the rest of the application source code into the container.
COPY . .

# Set the default port environment variable for the application.
ENV PORT=3000

# Document that the container listens on port 3000.
EXPOSE 3000

# Start the application using the npm start script.
CMD ["npm", "start"]