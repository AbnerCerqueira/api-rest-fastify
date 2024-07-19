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

    const submission = req.body as User

    for (const [key, value] of Object.entries(submission)) {
        if (key === 'password' && value !== '') {
            const hashedPassword = await bcrypt.hash(submission[key], 10)
            submission[key] = hashedPassword
        }
        if (value === '') {
            delete submission[key as keyof User]
        }
    }

    if (Object.keys(submission).length === 0) {
        return reply.status(204)
    }

    try {
        const { id } = req.user as User
        const [rows]: any = await con.query<MySQLRowDataPacket[]>(sql, [submission, id])
        return rows.affectedRows > 0 ? reply.status(200).send({ message: "Usuário atualizado com sucesso" }) : reply.status(400).send({ message: "Não foi possivel atualizar" })
    } catch (err: any) {
        return err
    }
}

export async function deleteUser(req: FastifyRequest, reply: FastifyReply) {
    const con = req.server.mysql
    const sql = 'DELETE FROM user WHERE id = ?'

    try {
        // OBS: podemos pegar o id pelo parametro da rota, custom header na requisição ou pelo token do usuário autenticado
        const { id } = req.user as User
        await con.query(sql, id)
        return reply.status(200).send({ message: "Usuário apagado com sucesso" })
    } catch (err: any) {
        return err
    }
}