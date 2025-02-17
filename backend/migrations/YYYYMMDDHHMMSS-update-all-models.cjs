'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 1. Criar tabela Users
      await queryInterface.createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        cpf: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        profilePicture: {
          type: Sequelize.STRING,
          defaultValue: '',
        },
        gender: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        activeWorkspaceId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // 2. Criar tabela Workspaces
      await queryInterface.createTable('Workspaces', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        cnpj: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        activeModules: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: ['chat', 'kanban'],
          allowNull: false,
        },
        inviteCode: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // 3. Atualizar Users com a referência ao Workspace ativo
      await queryInterface.addConstraint('Users', {
        fields: ['activeWorkspaceId'],
        type: 'foreign key',
        name: 'users_activeWorkspace_fk',
        references: {
          table: 'Workspaces',
          field: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      // 4. Criar tabela UserWorkspace (relação many-to-many)
      await queryInterface.createTable('UserWorkspaces', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',
  },
  workspaceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Workspaces',
      key: 'id'
    },
    onDelete: 'CASCADE',
  },
  role: {
    type: Sequelize.ENUM('owner', 'admin', 'member'),
    allowNull: false,
    defaultValue: 'member'
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastAccessed: {
    type: Sequelize.DATE,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  }
});await queryInterface.createTable('UserWorkspaces', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',
  },
  workspaceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Workspaces',
      key: 'id'
    },
    onDelete: 'CASCADE',
  },
  role: {
    type: Sequelize.ENUM('owner', 'admin', 'member'),
    allowNull: false,
    defaultValue: 'member'
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastAccessed: {
    type: Sequelize.DATE,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  }
});

      // 5. Criar tabela SgaCredentials
      await queryInterface.createTable('SgaCredentials', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        workspaceId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Workspaces',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        login: {
          type: Sequelize.STRING,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        token: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });

      // 6. Criar tabela Conversations
      await queryInterface.createTable('Conversations', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        workspaceId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Workspaces',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        isGroup: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        lastMessageAt: {
          type: Sequelize.DATE,
        },
        groupProfilePhoto: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // 7. Criar tabela Messages
      await queryInterface.createTable('Messages', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        senderId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        conversationId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Conversations',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // 8. Criar tabela ConversationParticipants
      await queryInterface.createTable('ConversationParticipants', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        conversationId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Conversations',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // 9. Criar tabela Instances
      await queryInterface.createTable('Instances', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        phoneNumber: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        },
        status: {
          type: Sequelize.ENUM('CONNECTED', 'DISCONNECTED', 'WAITING_QR', 'CONNECTING'),
          allowNull: false,
          defaultValue: 'DISCONNECTED',
        },
        workspaceId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Workspaces',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        qrcode: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        frontName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // 10. Criar tabela Campaigns
      await queryInterface.createTable('Campaigns', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        workspaceId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Workspaces',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        name: {
          type: Sequelize.STRING,
        },
        type: {
          type: Sequelize.STRING,
        },
        startImmediately: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        startDate: {
          type: Sequelize.DATE,
        },
        messageInterval: {
          type: Sequelize.INTEGER,
        },
        messages: {
          type: Sequelize.JSONB,
        },
        instanceIds: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: [],
        },
        csvFileUrl: {
          type: Sequelize.STRING,
        },
        imageUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING,
          defaultValue: 'PENDING',
        },
        successCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        failureCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        error: {
          type: Sequelize.TEXT,
        },
        lastProcessedAt: {
          type: Sequelize.DATE,
        },
        instanceId: {
          type: Sequelize.STRING,
          references: {
            model: 'Instances',
            key: 'id'
          },
          onDelete: 'SET NULL'
        },
        scheduledTo: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // 11. Criar tabela MessageHistories
      await queryInterface.createTable('MessageHistories', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        campaignId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Campaigns',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        contact: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('SENT', 'ERROR'),
          allowNull: false,
        },
        error: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        sentAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        metadata: {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // 12. Criar tabela PasswordResetTokens
      await queryInterface.createTable('PasswordResetTokens', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        token: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        expiresAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remover tabelas na ordem inversa
      await queryInterface.dropTable('PasswordResetTokens');
      await queryInterface.dropTable('MessageHistories');
      await queryInterface.dropTable('Campaigns');
      await queryInterface.dropTable('Instances');
      await queryInterface.dropTable('Messages');
      await queryInterface.dropTable('ConversationParticipants');
      await queryInterface.dropTable('Conversations');
      await queryInterface.dropTable('SgaCredentials');
      await queryInterface.dropTable('UserWorkspaces');
      await queryInterface.dropTable('Users'); // Primeiro removemos a constraint
      await queryInterface.dropTable('Workspaces');
    } catch (error) {
      console.error('Migration Rollback Error:', error);
      throw error;
    }
  }
};