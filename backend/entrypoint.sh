#!/bin/bash

# Espera pelo banco de dados estar disponível
dockerize -wait tcp://dpg-cp50v0f79t8c73emtbjg-a.frankfurt-postgres.render.com:5432 -timeout 60s

# Executa migrações com ou sem seeders
if [ "$RESET_SEEDERS" = "true" ]; then
    php artisan migrate:fresh --seed --force
else
    php artisan migrate --force
fi

# Ajusta as sequências no banco de dados
php artisan db:adjust-sequences

# Inicia o PHP-FPM
exec php-fpm -F
