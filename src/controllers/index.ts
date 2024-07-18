import { FastifyReply, FastifyRequest } from "fastify"
import { MySQLRowDataPacket } from "@fastify/mysql"
import bcrypt from "bcrypt"
import { User } from "../types"


export async function addUser(req: FastifyRequest, reply: FastifyReply) {
    const con = req.server.mysql

    const sql = 'INSERT INTO user SET ?'
    const { username, password } = req.body as User
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await con.query(sql, { username: username, password: hashedPassword })
        return reply.status(201).send({ message: "Usuário criado" })
    } catch (err: any) {
        return err.code === "ER_DUP_ENTRY" ? reply.status(409).send({ message: "Usuário ja existe" }) : err
    }
}

export async function getUser(req: FastifyRequest, reply: FastifyReply) {
    const con = req.server.mysql
    const sql = 'SELECT id, username, password FROM user WHERE username = ?'

    const { username, password } = req.body as User
    const [rows] = await con.query<MySQLRowDataPacket[]>(sql, username)

    if (!rows.length) {
        return reply.status(403).send({ message: "Usuário não encontrado" })
    }

    const isMatch = await bcrypt.compare(password, rows[0].password)
    if (!isMatch) {
        return reply.status(403).send({ message: "Senha inválida" })
    }

    const token = req.server.jwt.sign({
        id: rows[0].id,
        username: rows[0].username,
    }, {
        expiresIn: '1h'
    })

    return reply.status(200).send({ message: "Logado com sucesso", token })
}

export async function authUser(req: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send({ message: "Autenticado com sucesso", user: req.user })
}

export async function updateUser(req: FastifyRequest, reply: FastifyReply) {
    const con = req.server.mysql
    const sql = 'UPDATE user SET ? WHERE id = ?'

    if (Object.keys(req.body as User).length === 0) {
        return reply.status(204)
    }

    const { id, username, password } = req.body as User

    const hashedPassword = await bcrypt.hash(password, 10)

    const dadosAtualizados = {
        username: username,
        password: hashedPassword
    }

    try {
        await con.query(sql, [dadosAtualizados, id])
        return reply.status(200).send({ message: "Usuário atualizado com sucesso" })
    } catch (err: any) {
        return err
    }
}

export async function deleteUser(req: FastifyRequest, reply: FastifyReply) {
    const con = req.server.mysql
    const sql = 'DELETE FROM user WHERE id = ?'

    // OBS: podemos pegar o id pelo parametro da rota, custom header na requisição ou pelo token do usuário autenticado
    const { id } = req.user as User

    try {
        await con.query(sql, id)
        return reply.status(200).send({ message: "Usuário apagado com sucesso" })
    } catch (err: any) {
        return err
    }
}