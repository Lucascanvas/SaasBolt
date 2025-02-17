import { htmlToWhatsAppFormat } from './htmlToWhatsAppFormat.js';

export const processMessageVariables = (message, contact) => {
    try {
        return htmlToWhatsAppFormat(
            message.replace(/{{(.*?)}}/g, (_, variable) => contact[variable] || '')
        );
    } catch (error) {
        console.error('Erro ao processar variáveis da mensagem:', error);
        return message;
    }
};
