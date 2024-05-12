# Base image for Angular build
FROM node:latest AS angular-builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY frontend/package*.json ./

# Install Angular CLI
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY frontend .

# Build the Angular app for production
RUN ng build --configuration=production

# Base image for serving Angular app with Nginx
FROM nginx:latest

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/

# Copy Angular build artifacts from the Angular builder stage to the Nginx image
COPY --from=angular-builder /app/dist/frontend /usr/share/nginx/html

# Set working directory to where static files are served (not necessary, but good practice)
WORKDIR /usr/share/nginx/html
