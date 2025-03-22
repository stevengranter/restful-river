import { Router } from "express"
import usersController from "../controllers/users.controller.js"

const router = Router()

router
    .get("/", usersController.getAllUsers)
    .post("/", usersController.createNewUser)
    .patch("/", usersController.updateUser)
    .delete("/", usersController.deleteUser)

export { router as usersRouter }
