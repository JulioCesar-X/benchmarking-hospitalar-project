# Base image
FROM php:7.4-fpm

# Set working directory
WORKDIR /var/www

# Install dependencies for PostgreSQL and PHP extensions
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application code
COPY backend /var/www

# Install project dependencies
RUN composer install

# Permissions
RUN chown -R www-data:www-data /var/www

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*