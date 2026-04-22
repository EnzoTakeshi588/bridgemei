const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3001;

// Cria o banco de dados (arquivo usuarios.db)
const db = new Database("usuarios.db");

// Cria a tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em TEXT DEFAULT (datetime('now'))
  )
`);

app.use(cors());
app.use(express.json());

// Rota de cadastro
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const jaExiste = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);
  if (jaExiste) {
    return res.status(400).json({ erro: "E-mail já cadastrado" });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  db.prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)").run(nome, email, senhaCriptografada);

  res.json({ mensagem: "Usuário cadastrado com sucesso!" });
});

// Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const usuario = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);

  if (!usuario) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos" });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos" });
  }

  res.json({ mensagem: "Login realizado com sucesso!", nome: usuario.nome });
});

// Rota para listar usuários (para testar)
app.get("/usuarios", (req, res) => {
  const usuarios = db.prepare("SELECT id, nome, email, criado_em FROM usuarios").all();
  res.json(usuarios);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Banco de dados: usuarios.db`);
});