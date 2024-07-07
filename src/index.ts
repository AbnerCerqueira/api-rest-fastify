import fastify from "fastify"
import dbConnector from './database/connection'
import routes from "./routes/routes"

const server = fastify({ logger: true })

server.register(dbConnector)
server.register(routes)

const PORT = 8080
async function start() {
    try {
        await server.listen({ port: PORT })
        console.log(`Iniciando servidor na porta ${PORT}`)
    } catch (err) {
        server.log.error(err)
    }
}

start() 