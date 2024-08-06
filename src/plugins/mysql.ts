import dotenv from "dotenv"
import fastifyPlugin from "fastify-plugin"
import fastifyMysql, { MySQLPromiseConnection } from "@fastify/mysql"
import { FastifyInstance } from "fastify"

dotenv.config()

declare module 'fastify' {
    interface FastifyInstance {
        mysql: MySQLPromiseConnection
    }
}

async function mysqlPlugin(server: FastifyInstance) {
    const user = process.env.MYSQL_USER
    const host = process.env.MYSQL_HOST
    const db = process.env.MYSQL_DB
    const password = process.env.MYSQL_PASSWORD
    try {
        await server.register(fastifyMysql, {
            promise: true,
            uri: `mysql://${user}@${host}/${db}`,
            password: password
        })
        console.log("Conectado ao banco de dados")
    } catch (err) {
        console.log(err)
    }
}

export default fastifyPlugin(mysqlPlugin)
