const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
    info: (message) => {
        if (isDevelopment) {
            console.log(message);
        }
    },
    error: (message) => {
        // Sempre loga erros, independente do ambiente
        console.error(message);
    },
    debug: (message) => {
        if (isDevelopment && process.env.DEBUG) {
            console.debug(message);
        }
    }
}; 