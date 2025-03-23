import "dotenv/config"
import { db } from "../server.js"
import { Request, Response } from "express"

const handleLogout = async (req: Request, res: Response) => {
    // On client, also delete access token
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)

    const refreshToken = cookies.jwt

    // Is refreshToken in db?
    const [foundUser] = await db.query(
        "SELECT email,refresh_token FROM user_data WHERE refresh_token = ?",
        [refreshToken]
    )
    if (!foundUser || foundUser.length < 1) {
        res.clearCookie("jwt", { httpOnly: true })
        return res.sendStatus(204)
    }

    // Delete refresh token in db
    await db.query(
        "UPDATE user_data SET refresh_token = NULL WHERE refresh_token = ?",
        [refreshToken]
    )

    res.clearCookie("jwt", { httpOnly: true })
    return res.sendStatus(200).json({ message: "Logout successful" })
}

const logoutController = { handleLogout }

export default logoutController
