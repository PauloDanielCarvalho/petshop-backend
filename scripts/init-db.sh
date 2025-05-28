#!/bin/bash

# 🗄️ Script de inicialização do PostgreSQL
# Este script é executado automaticamente quando o container do PostgreSQL é criado pela primeira vez

set -e

echo "🗄️ Inicializando banco de dados do Petshop..."

# Criar usuário adicional para desenvolvimento (se necessário)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Criar extensões úteis
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    -- Configurar timezone
    SET timezone = 'America/Sao_Paulo';
    
    -- Grants para o usuário
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
    
    -- Log de inicialização
    \echo '✅ Banco de dados inicializado com sucesso!'
    \echo '📊 Database: $POSTGRES_DB'
    \echo '👤 User: $POSTGRES_USER'
    \echo '🌍 Timezone: America/Sao_Paulo'
EOSQL

echo "🎉 Inicialização do PostgreSQL concluída!" 