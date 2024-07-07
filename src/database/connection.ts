import { FastifyInstance } from "fastify"
import fastifyPlugin from "fastify-plugin"
import fastifyMysql, { MySQLPromiseConnection } from "@fastify/mysql"
import jwt from "@fastify/jwt"

declare module 'fastify' {
    interface FastifyInstance {
        mysql: MySQLPromiseConnection
    }
}

async function dbConnector(server: FastifyInstance) {
    
    server.register(jwt, {
        secret: "segredinho"
    })

    server.register(fastifyMysql, {
        promise: true,
        uri: "mysql://root@localhost/fastify",
        password: "" || "1"
    })
}

export default fastifyPlugin(dbConnector)