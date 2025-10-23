// controllers/userController.js
import { UserRepository } from "../repositories/userRepository.js";

export class UserController {
    static async listar(req, res) {
        const repo = new UserRepository();
        const usuarios = await repo.findAll();
        res.json(usuarios);
    }
}