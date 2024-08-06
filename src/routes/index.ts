import { cadastro, login, rotaProtegida, atualizar, apagar } from './routes'
import { FastifyInstance } from 'fastify'


export default function routes(server: FastifyInstance, options: any, done: Function) {
    server.route(cadastro)
    server.route(login)
    server.route(rotaProtegida)
    server.route(atualizar)
    server.route(apagar)
    done()
}
