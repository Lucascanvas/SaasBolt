import multer from 'multer';
import models from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import minioClient from "../config/minio.mjs";
import { startCampaign } from "../services/campaignService.js";
import { io } from "../socket/socket.js";
import { getMediaBase64 } from '../utils/getMediaBase64.js';
import axios from "axios";
import { safeMinioOperation } from "../config/minio.mjs";
import { parse } from 'csv-parse/sync';


const { Campaign, MessageHistory } = models;
const BUCKET_NAME = process.env.MINIO_BUCKET || "campaigns";

// Configuração do Multer
const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: 'csv', maxCount: 1 },
    { name: 'media', maxCount: 1 }
]);

// Wrapper para usar multer com async/await
const handleUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) {
                console.error('Erro no upload:', err);
                reject(err);
            }
            resolve();
        });
    });
};

// Função para normalizar strings (remove acentos, espaços e deixa lowercase)
const normalizeString = (str) => {
    return str.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .trim();
};

// Função para extrair variáveis do template da mensagem
const extractTemplateVariables = (message) => {
    const regex = /{{([^{}]+)}}/g;
    const variables = [];
    let match;
    
    while ((match = regex.exec(message)) !== null) {
        variables.push(match[1].trim());
    }
    
    return variables;
};

// Função para validar se todas as variáveis existem no CSV
const validateTemplateVariables = (csvHeaders, messageTemplate) => {
    const templateVars = extractTemplateVariables(messageTemplate);
    const normalizedHeaders = csvHeaders.map(header => header.toLowerCase().trim());
    
    console.log('Validação de variáveis:', {
        template: messageTemplate,
        foundVars: templateVars,
        availableHeaders: normalizedHeaders,
        csvOriginalHeaders: csvHeaders
    });

    const missingVars = templateVars.filter(variable => 
        !normalizedHeaders.includes(variable.toLowerCase())
    );
    
    if (missingVars.length > 0) {
        throw new Error(
            `Variáveis não encontradas na planilha: ${missingVars.join(', ')}\n` +
            `Colunas disponíveis: ${csvHeaders.join(', ')}`
        );
    }

    return true;
};

// Função para substituir todas as variáveis na mensagem
const replaceTemplateVariables = (message, contactData) => {
    console.log('Mensagem original:', message);
    // Encontra todas as variáveis no template
    const variables = message.match(/{{([^{}]+)}}/g) || [];
    console.log('Variáveis encontradas:', variables);
    // Inicializa arrays para armazenar variáveis e substitutos
    const variableNames = [];
    const substitutes = [];

    // Para cada variável encontrada, faz a substituição
    let finalMessage = message;
    variables.forEach(variable => {
        // Remove {{ }} e espaços em branco
        const variableName = variable.replace(/[{}]/g, '').trim().toLowerCase();
        variableNames.push(variableName); // Armazena o nome da variável

        // Procura o valor correspondente no contactData (case insensitive)
        const value = Object.entries(contactData).find(
            ([key, _]) => key.toLowerCase() === variableName
        );

        if (value) {
            substitutes.push(value[1]); // Armazena o substituto
            // Substitui todas as ocorrências da variável pelo valor
            const regex = new RegExp(`{{\\s*${variableName}\\s*}}`, 'g');
            finalMessage = finalMessage.replace(regex, value[1]);
        } else {
            substitutes.push('N/A'); // Se não encontrar, coloca 'N/A'
            console.warn(`Variável ${variableName} não encontrada nos dados do contato:`, contactData);
        }
    });

    // Loga as variáveis e seus substitutos
    console.log(`Variáveis (${variableNames.length}):`, variableNames.join(', '));
    console.log(`Substitutos (${substitutes.length}):`, substitutes.join(', '));

    return finalMessage;
};

// Na função que processa o envio da mensagem
const processMessage = async (campaign, contact) => {
    try {
        // Log para debug
        console.log('Dados do contato:', contact);
        console.log('Template da mensagem:', campaign.message);

        // Substitui as variáveis
        const finalMessage = replaceTemplateVariables(campaign.message, contact);

        console.log('Mensagem final:', finalMessage);

        // Registra no histórico
        await MessageHistory.create({
            campaignId: campaign.id,
            contact: contact.phone || contact.numero || contact.telefone,
            message: finalMessage,
            status: 'PENDING',
            metadata: {
                originalTemplate: campaign.message,
                contactData: contact,
                variables: Object.keys(contact)
            }
        });

        // ... resto do código de envio ...

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        throw error;
    }
};

const parseCSV = (csvContent) => {
    try {
        const records = parse(csvContent, {  // Aqui usamos `parse`
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        
        console.log('CSV parseado com sucesso:', {
            linhas: records.length,
            colunas: records[0] ? Object.keys(records[0]) : []
        });
        
        return records;
    } catch (error) {
        console.error('Erro ao parsear CSV:', error);
        throw new Error(`Erro ao processar arquivo CSV: ${error.message}`);
    }
};

export const createCampaign = async (req, res) => {
    try {
        console.log('Configuração MinIO no controller:', {
            endPoint: minioClient.endPoint,
            port: minioClient.port,
            useSSL: minioClient.useSSL
        });

        const workspaceId = req.params.workspaceId;
        
        // Primeiro processa o upload
        await handleUpload(req, res);
        
        // Depois loga os dados recebidos
        console.log('Files recebidos:', req.files);
        console.log('Body recebido:', req.body);
        
        if (!req.files || !req.files.csv) {
            throw new Error("Arquivo CSV é obrigatório");
        }

        const { csv, media } = req.files;

        // Usa safeMinioOperation para o CSV
        const csvFileName = `${workspaceId}/csv/${uuidv4()}-${csv[0].originalname}`;
        await safeMinioOperation(async () => {
            console.log('Tentando upload do CSV:', {
                bucket: BUCKET_NAME,
                fileName: csvFileName,
                size: csv[0].size
            });
            
            return minioClient.putObject(
                BUCKET_NAME,
                csvFileName,
                csv[0].buffer,
                csv[0].size,
                csv[0].mimetype
            );
        });

        let mediaBase64 = null;
        let mediaType = null;
        let mediaFileName = null;
        let mediaMediaType = null;

        if (media && media[0]) {
            const mediaFile = media[0];
            
            if (!mediaFile.originalname) {
                console.error('Arquivo de mídia sem nome:', mediaFile);
                throw new Error('Arquivo de mídia inválido');
            }

            mediaFileName = `${workspaceId}/media/${uuidv4()}-${mediaFile.originalname}`;
            const extension = mediaFile.originalname.toLowerCase().split('.').pop();
            mediaMediaType = ['pdf', 'doc', 'docx'].includes(extension) ? "document" : "image";

            // Usa safeMinioOperation para a mídia
            await safeMinioOperation(async () => {
                return minioClient.putObject(
                    BUCKET_NAME,
                    mediaFileName,
                    mediaFile.buffer,
                    mediaFile.size,
                    mediaFile.mimetype
                );
            });

            // Usa safeMinioOperation para obter o base64
            mediaBase64 = await getMediaBase64(BUCKET_NAME, mediaFileName);
            mediaType = mediaFile.mimetype;
            mediaFileName = mediaFile.originalname;

            console.log(`\x1b[34m[Debug]\x1b[0m ${mediaMediaType.toUpperCase()} convertido para base64`);
        }

        // Processa as mensagens
        let messages = JSON.parse(req.body.messages);
        if (mediaBase64) {
            messages = messages.map(msg => ({
                ...msg,
                mediaUrl: mediaBase64,
                mimetype: mediaType,
                fileName: mediaFileName,
                mediatype: mediaMediaType
            }));
        }

        const csvContent = csv[0].buffer.toString('utf-8');
        const csvRows = await parseCSV(csvContent);
        
        if (csvRows.length === 0) {
            throw new Error("Planilha CSV vazia");
        }

        const csvHeaders = Object.keys(csvRows[0]);
        const messageTemplate = req.body.message;

        try {
            // Agora retorna o mapeamento de variáveis
            const variableMapping = validateTemplateVariables(csvHeaders, messageTemplate);
            
            console.log('Mapeamento de variáveis:', variableMapping);

            // Substitui as variáveis no template usando o mapeamento correto
            let finalMessage = messageTemplate;
            Object.entries(variableMapping).forEach(([templateVar, csvHeader]) => {
                const regex = new RegExp(`{{\\s*${templateVar}\\s*}}`, 'gi');
                finalMessage = finalMessage.replace(regex, `{{${csvHeader}}}`);
            });

            // Atualiza a mensagem com os nomes corretos das colunas
            req.body.message = finalMessage;

        } catch (error) {
            return res.status(400).json({
                error: error.message,
                headers: csvHeaders,
                templateVars: messageTemplate.match(/{{([^{}]+)}}/g)
                    ?.map(v => v.replace(/[{}]/g, '').trim()) || []
            });
        }

        const campaignData = {
            ...req.body,
            workspaceId: parseInt(workspaceId),
            startImmediately: req.body.startImmediately === "true",
            messageInterval: parseInt(req.body.messageInterval),
            instanceIds: JSON.parse(req.body.instanceIds),
            messages,
            csvFileUrl: `${BUCKET_NAME}/${csvFileName}`,
            status: 'PENDING',
            isActive: true
        };

        const campaign = await Campaign.create(campaignData);
        
        console.log(`\x1b[34m[Debug]\x1b[0m Campanha criada com sucesso ${mediaMediaType ? `(com ${mediaMediaType})` : ''}`);
        
        io.to(`workspace_${workspaceId}`).emit("campaignCreated", campaign);
        
        res.status(201).json(campaign);

    } catch (error) {
        console.error('Erro detalhado ao criar campanha:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            endpoint: minioClient.endPoint,
            port: minioClient.port,
            useSSL: minioClient.useSSL,
            currentConfig: minioClient.config
        });
        res.status(500).json({ error: error.message });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;

        const campaigns = await Campaign.findAll({
            where: {
                workspaceId: workspaceId,
                isActive: true
            },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json(campaigns || []);
    } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
        return res.status(500).json({
            message: "Erro ao buscar campanhas",
            error: error.message,
        });
    }
};

export const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            where: {
                id: req.params.id,
                isActive: true
            }
        });

        if (campaign) {
            res.status(200).json(campaign);
        } else {
            res.status(404).json({ message: "Campanha não encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findOne({
            where: {
                id: id,
                isActive: true
            }
        });

        if (!campaign) {
            return res.status(404).json({ message: "Campanha não encontrada" });
        }

        await campaign.update(req.body);

        io.to(`workspace_${campaign.workspaceId}`).emit(
            "campaignUpdated",
            campaign
        );

        res.json(campaign);
    } catch (error) {
        console.error("Erro ao atualizar campanha:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const { workspaceId, campaignId } = req.params;

        const campaign = await Campaign.findOne({
            where: {
                id: campaignId,
                workspaceId: workspaceId,
                isActive: true
            },
        });

        if (!campaign) {
            return res.status(404).json({ message: "Campanha não encontrada" });
        }

        await campaign.update({ isActive: false });

        io.to(`workspace_${workspaceId}`).emit('campaignDeleted', {
            campaignId,
            workspaceId
        });

        res.status(200).json({ message: "Campanha deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCampaignStats = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;

        // Busca todas as campanhas do workspace com o alias correto
        const campaigns = await Campaign.findAll({
            where: {
                workspaceId: workspaceId,
                isActive: true
            },
            attributes: [
                'id',
                'messages'
            ],
            include: [{
                model: MessageHistory,
                as: 'MessageHistories', // Usando o alias definido no modelo
                attributes: ['status']
            }]
        });

        // Inicializa as estatísticas
        const stats = {
            totalCampaigns: campaigns.length,
            totalMessages: 0,
            deliveredMessages: 0,
            failedMessages: 0,
            successRate: 0
        };

        // Calcula as estatísticas usando MessageHistory
        campaigns.forEach(campaign => {
            // Conta mensagens enviadas e com erro
            campaign.MessageHistories?.forEach(history => {
                stats.totalMessages++;
                if (history.status === 'SENT') {
                    stats.deliveredMessages++;
                } else if (history.status === 'ERROR') {
                    stats.failedMessages++;
                }
            });
        });

        // Calcula a taxa de sucesso
        stats.successRate = stats.totalMessages > 0
            ? ((stats.deliveredMessages / stats.totalMessages) * 100).toFixed(2)
            : 0;

        res.status(200).json({
            workspaceId,
            stats: {
                totalCampaigns: stats.totalCampaigns,
                messageStats: {
                    total: stats.totalMessages,
                    delivered: stats.deliveredMessages,
                    failed: stats.failedMessages,
                    successRate: `${stats.successRate}%`
                }
            }
        });

    } catch (error) {
        console.error('Erro ao buscar estatísticas das campanhas:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar estatísticas das campanhas',
            details: error.message 
        });
    }
};
