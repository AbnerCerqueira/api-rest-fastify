import fastify from "fastify"
import mysqlPlugin from './plugins/mysql'
import jwtPlugin from './plugins/jwt'
import swaggerPlugin from './plugins/swagger'
import routes from "./routes"

const server = fastify({ logger: true })

server.register(mysqlPlugin)
server.register(jwtPlugin)
server.register(swaggerPlugin)
server.register(routes)

async function start() {
    const PORT = 8080
    try {
        await server.listen({ port: PORT })
        console.log(`Iniciando servidor na porta ${PORT}`)
    } catch (err) {
        server.log.error(err)
    }
}

start() 