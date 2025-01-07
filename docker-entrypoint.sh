#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is ready!"

# Check if database is empty by checking if any users exist
echo "Checking if database needs initialization..."
USER_COUNT=$(npx prisma query 'SELECT COUNT(*) FROM users;' --json | grep -o '[0-9]*')

if [ "$USER_COUNT" = "0" ]; then
  echo "Database is empty. Running migrations and seed..."
  npx prisma migrate reset --force
else
  echo "Database already contains data. Running only migrations..."
  npx prisma migrate deploy
fi

# Start the application
echo "Starting the application..."
exec "$@" 