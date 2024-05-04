# Use a imagem base php:7.4-fpm
FROM php:7.4-fpm

# Instala as dependências do sistema
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libpq-dev

# Instala as extensões do PHP necessárias
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Copia o Composer do contêiner oficial do Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho como /var/www
WORKDIR /var/www

# Copia os arquivos do aplicativo Laravel para o contêiner
COPY . /var/www

# Define as permissões de usuário
RUN chown -R www-data:www-data /var/www

# Expõe a porta 9000
EXPOSE 9000

# Comando para iniciar o servidor php-fpm
CMD ["php-fpm"]
