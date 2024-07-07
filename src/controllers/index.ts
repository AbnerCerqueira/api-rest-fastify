import { FastifyReply, FastifyRequest } from "fastify"
import { MySQLRowDataPacket } from "@fastify/mysql"
import bcrypt from "bcrypt"
import { User } from "../types"


export async function addUser(req: FastifyRequest, reply: FastifyReply) {
    const con = req.server.mysql

    const sql = 'INSERT INTO user SET ?'
    console.log(req.body)
    const { username, password } = req.body as User
    const hashedPassword = await bcrypt.hash(password, 10)

    const [rows] = await con.query<MySQLRowDataPacket[]>(sql, { username: username, password: hashedPassword })
    return reply.send(rows)
}

export async function getUser(req: FastifyRequest, reply: FastifyReply) {
    const con = req.server.mysql

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

    const token = req.server.jwt.sign({
        id: rows[0].id,
        username: rows[0].username,
    }, {
        expiresIn: '1h'
    })

    return reply.send({ message: "Logado com sucesso", token })
}

export async function authUser(req: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: "Autenticado com sucesso", user: req.user })
}

export async function updateUser(req: FastifyRequest, reply: FastifyReply) {
    const con = req.server.mysql
    const sql = 'UPDATE user SET ? WHERE id = ?'

    const { id } = req.user as User
    const { username, password } = req.body as User

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const dadosAtualizados = {
        username: username,
        password: hashedPassword
    }

    const [rows] = await con.query<MySQLRowDataPacket[]>(sql, [dadosAtualizados, id])
    return reply.send(rows)
}

export async function deleteUser(req: FastifyRequest, reply: FastifyReply) {
    const con = req.server.mysql
    const sql = 'DELETE FROM user WHERE id = ?'

    const { id } = req.user as User
    const [rows] = await con.query<MySQLRowDataPacket[]>(sql, id)

    return reply.send(rows)

}