FROM debian:trixie

# Avoid prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# 1. Install PHP and all extensions
RUN apt-get update && apt-get install -y \
    wget curl git unzip sudo \
    php-cli php-common php-fpm php-curl php-gd php-mbstring \
    php-mysql php-pgsql php-sqlite3 php-xml php-zip php-bcmath \
    php-intl php-bz2 php-calendar php-exif php-fileinfo php-ftp \
    php-iconv php-sockets php-tokenizer php-xmlrpc php-pspell \
    php-snmp php-soap php-tidy php-xsl php-imagick php-redis \
    php-memcached php-opcache php-apcu \
    mariadb-server mariadb-client \
    && apt-get clean

# 2. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Create the user 'samurayjedi' and give sudo rights
RUN useradd -m -s /bin/bash -u 1000 samurayjedi && \
    usermod -aG sudo samurayjedi && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# 4. Switch to the user to install NVM/Node
USER samurayjedi
ENV NVM_DIR /home/samurayjedi/.nvm
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install --lts \
    && nvm use --lts

# Set the working directory
WORKDIR /home/samurayjedi/Workspace