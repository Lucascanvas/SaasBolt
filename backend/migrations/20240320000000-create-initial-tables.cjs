'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primeiro criar a tabela Workspaces
    await queryInterface.createTable('Workspaces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      activeModules: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['chat', 'kanban'],
        allowNull: false
      },
      inviteCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      freeMessages: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      usedMessages: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Depois criar a tabela Campaigns
    await queryInterface.createTable('Campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'DRAFT'
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Workspaces',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Criar tabela de MessageHistories
    await queryInterface.createTable('MessageHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      campaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Campaigns',
          key: 'id'
        }
      },
      recipientId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Criar tabela de MessageCampaigns
    await queryInterface.createTable('MessageCampaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      campaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Campaigns',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Criar tabela de Recipients
    await queryInterface.createTable('Recipients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      campaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Campaigns',
          key: 'id'
        }
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'PENDING'
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Criar tabela de SgaCredentials
    await queryInterface.createTable('SgaCredentials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Workspaces',
          key: 'id'
        },
        unique: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Criar tabela de WorkspaceModules
    await queryInterface.createTable('WorkspaceModules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Workspaces',
          key: 'id'
        }
      },
      moduleName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Adicionar índices para melhor performance
    await queryInterface.addIndex('MessageHistories', ['campaignId']);
    await queryInterface.addIndex('MessageCampaigns', ['campaignId']);
    await queryInterface.addIndex('Recipients', ['campaignId']);
    await queryInterface.addIndex('WorkspaceModules', ['workspaceId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remover as tabelas na ordem correta (inversa da criação)
    await queryInterface.dropTable('MessageHistories');
    await queryInterface.dropTable('MessageCampaigns');
    await queryInterface.dropTable('Recipients');
    await queryInterface.dropTable('WorkspaceModules');
    await queryInterface.dropTable('SgaCredentials');
    await queryInterface.dropTable('Campaigns');
    await queryInterface.dropTable('Workspaces');
  }
}; 