import minioClient from '../config/minio.mjs';

export const checkMinioConnection = async (req, res, next) => {
    try {
        if (!minioClient) {
            throw new Error('Cliente MinIO não foi inicializado');
        }
        await minioClient.listBuckets();
        next();
    } catch (error) {
        console.error('Erro na verificação do MinIO:', error);
        res.status(503).json({ error: 'Serviço MinIO indisponível' });
    }
}; 