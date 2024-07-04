#!/bin/bash

# Wait for the database to be ready
dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 60s

# Start the Laravel application in the background
php artisan serve --host=0.0.0.0 --port=8000 &

echo "Laravel application started."

# Clear caches
php artisan clear:all

echo "Running migrations and seeders in the background."

# Run migrations and seeders in the background
if [ "$RESET_SEEDERS" = "true" ]; then
    php artisan migrate:fresh --seed &
else
    php artisan migrate --force &
fi

# Ajustar sequências do banco de dados se necessário em background
php artisan db:adjust-sequences &

# Wait for background processes to finish
wait

echo "Migrations and seeders completed."