import { FastifyInstance, RouteOptions } from 'fastify'
import { addUser, authUser, deleteUser, getUser, updateUser } from '../controllers/index'
import { verifyJwt } from '../middlewares/auth'

const cadastro: RouteOptions = {
    method: 'POST',
    url: '/api/cadastro',
    handler: addUser
}

const login: RouteOptions = {
    method: 'POST',
    url: '/api/login',
    handler: getUser
}

const rotaProtegida: RouteOptions = {
    method: 'GET',
    url: '/api/rota-protegida',
    onRequest: [verifyJwt],
    handler: authUser
}

const atualizar: RouteOptions = {
    method: 'PUT',
    url: '/api/atualizar',
    onRequest: [verifyJwt],
    handler: updateUser
}

const apagar: RouteOptions = {
    method: 'DELETE',
    url: '/api/apagar',
    onRequest: [verifyJwt],
    handler: deleteUser
}

export default function routes(server: FastifyInstance, options: any, done: Function) {
    server.route(cadastro)
    server.route(login)
    server.route(rotaProtegida)
    server.route(atualizar)
    server.route(apagar)
    done()
}