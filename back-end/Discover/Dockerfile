FROM php:8.2-apache
 
# Instalar dependências do sistema e extensões PHP

RUN apt-get update && apt-get install -y \

    libpng-dev libonig-dev libxml2-dev libzip-dev \

    zip unzip git curl
 
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip
 
# Instalar Composer

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
 
WORKDIR /var/www/html

COPY . .
 
# Instalar dependências ignorando scripts (evita erros de falta de .env no build)

RUN composer install --no-dev --optimize-autoloader --no-scripts
 
# Dar permissões

RUN chown -R www-data:www-data storage bootstrap/cache
 
# Configurar Apache

ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

RUN a2enmod rewrite
 
EXPOSE 80

 
