```markdown
# 📚 API de Gestão de Tarefas e Avaliações

Este documento descreve os recursos disponíveis na API, integrando o **Sistema de Gestão de Tarefas** e o **Sistema de Avaliações**.

---

## 🚀 Tecnologias

- **Runtime:** Node.js
- **Banco de Dados:** SQLite
- **Autenticação:** JWT (JSON Web Tokens)
- **Segurança:** Bcrypt para hash de senhas
- **Arquitetura:** MVC + Service Layer + POO

---

## 📋 Índice

- [Autenticação](#-autenticação)
- [Gestão de Tarefas](#-gestão-de-tarefas)
- [Sistema de Avaliações](#-sistema-de-avaliações)
- [Códigos de Status](#-códigos-de-status)

---

## 🔐 Autenticação

### Registrar Novo Usuário

Cria uma nova conta no sistema com perfil de usuário ou administrador.

**Endpoint:** `POST /auth/registrar`

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senhaSegura123",
  "perfil": "user"
}
```

**Campos:**
- `nome` (string, obrigatório): Nome completo do usuário
- `email` (string, obrigatório): Email único no sistema
- `senha` (string, obrigatório): Senha de acesso
- `perfil` (string, opcional): Tipo de perfil - `"user"` ou `"admin"` (padrão: `"user"`)

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário registrado com sucesso",
  "userId": 1
}
```

---

### Login

Autentica o usuário e retorna token de acesso válido por 24 horas.

**Endpoint:** `POST /auth/login`

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "perfil": "user"
  }
}
```

---

## 📝 Gestão de Tarefas

> **⚠️ Importante:** Todas as rotas de tarefas requerem autenticação via token JWT.
> 
> **Header obrigatório:** `Authorization: Bearer <SEU_TOKEN>`

### Criar Tarefa

Cria uma nova tarefa associada ao usuário autenticado.

**Endpoint:** `POST /tarefas`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "titulo": "Estudar Node.js",
  "descricao": "Revisar módulos de API RESTful e autenticação JWT",
  "prioridade": "alta",
  "status": "pendente"
}
```

**Campos:**
- `titulo` (string, obrigatório): Título da tarefa
- `descricao` (string, opcional): Descrição detalhada
- `prioridade` (string, obrigatório): Nível de prioridade
  - Valores aceitos: `"baixa"`, `"media"`, `"alta"`
- `status` (string, obrigatório): Status atual da tarefa
  - Valores aceitos: `"pendente"`, `"em_andamento"`, `"concluida"`

**Resposta de Sucesso (201):**
```json
{
  "message": "Tarefa criada com sucesso",
  "tarefaId": 1
}
```

---

### Listar Tarefas

Retorna todas as tarefas do usuário autenticado. Administradores visualizam tarefas de todos os usuários.

**Endpoint:** `GET /tarefas`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta de Sucesso (200):**
```json
{
  "tarefas": [
    {
      "id": 1,
      "titulo": "Estudar Node.js",
      "descricao": "Revisar módulos de API RESTful e autenticação JWT",
      "prioridade": "alta",
      "status": "pendente",
      "usuario_id": 1,
      "criado_em": "2026-01-20T10:30:00.000Z"
    },
    {
      "id": 2,
      "titulo": "Implementar testes",
      "descricao": "Criar testes unitários para os controllers",
      "prioridade": "media",
      "status": "em_andamento",
      "usuario_id": 1,
      "criado_em": "2026-01-20T14:15:00.000Z"
    }
  ]
}
```

**Comportamento por Perfil:**
- **Usuários comuns:** Visualizam apenas suas próprias tarefas
- **Administradores:** Visualizam tarefas de todos os usuários do sistema

---

## ⭐ Sistema de Avaliações

> **⚠️ Importante:** 
> - Todas as rotas requerem autenticação via token JWT
> - Usuários **não podem** avaliar a si mesmos
> - Notas devem estar entre 1 e 5

### Criar Avaliação

Registra uma avaliação (nota e comentário) para outro usuário do sistema.

**Endpoint:** `POST /avaliacoes`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "avaliado_id": 2,
  "nota": 5,
  "comentario": "Excelente profissional! Entregou todas as tarefas no prazo e com qualidade excepcional."
}
```

**Campos:**
- `avaliado_id` (number, obrigatório): ID do usuário que será avaliado
- `nota` (number, obrigatório): Nota de 1 a 5 (números inteiros)
- `comentario` (string, opcional): Comentário sobre a avaliação

**Regras de Validação:**
- A nota deve ser um número inteiro entre 1 e 5
- O `avaliado_id` não pode ser igual ao ID do usuário autenticado
- O usuário avaliado deve existir no sistema

**Resposta de Sucesso (201):**
```json
{
  "message": "Avaliação registrada com sucesso",
  "avaliacaoId": 1
}
```

---

### Visualizar Relatório de Avaliações

Retorna o desempenho de um usuário específico, incluindo todas as avaliações recebidas e a média calculada automaticamente.

**Endpoint:** `GET /avaliacoes/recebidas/:usuarioId`

**Exemplo:** `GET /avaliacoes/recebidas/2`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Parâmetros de URL:**
- `usuarioId` (number): ID do usuário cujas avaliações serão consultadas

**Resposta de Sucesso (200):**
```json
{
  "usuario": {
    "id": 2,
    "nome": "Maria Santos"
  },
  "total_avaliacoes": 3,
  "media_nota": "4.67",
  "lista_avaliacoes": [
    {
      "id": 1,
      "nota": 5,
      "comentario": "Excelente profissional! Entregou todas as tarefas no prazo.",
      "avaliador": {
        "id": 1,
        "nome": "João Silva"
      },
      "data_avaliacao": "2026-01-20T10:00:00.000Z"
    },
    {
      "id": 2,
      "nota": 4,
      "comentario": "Muito bom trabalho, comunicação clara.",
      "avaliador": {
        "id": 3,
        "nome": "Pedro Costa"
      },
      "data_avaliacao": "2026-01-19T15:30:00.000Z"
    },
    {
      "id": 3,
      "nota": 5,
      "comentario": "Superou as expectativas!",
      "avaliador": {
        "id": 4,
        "nome": "Ana Lima"
      },
      "data_avaliacao": "2026-01-18T09:45:00.000Z"
    }
  ]
}
```

**Detalhes da Resposta:**
- `total_avaliacoes`: Quantidade total de avaliações recebidas
- `media_nota`: Média aritmética das notas (formatada com 2 casas decimais)
- `lista_avaliacoes`: Array com todas as avaliações, ordenadas da mais recente para a mais antiga

---

## 📊 Códigos de Status

### Sucesso
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso

### Erros do Cliente
- `400 Bad Request` - Dados inválidos ou faltando campos obrigatórios
- `401 Unauthorized` - Token não fornecido ou inválido
- `403 Forbidden` - Usuário sem permissão para acessar o recurso
- `404 Not Found` - Recurso não encontrado

### Erros do Servidor
- `500 Internal Server Error` - Erro interno no servidor

---

## 🔒 Segurança

- Senhas são armazenadas com hash bcrypt
- Tokens JWT expiram em 24 horas
- Validação de entrada em todas as rotas
- Proteção contra auto-avaliação no sistema de avaliações
- Controle de permissões baseado em perfil de usuário

---

## 📝 Exemplo de Uso Completo

```javascript
// 1. Registrar usuário
const registro = await fetch('/auth/registrar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@email.com',
    senha: 'senha123',
    perfil: 'user'
  })
});

// 2. Fazer login
const login = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@email.com',
    senha: 'senha123'
  })
});
const { token } = await login.json();

// 3. Criar tarefa
const tarefa = await fetch('/tarefas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    titulo: 'Estudar API',
    descricao: 'Revisar documentação',
    prioridade: 'alta',
    status: 'pendente'
  })
});

// 4. Avaliar outro usuário
const avaliacao = await fetch('/avaliacoes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    avaliado_id: 2,
    nota: 5,
    comentario: 'Excelente trabalho!'
  })
});
```

---

**Desenvolvido com ❤️ usando Node.js e SQLite**