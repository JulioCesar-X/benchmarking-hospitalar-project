#!/bin/bash

# Aguarde o banco de dados estar disponível
dockerize -wait tcp://dpg-cp50v0f79t8c73emtbjg-a.frankfurt-postgres.render.com:5432 -timeout 60s

# Verifique se a variável RESET_SEEDERS está definida como "true"
if [ "$RESET_SEEDERS" = "true" ]; then
    echo "Resetting seeders..."
    php artisan migrate:fresh --seed --force
else
    echo "Running migrations without seeding..."
    php artisan migrate --force
fi

# Ajuste as sequências
php artisan db:adjust-sequences

# Inicie o PHP-FPM e o Nginx
service nginx start
php-fpm
