FROM php:8.2-apache
 
# Instalar extensões necessárias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl
 
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd
 
# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
 
# Configurar diretório de trabalho
WORKDIR /var/www/html
COPY . .
 
# Instalar dependências
RUN composer install --no-dev --optimize-autoloader
 
# Dar permissões às pastas do Laravel
RUN chown -R www-data:www-data storage bootstrap/cache
 
# Configurar o Apache para o Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/apache2/htdocs!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite
 
EXPOSE 80
