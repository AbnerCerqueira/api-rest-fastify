import { FastifyReply, FastifyRequest } from "fastify";

export async function verificaJwt(req: FastifyRequest, reply: FastifyReply) {
    try {
        await req.jwtVerify()
    } catch (err) {
        return reply.send({ message: "Token inválido" })
    }
}