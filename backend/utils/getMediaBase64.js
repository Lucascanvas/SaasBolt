import minioClient, { safeMinioOperation } from '../config/minio.mjs';

export const getMediaBase64 = async (bucketName, fileName) => {
    try {
        const data = await safeMinioOperation(async () => {
            return minioClient.getObject(bucketName, fileName);
        });

        return new Promise((resolve, reject) => {
            const chunks = [];
            data.on('data', chunk => chunks.push(chunk));
            data.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64 = buffer.toString('base64');
                resolve(base64);
            });
            data.on('error', reject);
        });
    } catch (error) {
        console.error('Erro ao converter arquivo para base64:', error);
        throw error;
    }
}; 