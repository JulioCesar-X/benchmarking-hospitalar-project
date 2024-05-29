#!/bin/bash

# Wait for the database to be ready
# dockerize -wait tcp://db:5432 -timeout 60s
dockerize -wait tcp://dpg-cp50v0f79t8c73emtbjg-a:5432 -timeout 60s


# Run migrations
if [ "$RESET_SEEDERS" = "true" ]; then
    php artisan migrate:fresh --seed --force
else
    php artisan migrate --force
fi

# Adjust database sequences if necessary
php artisan db:adjust-sequences

# Iniciar PHP-FPM
php-fpm &

# Aguardar um momento para garantir que o PHP-FPM esteja pronto
sleep 5

# Iniciar o servidor Nginx
exec nginx -g 'daemon off;'
