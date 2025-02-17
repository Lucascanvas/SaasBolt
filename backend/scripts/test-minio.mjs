import { Client } from 'minio';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega as variáveis de ambiente
dotenv.config({ 
    path: resolve(__dirname, '..', process.env.NODE_ENV === 'production' ? '.env.production' : '.env') 
});

const testMinioConnection = async () => {
    console.log('🚀 Iniciando teste de conexão com MinIO...');
    
    const minioConfig = {
        endPoint: process.env.MINIO_ENDPOINT || 'minio',
        port: parseInt(process.env.MINIO_PORT) || 9000,
        useSSL: false,
        accessKey: process.env.MINIO_ROOT_USER || 'admin',
        secretKey: process.env.MINIO_ROOT_PASSWORD || 'Bolt36023@',
        s3ForcePathStyle: true,
        signatureVersion: 'v4'
    };

    console.log('📝 Configuração MinIO:', {
        endPoint: minioConfig.endPoint,
        port: minioConfig.port,
        useSSL: minioConfig.useSSL,
        accessKey: minioConfig.accessKey
    });

    const minioClient = new Client(minioConfig);

    try {
        console.log('🔍 Testando listagem de buckets...');
        const buckets = await minioClient.listBuckets();
        console.log('✅ Conexão bem sucedida!');
        console.log('📦 Buckets encontrados:', buckets.map(b => b.name));
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erro ao testar conexão com MinIO:', error);
        process.exit(1);
    }
};

testMinioConnection();