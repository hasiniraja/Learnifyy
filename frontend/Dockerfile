FROM node:20-alpine

WORKDIR /app

# Install git + bash (needed for some npm scripts)
RUN apk add --no-cache git bash

# Copy only dependency files first
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the app
COPY . .

# Build the app
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "dev"]

