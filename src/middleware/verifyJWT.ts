import "dotenv/config"
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]
    console.log("Headers:")
    console.log(req.headers)
    if (!authHeader) return res.sendStatus(401)
    // console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
        (err: any, decoded: any) => {
            if (err) return res.sendStatus(403) // invalid token
            // console.log(decoded)
            req.body.email = decoded.email
            next()
        }
    )
}

export default verifyJWT
