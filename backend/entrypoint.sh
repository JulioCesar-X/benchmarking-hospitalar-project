#!/bin/bash

# Wait for the database to be ready
dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 60s

# Clear caches
php artisan clear:all

# Função para rodar migrations e seeds
run_migrations_and_seeds() {
    if [ "$RESET_SEEDERS" = "true" ]; then
        php artisan migrate:fresh --seed --force
    else
        php artisan migrate --force
    fi

    # Ajustar sequências do banco de dados se necessário
    php artisan db:adjust-sequences

    # Criar arquivo de controle indicando que o processo foi concluído
    touch /tmp/seeding_completed

    # Exibir mensagem de feedback
    echo "Seeding completed successfully."
}

# Rodar migrations e seeds em background
run_migrations_and_seeds &

# Iniciar um processo que mantém a aplicação ativa enquanto o seeding está em andamento
( while [ ! -f /tmp/seeding_completed ]; do
    echo "Waiting for seeding to complete..."
    sleep 60
  done ) &

# Start the Laravel application
php artisan serve --host=0.0.0.0 --port=8000