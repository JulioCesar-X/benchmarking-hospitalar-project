#!/bin/bash

# Esperar o PostgreSQL estar disponível
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

# Exportar a senha para ser usada pelo psql
export PGPASSWORD="$DB_PASSWORD"

# Rodar migrações do Laravel para criar tabelas
php artisan migrate --force

# Rodar o script de inicialização de dados
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" -f /docker-entrypoint-initdb.d/postgresql-default-data.sql

# Limpar a senha
unset PGPASSWORD

# Rodar comandos Artisan adicionais
php artisan key:generate
php artisan config:cache

# Iniciar o servidor Laravel
exec "$@"


# #!/bin/bash

# # Esperar o PostgreSQL estar disponível
# until pg_isready -h "172.31.45.90" -p "5432" -U "atec"; do
#   echo "Waiting for PostgreSQL..."
#   sleep 2
# done

# export PGPASSWORD="atec123"

# # Rodar migrações do Laravel para criar tabelas
# php artisan migrate --force

# # Rodar o script de inicialização de dados
# psql -h "172.31.45.90" -p "5432" -U "atec" -d "bh_db" -f /docker-entrypoint-initdb.d/postgresql-default-data.sql

# # Limpar a senha
# unset PGPASSWORD

# # Rodar comandos Artisan adicionais
# php artisan key:generate
# php artisan config:cache

# # Iniciar o servidor Laravel
# exec "$@"
