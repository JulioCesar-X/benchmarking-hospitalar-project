#!/bin/bash

# Wait for the database to be ready
dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 60s

# Run migrations
if [ "$RESET_SEEDERS" = "true" ]; then
    php artisan migrate:fresh --seed
else
    php artisan migrate --force
fi

# Ajustar sequências do banco de dados se necessário
php artisan db:adjust-sequences

# Start the Laravel application
php artisan serve --host=0.0.0.0 --port=8000
