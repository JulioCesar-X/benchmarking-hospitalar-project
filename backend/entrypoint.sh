#!/bin/bash
set -e  # O script falhará se qualquer comando retornar um status de saída diferente de zero

# Iniciar PHP-FPM em background
php-fpm

# Esperar que PHP-FPM esteja pronto antes de iniciar Nginx
while ! nc -z localhost 9000; do
  echo "Esperando PHP-FPM..."
  sleep 1
done
echo "PHP-FPM está pronto."

# Esperar que o banco de dados esteja pronto
dockerize -wait tcp://dpg-cp50v0f79t8c73emtbjg-a:5432 -timeout 60s

# Run migrations
if [ "$RESET_SEEDERS" = "true" ]; then
    php artisan migrate:fresh --seed --force
else
    php artisan migrate --force
fi

# Ajustar sequências do banco de dados se necessário
php artisan db:adjust-sequences

# Iniciar Nginx em primeiro plano
exec nginx -g 'daemon off;'
