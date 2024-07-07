import fastify, { FastifyInstance } from "fastify"
import fastifyMysql, { MySQLPromiseConnection, MySQLRowDataPacket } from "@fastify/mysql"
import bcrypt from "bcrypt"
import jwt from "@fastify/jwt"
import { User } from "./types/types"
import { verificaJwt } from "./middlewares/auth"

const server = fastify({ logger: true })

declare module 'fastify' {
    interface FastifyInstance {
        mysql: MySQLPromiseConnection
    }
}

server.register(fastifyMysql, {
    promise: true,
    uri: "mysql://root@localhost/fastify",
    password: "1"
})

server.register(jwt, {
    secret: "segredinho"
})

server.post('/api/cadastro', async (req, reply) => {
    const con = server.mysql
    const sql = 'INSERT INTO user SET ?'

    const { username, password } = req.body as User
    const hashedPassword = await bcrypt.hash(password, 10)

    const [rows] = await con.query<MySQLRowDataPacket[]>(sql, { username: username, password: hashedPassword })
    reply.send(rows)
})

server.post('/api/login', async (req, reply) => {
    const con = server.mysql
    const sql = 'SELECT id, username, password FROM user WHERE username = ?'

    const { username, password } = req.body as User
    const [rows] = await con.query<MySQLRowDataPacket[]>(sql, username)

    if (!rows.length) {
        return reply.send({ message: "Usuário não encontrado" })
    }

    const result = await bcrypt.compare(password, rows[0].password)
    if (!result) {
        return reply.send({ message: "Senha inválida" })
    }

    const token = server.jwt.sign({
        id: rows[0].id,
        username: rows[0].username,
    }, {
        expiresIn: '1h'
    })

    reply.send({ message: "Logado com sucesso", token })
})

server.get('/api/rota-protegida', { onRequest: [verificaJwt] }, async (req, reply) => {
    reply.send({ message: "Autenticado com sucesso", user: req.user })
})

server.put('/api/atualizar', async (req, reply) => {
    const con = server.mysql
    const sql = 'UPDATE user SET ?'

    const { username, password } = req.body as User
    const hashedPassword = await bcrypt.hash(password, 10)

    const [rows] = await con.query<MySQLRowDataPacket[]>(sql, { username: username, password: hashedPassword })
    reply.send(rows)
})

server.delete('/api/apagar', { onRequest: [verificaJwt] }, async (req, reply) => {
    const con = server.mysql
    const sql = 'DELETE FROM user WHERE id = ?'

    const { id } = req.user as User
    const [rows] = await con.query<MySQLRowDataPacket[]>(sql, id)

    reply.send(rows)
})

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