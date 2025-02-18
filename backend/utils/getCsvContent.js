import minioClient from '../config/minio.mjs';
const BUCKET_NAME = process.env.MINIO_BUCKET || "evolution-assets";

export const getCsvContent = async (csvFileUrl) => {
    if (!csvFileUrl) {
        throw new Error('URL do arquivo CSV não fornecida');
    }

    try {
        const stream = await minioClient.getObject(BUCKET_NAME, csvFileUrl);
        return new Promise((resolve, reject) => {
            let content = '';
            stream.on('data', chunk => content += chunk);
            stream.on('end', () => resolve(content));
            stream.on('error', reject);
        });
    } catch (error) {
        console.error('[Error] Erro ao buscar arquivo CSV:', error);
        throw new Error('Erro ao buscar arquivo CSV');
    }
};