# SMI Server

## Docker Setup

### Prerequisites
- Docker installed on your system
- Docker Compose installed on your system

### Building and Running with Docker

1. First time setup:
```bash
# Build the Docker image
docker-compose build

# Start the server
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f
```

3. Stop the server:
```bash
docker-compose down
```

### Environment Variables

Create a `.env` file in the root directory with your configuration:

```env
ENV_CURRENT=PROD  # or DEV
DB_PASSWORD=your_mongodb_password
# Add other environment variables as needed
```

### Persistence

The Docker setup includes volume mounts for:
- WhatsApp Web authentication data (`.wwebjs_auth`)
- WhatsApp Web cache (`.wwebjs_cache`)

This ensures your WhatsApp session persists across container restarts.

### Development Mode

To run in development mode:
1. Change `ENV_CURRENT=DEV` in docker-compose.yml
2. The server will run on port 3005 instead of 3010

### Troubleshooting

1. If WhatsApp Web connection issues occur:
```bash
# Remove the volumes and restart
docker-compose down -v
docker-compose up -d
```

2. To rebuild the image after dependencies change:
```bash
docker-compose build --no-cache
docker-compose up -d
```