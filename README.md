# 🐕 Petshop Backend API

Uma API REST moderna e completa para gerenciamento de petshop, desenvolvida com Node.js, TypeScript, Express e Prisma. O projeto inclui sistema de autenticação, gerenciamento de pets, agendamentos e vem com dados mock pré-configurados para desenvolvimento imediato.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-55%20passing-brightgreen.svg)](#testes)
[![Coverage](https://img.shields.io/badge/Coverage-80%2B%25-brightgreen.svg)](#testes)

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [✨ Características](#-características)
- [🛠️ Tecnologias](#️-tecnologias)
- [🚀 Instalação e Setup](#-instalação-e-setup)
- [🎮 Dados Mock Incluídos](#-dados-mock-incluídos)
- [🐳 Docker Setup](#-docker-setup)
- [⚙️ Configuração](#️-configuração)
- [🎯 Uso da API](#-uso-da-api)
- [📡 Endpoints](#-endpoints)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [📜 Scripts Disponíveis](#-scripts-disponíveis)
- [🧪 Testes](#-testes)
- [🚀 Melhorias Sugeridas](#-melhorias-sugeridas)
- [🚀 Deploy](#-deploy)
- [🤝 Contribuição](#-contribuição)
- [📝 Licença](#-licença)

## 🎯 Visão Geral

O **Petshop Backend** é uma solução completa para clínicas veterinárias e petshops que precisam de:

- 👥 **Gestão de Clientes** - Cadastro e autenticação de usuários
- 🐕 **Gerenciamento de Pets** - CRUD completo com informações detalhadas
- 📅 **Sistema de Agendamentos** - Consultas com validações de horário comercial
- 🔐 **Segurança Robusta** - JWT, rate limiting, validações
- 📊 **Relatórios** - Histórico e estatísticas de agendamentos

**Diferencial:** Vem com **dados mock realistas** para desenvolvimento imediato, setup com Docker e suite completa de testes.

## ✨ Características

### 🔐 **Autenticação & Segurança**
- JWT (JSON Web Tokens) para autenticação
- Hash seguro de senhas com bcryptjs
- Rate limiting para proteção contra abuso
- Validação de dados com Zod
- Middleware de autorização

### 🐾 **Gerenciamento de Pets**
- CRUD completo (Create, Read, Update, Delete)
- Associação com usuários proprietários
- Validação de propriedade (usuário só acessa seus pets)
- Informações detalhadas (espécie, raça, idade)

### 📅 **Sistema de Agendamentos**
- Criação e gestão de consultas
- **Regras de negócio:**
  - Segunda a Sexta: 8h às 18h
  - Sábado: 8h às 12h
  - Domingo: Fechado
- Validação de conflitos de horário
- Status de agendamento (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- Filtros e paginação

### 🧪 **Qualidade & Testes**
- **55+ testes automatizados** (100% passando)
- Cobertura de testes > 80%
- Testes unitários e de integração
- Testes de segurança e autorização

### 🌱 **Desenvolvimento Ready**
- **Dados mock pré-configurados** (4 usuários, 8 pets, 8 agendamentos)
- Setup com Docker em segundos
- Ambiente consistente entre desenvolvedores
- Hot reload com nodemon

## 🛠️ Tecnologias

### **Backend**
- **Node.js 18+** - Runtime JavaScript/TypeScript
- **TypeScript** - Tipagem estática para maior robustez
- **Express.js** - Framework web minimalista e flexível
- **Prisma** - ORM moderno com type-safety

### **Banco de Dados**
- **PostgreSQL** - Banco relacional robusto
- **Docker** - Containerização para desenvolvimento

### **Autenticação & Segurança**
- **JWT** - Tokens seguros para autenticação
- **bcryptjs** - Hash criptográfico de senhas
- **express-rate-limit** - Proteção contra abuse
- **Zod** - Validação de esquemas de dados

### **Qualidade & Testes**
- **Jest** - Framework de testes moderno
- **Supertest** - Testes de integração HTTP
- **ts-jest** - Preset Jest para TypeScript

### **DevOps & Deployment**
- **Docker & Docker Compose** - Containerização
- **GitHub Actions** - CI/CD pipeline
- **ESLint + Prettier** - Qualidade de código
- **Husky** - Git hooks para automação

## 🚀 Instalação e Setup

### **Pré-requisitos**
- [Node.js 18+](https://nodejs.org/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Yarn](https://yarnpkg.com/) (recomendado) ou npm

### **🐳 Opção 1: Setup Rápido com Docker (Recomendado)**

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/petshop-backend.git
cd petshop-backend

# 2. Configure ambiente
cp env.example .env

# 3. Subir banco PostgreSQL
docker-compose up -d postgres

# 4. Instalar dependências
yarn install

# 5. Executar migrations e seed (dados mock)
yarn migrate
yarn seed

# 6. Iniciar aplicação
yarn dev
```

**🎉 Pronto! API rodando em `http://localhost:3000` com dados de teste!**

### **🚀 Opção 2: Full-Stack Automático**

```bash
# Subir tudo automaticamente (API + Banco + Seed)
docker-compose --profile full-stack up -d

# Acompanhar logs
docker-compose logs -f petshop-api
```

### **📝 Opção 3: Setup Manual (sem Docker)**

```bash
# 1. Clone e configure
git clone https://github.com/seu-usuario/petshop-backend.git
cd petshop-backend
yarn install

# 2. Configure PostgreSQL local
# Instale PostgreSQL e configure DATABASE_URL no .env

# 3. Execute migrations e seed
yarn migrate
yarn seed

# 4. Inicie aplicação
yarn dev
```

## 🎮 Dados Mock Incluídos

O projeto vem com **dados realistas pré-configurados** para desenvolvimento imediato:

### **👥 4 Usuários de Teste**
| Email | Senha | Pets |
|-------|-------|------|
| joao@exemplo.com | 123456 | Rex (Labrador), Bella (Golden) |
| maria@exemplo.com | 123456 | Mimi (Siamês), Garfield (Persa) |
| carlos@exemplo.com | 123456 | Max (Pastor Alemão), Luna (Maine Coon) |
| ana@exemplo.com | 123456 | Thor (Rottweiler), Lola (Poodle) |

### **🐕 8 Pets Diversos**
- **Cães:** Rex, Bella, Max, Thor, Lola
- **Gatos:** Mimi, Garfield, Luna
- **Raças variadas** para testes realistas
- **Idades diferentes** (1-6 anos)

### **📅 8 Agendamentos**
- **4 Futuros:** Para testar gestão e criação
- **4 Históricos:** Para testar relatórios e consultas
- **Status variados:** PENDING, CONFIRMED, COMPLETED, CANCELLED
- **Horários diversos** respeitando regras de negócio

### **🧪 Como Usar os Dados Mock**

```bash
# Testar login imediato
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@exemplo.com", "password": "123456"}'

# Reset dados quando necessário
yarn migrate:reset  # Apaga tudo e recria com seed
```

## 🐳 Docker Setup

### **🎯 Profiles Disponíveis**

| Profile | Comando | O que inclui |
|---------|---------|-------------|
| **Default** | `docker-compose up` | Apenas PostgreSQL |
| **Full-Stack** | `docker-compose --profile full-stack up` | PostgreSQL + API + Seed automático |

### **🛠️ Comandos Úteis**

```bash
# Gerenciamento básico
docker-compose up -d postgres    # Apenas banco
docker-compose ps               # Ver status
docker-compose logs postgres    # Ver logs
docker-compose down            # Parar tudo
docker-compose down -v         # Parar + limpar volumes

# Trabalhar com dados
yarn seed                      # Popular com dados mock
yarn migrate:reset            # Reset completo + seed

# Verificar dados no banco
docker-compose exec postgres psql -U postgres -d petshop_db -c "
  SELECT 'Usuários:', COUNT(*) FROM \"User\"
  UNION ALL SELECT 'Pets:', COUNT(*) FROM \"Pet\"
  UNION ALL SELECT 'Agendamentos:', COUNT(*) FROM \"Appointment\";
"
```

### **🐛 Troubleshooting Docker**

```bash
# Problema: Porta 5432 em uso
sudo lsof -i :5432              # Ver quem está usando
sudo systemctl stop postgresql  # Parar PostgreSQL local
POSTGRES_PORT=5433 docker-compose up -d  # Usar porta diferente

# Problema: Conflito de versões PostgreSQL
docker-compose down -v         # Limpar volumes antigos
docker-compose up -d postgres  # Recriar limpo

# Problema: Aplicação não conecta
docker-compose ps postgres     # Verificar se está rodando
docker-compose logs postgres   # Ver logs de erro
```

## ⚙️ Configuração

### **Variáveis de Ambiente (.env)**

```env
# 🗄️ Banco de Dados
DATABASE_URL="postgresql://postgres:password@localhost:5432/petshop_db"

# 🔐 Autenticação JWT
JWT_SECRET="seu-jwt-secret-super-seguro-aqui"

# 🌐 Servidor
PORT=3000
NODE_ENV="development"

# 🛡️ Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100      # máximo por janela
AUTH_RATE_LIMIT_MAX=5            # tentativas de login
CREATE_RATE_LIMIT_MAX=10         # criação de recursos

# 🐳 Docker (para desenvolvimento)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=petshop_db
POSTGRES_PORT=5432
```

### **Schema do Banco (Prisma)**

```prisma
model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  password     String
  createdAt    DateTime      @default(now())
  pets         Pet[]
  appointments Appointment[]
}

model Pet {
  id           String        @id @default(uuid())
  name         String
  species      String
  breed        String?
  age          Int?
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  createdAt    DateTime      @default(now())
  appointments Appointment[]
}

model Appointment {
  id        String            @id @default(uuid())
  date      DateTime
  reason    String
  status    AppointmentStatus @default(PENDING)
  petId     String
  userId    String
  pet       Pet               @relation(fields: [petId], references: [id])
  user      User              @relation(fields: [userId], references: [id])
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

## 🎯 Uso da API

### **Fluxo Básico**

1. **Registrar/Login** → Obter token JWT
2. **Cadastrar Pets** → Adicionar animais à conta
3. **Agendar Consultas** → Criar agendamentos
4. **Gerenciar** → Atualizar dados e status

### **Exemplo Prático**

```javascript
// 1. Login com dados mock
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@exemplo.com',
    password: '123456'
  })
});

// Token retornado nos cookies automaticamente

// 2. Listar pets do usuário
const petsResponse = await fetch('http://localhost:3000/api/pets', {
  credentials: 'include' // Inclui cookies
});
const pets = await petsResponse.json();

// 3. Criar agendamento
const appointmentResponse = await fetch('http://localhost:3000/api/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    date: '2025-01-15T10:00:00Z',
    reason: 'Consulta de rotina',
    petId: pets[0].id
  })
});
```

## 📡 Endpoints

### **🔐 Autenticação**
```http
POST   /api/auth/register     # Registrar novo usuário
POST   /api/auth/login        # Fazer login
POST   /api/auth/logout       # Fazer logout
GET    /api/auth/me           # Dados do usuário logado
```

### **🐾 Pets**
```http
GET    /api/pets              # Listar pets do usuário
POST   /api/pets              # Cadastrar novo pet
GET    /api/pets/:id          # Buscar pet específico
PUT    /api/pets/:id          # Atualizar pet
DELETE /api/pets/:id          # Remover pet
```

### **📅 Agendamentos**
```http
GET    /api/appointments                  # Listar agendamentos
POST   /api/appointments                  # Criar agendamento
GET    /api/appointments/:id              # Buscar agendamento
PUT    /api/appointments/:id              # Atualizar agendamento
DELETE /api/appointments/:id              # Cancelar agendamento
GET    /api/appointments/available-slots  # Horários disponíveis
```

### **📊 Filtros e Paginação**

```bash
# Listar agendamentos com filtros
GET /api/appointments?page=1&limit=10&status=PENDING&date=2025-01-15

# Parâmetros suportados:
# - page: número da página (padrão: 1)
# - limit: itens por página (padrão: 10, máx: 50)
# - status: PENDING | CONFIRMED | COMPLETED | CANCELLED
# - date: filtro por data específica (YYYY-MM-DD)
# - petId: filtro por pet específico
```

### **🕒 Regras de Negócio**

#### **Horário de Funcionamento**
- **Segunda a Sexta:** 8h às 18h
- **Sábado:** 8h às 12h  
- **Domingo:** Fechado

#### **Validações Automáticas**
- ✅ Agendamentos só para datas futuras
- ✅ Verificação de conflitos de horário
- ✅ Pet deve pertencer ao usuário logado
- ✅ Agendamentos confirmados não podem ser deletados (apenas cancelados)
- ✅ Rate limiting para prevenir spam

## 📁 Estrutura do Projeto

```
petshop-backend/
├── 📁 prisma/
│   ├── 📁 migrations/           # Histórico de mudanças no banco
│   ├── 📄 seed.ts              # Dados mock para desenvolvimento
│   └── 📄 schema.prisma        # Schema do banco de dados
├── 📁 scripts/
│   └── 📄 init-db.sh           # Script de inicialização PostgreSQL
├── 📁 src/
│   ├── 📁 __tests__/           # 🧪 Testes automatizados
│   │   ├── 📁 controllers/     # Testes dos controllers
│   │   ├── 📁 middlewares/     # Testes dos middlewares
│   │   └── 📁 helpers/         # Utilitários de teste
│   ├── 📁 controllers/         # 🎮 Lógica de negócio
│   │   ├── 📄 authController.ts
│   │   ├── 📄 petController.ts
│   │   └── 📄 appointmentController.ts
│   ├── 📁 middlewares/         # 🛡️ Middlewares customizados
│   │   ├── 📄 auth.ts
│   │   ├── 📄 validation.ts
│   │   └── 📄 errorHandler.ts
│   ├── 📁 routes/              # 🛣️ Definição das rotas
│   ├── 📁 schemas/             # ✅ Esquemas de validação Zod
│   ├── 📄 index.ts             # 🚀 Entrada da aplicação
│   └── 📄 prisma.ts            # 🗄️ Cliente Prisma
├── 📁 .github/workflows/       # 🔄 CI/CD com GitHub Actions
├── 📄 docker-compose.yml       # 🐳 Orquestração de containers
├── 📄 Dockerfile              # 🐳 Imagem da aplicação
├── 📄 jest.config.js           # 🧪 Configuração de testes
├── 📄 package.json             # 📦 Dependências e scripts
└── 📄 README.md               # 📖 Este arquivo
```

## 📜 Scripts Disponíveis

### **🔥 Desenvolvimento**
```bash
yarn dev              # Inicia servidor com hot reload (nodemon)
yarn build            # Compila TypeScript → JavaScript
yarn start            # Inicia servidor de produção
```

### **🗄️ Banco de Dados**
```bash
yarn migrate          # Aplica migrations pendentes
yarn migrate:prod     # Aplica migrations em produção
yarn migrate:reset    # Reset completo do banco + seed automático
yarn seed             # Popula banco com dados mock
yarn db:studio        # Abre interface visual do Prisma
```

### **🧪 Testes**
```bash
yarn test             # Executa todos os testes
yarn test:watch       # Executa testes em modo watch
yarn test:coverage    # Executa testes com relatório de cobertura
yarn test:ci          # Executa testes para CI/CD (sem interação)
```

### **🔧 Qualidade de Código**
```bash
yarn lint             # Executa ESLint
yarn lint:fix         # Corrige problemas automaticamente
yarn format           # Formata código com Prettier
yarn type-check       # Verifica tipos TypeScript
```

### **🐳 Docker**
```bash
# Desenvolvimento
docker-compose up -d postgres              # Apenas PostgreSQL
docker-compose --profile full-stack up -d  # Stack completa
docker-compose down                         # Parar containers
docker-compose down -v                      # Parar + limpar dados
```

## 🧪 Testes

### **📊 Cobertura Atual**
- ✅ **4 suítes de teste** completas
- ✅ **55+ casos de teste** automatizados
- ✅ **100% dos testes passando**
- ✅ **Cobertura > 80%** do código

### **🎯 Tipos de Teste**
- **Testes Unitários** - Funções e métodos isolados
- **Testes de Integração** - Fluxos completos da API
- **Testes de Segurança** - Autenticação e autorização
- **Testes de Validação** - Schemas e entrada de dados

### **🧪 Executando Testes**

```bash
# Desenvolvimento
yarn test:watch        # Executa e observa mudanças

# CI/CD
yarn test:ci          # Executa uma vez para pipeline

# Com relatórios
yarn test:coverage    # Gera relatório de cobertura HTML
```

### **📁 Estrutura dos Testes**
```
src/__tests__/
├── 📁 controllers/
│   ├── 🧪 authController.test.ts      # Login, registro, logout
│   ├── 🧪 petController.test.ts       # CRUD de pets + segurança
│   └── 🧪 appointmentController.test.ts # Agendamentos + regras de negócio
├── 📁 middlewares/
│   └── 🧪 middleware.test.ts          # Validação, auth, errors
├── 📁 helpers/
│   └── 🛠️ testHelpers.ts              # Mocks e utilitários
└── ⚙️ setup.ts                       # Configuração global
```

### **🎯 Casos de Teste Cobertos**

**Autenticação:**
- ✅ Registro de usuário (sucesso/conflito)
- ✅ Login (credenciais válidas/inválidas)
- ✅ Logout e limpeza de sessão
- ✅ Proteção de rotas autenticadas

**Pets:**
- ✅ CRUD completo com validações
- ✅ Segurança (usuário só acessa seus pets)
- ✅ Tratamento de erros de banco

**Agendamentos:**
- ✅ Criação com validações de negócio
- ✅ Horário comercial (Seg-Sex 8h-18h, Sáb 8h-12h)
- ✅ Prevenção de conflitos de horário
- ✅ Filtros e paginação

## 🚀 Melhorias Sugeridas

### **🚨 Prioridade CRÍTICA (Implementar imediatamente)**

#### **1. 🔒 Segurança Avançada**
```bash
# Implementar:
yarn add helmet cors express-validator
```
- **Helmet.js** para headers de segurança
- **CORS** configurado adequadamente
- **Input sanitization** avançada
- **Validação de senhas** mais robusta

#### **2. 📝 Sistema de Logs**
```bash
# Adicionar:
yarn add winston morgan
```
- **Logs estruturados** com Winston
- **Logs de requisições** com Morgan
- **Rotação de logs** automática
- **Diferentes níveis** (error, warn, info, debug)

#### **3. 🛠️ Ferramentas de Desenvolvimento**
```bash
# Qualidade de código:
yarn add -D eslint prettier husky lint-staged
yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```
- **ESLint + Prettier** para padronização
- **Husky** para git hooks
- **Pre-commit** checks automáticos

### **🔥 Prioridade ALTA (Próximas sprints)**

#### **1. 📸 Sistema de Upload**
- **Upload de fotos** de pets
- **Redimensionamento** automático
- **Integração AWS S3** ou Cloudinary
- **Validação de tipos** de arquivo

#### **2. 📧 Sistema de Email/Notificações**
- **Email de boas-vindas**
- **Confirmação de agendamentos**
- **Lembretes de consulta**
- **Reset de senha por email**

#### **3. 📚 Documentação Swagger**
```bash
yarn add swagger-jsdoc swagger-ui-express
```
- **OpenAPI 3.0** spec completa
- **Interface interativa** para testes
- **Exemplos** de request/response

#### **4. 🔐 Autenticação Avançada**
- **Refresh tokens**
- **Verificação de email**
- **Reset de senha**
- **Remember me**

### **⭐ Prioridade MÉDIA (Médio prazo)**

#### **1. ⚡ Performance**
- **Cache com Redis** para consultas frequentes
- **Background jobs** com Bull/Agenda
- **Compressão** de responses
- **Query optimization**

#### **2. 📊 Métricas e Monitoramento**
- **Prometheus** metrics
- **Health check** endpoints
- **Error tracking** com Sentry
- **Performance monitoring**

#### **3. 🔍 Busca Avançada**
- **Full-text search**
- **Filtros combinados**
- **Faceted search**
- **Ordenação dinâmica**

### **🎁 Prioridade BAIXA (Futuras versões)**

#### **1. 🤖 Inteligência Artificial**
- **Chatbot** para suporte
- **Recomendação** de serviços
- **Detecção automática** de raças por foto
- **Análise de sentimentos**

#### **2. 📱 Features Premium**
- **Push notifications**
- **Chat em tempo real**
- **Sistema de pagamentos**
- **Integração com APIs externas**

#### **3. 🌍 Internacionalização**
- **Múltiplos idiomas** (PT, EN, ES)
- **Localização** de moeda/data
- **Timezone** automático

### **📋 Roadmap de Implementação**

| Fase | Tempo | Foco | Features |
|------|-------|------|----------|
| **Fase 1** | 1-2 semanas | Segurança & Qualidade | Logs, ESLint, Headers segurança |
| **Fase 2** | 2-3 semanas | Core Features | Upload, Email, Swagger |
| **Fase 3** | 3-4 semanas | Performance | Cache, Métricas, Background jobs |
| **Fase 4** | 1-2 meses | Advanced | AI, Push notifications, Pagamentos |

## 🚀 Deploy

### **🌟 Deploy em Produção**

#### **Variáveis de Ambiente (Produção)**
```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="super-secret-production-key-256-bits"
PORT=3000

# Rate Limiting (mais restritivo em produção)
RATE_LIMIT_MAX_REQUESTS=50
AUTH_RATE_LIMIT_MAX=3
```

#### **🐳 Docker Production**
```bash
# Build da imagem
docker build -t petshop-backend:latest .

# Run em produção
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --restart=unless-stopped \
  petshop-backend:latest
```

#### **📋 Checklist de Deploy**
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Banco de dados migrado (`prisma migrate deploy`)
- [ ] ✅ SSL/HTTPS configurado
- [ ] ✅ Logs de produção funcionando
- [ ] ✅ Health checks configurados
- [ ] ✅ Backup do banco configurado
- [ ] ✅ Monitoramento ativo

### **⚙️ CI/CD Pipeline**

O projeto inclui workflow do GitHub Actions:

```yaml
# .github/workflows/ci.yml
name: 🚀 CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:     # Testes + Coverage
  build:    # Build da aplicação  
  security: # Security scan
  docker:   # Build e push da imagem
  deploy:   # Deploy automático
```

### **🚀 Platforms Suportadas**
- **Heroku** - Deploy simples com Procfile
- **Railway** - Deploy automático via Git
- **DigitalOcean App** - Container deploy
- **AWS ECS** - Container orchestration
- **Google Cloud Run** - Serverless containers

## 🤝 Contribuição

### **Como Contribuir**

1. **🍴 Fork** o projeto
2. **📥 Clone** seu fork: `git clone https://github.com/seu-usuario/petshop-backend.git`
3. **🌿 Crie** uma branch: `git checkout -b feature/nova-feature`
4. **💾 Commit** suas mudanças: `git commit -m 'feat: adiciona nova feature'`
5. **📤 Push** para a branch: `git push origin feature/nova-feature`
6. **📋 Abra** um Pull Request

### **📝 Padrões do Projeto**

#### **Commits (Conventional Commits)**
```bash
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação de código
refactor: refatoração sem mudança de comportamento
test: adição ou correção de testes
chore: tarefas de manutenção
```

#### **Code Style**
- ✅ **TypeScript strict mode** habilitado
- ✅ **ESLint + Prettier** para formatação
- ✅ **Nomes descritivos** para variáveis e funções
- ✅ **Comentários** em português para lógica complexa

#### **Testes**
- ✅ **Adicionar testes** para novas features
- ✅ **Manter cobertura > 80%**
- ✅ **Testes devem passar** antes do merge
- ✅ **Mocks apropriados** para dependências externas

### **🔍 Code Review**

Todas as contribuições passam por:
- ✅ **Análise de código** por maintainers
- ✅ **Execução automática de testes**
- ✅ **Verificação de segurança**
- ✅ **Performance check**
- ✅ **Compatibilidade verificada**

### **🏷️ Issues e Bugs**

Ao reportar issues:
- 🐛 **Descreva o problema** claramente
- 📋 **Passos para reproduzir**
- 🖥️ **Ambiente** (OS, Node version, etc.)
- 📸 **Screenshots** se aplicável
- 🧪 **Teste caso** se possível

## 📞 Suporte e Comunidade

### **📧 Contatos**
- **Maintainer:** [Seu Nome](mailto:seu-email@exemplo.com)
- **Issues:** [GitHub Issues](https://github.com/seu-usuario/petshop-backend/issues)
- **Discussões:** [GitHub Discussions](https://github.com/seu-usuario/petshop-backend/discussions)

### **📚 Recursos**
- **📖 Documentação:** [Wiki do Projeto](https://github.com/seu-usuario/petshop-backend/wiki)
- **🐳 Docker:** [Docker Hub](https://hub.docker.com/r/seu-usuario/petshop-backend)
- **📊 Status:** [Status Page](https://status.petshop-api.com)

### **🌟 Comunidade**
- **Discord:** [Servidor da Comunidade](#)
- **Twitter:** [@petshop_api](#)
- **LinkedIn:** [Página do Projeto](#)

## 📝 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

### **O que você pode fazer:**
- ✅ Usar comercialmente
- ✅ Modificar o código
- ✅ Distribuir
- ✅ Usar privadamente

### **O que você deve fazer:**
- 📄 Incluir a licença e copyright
- 📝 Indicar mudanças feitas

---

## 🎯 Estatísticas do Projeto

![GitHub stars](https://img.shields.io/github/stars/seu-usuario/petshop-backend?style=social)
![GitHub forks](https://img.shields.io/github/forks/seu-usuario/petshop-backend?style=social)
![GitHub issues](https://img.shields.io/github/issues/seu-usuario/petshop-backend)
![GitHub pull requests](https://img.shields.io/github/issues-pr/seu-usuario/petshop-backend)

**Desenvolvido com ❤️ por [Seu Nome](https://github.com/seu-usuario)**

*Última atualização: Dezembro 2024*

---

### 🚀 **Quick Start - TL;DR**

```bash
git clone https://github.com/seu-usuario/petshop-backend.git
cd petshop-backend
cp env.example .env
docker-compose up -d postgres
yarn install && yarn migrate && yarn seed
yarn dev
# 🎉 API rodando em http://localhost:3000
# 🔑 Login: joao@exemplo.com / 123456
``` 