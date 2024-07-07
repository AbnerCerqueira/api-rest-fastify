import { FastifyInstance } from "fastify"
import fastifyPlugin from "fastify-plugin"
import jwt from "@fastify/jwt"

async function jwtPlugin(server: FastifyInstance) {
    await server.register(jwt, {
        secret: "segredinho"
    })
}

export default fastifyPlugin(jwtPlugin)