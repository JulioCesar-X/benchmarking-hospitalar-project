# Base image for serving Angular app with Nginx
FROM nginx:latest

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/

# Set working directory to where static files are served
WORKDIR /usr/share/nginx/html

# Copy Angular build artifacts from the Docker Compose context to the container
ARG ANGULAR_DIST
COPY $ANGULAR_DIST /usr/share/nginx/html