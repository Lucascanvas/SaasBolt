import express from 'express'
import dotenv from 'dotenv'
import cookieParse from 'cookie-parser'
import { server, app, io } from './socket/socket.js';
import instanceRoutes from './routes/instance.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import messageCampaignRoutes from './routes/messageCampaign.js';
import recipientRoutes from './routes/recipient.js';
import webhookRoutes from './routes/webhook.routes.js';
import messageHistoryRoutes from './routes/messageHistory.routes.js';
import cors from 'cors';
import sequelize from './config/database.js';
import superadminRoutes from './routes/superadmin.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';

dotenv.config()

const PORT = process.env.PORT || 2345

// Teste de conexão ao iniciar
sequelize.authenticate()
    .then(() => {
        console.log('📊 Conexão com o banco estabelecida com sucesso!');
    })
    .catch(err => {
        console.error('❌ Erro ao conectar com o banco:', err);
        process.exit(1);
    });

app.set('io', io);

// Rota de teste
app.get("/", async (req, res) => {
    try {
        const [result] = await sequelize.query("SELECT NOW()");
        res.status(200).send('Servidor rodando e PostgreSQL retornou: ' + result[0].now);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao conectar ao PostgreSQL: ' + err);
    }
});

// Configuração do CORS
const allowedOrigins = ["https://disparador.bchat.lat", "https://api2.bchat.com.br", "http://localhost:5173"];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Origem não permitida pelo CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParse());

//importação de rotas
import authRouters from "./routes/auth.routes.js"
import messageRouters from "./routes/message.routes.js"
import userRouters from "./routes/user.routes.js"
import workspacesRouters from "./routes/workspaces.routes.js"
import conversationsRouters from "./routes/conversations.routes.js"
import contactRoutes from './routes/contact.routes.js'
import whatsappRoutes from './routes/whatsapp.routes.js';

app.use("/api/auth", authRouters)
app.use("/api/messages", messageRouters)
app.use("/api/users", userRouters)
app.use("/api/workspaces", workspacesRouters)
app.use("/api/conversations", conversationsRouters)
app.use('/api/contacts', contactRoutes)
app.use('/api/instances', instanceRoutes)
app.use('/api/campaigns', campaignRoutes);
app.use('/api/message-campaigns', messageCampaignRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/message-history', messageHistoryRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/workspaces', workspaceRoutes);

// Configuração do Socket.IO
io.engine.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (!origin || allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    next();
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Socket.IO handlers
io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    // Adicione tratamento de erro para o socket
    socket.on('error', (error) => {
        console.error('Erro no socket:', error);
    });

    socket.on('joinWorkspace', (workspace) => {
        socket.join(workspace);
        console.log(`Cliente ${socket.id} entrou na sala: ${workspace}`);
    });

    socket.on('leaveWorkspace', (workspace) => {
        socket.leave(workspace);
        console.log(`Cliente ${socket.id} saiu da sala: ${workspace}`);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente ${socket.id} desconectado`);
    });

    // ... outros handlers de socket
});

// Inicia o servidor
server.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    
    // Testa a conexão novamente após o servidor iniciar
    await sequelize.authenticate();
});

export default server;
