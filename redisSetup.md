# Redis Setup with Docker

This guide provides step-by-step instructions to set up and run Redis using Docker. Follow these steps to configure Redis for development or production environments.

---

## Prerequisites

- **Docker** installed on your system.
- Basic knowledge of Docker commands.

---

## Steps to Set Up Redis

### **1. Pull the Redis Docker Image**
Download the official Redis image from Docker Hub:
```bash
docker pull redis:latest
```

### **2. Run Redis in a Docker Container**
Start a Redis container with default settings:
```bash
docker run --name redis-container -p 6379:6379 -d redis:latest
```
- **`--name redis-container`**: Assigns a name to the container.
- **`-p 6379:6379`**: Maps the container's Redis port (`6379`) to the host's port (`6379`).
- **`-d`**: Runs the container in detached mode.

### **3. Verify Redis is Running**
Check if the container is active:
```bash
docker ps
```
You should see the `redis-container` listed as running.

### **4. Connect to Redis**
To interact with Redis from within the container:
```bash
docker exec -it redis-container redis-cli
```
Test Redis commands:
```redis
SET mykey "Hello, Redis"
GET mykey
```

### **5. Persistent Data Storage**
By default, Redis data is lost when the container stops. To persist data, mount a volume:
```bash
docker run --name redis-container -p 6379:6379 -v redis-data:/data -d redis:latest
```
- **`-v redis-data:/data`**: Maps the `redis-data` volume to the `/data` directory in the container.

To stop and restart the container:
```bash
docker stop redis-container
docker start redis-container
```
The data will persist across restarts.

### **6. Using a Custom Configuration**

#### Create a `redis.conf` File:
```conf
bind 0.0.0.0
protected-mode no
appendonly yes
```

#### Run Redis with Custom Configuration:
```bash
docker run --name redis-container -p 6379:6379 -v $(pwd)/redis.conf:/usr/local/etc/redis/redis.conf -d redis:latest redis-server /usr/local/etc/redis/redis.conf
```

---

## Optional: Use Docker Compose

For more complex setups, define Redis in a `docker-compose.yml` file:

### Example `docker-compose.yml`:
```yaml
version: "3.8"
services:
  redis:
    image: redis:latest
    container_name: redis-container
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
volumes:
  redis-data:
```

Run the Redis service:
```bash
docker-compose up -d
```

To stop the services:
```bash
docker-compose down
```

---

## Logs and Debugging

### Check Container Logs:
```bash
docker logs redis-container
```

### Remove a Container:
If you need to delete the container:
```bash
docker stop redis-container
docker rm redis-container
```

---

## Connecting to Redis from Your Application

Use a Redis client to connect to the Redis server. Example in Node.js using `ioredis`:

### Node.js Example:
```typescript
import Redis from "ioredis";

const redis = new Redis({
    host: "localhost", // Use 'redis-container' if running in Docker Compose
    port: 6379,
});

redis.set("key", "value").then(() => {
    redis.get("key").then((value) => console.log("Value:", value));
});
```

---

## Commands Summary

| Action                       | Command                                                                 |
|------------------------------|-------------------------------------------------------------------------|
| Pull Redis Image             | `docker pull redis:latest`                                             |
| Run Redis Container          | `docker run --name redis-container -p 6379:6379 -d redis:latest`       |
| Run with Persistent Storage  | `docker run --name redis-container -p 6379:6379 -v redis-data:/data -d redis:latest` |
| Access Redis CLI             | `docker exec -it redis-container redis-cli`                            |
| Check Running Containers     | `docker ps`                                                            |
| Stop Container               | `docker stop redis-container`                                          |
| Start Container              | `docker start redis-container`                                         |
| View Logs                    | `docker logs redis-container`                                          |
| Remove Container             | `docker rm redis-container`                                            |

---

## Next Steps
- Integrate Redis with your backend for caching.
- Configure Nginx as a reverse proxy for secure access.
- Build and deploy your application.

Feel free to reach out if you encounter any issues!

