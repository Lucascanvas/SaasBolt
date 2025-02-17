FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Instala o cliente PostgreSQL e outras ferramentas necessárias
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Torna o script executável
RUN chmod +x wait-and-start.sh

EXPOSE 2345

CMD ["./wait-and-start.sh"]