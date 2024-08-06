# Clone
```
git clone https://github.com/AbnerCerqueira/api-rest-fastify.git
cd api-rest-fastify/
```

# Environment
## MySQL
```
CREATE DATABASE fastify;

USE fastify;

CREATE TABLE user(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(100)
);
```

## ENVs
```
MYSQL_USER = "root"
MYSQL_PASSWORD = ""
MYSQL_PORT = "3306"
MYSQL_DB = "fastify"
MYSQL_HOST = "localhost"
```

# Setup
```
npm install
npm run dev
```

# Run
```
http://localhost:8000/docs
```
