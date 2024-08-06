import { addUser, authUser, deleteUser, getUser, updateUser } from '../controllers/index'
import { apagarSchema, atualizarSchema, authSchema, cadastroSchema, loginSchema } from '../schemas/schemas'
import { RouteOptions } from 'fastify'
import { verifyJwt } from '../middlewares/auth'

export const cadastro: RouteOptions = {
    method: 'POST',
    url: '/api/cadastro',
    handler: addUser,
    schema: {
        ...cadastroSchema
    }
}

export const login: RouteOptions = {
    method: 'POST',
    url: '/api/login',
    handler: getUser,
    schema: {
        ...loginSchema
    }
}

export const rotaProtegida: RouteOptions = {
    method: 'GET',
    url: '/api/rota-protegida',
    onRequest: [verifyJwt],
    handler: authUser,
    schema: {
        ...authSchema
    }
}

export const atualizar: RouteOptions = {
    method: 'PUT',
    url: '/api/atualizar',
    onRequest: [verifyJwt],
    handler: updateUser,
    schema: {
        ...atualizarSchema
    }
}

export const apagar: RouteOptions = {
    method: 'DELETE',
    url: '/api/apagar',
    onRequest: [verifyJwt],
    handler: deleteUser,
    schema: {
        ...apagarSchema
    }
}
