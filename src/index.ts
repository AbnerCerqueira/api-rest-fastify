import fastify from "fastify"
import jwtPlugin from './plugins/jwt'
import mysqlPlugin from './plugins/mysql'
import routes from "./routes"
import swaggerPlugin from './plugins/swagger'

const server = fastify({ logger: true })

server.register(mysqlPlugin)
server.register(jwtPlugin)
server.register(swaggerPlugin)
server.register(routes)

async function start() {
    try {
        await server.listen({ port: 8000 })
        console.log(`Iniciando servidor na porta ${8000}`)
    } catch (err) {
        server.log.error(err)
    }
}

start() 
