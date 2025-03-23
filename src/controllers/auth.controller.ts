import "dotenv/config"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as fs from "fs"
import * as fsPromises from "fs/promises"
import path from "path"
import { userSchema } from "../schemas/user.schema.js"
import { db } from "../server.js"
import { Request, Response } from "express"

const handleLogin = async (req: Request, res: Response) => {
    // Check req.body to see if matches schema
    const parsedBody = userSchema.safeParse(req.body)
    if (parsedBody.error) {
        return res.status(400).send(parsedBody.error.message)
    }
    const { email, password } = parsedBody.data

    // Check if user exists
    const [foundUser] = await db.query(
        "SELECT email,password FROM user_data WHERE" + " email = ?",
        [email.toLowerCase()]
    )
    if (!foundUser || foundUser.length < 1) {
        return res.status(400).json({ message: "User not found" })
    }

    // Check if password matches
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
        const accessToken = jwt.sign(
            { email: foundUser.email },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15s" }
        )
        const refreshToken = jwt.sign(
            { email: foundUser.email },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "1d" }
        )
        const result = await db.mutate(
            "UPDATE user_data SET refresh_token = ? WHERE email = ?",
            [refreshToken, foundUser.email]
        )
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.status(200).json({ accessToken })
    } else {
        res.status(400).json({ message: "Invalid credentials" })
    }

    // console.log(foundUser)
}

const authController = { handleLogin }

export default authController
