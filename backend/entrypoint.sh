#!/bin/bash

# Wait for the database to be ready
dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 60s

# Clear caches
php artisan clear:all

# Função para rodar migrations e seeds
run_migrations_and_seeds() {
    if [ "$RESET_SEEDERS" = "true" ]; then
        php artisan migrate:fresh --seed
    else
        php artisan migrate --force
    fi

    # Ajustar sequências do banco de dados se necessário
    php artisan db:adjust-sequences

    # Criar arquivo de controle indicando que o processo foi concluído
    touch /tmp/seeding_completed
}

# Rodar migrations e seeds em background
run_migrations_and_seeds &

# Esperar até que o arquivo de controle seja criado
while [ ! -f /tmp/seeding_completed ]; do
  sleep 1
done

# Start the Laravel application
php artisan serve --host=0.0.0.0 --port=8000