import { FastifyReply, FastifyRequest } from "fastify"
import { MySQLRowDataPacket } from "@fastify/mysql"
import bcrypt from "bcrypt"
import { User } from "../types"
import { mysqlCreateUser, mysqlDeleteUser, mysqlGetUser, mysqlUpdateUser } from "../database/dao"


export async function addUser(req: FastifyRequest, reply: FastifyReply) {
    try {
        const con = req.server.mysql
        await mysqlCreateUser(con, req.body as User)
        return reply.status(201).send({ message: "Usuário criado" })
    } catch (err: any) {
        return err.code === "ER_DUP_ENTRY" ? reply.status(409).send({ message: "Usuário ja existe" }) : reply.send(err)
    }
}

export async function getUser(req: FastifyRequest, reply: FastifyReply) {
    
    const { username, password } = req.body as User
    let result: MySQLRowDataPacket[] = []
    
    try {
        const con = req.server.mysql
        result = await mysqlGetUser(con, username)
    } catch (err: any) {
        return reply.send(err)
    }

    if (!result.length) {
        return reply.status(400).send({ message: "Usuário não encontrado" })
    }

    const isMatch = await bcrypt.compare(password, result[0].password)
    if (!isMatch) {
        return reply.status(403).send({ message: "Senha inválida" })
    }

    const token = req.server.jwt.sign({
        ...result[0]
    }, {
        expiresIn: '1h'
    })

    return reply.status(200).send({ message: "Logado com sucesso", token })
}

export async function authUser(req: FastifyRequest, reply: FastifyReply) {
    const { id, username } = req.user as User
    return reply.status(200).send({ message: "Autenticado com sucesso", user: { id, username } })
}

export async function updateUser(req: FastifyRequest, reply: FastifyReply) {
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
        return reply.status(204).send()
    }

    try {
        const con = req.server.mysql
        const { id } = req.user as User
        const result = await mysqlUpdateUser(con, submission, id)
        return result.affectedRows > 0 ? reply.status(200).send({ message: "Usuário atualizado com sucesso" }) : reply.status(400).send({ message: "Não foi possivel atualizar" })
    } catch (err: any) {
        return reply.send(err)
    }
}

export async function deleteUser(req: FastifyRequest, reply: FastifyReply) {
    try {
        // OBS: podemos pegar o id pelo parametro da rota, custom header na requisição ou pelo token do usuário autenticado
        const { id } = req.user as User
        const con = req.server.mysql
        const result = await mysqlDeleteUser(con, id)
        return result.affectedRows > 0 ? reply.status(200).send({ message: "Usuário apagado com sucesso" }) : reply.status(204).send()
    } catch (err: any) {
        return reply.send(err)
    }
}
