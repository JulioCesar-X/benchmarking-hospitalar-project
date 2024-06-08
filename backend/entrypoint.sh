#!/bin/bash

# Wait for the database to be ready

#comente esse para o deploy
dockerize -wait tcp://db:5432 -timeout 60s

# #comente esse para o ambiente de desenvolvimento
 dockerize -wait tcp://dpg-cp50v0f79t8c73emtbjg-a:5432 -timeout 60s

php artisan clear:all

# Run migrations
if [ "$RESET_SEEDERS" = "true" ]; then
    php artisan migrate:fresh --seed --force
else
    php artisan migrate --force
fi

# Ajustar sequências do banco de dados se necessário
php artisan db:adjust-sequences

# Start the Laravel application
php artisan serve --host=0.0.0.0 --port=8001
