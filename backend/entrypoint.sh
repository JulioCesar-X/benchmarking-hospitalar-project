#!/bin/bash

# Iniciar PHP-FPM
php-fpm -D

# Aguarde o banco de dados estar disponível
dockerize -wait tcp://dpg-cp50v0f79t8c73emtbjg-a.frankfurt-postgres.render.com:5432 -timeout 60s

# Execute as migrações e seeds conforme necessário
if [ "$RESET_SEEDERS" = "true" ]; then
    php artisan migrate:fresh --seed --force
else
    php artisan migrate --force
fi

# Ajuste as sequências
php artisan db:adjust-sequences

# Inicie o Nginx em primeiro plano
nginx -g "daemon off;"
