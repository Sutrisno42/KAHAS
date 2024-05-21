#!/bin/bash
set -e

echo "Deployment started ..."

# Enter maintenance mode or return true
# if already is in maintenance mode
# (php artisan down) || true

# Pull the latest version of the app
sudo git stash
sudo git pull origin production

# Install composer dependencies
sudo composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Clear the old cache
php artisan clear-compiled

# Recreate cache
sudo chown -R $USER:www-data storage
sudo chown -R $USER:www-data bootstrap/cache
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache
sudo chmod -R ugo+rw storage
php artisan optimize

php artisan config:clear
php artisan cache:clear
sudo composer dump-autoload
php artisan view:clear
php artisan route:clear

# Compile npm assets
# npm run prod

# Run database migrations
php artisan migrate --force

# Exit maintenance mode
# php artisan up

echo "Deployment finished!"
