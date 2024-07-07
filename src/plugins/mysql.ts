import { FastifyInstance } from "fastify"
import fastifyPlugin from "fastify-plugin"
import fastifyMysql, { MySQLPromiseConnection } from "@fastify/mysql"

declare module 'fastify' {
    interface FastifyInstance {
        mysql: MySQLPromiseConnection
    }
}

async function mysqlPlugin(server: FastifyInstance) {

    await server.register(fastifyMysql, {
        promise: true,
        uri: "mysql://root@localhost/fastify",
        password: "" || "1"
    })
}

export default fastifyPlugin(mysqlPlugin)