import { FastifySchema } from "fastify";

export const cadastroSchema: FastifySchema = {
    body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }
        },
        additionalProperties: false
    },
    response: {
        201: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
        409: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        },
    }
}

export const loginSchema: FastifySchema = {
    body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }
        },
        additionalProperties: false
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                token: { type: 'string' }
            }
        },
        403: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            },
        },
    }
}

export const authSchema = {
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
            authorization: { type: 'string', pattern: '^Bearer\\s+.+$' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                user: {}
            }
        },
        401: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            },
        },
    }
}

export const atualizarSchema = {
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
            authorization: { type: 'string', pattern: '^Bearer\\s+.+$' }
        }
    },
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }
        },
        additionalProperties: false
    },
    response: {
        204: {

        },
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
}

export const apagarSchema = {
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
            authorization: { type: 'string', pattern: '^Bearer\\s+.+$' }
        }
    },
    response: {
        204: {

        },
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
}
