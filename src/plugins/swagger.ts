import fastifyPlugin from "fastify-plugin"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { FastifyInstance } from "fastify"

async function swaggerPlugin(server: FastifyInstance) {
    await server.register(fastifySwagger)
    await server.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        },
    })
}

export default fastifyPlugin(swaggerPlugin)
