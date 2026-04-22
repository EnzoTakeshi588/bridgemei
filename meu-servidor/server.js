const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const app = express();
const PORT = 3001;
const DB_FILE = "./usuarios.json";

app.use(cors());
app.use(express.json());

// Lê os usuários do arquivo
function lerUsuarios() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

// Salva os usuários no arquivo
function salvarUsuarios(usuarios) {
  fs.writeFileSync(DB_FILE, JSON.stringify(usuarios, null, 2));
}

// Rota de cadastro
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const usuarios = lerUsuarios();
  const jaExiste = usuarios.find((u) => u.email === email);

  if (jaExiste) {
    return res.status(400).json({ erro: "E-mail já cadastrado" });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  usuarios.push({ nome, email, senha: senhaCriptografada });
  salvarUsuarios(usuarios);

  res.json({ mensagem: "Usuário cadastrado com sucesso!" });
});

// Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const usuarios = lerUsuarios();
  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos" });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos" });
  }

  res.json({ mensagem: "Login realizado com sucesso!", nome: usuario.nome });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});