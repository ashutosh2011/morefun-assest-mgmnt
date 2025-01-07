#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is ready!"

# Run migrations
echo "Running database migrations..."
npx prisma migrate reset --force

# The above command will also run the seed script
# But if you want to run seed separately, uncomment the following:
# echo "Running database seed..."
# npx prisma db seed

# Start the application
echo "Starting the application..."
exec "$@" 