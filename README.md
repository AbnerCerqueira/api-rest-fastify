# Start
API feita utilizando Fastify, MySQL e autenticação JWT, após o build, pode ser testada pela Swagger UI configurada em: `http://localhost:8000/docs`
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
Crie um arquivo .env no diretório raiz do projeto e atribua às environment variables suas configs do MySQL.
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
![image](https://github.com/user-attachments/assets/1ba1dc43-1528-4393-8b76-9e304b5c71ca)


# Run
```
http://localhost:8000/docs
```
![image](https://github.com/user-attachments/assets/0e7f048c-4c1e-4b04-86c4-4d1dcbb1a374)

