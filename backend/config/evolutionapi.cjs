require('dotenv').config();

const EVOLUTION_API_URL = process.env.URL_EVOLUTION_API || 'https://api2.bchat.com.br';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '4Nvn5HE2F3cIw9H';


module.exports = {
  EVOLUTION_API_URL,
  EVOLUTION_API_KEY
};
