#!/bin/bash

set -e

echo "Starting entrypoint script..."

# Wait for the database to be ready
echo "Waiting for the database to be ready..."
dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 60s

echo "Database is ready."

# Clear caches
echo "Clearing caches..."
php artisan clear:all

# Função para rodar migrations e seeds
run_migrations_and_seeds() {
    echo "Running migrations and seeders..."
    if [ "$RESET_SEEDERS" = "true" ]; then
        echo "Running migrate:fresh --seed"
        php artisan migrate:fresh --seed
    else
        echo "Running migrate --force"
        php artisan migrate --force
    fi

    # Ajustar sequências do banco de dados se necessário
    echo "Adjusting database sequences"
    php artisan db:adjust-sequences
}

# Rodar migrations e seeds
run_migrations_and_seeds

echo "Migrations and seeders completed."

# Start the Laravel application
echo "Starting Laravel application..."
php artisan serve --host=0.0.0.0 --port=8000