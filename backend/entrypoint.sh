#!/bin/bash

# Esperar o PostgreSQL estar disponível
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

# Rodar migrações do Laravel para criar tabelas
php artisan migrate --force

# Rodar o script de inicialização de dados
psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_DATABASE -f /docker-entrypoint-initdb.d/postgresql-default-data.sql

# Rodar comandos Artisan adicionais
php artisan key:generate
php artisan config:cache

# Iniciar o servidor Laravel
exec "$@"
