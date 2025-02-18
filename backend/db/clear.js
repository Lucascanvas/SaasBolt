import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    user: process.env.POSTGRES_USER || "bolt360ti",
    host: "localhost",
    database: process.env.POSTGRES_DB || "campanhas360",
    password: process.env.POSTGRES_PASSWORD || "kasdjasidaau1n213mmaaasdncksk",
    port: process.env.POSTGRES_PORT || 4001,
});

async function clearDatabase() {
    try {
        await client.connect();
        console.log('Conectado ao banco de dados!');

        // Remover todos os tipos ENUM
        await client.query(`
            DO $$ 
            DECLARE 
                enum_type text;
            BEGIN 
                FOR enum_type IN (SELECT DISTINCT t.typname 
                                FROM pg_type t 
                                JOIN pg_enum e ON t.oid = e.enumtypid 
                                JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace) 
                LOOP 
                    EXECUTE 'DROP TYPE IF EXISTS ' || enum_type || ' CASCADE'; 
                END LOOP; 
            END $$;
        `);

        // Remover todas as tabelas
        await client.query(`
            DROP SCHEMA public CASCADE;
            CREATE SCHEMA public
        `);

        console.log('Todas as tabelas e tipos foram excluídos com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir as tabelas:', error);
    } finally {
        // Fechar a conexão com o banco de dados
        await client.end();
    }
}

// Executar a função e aguardar sua conclusão
(async () => {
  await clearDatabase();
  process.exit(0);
})();
