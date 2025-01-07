# Use Node.js LTS
FROM node:18-alpine

# Install dependencies for Prisma and build
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    netcat-openbsd

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the application
COPY . .

# Generate Prisma Client only (not migrations)
RUN npx prisma generate

# Build the Next.js application
RUN npm run docker-build

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the application
CMD ["npm", "start"]