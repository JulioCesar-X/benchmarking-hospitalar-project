# Use PHP 7.4 with FPM (FastCGI Process Manager)
FROM php:7.4-fpm

# Install system dependencies required for Laravel and common PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    git \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install necessary PHP extensions for Laravel (PostgreSQL and Zip in this case)
RUN docker-php-ext-install pdo pdo_pgsql pgsql zip

# Download and install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer

# Install Dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz -O dockerize.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize.tar.gz \
    && rm dockerize.tar.gz

# Set working directory inside the container
WORKDIR /var/www/html

# Copy the application code to the container
COPY . .


# Install Composer dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader \
&& composer require laravel/sanctum

# Set the correct permissions for the Laravel storage and bootstrap directories
RUN chmod -R 777 storage bootstrap/cache

# Generate application key, clear cache, and discover packages
RUN php artisan clear:all

# Copy the entrypoint script into the container and ensure it is executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expor a porta em que o PHP-FPM vai rodar
EXPOSE 9000

# Use the entrypoint script to setup the application
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
