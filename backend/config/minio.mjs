import { Client } from 'minio';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const minioConfig = {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
};

// Adicione validação da configuração
if (!minioConfig.accessKey || !minioConfig.secretKey) {
    console.error('❌ Credenciais do MinIO não configuradas corretamente');
}

// Congele a configuração para evitar modificações
Object.freeze(minioConfig);

console.log('Configuração MinIO (interno):', {
    endPoint: minioConfig.endPoint,
    port: minioConfig.port,
    useSSL: minioConfig.useSSL
});

console.log('Configuração MinIO:', {
    endPoint: minioConfig.endPoint,
    port: minioConfig.port,
    useSSL: minioConfig.useSSL,
    accessKey: minioConfig.accessKey,
    bucketName: process.env.MINIO_BUCKET || 'campaigns'
});

console.log('MinIO Client Config:', {
    ...minioConfig,
    secretKey: '***********'
});

const minioClient = new Client(minioConfig);

// Adicione uma verificação inicial da conexão
minioClient.listBuckets()
    .then(() => console.log('✅ Conexão MinIO verificada com sucesso'))
    .catch(err => console.error('❌ Erro na verificação inicial do MinIO:', err));

const initializeMinio = async () => {
    const maxRetries = 5;
    const retryDelay = 3000;
    
    console.log('Tentando conectar ao MinIO com as configurações:', {
        endPoint: minioConfig.endPoint,
        port: minioConfig.port,
        useSSL: minioConfig.useSSL,
        bucketName: process.env.MINIO_BUCKET
    });
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const bucketName = process.env.MINIO_BUCKET || 'campaigns';
            console.log(`Tentativa ${attempt} de conectar ao MinIO...`);
            
            const bucketExists = await minioClient.bucketExists(bucketName);
            
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName);
                console.log(`✅ Bucket '${bucketName}' criado com sucesso`);
            } else {
                console.log(`✅ Bucket '${bucketName}' já existe`);
            }
            
            console.log('✅ Conexão com MinIO estabelecida com sucesso');
            return true;
        } catch (error) {
            console.error(`❌ Tentativa ${attempt}/${maxRetries} falhou:`, error.message);
            
            // Em desenvolvimento, não queremos que o erro do MinIO pare a aplicação
            if (isDevelopment) {
                console.warn('⚠️ Ambiente de desenvolvimento: continuando mesmo com erro do MinIO');
                return false;
            }
            
            if (attempt === maxRetries) {
                throw new Error(`Falha ao conectar ao MinIO após ${maxRetries} tentativas: ${error.message}`);
            }
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

const testConnection = async () => {
    try {
        console.log('Testando conexão com MinIO usando AWS4-HMAC-SHA256...');
        
        const buckets = await minioClient.listBuckets();
        console.log('Conexão bem sucedida! Buckets:', buckets.map(b => b.name));
        
        const bucketName = process.env.MINIO_BUCKET || 'campaigns';
        const exists = await minioClient.bucketExists(bucketName);
        console.log(`Bucket '${bucketName}' existe:`, exists);
        
        if (!exists) {
            await minioClient.makeBucket(bucketName);
            console.log(`Bucket '${bucketName}' criado com sucesso`);
        }
        
        return true;
    } catch (error) {
        console.error('Erro detalhado ao conectar com MinIO:', {
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            endpoint: minioConfig.endPoint,
            useSSL: minioConfig.useSSL,
            authType: 'AWS4-HMAC-SHA256',
            signatureVersion: minioConfig.signatureVersion
        });
        
        if (error.code === 'SignatureDoesNotMatch') {
            console.error('Erro de assinatura. Verifique as credenciais e a configuração do MinIO.');
        }
        
        return false;
    }
};

const verifyConfig = () => {
    console.log('Verificando configuração do MinIO:', {
        endPoint: minioConfig.endPoint,
        useSSL: minioConfig.useSSL,
        signatureVersion: minioConfig.signatureVersion,
        s3ForcePathStyle: minioConfig.s3ForcePathStyle,
        accessKeyConfigured: !!minioConfig.accessKey,
        secretKeyConfigured: !!minioConfig.secretKey
    });
};

const ensureConnection = async () => {
    try {
        await minioClient.listBuckets();
        return true;
    } catch (error) {
        console.error('Erro na conexão com MinIO:', {
            message: error.message,
            code: error.code,
            endpoint: minioConfig.endPoint,
            port: minioConfig.port
        });
        throw error;
    }
};

const safeMinioOperation = async (operation) => {
    try {
        console.log('Iniciando operação MinIO segura...');
        await ensureConnection();
        console.log('Conexão verificada, executando operação...');
        const result = await operation();
        console.log('Operação concluída com sucesso');
        return result;
    } catch (error) {
        console.error('Erro em operação MinIO:', {
            message: error.message,
            code: error.code,
            endpoint: minioConfig.endPoint,
            port: minioConfig.port,
            stack: error.stack
        });
        throw error;
    }
};

verifyConfig();

export { initializeMinio, testConnection, verifyConfig, safeMinioOperation };
export default minioClient;
