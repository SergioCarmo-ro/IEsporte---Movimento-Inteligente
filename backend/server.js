import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Função para abrir o banco
const dbPromise = open({
    filename: "./backend/database.db",
    driver: sqlite3.Database
});

// Criação de tabela (exemplo)
app.get("/init", async(req, res) => {
    const db = await dbPromise;
    await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT UNIQUE,
      senha TEXT
    )
  `);
    res.send("Banco de dados inicializado!");
});

// Inserir usuário
app.post("/api/usuarios", async(req, res) => {
    const { nome, email, senha } = req.body;
    const db = await dbPromise;
    try {
        await db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senha]);
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        res.status(400).json({ error: "Erro ao cadastrar usuário", details: err.message });
    }
});

// Listar usuários
app.get("/api/usuarios", async(req, res) => {
    const db = await dbPromise;
    const usuarios = await db.all("SELECT * FROM usuarios");
    res.json(usuarios);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));