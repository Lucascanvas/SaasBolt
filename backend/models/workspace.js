import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Workspace extends Model {
        static associate(models) {
            Workspace.belongsToMany(models.User, {
                through: 'UserWorkspace',
                as: 'users',
                foreignKey: 'workspaceId'
            });

            Workspace.hasMany(models.Conversation, {
                foreignKey: 'workspaceId',
                as: 'conversations'
            });

            // Adicionando a nova relação com SgaCredentials
            Workspace.hasOne(models.SgaCredentials, {
                foreignKey: 'workspaceId',
                as: 'sgaCredentials'
            });

            // Certifique-se de que o modelo WorkspaceModule existe
            if (models.WorkspaceModule) {
                Workspace.hasMany(models.WorkspaceModule, {
                    foreignKey: 'workspaceId',
                    as: 'modules'
                });
            }
        }
    }

    Workspace.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cnpj: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        activeModules: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: ['chat', 'kanban'],
            allowNull: false
        },
        inviteCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        availableMessages: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        messagesExpiration: {
            type: DataTypes.DATE,
            allowNull: true
        }
        // Outros campos relevantes para o Workspace
    }, {
        sequelize,
        modelName: 'Workspace',
        tableName: 'Workspaces',
        timestamps: true,
    });

    return Workspace;
};
