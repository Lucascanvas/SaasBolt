#!/bin/sh

echo "Aguardando PostgreSQL..."
until pg_isready -h postgres -p 5432 -U ${POSTGRES_USER}; do
    echo "PostgreSQL não está pronto - aguardando..."
    sleep 2
done
echo "PostgreSQL está pronto!"

# Executa as migrações
echo "Executando migrações do banco de dados..."
npx sequelize-cli db:migrate

echo "Iniciando o servidor..."
npm start