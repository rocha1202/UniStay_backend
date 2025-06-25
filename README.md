# 🛏️ UniStay API – Plataforma de Alojamento e Integração Académica

**UniStay** é uma API REST construída em Node.js com Express e MySQL, que serve como backend para uma plataforma de alojamento universitário. A aplicação conecta **estudantes** que procuram alojamento com **facilitadores** que os disponibilizam, promovendo também a **integração académica e cultural** por meio de eventos.

---

## 🚀 Funcionalidades Principais

### 👤 Autenticação & Perfis
- Registo e login de utilizadores (estudante, facilitador, administrador)
- Geração de token JWT
- Perfil protegido por autenticação

### 🏠 Alojamentos
- Criação de alojamentos por facilitadores
- Pesquisa por zona, preço, número de camas, tipo de quarto e disponibilidade
- Avaliações e comentários feitos por estudantes

### 📅 Reservas
- Estudantes podem fazer reservas em alojamentos
- Facilitadores confirmam ou cancelam reservas
- Gestão de disponibilidade automática

### 🎉 Eventos
- Facilitadores criam eventos académicos, culturais e lúdicos
- Estudantes participam em eventos
- Notificações em caso de alterações ou cancelamentos

### 🔔 Notificações
- Internas por sistema (reserva recebida, confirmação, etc.)
- Exibidas por utilizador autenticado

### 🛡️ Administração
- Aprovação de novos facilitadores
- Bloqueio / desbloqueio / remoção de utilizadores
- Moderação de alojamentos e eventos

---

## 📦 Tecnologias Usadas

- Node.js + Express
- MySQL (via mysql2)
- JWT (autenticação)
- Dotenv (variáveis de ambiente)
- Nodemailer (suporte opcional a envio de emails)
- Postman (coleção para testes)

---

## ▶️ Como correr localmente

```bash
git clone https://github.com/teu-utilizador/unistay-api.git
cd unistay-api
npm install
cp .env.example .env
# configura a base de dados e variáveis de ambiente
npm start
```

Servidor por padrão:  
👉 `http://localhost:3000`

---

## 📬 API Documentada no Postman

Inclui:
- Todas as rotas
- Agrupamento por funcionalidade
- Exemplos de uso em JSON

---

## 💡 Observações

Este projeto foi desenvolvido como parte de uma unidade curricular (Programação Web 2) e simula uma plataforma real de apoio ao alojamento estudantil com integração académica.
