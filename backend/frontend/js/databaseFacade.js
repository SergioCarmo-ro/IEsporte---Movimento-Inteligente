// databaseFacade.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export class DatabaseFacade {
    static async getConnection() {
        return open({
            filename: "./backend/database.db",
            driver: sqlite3.Database
        });
    }

    static async criarUsuario(nome, email, senha) {
        const db = await this.getConnection();
        await db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senha]);
    }

    static async listarUsuarios() {
        const db = await this.getConnection();
        return await db.all("SELECT id, nome, email FROM usuarios");
    }

    static async autenticarUsuario(email, senha) {
        const db = await this.getConnection();
        return await db.get("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha]);
    }
}