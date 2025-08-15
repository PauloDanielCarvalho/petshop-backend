# 🏗️ Multi-stage Dockerfile para Petshop Backend

# Estágio 1: Build
FROM node:18-alpine AS builder

# Informações do mantenedor
LABEL maintainer="seu-email@exemplo.com"
LABEL description="Petshop Backend API"

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN yarn generate

# Build da aplicação
RUN yarn build

# Remover dependências de desenvolvimento
RUN yarn install --production --frozen-lockfile

# Estágio 2: Produção
FROM node:18-alpine AS production

# Instalar dumb-init para melhor handling de sinais
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S petshop -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários do estágio de build
COPY --from=builder --chown=petshop:nodejs /app/dist ./dist
COPY --from=builder --chown=petshop:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=petshop:nodejs /app/package.json ./package.json
COPY --from=builder --chown=petshop:nodejs /app/prisma ./prisma

# Criar diretório para logs
RUN mkdir -p /app/logs && chown petshop:nodejs /app/logs

# Mudar para usuário não-root
USER petshop

# Expor porta
EXPOSE 3000

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js || exit 1

# Comando para iniciar a aplicação
CMD ["dumb-init", "node", "dist/index.js"] 