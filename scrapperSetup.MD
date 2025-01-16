# NSE Scraper Setup with Redis and Nginx

This guide provides step-by-step instructions to set up a scraper that fetches data from NSE India, stores it in Redis, and uses Nginx to prevent bans by managing requests efficiently.

---

## **1. Local Development Setup**

### Install Redis on Ubuntu
1. Update the system:
   ```bash
   sudo apt update
   ```
2. Install Redis:
   ```bash
   sudo apt install redis
   ```
3. Start and enable Redis service:
   ```bash
   sudo systemctl start redis
   sudo systemctl enable redis
   ```
4. Test the Redis installation:
   ```bash
   redis-cli ping
   # Expected output: PONG
   ```

### Update the Scraper for Redis Integration
1. Install Redis client for Node.js:
   ```bash
   npm install redis
   ```
2. Use the following code snippet in your scraper to connect and store data in Redis:
   ```javascript
   import { createClient } from 'redis';

   const redisClient = createClient();

   async function storeInRedis(key, value) {
     try {
       await redisClient.connect();
       await redisClient.set(key, JSON.stringify(value));
       console.log(`Data stored in Redis under key: ${key}`);
     } catch (err) {
       console.error('Redis error:', err);
     } finally {
       await redisClient.disconnect();
     }
   }
   ```

---

## **2. Deployment with Docker Compose**

### Create `docker-compose.yml`
Use the following `docker-compose.yml` file to define your services:
```yaml
version: '3.9'
services:
  scraper:
    build: .
    depends_on:
      - redis
    restart: always

  redis:
    image: redis:latest
    container_name: redis
    ports:
      - "6379:6379"

  nginx:
    image: nginx:latest
    container_name: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### Build and Deploy Services
1. Start the services:
   ```bash
   docker-compose up --build -d
   ```
2. Verify running containers:
   ```bash
   docker ps
   ```

---

## **3. Nginx Configuration**

### Example `nginx.conf`
Create a `nginx.conf` file with rate-limiting rules:
```nginx
worker_processes 1;
events {
    worker_connections 1024;
}
http {
    limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;

    server {
        listen 80;

        location / {
            proxy_pass http://scraper:3000;
            limit_req zone=one burst=5;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

---

## **4. Commands Reference**

### Local Development
- **Start Redis**:
  ```bash
  sudo systemctl start redis
  ```
- **Check Redis Status**:
  ```bash
  sudo systemctl status redis
  ```
- **Stop Redis**:
  ```bash
  sudo systemctl stop redis
  ```

### Docker Deployment
- **Start All Services**:
  ```bash
  docker-compose up --build -d
  ```
- **Stop All Services**:
  ```bash
  docker-compose down
  ```
- **Check Logs**:
  ```bash
  docker-compose logs -f
  ```

---

## **5. Testing the Setup**

### Redis
1. Access Redis CLI:
   ```bash
   redis-cli
   ```
2. Retrieve stored keys:
   ```bash
   KEYS *
   ```
3. Get value of a key:
   ```bash
   GET <key>
   ```

### Nginx
1. Check if rate-limiting is working by sending multiple requests quickly.
2. Monitor logs:
   ```bash
   docker logs nginx
   ```

---

## **6. Notes**
- Ensure that your scraper has proper delays between requests to avoid getting banned by NSE India.
- Test locally with Redis installed on Ubuntu before switching to Docker for deployment.
- Use `pm2` or similar tools to manage your scraper process for additional reliability.
