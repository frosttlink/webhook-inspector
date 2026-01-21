# Node-React Webhooks

Um projeto full-stack para gerenciamento e monitoramento de webhooks com geração automática de handlers usando IA.

## 📋 Descrição

Sistema completo para capturar, gerenciar e listar webhooks com interface moderna. Permite gerar handlers automáticos baseados em payloads de webhook usando inteligência artificial.

## 🚀 Tecnologias

### Backend (API)

- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Tipagem estática para JavaScript
- **Drizzle ORM** - ORM moderno com suporte a PostgreSQL
- **Zod** - Validação de schemas
- **AI SDK (Google)** - Integração com modelos de IA
- **PostgreSQL** - Banco de dados relacional

### Frontend (Web)

- **React 19** - Biblioteca UI declarativa
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderno e rápido
- **TanStack Router** - Roteamento robusto
- **React Query** - Gerenciamento de estado e cache
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones SVG

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- pnpm 10.5.2+
- PostgreSQL (para o banco de dados)

### Passos

1. **Clone o repositório**

   ```bash
   git clone <seu-repositorio>
   cd node-react
   ```

2. **Instale as dependências**

   ```bash
   pnpm install
   ```

3. **Configure variáveis de ambiente**

   Na pasta `api/`, crie um arquivo `.env`:

   ```
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/webhooks
   GOOGLE_GENERATIVE_AI_API_KEY=sua-chave-api
   ```

4. **Configure o banco de dados**

   ```bash
   cd api
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Inicie a aplicação**

   Terminal 1 (API):

   ```bash
   cd api
   pnpm dev
   ```

   Terminal 2 (Web):

   ```bash
   cd web
   pnpm dev
   ```

## 💻 Uso

### API

- **URL**: `http://localhost:3000` (padrão Fastify)
- **Documentação**: Swagger/OpenAPI disponível na rota `/docs`
- **Endpoints principais**:
  - `GET /webhooks` - Listar webhooks
  - `POST /webhooks/capture` - Capturar webhook
  - `GET /webhooks/:id` - Obter detalhes de um webhook
  - `DELETE /webhooks/:id` - Deletar webhook
  - `POST /webhooks/:id/generate-handler` - Gerar handler com IA

### Web

- **URL**: `http://localhost:5173` (padrão Vite)
- **Funcionalidades**:
  - Visualizar lista de webhooks capturados
  - Ver detalhes de cada webhook
  - Visualizar payload em code blocks formatados
  - Gerar handlers automáticos usando IA
  - Deletar webhooks

## 📂 Estrutura do Projeto

```
node-react/
├── api/                    # Backend (Fastify + TypeScript)
│   ├── src/
│   │   ├── server.ts       # Configuração do servidor
│   │   ├── routes/         # Endpoints da API
│   │   ├── db/             # Banco de dados (Drizzle ORM)
│   │   └── env.ts          # Variáveis de ambiente
│   └── package.json
│
├── web/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── routes/         # Páginas (TanStack Router)
│   │   ├── http/           # Requisições HTTP
│   │   └── index.css       # Estilos globais
│   └── package.json
│
└── pnpm-workspace.yaml     # Configuração do workspace
```

## 🛠️ Scripts Disponíveis

### API

```bash
pnpm dev              # Executar em desenvolvimento
pnpm start            # Executar versão de produção
pnpm format           # Formatar código com Biome
pnpm db:generate      # Gerar migrações do banco
pnpm db:migrate       # Executar migrações
pnpm db:studio        # Abrir Drizzle Studio
pnpm db:seed          # Popular banco com dados de exemplo
```

### Web

```bash
pnpm dev              # Executar em desenvolvimento
pnpm build            # Build para produção
pnpm format           # Formatar código com Biome
pnpm preview          # Preview da build
```

## 🔧 Comandos do Workspace

```bash
pnpm install          # Instalar dependências de todos os pacotes
pnpm -r dev           # Rodar dev em todos os pacotes
pnpm format -r        # Formatar todos os pacotes
```

## 📝 Notas Importantes

- O projeto usa **pnpm workspaces** para gerenciar múltiplos pacotes
- A API requer uma chave da **Google Generative AI** para gerar handlers
- Certifique-se de que o PostgreSQL está rodando antes de iniciar a API
- Use `pnpm db:studio` para visualizar e gerenciar dados do banco graficamente

## 📄 Licença

ISC
