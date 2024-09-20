# Stage 1: Build the React app
FROM node:16-alpine as build

# Set working directory
WORKDIR /app

# Copy only the package files and install dependencies
COPY ./frontend/package*.json ./

# Install dependencies (including Cypress for development)
RUN npm install

# Copy the rest of the frontend app to the container
COPY ./frontend .

# Copy the .env.docker file from the root directory into the /app directory
COPY ./.env.docker .env

# Build the React app for production
RUN npm run build

# Stage 2: Serve the React app with nginx for production
FROM nginx:alpine as production

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
