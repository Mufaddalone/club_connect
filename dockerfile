# Step 1: Use Node.js as the base image for building the application
FROM node:18 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the Angular application
RUN npm run build

# Step 2: Use an NGINX image for serving the built Angular app
FROM nginx:alpine

# Copy built application files from the build stage
# Fix: Copy from the correct directory including browser files
COPY --from=build /usr/src/app/dist/ds_project/browser/* /usr/share/nginx/html/

# Create nginx configuration for Angular routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]