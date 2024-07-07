import { FastifyInstance } from "fastify"
import fastifyPlugin from "fastify-plugin"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"

async function swaggerPlugin(server: FastifyInstance) {
    await server.register(fastifySwagger)
    await server.register(fastifySwaggerUi, {
        routePrefix: '/docs'
    })
}

export default fastifyPlugin(swaggerPlugin)