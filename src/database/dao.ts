import bcrypt from "bcrypt"
import { MySQLPromiseConnection, MySQLRowDataPacket } from "@fastify/mysql"
import { User } from "../types"

export async function mysqlCreateUser(con: MySQLPromiseConnection, user: User) {
    const sql = 'INSERT INTO user SET ?'
    const { username, password } = user
    const hashedPassword = await bcrypt.hash(password, 10)
    await con.query(sql, { username: username, password: hashedPassword })
}

export async function mysqlGetUser(con: MySQLPromiseConnection, username: string) {
    const sql = 'SELECT id, username, password FROM user WHERE username = ?'
    const [rows] = await con.query<MySQLRowDataPacket[]>(sql, username)
    return rows
}

export async function mysqlUpdateUser(con: MySQLPromiseConnection, newData: User, id: number) {
    const sql = 'UPDATE user SET ? WHERE id = ?'
    const [rows]: any = await con.query(sql, [newData, id])
    return rows
}

export async function mysqlDeleteUser(con: MySQLPromiseConnection, id: number) {
    const sql = 'DELETE FROM user WHERE id = ?'
    const [rows]: any = await con.query(sql, id)
    return rows
}
